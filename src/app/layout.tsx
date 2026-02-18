import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ThemeProvider, ThemeScript } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOC PROOF - Blockchain Document Certification",
  description:
    "Enterprise-grade blockchain document certification platform for governments, universities, banks, and international institutions.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-base-100 text-base-content">
        <ThemeScript />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
