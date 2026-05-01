import { AvocatsGrid } from "@/components/dashboard/avocats-grid";
import { ConsultationsTable } from "@/components/dashboard/consultations-table";
import { CreateConsultationForm } from "@/components/dashboard/create-consultation-form";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import {
  getAvocats,
  getConsultationsWithDocumentsForUser,
  getCurrentUser,
} from "@/lib/supabase/queries";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const [avocats, consultations] = await Promise.all([
    getAvocats(),
    getConsultationsWithDocumentsForUser(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
      <header className="rounded-3xl bg-[var(--surface)] p-6 shadow-[0_10px_35px_rgba(4,22,39,0.08)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
              Tableau de bord
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-[var(--primary)]">
              Bienvenue sur Avocat-Link
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Connecte en tant que {user.email}
            </p>
          </div>

          <SignOutButton />
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[var(--primary)]">Avocats disponibles</h2>
        <AvocatsGrid avocats={avocats} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
        <CreateConsultationForm avocats={avocats} />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--primary)]">
            Mes consultations
          </h2>
          <ConsultationsTable consultations={consultations} />
        </div>
      </section>
    </main>
  );
}
