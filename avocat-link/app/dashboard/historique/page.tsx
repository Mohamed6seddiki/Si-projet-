import { ConsultationsTable } from "@/components/dashboard/consultations-table";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { getConsultationsWithDocumentsForUser, getCurrentUser } from "@/lib/supabase/queries";

export default async function HistoriquePage() {
  const user = await getCurrentUser();
  const consultations = user ? await getConsultationsWithDocumentsForUser() : [];

  return (
    <div className="flex w-full flex-col">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--primary)] sm:text-3xl">
            Historique des consultations
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Statut et documents associés à vos demandes.
          </p>
          {!user ? (
            <p className="mt-2 text-sm font-medium text-[var(--accent-strong)]">
              Mode visiteur actif: l&apos;historique personnel nécessite un compte.
            </p>
          ) : null}
        </div>
        {user ? (
          <ConsultationsTable consultations={consultations} />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[var(--primary)]">Aucun compte connecté</p>
            <p className="mt-1 text-sm text-slate-600">
              Connectez-vous si vous voulez voir un historique personnel.
            </p>
          </div>
        )}
      </div>
      <DashboardFooter />
    </div>
  );
}
