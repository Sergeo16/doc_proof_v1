import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "fr", "zh", "ar", "es"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const { usePathname, useRouter, Link } = createNavigation(routing);
