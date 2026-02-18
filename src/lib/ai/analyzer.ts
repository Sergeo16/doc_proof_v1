/**
 * DOC PROOF - AI Document Analysis
 * Fraud detection, integrity analysis, anomaly scoring
 * Production: integrate OpenAI/Anthropic API for advanced analysis
 */

import pdf from "pdf-parse";
import { createHash } from "crypto";

export interface AIAnalysisResult {
  fraudScore: number;
  integrityScore: number;
  anomalies: string[];
  summary: string;
  metadata: Record<string, string>;
  recommendations: string[];
}

export async function analyzeDocument(
  buffer: Buffer,
  mimeType: string
): Promise<AIAnalysisResult> {
  const anomalies: string[] = [];
  let metadata: Record<string, string> = {};
  let textContent = "";

  try {
    if (mimeType === "application/pdf") {
      const pdfData = await pdf(buffer);
      textContent = pdfData.text;
      metadata = {
        pages: String(pdfData.numpages),
        info: JSON.stringify(pdfData.info || {}),
      };

      // Basic anomaly detection
      if (pdfData.numpages === 0) anomalies.push("empty_document");
      if (textContent.length < 50 && pdfData.numpages > 1)
        anomalies.push("possible_scanned_image");
    }
  } catch (err) {
    anomalies.push("parse_error");
    metadata = { parseError: String(err) };
  }

  // Hash consistency check
  const computedHash = "0x" + createHash("sha256").update(buffer).digest("hex");
  metadata.computedHash = computedHash;

  // Fraud probability heuristics (0-100)
  let fraudScore = 0;
  if (anomalies.includes("empty_document")) fraudScore += 40;
  if (anomalies.includes("parse_error")) fraudScore += 30;
  if (anomalies.includes("possible_scanned_image")) fraudScore += 15;
  if (textContent.length > 10000) fraudScore += 5; // Very long doc
  if (buffer.length < 100) fraudScore += 50; // Tiny file

  const integrityScore = Math.max(0, 100 - fraudScore);
  const summary =
    textContent.length > 0
      ? textContent.slice(0, 200) + (textContent.length > 200 ? "..." : "")
      : "No extractable text content";

  const recommendations: string[] = [];
  if (fraudScore > 50) recommendations.push("Manual verification recommended");
  if (anomalies.length > 0)
    recommendations.push("Review detected anomalies before certification");

  return {
    fraudScore: Math.min(100, fraudScore),
    integrityScore,
    anomalies,
    summary,
    metadata,
    recommendations,
  };
}
