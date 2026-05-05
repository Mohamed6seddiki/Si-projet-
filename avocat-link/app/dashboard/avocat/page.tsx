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
        <section className="group rounded-3xl border border-white/50 bg-white/70 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-inset ring-indigo-100/50 shadow-inner">
                <span className="text-xl font-bold text-indigo-700">
                  {(profile?.nom ?? user?.email ?? "V").slice(0, 1).toUpperCase()}
                </span>
                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm"></div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500/80">
                  Espace avocat
                </p>
                <h1 className="mt-0.5 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600">
                  {profile?.nom ?? user?.user_metadata?.full_name ?? "Profil avocat"}
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {profile?.specialite ?? "Spécialité à compléter"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/reservations"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:opacity-95 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                Créer une consultation
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="group rounded-3xl border border-white/50 bg-white/70 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">Modifier mon profil public</h2>
              <p className="mt-1 text-sm text-slate-500">
                Mettez à jour le nom, la spécialité et l&apos;image affichés aux clients.
              </p>
            </div>
            {user ? (
              <LawyerProfileForm
                initialProfile={profile}
                userEmail={user.email ?? ""}
              />
            ) : (
              <div className="rounded-2xl border border-slate-200/60 bg-white/50 p-5 text-sm text-slate-600 backdrop-blur-sm">
                Mode visiteur: le formulaire de profil est disponible après connexion.
              </div>
            )}
          </div>

          <div className="group rounded-3xl border border-white/50 bg-white/70 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">Visibilité</h2>
              <p className="mt-1 text-sm text-slate-500">
                Votre compte avocat est public dès qu&apos;il existe dans la base.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50/50 to-blue-50/50 p-5 ring-1 ring-inset ring-indigo-100/50">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl"></div>
              <div className="relative text-sm font-medium leading-relaxed text-indigo-900/80">
                <svg className="mb-3 h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Les clients peuvent vous trouver dans l&apos;annuaire une fois votre profil créé. Soignez votre présentation pour inspirer confiance.
              </div>
            </div>
          </div>
        </section>

        <section className="group rounded-3xl border border-white/50 bg-white/70 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Demandes reçues</h2>
              <p className="mt-1 text-sm text-slate-500">
                Gérez les demandes entrantes et suivez l&apos;évolution de vos dossiers.
              </p>
            </div>
          </div>

          {user && consultations.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/60 bg-slate-50/30 p-12 text-center transition-colors hover:bg-slate-50/50">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 ring-4 ring-indigo-50/50">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Aucune demande reçue pour le moment
              </p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Vous verrez ici les demandes dès qu&apos;un client choisira votre profil pour une consultation.
              </p>
            </div>
          ) : !user ? (
            <div className="mt-6 rounded-2xl border border-white/60 bg-white/50 p-6 text-sm text-slate-600 backdrop-blur-sm">
              Mode visiteur: les demandes reçues apparaissent après connexion avec un compte avocat.
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-200/50 bg-white/40 shadow-sm backdrop-blur-md">
              <LawyerRequestsTable consultations={consultations} />
            </div>
          )}
        </section>
      </div>
      <DashboardFooter />
    </div>
  );
}

