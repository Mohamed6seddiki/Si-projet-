import Link from "next/link";

import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { LawyerProfileForm } from "@/components/dashboard/lawyer-profile-form";
import { LawyerRequestsTable } from "@/components/dashboard/lawyer-requests-table";
import { getConsultationsForLawyer, getCurrentUser, getLawyerProfile } from "@/lib/supabase/queries";

export default async function AvocatDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const [profile, consultations] = user
    ? await Promise.all([getLawyerProfile(), getConsultationsForLawyer()])
    : [null, []];

  return (
    <div className="flex w-full flex-col">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--surface-muted) text-lg font-semibold text-(--primary)">
                {(profile?.nom ?? user?.email ?? "V").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Espace avocat
                </p>
                <h1 className="text-2xl font-bold text-(--primary)">
                  {profile?.nom ?? user?.user_metadata?.full_name ?? "Profil avocat"}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {profile?.specialite ?? "Spécialité à compléter"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/reservations"
                className="inline-flex items-center justify-center rounded-xl bg-(--primary) px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Créer une consultation
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-(--primary)">Modifier mon profil public</h2>
              <p className="text-sm text-slate-600">
                Mettez à jour le nom, la spécialité et l&apos;image affichés aux clients.
              </p>
            </div>
            {user ? (
              <LawyerProfileForm
                initialProfile={profile}
                userEmail={user.email ?? ""}
              />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Mode visiteur: le formulaire de profil est disponible après connexion.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-(--primary)">Visibilité</h2>
              <p className="text-sm text-slate-600">
                Votre compte avocat est public dès qu&apos;il existe dans la base `avocats`.
              </p>
            </div>
            <div className="rounded-2xl bg-(--surface-muted) p-4 text-sm text-slate-700">
              Les clients peuvent vous trouver dans l&apos;annuaire une fois votre profil créé.
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-(--primary)">Demandes reçues</h2>
              <p className="text-sm text-slate-600">
                Confirmez les demandes entrantes puis marquez-les comme terminées.
              </p>
            </div>
          </div>

          {user && consultations.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
              <p className="text-sm font-semibold text-(--primary)">
                Aucune demande reçue pour le moment
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Vous verrez ici les demandes dès qu&apos;un client choisira votre profil.
              </p>
            </div>
          ) : !user ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              Mode visiteur: les demandes reçues apparaissent après connexion avec un compte avocat.
            </div>
          ) : (
            <div className="mt-6">
              <LawyerRequestsTable consultations={consultations} />
            </div>
          )}
        </section>
      </div>
      <DashboardFooter />
    </div>
  );
}
