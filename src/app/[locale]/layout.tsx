import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "react-hot-toast";
import { getSession } from "@/lib/auth";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const session = await getSession();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar locale={locale} session={session} />
      <main className="min-h-screen bg-base-100 text-base-content">{children}</main>
      <Toaster position="top-right" />
    </NextIntlClientProvider>
  );
}
