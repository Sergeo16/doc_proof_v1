/**
 * Page racine : le middleware next-intl redirige déjà / vers la locale détectée
 * (accept-language, cookie NEXT_LOCALE, ou defaultLocale).
 * Ce redirect ne s'exécute qu'en fallback si le middleware n'a pas redirigé.
 */
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
