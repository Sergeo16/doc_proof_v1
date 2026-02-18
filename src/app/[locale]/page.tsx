import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/home/hero-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("app");

  return (
    <HeroSection
      appName={t("name")}
      tagline={t("tagline")}
      locale={locale}
    />
  );
}
