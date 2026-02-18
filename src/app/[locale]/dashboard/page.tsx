import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) redirect(`/${locale}/login`);

  const [documents, verifications] = await Promise.all([
    prisma.document.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.verification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { document: true },
    }),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold gradient-text mb-8">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href={`/${locale}/upload`} className="card glass-card hover:border-primary/50 transition-colors">
          <div className="card-body">
            <h2 className="card-title">Upload Document</h2>
            <p className="opacity-80">Certify a new document on the blockchain</p>
          </div>
        </Link>
        <Link href={`/${locale}/verify`} className="card glass-card hover:border-primary/50 transition-colors">
          <div className="card-body">
            <h2 className="card-title">Verify Document</h2>
            <p className="opacity-80">Verify document integrity by hash</p>
          </div>
        </Link>
        {session.role === "SUPER_ADMIN" && (
          <Link href={`/${locale}/admin`} className="card glass-card hover:border-primary/50 transition-colors">
            <div className="card-body">
              <h2 className="card-title">Admin Panel</h2>
              <p className="opacity-80">Super Admin control center</p>
            </div>
          </Link>
        )}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="card glass-card">
          <div className="card-body">
            <h2 className="card-title">My Documents</h2>
            {documents.length === 0 ? (
              <p className="opacity-70">No documents yet. Upload your first!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>File</th>
                      <th>Status</th>
                      <th>Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td>{doc.fileName}</td>
                        <td>
                          <span
                            className={`badge ${
                              doc.status === "CERTIFIED"
                                ? "badge-success"
                                : doc.status === "REVOKED"
                                ? "badge-error"
                                : "badge-warning"
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="font-mono text-xs truncate max-w-[120px]">
                          {doc.originalHash.slice(0, 18)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card glass-card">
          <div className="card-body">
            <h2 className="card-title">Recent Verifications</h2>
            {verifications.length === 0 ? (
              <p className="opacity-70">No verifications yet</p>
            ) : (
              <ul className="space-y-2">
                {verifications.map((v) => (
                  <li key={v.id} className="flex justify-between items-center">
                    <span className="font-mono text-sm truncate max-w-[180px]">
                      {v.hash.slice(0, 20)}...
                    </span>
                    <span
                      className={`badge badge-sm ${
                        v.isValid ? "badge-success" : "badge-error"
                      }`}
                    >
                      {v.isValid ? "Valid" : "Invalid"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
