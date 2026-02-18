"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { verifyDocumentByHash } from "@/actions/documents";
import { getExplorerUrl } from "@/lib/blockchain";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const t = useTranslations("verify");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const hashParam = searchParams.get("hash");

  const [hash, setHash] = useState(hashParam || "");
  const [result, setResult] = useState<{
    isValid: boolean;
    document?: {
      hash: string;
      issuer: string;
      certifiedAt: Date | null;
      blockchainTxHash: string | null;
    } | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hashParam) setHash(hashParam);
  }, [hashParam]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await verifyDocumentByHash(hash.trim());
      setResult(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">{t("title")}</h1>
        <p className="text-lg opacity-80 mb-8">{t("subtitle")}</p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder={t("hashPlaceholder")}
            className="input input-bordered w-full font-mono"
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner" />
            ) : (
              t("verify")
            )}
          </button>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 card glass-card"
          >
            <div className="card-body">
              <div
                className={`flex items-center gap-3 text-xl font-bold ${
                  result.isValid ? "text-success" : "text-error"
                }`}
              >
                {result.isValid ? "✓" : "✗"}{" "}
                {result.isValid ? t("valid") : t("invalid")}
              </div>

              {result.document && (
                <div className="space-y-2 mt-4">
                  <p>
                    <span className="opacity-70">{t("issuer")}:</span>{" "}
                    {result.document.issuer}
                  </p>
                  {result.document.certifiedAt && (
                    <p>
                      <span className="opacity-70">{t("timestamp")}:</span>{" "}
                      {new Date(result.document.certifiedAt).toLocaleString()}
                    </p>
                  )}
                  {result.document.blockchainTxHash && (
                    <a
                      href={getExplorerUrl(result.document.blockchainTxHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary"
                    >
                      {t("blockchain")}
                    </a>
                  )}
                </div>
              )}

              {result.document && (
                <div className="mt-6 p-4 bg-base-300 rounded-box flex justify-center">
                  <QRCodeSVG
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/${locale}/verify?hash=${result.document.hash}`}
                    size={128}
                    level="M"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
