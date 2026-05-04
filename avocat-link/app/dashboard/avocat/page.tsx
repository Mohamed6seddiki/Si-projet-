import Link from "next/link";

import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/utils";
import { getConsultationsForLawyer, getCurrentUser, getLawyerProfile } from "@/lib/supabase/queries";

export default async function AvocatDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const [profile, consultations] = await Promise.all([
    getLawyerProfile(),
    getConsultationsForLawyer(),
  ]);

  return (
    <div className="flex w-full flex-col">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-lg font-semibold text-[var(--primary)]">
                {(profile?.nom ?? user.email ?? "?").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Espace avocat
                </p>
                <h1 className="text-2xl font-bold text-[var(--primary)]">
                  {profile?.nom ?? user.user_metadata?.full_name ?? "Profil avocat"}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {profile?.specialite ?? "Spécialité à compléter"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/avocat/profil"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[var(--primary)] shadow-sm transition hover:bg-slate-50"
              >
                Modifier mon profil
              </Link>
              <Link
                href="/dashboard/reservations"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Créer une consultation
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--primary)]">
                Consultations affectées
              </h2>
              <p className="text-sm text-slate-600">
                Suivez les demandes des clients et mettez à jour le statut.
              </p>
            </div>
          </div>

          {consultations.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
              <p className="text-sm font-semibold text-[var(--primary)]">
                Aucune consultation assignée pour le moment
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Vous verrez ici les demandes dès qu&apos;un client vous choisira.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-[var(--surface-muted)] text-left text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Client</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map((consultation) => (
                    <tr
                      key={consultation.id}
                      className="border-t border-[var(--surface-subtle)]"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--primary)]">
                        {consultation.client_id.slice(0, 8)}…
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDateTime(consultation.date_consultation)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={consultation.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      <DashboardFooter />
    </div>
  );
}
