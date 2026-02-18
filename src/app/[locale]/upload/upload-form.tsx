"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { certifyDocument } from "@/actions/documents";
import toast from "react-hot-toast";

export function UploadForm() {
  const t = useTranslations("upload");
  const locale = useLocale();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error(t("error"));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await certifyDocument(formData);
      toast.success(t("success"));
      router.push(`/${locale}/verify?hash=${result.hash}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-box p-12 text-center transition-all ${
          dragActive ? "border-primary bg-primary/10" : "border-base-300"
        }`}
      >
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <p className="text-lg opacity-80">{t("dropzone")}</p>
          {file ? (
            <p className="mt-2 font-mono text-sm text-primary">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          ) : null}
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg w-full"
        disabled={!file || loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="loading loading-spinner" />
            {t("processing")}
          </span>
        ) : (
          t("title")
        )}
      </button>
    </form>
  );
}
