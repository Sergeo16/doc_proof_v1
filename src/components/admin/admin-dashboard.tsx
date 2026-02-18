"use client";

import { useTranslations } from "next-intl";

interface AdminDashboardProps {
  stats: { users: number; documents: number; organizations: number };
  recentLogs: {
    id: string;
    action: string;
    resource: string;
    userId: string | null;
    userEmail: string | null;
    createdAt: string;
  }[];
}

export function AdminDashboard({ stats, recentLogs }: AdminDashboardProps) {
  const t = useTranslations("admin");

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">Users</div>
          <div className="stat-value text-primary">{stats.users}</div>
        </div>
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">Documents</div>
          <div className="stat-value text-secondary">{stats.documents}</div>
        </div>
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">Organizations</div>
          <div className="stat-value">{stats.organizations}</div>
        </div>
      </div>

      <div className="card glass-card">
        <div className="card-body">
          <h2 className="card-title">Recent Audit Logs</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>User</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.action}</td>
                    <td>{log.resource}</td>
                    <td>{log.userEmail || log.userId || "-"}</td>
                    <td>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
