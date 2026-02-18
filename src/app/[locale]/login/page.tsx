"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { login } from "@/actions/auth";
import toast from "react-hot-toast";

export default function LoginPage() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      formData.set("locale", locale);
      await login(formData);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card glass-card w-full max-w-md"
      >
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">{t("login")}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="locale" value={locale} />
            <div className="form-control w-full">
              <label className="label py-1" htmlFor="login-email">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                placeholder="vous@exemple.com"
                className="input input-bordered w-full h-12"
              />
            </div>
            <div className="form-control w-full">
              <label className="label py-1" htmlFor="login-password">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="input input-bordered w-full h-12"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner" /> : t("login")}
            </button>
          </form>
          <p className="text-center text-sm opacity-70 mt-4">
            No account?{" "}
            <Link href="/register" className="link link-primary">
              {t("register")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
