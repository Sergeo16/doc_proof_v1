import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "fr", "zh", "ar", "es"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: true,
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
  },
});

export const { usePathname, useRouter, Link } = createNavigation(routing);

const LOCALES = ["en", "fr", "zh", "ar", "es"];

/**
 * Retire le préfixe de locale du pathname pour éviter /fr/fr.
 * usePathname peut parfois retourner /fr ou /fr/dashboard selon la config.
 */
export function getPathWithoutLocale(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && LOCALES.includes(segments[0])) {
    const rest = segments.slice(1);
    return rest.length ? "/" + rest.join("/") : "/";
  }
  return pathname.startsWith("/") ? pathname : "/" + pathname;
}
