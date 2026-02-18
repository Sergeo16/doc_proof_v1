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
  const session = await getSession();

  return (
    <>
      <Navbar locale={locale} session={session} />
      <main className="min-h-screen">{children}</main>
      <Toaster position="top-right" />
    </>
  );
}
