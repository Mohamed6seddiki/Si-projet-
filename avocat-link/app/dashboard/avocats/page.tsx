import { AvocatsGrid } from "@/components/dashboard/avocats-grid";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { getAvocats, getCurrentUser } from "@/lib/supabase/queries";

export default async function AvocatsListPage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const avocats = await getAvocats();

  return (
    <div className="flex w-full flex-col">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--primary)] sm:text-3xl">
            Annuaire des avocats
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Cliquez sur une fiche pour voir le détail et lancer une réservation.
          </p>
        </div>
        <AvocatsGrid avocats={avocats} />
      </div>
      <DashboardFooter />
    </div>
  );
}
