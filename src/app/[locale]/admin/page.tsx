import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") redirect(`/${locale}`);

  const [userCount, docCount, orgCount, recentLogs] = await Promise.all([
    prisma.user.count(),
    prisma.document.count(),
    prisma.organization.count(),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { user: { select: { email: true } } },
    }),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold gradient-text mb-8">
        Super Admin Dashboard
      </h1>

      <AdminDashboard
        stats={{
          users: userCount,
          documents: docCount,
          organizations: orgCount,
        }}
        recentLogs={recentLogs.map((l) => ({
          id: l.id,
          action: l.action,
          resource: l.resource,
          userId: l.userId,
          userEmail: l.user?.email ?? null,
          createdAt: l.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
