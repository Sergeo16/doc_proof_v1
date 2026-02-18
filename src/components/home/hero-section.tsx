"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

interface HeroSectionProps {
  appName: string;
  tagline: string;
  locale: string;
}

export function HeroSection({ appName, tagline }: HeroSectionProps) {
  const t = useTranslations("app");

  return (
    <div className="hero min-h-[80vh]">
      <div className="hero-content flex-col lg:flex-row-reverse gap-12">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mockup-browser border bg-base-300 border-base-300 shrink-0"
        >
          <div className="mockup-browser-toolbar">
            <div className="input">https://docproof.chain/verify</div>
          </div>
          <div className="flex justify-center px-4 py-16 bg-base-200">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 border-4 border-primary rounded-lg flex items-center justify-center">
                <span className="text-4xl">📄</span>
              </div>
              <p className="font-mono text-sm text-base-content/70">
                {t("documentHash")}: 0x7a3f...
              </p>
              <div className="badge badge-success badge-lg">✓ {t("certified")}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <h1 className="text-5xl font-bold gradient-text">{appName}</h1>
          <p className="py-6 text-xl opacity-90">{tagline}</p>
          <p className="text-base-content/80 mb-8">{t("heroDescription")}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/upload" className="btn btn-primary btn-lg">
              {t("certifyDocument")}
            </Link>
            <Link href="/verify" className="btn btn-outline btn-lg">
              {t("verifyDocument")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
