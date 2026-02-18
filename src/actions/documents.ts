"use server";

import { z } from "zod";

/** Validates hex private key (64 hex chars, optional 0x). Rejects placeholders. */
function resolveSignerPrivateKey(
  signer: string | undefined,
  fallback: string | undefined
): string | null {
  const candidates = [signer, fallback].filter(Boolean) as string[];
  for (const k of candidates) {
    const clean = k.startsWith("0x") ? k.slice(2) : k;
    if (clean.length === 64 && /^[0-9a-fA-F]+$/.test(clean)) return k;
  }
  return null;
}

/** Removes null bytes from strings so PostgreSQL JSONB accepts them */
function sanitizeForDb(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") return obj.replace(/\0/g, "");
  if (Array.isArray(obj)) return obj.map(sanitizeForDb);
  if (typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj))
      out[key] = sanitizeForDb(val);
    return out;
  }
  return obj;
}
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sha256Hash, encryptForIPFS, generateDocumentKey } from "@/lib/crypto";
import { uploadToIPFS } from "@/lib/ipfs";
import { analyzeDocument } from "@/lib/ai/analyzer";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import type { DocumentStatus } from "@prisma/client";

// Blockchain integration - in production, use server-side signer
// For demo we simulate or use env PRIVATE_KEY for org wallet
const certifySchema = z.object({
  fileBase64: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  organizationId: z.string().optional(),
  encryptForIpfs: z.boolean().default(true),
});

export async function certifyDocument(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");

  const file = formData.get("file") as File;
  if (!file) throw new Error("File required");

  const buffer = Buffer.from(await file.arrayBuffer());
  const hash = sha256Hash(buffer);
  const fileName = file.name;
  const mimeType = file.type || "application/octet-stream";
  const fileSize = buffer.length;

  // AI Analysis
  const aiAnalysis = await analyzeDocument(buffer, mimeType);

  // Check duplicate
  const existing = await prisma.document.findFirst({
    where: { originalHash: hash },
  });
  if (existing) throw new Error("Document hash already certified");

  let ipfsCid: string | null = null;
  let ipfsEncryptedCid: string | null = null;

  if (process.env.PINATA_API_KEY || process.env.WEB3_STORAGE_TOKEN) {
    try {
      if (formData.get("encrypt") === "true") {
        const key = generateDocumentKey();
        const { encrypted } = encryptForIPFS(buffer, key);
        ipfsEncryptedCid = await uploadToIPFS(
          encrypted,
          `encrypted_${fileName}`
        );
      } else {
        ipfsCid = await uploadToIPFS(buffer, fileName);
      }
    } catch (err) {
      console.error("IPFS upload failed:", err);
    }
  }

  // Blockchain - in production: call certifyOnChain with org wallet
  let blockchainTxHash: string | null = null;
  let blockchainBlock: number | null = null;

  const contractAddress = process.env.NEXT_PUBLIC_DOC_PROOF_CONTRACT_ADDRESS;
  const signerKey = process.env.BLOCKCHAIN_SIGNER_PRIVATE_KEY;
  const fallbackKey = process.env.PRIVATE_KEY;
  const privateKey = resolveSignerPrivateKey(signerKey, fallbackKey);

  if (contractAddress && privateKey) {
    try {
      const { ethers } = await import("ethers");
      const { certifyOnChain } = await import("@/lib/blockchain");
      const metadata = ipfsCid || ipfsEncryptedCid || "";
      const result = await certifyOnChain(hash, metadata, privateKey);
      blockchainTxHash = result.txHash;
      blockchainBlock = result.blockNumber;
    } catch (err) {
      console.error("Blockchain certification failed:", err);
    }
  }

  const doc = await prisma.document.create({
    data: {
      userId: session.id,
      organizationId: session.organizationId || undefined,
      originalHash: hash,
      ipfsCid,
      ipfsEncryptedCid,
      blockchainTxHash,
      blockchainBlock,
      issuerAddress: session.walletAddress || "0x0",
      status: blockchainTxHash ? "CERTIFIED" : "PENDING",
      fileName,
      fileSize,
      mimeType,
      aiAnalysis: sanitizeForDb(aiAnalysis) as object,
      aiFraudScore: aiAnalysis.fraudScore,
      certifiedAt: blockchainTxHash ? new Date() : null,
    },
  });

  await createAuditLog({
    userId: session.id,
    action: "DOCUMENT_CERTIFIED",
    resource: "document",
    resourceId: doc.id,
  });

  revalidatePath("/en/dashboard");
  return { id: doc.id, hash, blockchainTxHash };
}

export async function verifyDocumentByHash(hash: string) {
  const cleanHash = hash.startsWith("0x") ? hash : `0x${hash}`;
  if (cleanHash.length !== 66) throw new Error("Invalid hash format");

  const doc = await prisma.document.findFirst({
    where: { originalHash: cleanHash },
  });

  let blockchainValid = false;
  let blockchainData: {
    issuer?: string;
    timestamp?: number;
    revoked?: boolean;
  } = {};

  try {
    const { verifyOnChain } = await import("@/lib/blockchain");
    const result = await verifyOnChain(cleanHash);
    blockchainValid = result.isValid;
    blockchainData = result;
  } catch {
    blockchainValid = doc?.status === "CERTIFIED";
  }

  const isValid =
    doc?.status === "CERTIFIED" &&
    !doc.revokedAt &&
    (blockchainValid || !!doc.blockchainTxHash);

  if (doc) {
    await prisma.verification.create({
      data: {
        documentId: doc.id,
        hash: cleanHash,
        isValid,
        verificationMethod: "api",
      },
    });
  }

  return {
    isValid,
    document: doc
      ? {
          hash: doc.originalHash,
          issuer: blockchainData.issuer || doc.issuerAddress,
          certifiedAt: doc.certifiedAt || (blockchainData.timestamp ? new Date(blockchainData.timestamp * 1000) : null),
          blockchainTxHash: doc.blockchainTxHash,
        }
      : null,
  };
}
