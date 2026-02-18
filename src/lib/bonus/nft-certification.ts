/**
 * DOC PROOF - NFT Certification (Bonus Feature)
 * Concept: Mint NFT per certified document for transferable proof
 * Integrate with ERC-721 contract for institutional use
 */

export interface NFTCertificationConfig {
  enabled: boolean;
  contractAddress?: string;
  networkId: number;
}

export const NFT_CONFIG: NFTCertificationConfig = {
  enabled: false,
  networkId: 80001, // Mumbai
};

/**
 * Placeholder for NFT mint integration
 * Production: deploy ERC-721 contract, mint on certification
 */
export async function mintCertificationNFT(
  _documentHash: string,
  _issuer: string,
  _metadataUri: string
): Promise<string | null> {
  // TODO: Integrate with Web3 wallet, call mint(issuer, tokenId, metadataUri)
  return null;
}
