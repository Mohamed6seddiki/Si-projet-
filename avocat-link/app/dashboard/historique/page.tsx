import { ConsultationsTable } from "@/components/dashboard/consultations-table";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { getConsultationsWithDocumentsForUser, getCurrentUser } from "@/lib/supabase/queries";

export default async function HistoriquePage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const consultations = await getConsultationsWithDocumentsForUser();

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
        </div>
        <ConsultationsTable consultations={consultations} />
      </div>
      <DashboardFooter />
    </div>
  );
}
