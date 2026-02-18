/**
 * DOC PROOF - Crypto utilities
 * Document hashing, encryption for IPFS upload
 */

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
  scryptSync,
} from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const KEY_LENGTH = 32;
const SALT_LENGTH = 32;
const TAG_LENGTH = 16;

export function sha256Hash(data: Buffer | string): string {
  const hash = createHash("sha256");
  hash.update(data);
  return "0x" + hash.digest("hex");
}

function deriveKey(passphrase: string, salt: Buffer): Buffer {
  return scryptSync(passphrase, salt, KEY_LENGTH);
}

export function encryptForIPFS(
  data: Buffer,
  passphrase: string
): { encrypted: Buffer; iv: Buffer; salt: Buffer } {
  const salt = randomBytes(SALT_LENGTH);
  const key = deriveKey(passphrase, salt);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  cipher.setAAD(Buffer.from("doc-proof"));
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encrypted: Buffer.concat([iv, salt, authTag, encrypted]),
    iv,
    salt,
  };
}

export function decryptFromIPFS(
  encryptedData: Buffer,
  passphrase: string
): Buffer {
  const iv = encryptedData.subarray(0, IV_LENGTH);
  const salt = encryptedData.subarray(IV_LENGTH, IV_LENGTH + SALT_LENGTH);
  const authTag = encryptedData.subarray(
    IV_LENGTH + SALT_LENGTH,
    IV_LENGTH + SALT_LENGTH + TAG_LENGTH
  );
  const encrypted = encryptedData.subarray(IV_LENGTH + SALT_LENGTH + TAG_LENGTH);

  const key = deriveKey(passphrase, salt);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from("doc-proof"));

  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

export function generateDocumentKey(): string {
  return randomBytes(32).toString("hex");
}
