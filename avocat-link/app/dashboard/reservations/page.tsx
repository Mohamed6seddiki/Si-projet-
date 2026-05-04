import { BookingWorkflow } from "@/components/dashboard/booking-workflow";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { getAvocats, getCurrentUser } from "@/lib/supabase/queries";

type PageProps = {
  searchParams: Promise<{ avocat?: string }>;
};

export default async function ReservationsPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();

  const query = await searchParams;
  const avocatParam = typeof query.avocat === "string" ? query.avocat.trim() : "";

  const avocats = user ? await getAvocats() : [];
  const initialAvocatId =
    avocatParam && avocats.some((a) => a.id === avocatParam) ? avocatParam : null;

  return (
    <div className="flex w-full flex-col">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--primary)] sm:text-3xl">
            Nouvelle réservation
          </h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Sélectionnez un avocat, un créneau puis joignez votre dossier au format PDF pour créer
            la consultation.
          </p>
        </div>
        {user ? (
          <BookingWorkflow
            key={initialAvocatId ?? "none"}
            avocats={avocats}
            initialAvocatId={initialAvocatId}
          />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[var(--primary)]">Mode aperçu</p>
            <p className="mt-2 text-sm text-slate-600">
              Vous pouvez parcourir le projet sans compte. La création réelle d&apos;une consultation
              est réservée aux utilisateurs connectés.
            </p>
          </div>
        )}
      </div>
      <DashboardFooter />
    </div>
  );
}
