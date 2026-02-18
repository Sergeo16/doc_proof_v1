/**
 * DOC PROOF - IPFS Integration
 * Supports Pinata and Web3.Storage
 */

async function pinToPinata(data: Buffer | Blob, fileName: string): Promise<string> {
  const apiKey = process.env.PINATA_API_KEY;
  const apiSecret = process.env.PINATA_API_SECRET;
  if (!apiKey || !apiSecret) throw new Error("Pinata credentials not configured");

  const formData = new FormData();
  const blob =
    data instanceof Buffer
      ? new Blob([new Uint8Array(data)])
      : (data as Blob);
  formData.append("file", blob, fileName);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      pinata_api_key: apiKey,
      pinata_secret_api_key: apiSecret,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pinata upload failed: ${err}`);
  }

  const json = await res.json();
  return json.IpfsHash;
}

async function pinToWeb3Storage(data: Buffer | Blob, fileName: string): Promise<string> {
  const token = process.env.WEB3_STORAGE_TOKEN;
  if (!token) throw new Error("Web3.Storage token not configured");

  const formData = new FormData();
  const blob =
    data instanceof Buffer
      ? new Blob([new Uint8Array(data)])
      : (data as Blob);
  formData.append("file", blob, fileName);

  const res = await fetch("https://api.web3.storage/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Web3.Storage upload failed: ${err}`);
  }

  const json = await res.json();
  return json.cid;
}

export async function uploadToIPFS(
  data: Buffer | Blob,
  fileName: string
): Promise<string> {
  const provider = process.env.IPFS_PROVIDER || "pinata";

  if (provider === "pinata") {
    return pinToPinata(data, fileName);
  }
  if (provider === "web3storage") {
    return pinToWeb3Storage(data, fileName);
  }

  throw new Error(`Unknown IPFS provider: ${provider}`);
}

export function getIPFSUrl(cid: string): string {
  const gateway = process.env.IPFS_GATEWAY || "https://ipfs.io/ipfs";
  return `${gateway}/${cid}`;
}
