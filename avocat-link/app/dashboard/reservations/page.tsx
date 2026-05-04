import { BookingWorkflow } from "@/components/dashboard/booking-workflow";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { getAvocats, getCurrentUser } from "@/lib/supabase/queries";

type PageProps = {
  searchParams: Promise<{ avocat?: string }>;
};

export default async function ReservationsPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const query = await searchParams;
  const avocatParam = typeof query.avocat === "string" ? query.avocat.trim() : "";

  const avocats = await getAvocats();
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
        <BookingWorkflow
          key={initialAvocatId ?? "none"}
          avocats={avocats}
          initialAvocatId={initialAvocatId}
        />
      </div>
      <DashboardFooter />
    </div>
  );
}
