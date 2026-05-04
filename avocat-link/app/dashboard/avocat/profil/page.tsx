import { redirect } from "next/navigation";

import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { getCurrentUser, getLawyerProfile } from "@/lib/supabase/queries";

export default async function AvocatProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const profile = await getLawyerProfile();
  if (!profile) {
    redirect("/dashboard/avocat");
  }

  return (
    <div className="flex w-full flex-col">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--primary)] sm:text-3xl">
            Profil avocat
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Vérifiez vos informations publiques.
          </p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-xl font-semibold text-[var(--primary)]">
              {profile.nom.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--primary)]">{profile.nom}</p>
              <p className="text-sm text-slate-600">
                {profile.specialite ?? "Spécialité à compléter"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--primary)]">
                {user.email}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date d&apos;inscription
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--primary)]">
                {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
                  new Date(profile.created_at),
                )}
              </p>
            </div>
          </div>
        </section>
      </div>
      <DashboardFooter />
    </div>
  );
}
