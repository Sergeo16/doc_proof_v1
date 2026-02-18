/**
 * DOC PROOF - Blockchain Integration
 * Polygon/Mumbai interaction via Ethers.js
 */

import { ethers } from "ethers";
import type { Contract } from "ethers";

const DOC_PROOF_ABI = [
  "function certifyDocument(bytes32 documentHash, string metadata) external",
  "function verifyDocument(bytes32 documentHash) external view returns (bool)",
  "function getCertification(bytes32 documentHash) external view returns (tuple(bytes32 documentHash, address issuer, uint256 timestamp, bool revoked, string metadata))",
  "function revokeDocument(bytes32 documentHash, string reason) external",
  "function isHashRegistered(bytes32 documentHash) external view returns (bool)",
  "function getTotalCertifications() external view returns (uint256)",
  "event DocumentCertified(bytes32 indexed documentHash, address indexed issuer, uint256 timestamp, string metadata)",
  "event DocumentRevoked(bytes32 indexed documentHash, address indexed revoker, uint256 timestamp, string reason)",
];

export function getProvider() {
  const rpcUrl =
    process.env.NEXT_PUBLIC_CHAIN_ID === "137"
      ? process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-rpc.com"
      : process.env.POLYGON_MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com";

  return new ethers.JsonRpcProvider(rpcUrl);
}

export function getContract(signerOrProvider?: ethers.Signer | ethers.Provider): Contract {
  const address = process.env.NEXT_PUBLIC_DOC_PROOF_CONTRACT_ADDRESS;
  if (!address) throw new Error("NEXT_PUBLIC_DOC_PROOF_CONTRACT_ADDRESS not set");

  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(address, DOC_PROOF_ABI, provider);
}

export function hashToBytes32(hexHash: string): string {
  if (hexHash.startsWith("0x")) hexHash = hexHash.slice(2);
  if (hexHash.length !== 64) throw new Error("Invalid hash length");
  return "0x" + hexHash;
}

export async function certifyOnChain(
  documentHash: string,
  metadata: string,
  privateKey: string
): Promise<{ txHash: string; blockNumber: number }> {
  const provider = getProvider();
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = getContract(wallet);

  const tx = await contract.certifyDocument(
    hashToBytes32(documentHash),
    metadata
  );
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: Number(receipt.blockNumber),
  };
}

export async function verifyOnChain(documentHash: string): Promise<{
  isValid: boolean;
  issuer?: string;
  timestamp?: number;
  revoked?: boolean;
}> {
  const contract = getContract();
  const hash = hashToBytes32(documentHash);
  const isRegistered = await contract.isHashRegistered(hash);
  if (!isRegistered) return { isValid: false };

  const [isValid, cert] = await Promise.all([
    contract.verifyDocument(hash),
    contract.getCertification(hash),
  ]);

  return {
    isValid,
    issuer: cert.issuer,
    timestamp: Number(cert.timestamp),
    revoked: cert.revoked,
  };
}

export function getExplorerUrl(txHash: string): string {
  const base =
    process.env.NEXT_PUBLIC_CHAIN_ID === "137"
      ? "https://polygonscan.com"
      : "https://mumbai.polygonscan.com";
  return `${base}/tx/${txHash}`;
}
