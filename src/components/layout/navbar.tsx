"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { motion } from "framer-motion";
import { logout } from "@/actions/auth";

interface NavbarProps {
  locale: string;
  session: { email: string; role: string } | null;
}

export function Navbar({ locale, session }: NavbarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/upload", label: t("upload") },
    { href: "/verify", label: t("verify") },
    { href: "/dashboard", label: t("dashboard") },
  ];

  if (session?.role === "SUPER_ADMIN") {
    navLinks.push({ href: "/admin", label: t("admin") });
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="navbar glass-card sticky top-0 z-50"
    >
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl font-bold gradient-text">
          DOC PROOF
        </Link>
      </div>

      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={
                  pathname === link.href || (pathname === "/" && link.href === "/")
                    ? "active font-semibold"
                    : "hover:bg-base-300/50"
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
        {session ? (
          <>
            <span className="hidden sm:inline text-sm opacity-70">{session.email}</span>
            <form action={logout}>
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="btn btn-ghost btn-sm">
                {t("logout")}
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost">
              {t("login")}
            </Link>
            <Link href="/register" className="btn btn-primary">
              {t("register")}
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}
