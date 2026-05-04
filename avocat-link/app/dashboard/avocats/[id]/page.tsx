import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { getAvocatById, getCurrentUser } from "@/lib/supabase/queries";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AvocatDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const { id } = await params;
  const avocat = await getAvocatById(id);

  if (!avocat) {
    notFound();
  }

  const inscritLe = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
    new Date(avocat.created_at),
  );

  return (
    <div className="flex w-full flex-col">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/dashboard/avocats"
          className="text-sm font-semibold text-[var(--accent-strong)] hover:underline"
        >
          ← Retour à l&apos;annuaire
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-3xl bg-[var(--surface-muted)]">
            {avocat.avatar_url && avocat.avatar_url.startsWith("/") ? (
              <Image
                src={avocat.avatar_url}
                alt={`Portrait de ${avocat.nom}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : avocat.avatar_url ? (
              <img
                src={avocat.avatar_url}
                alt={`Portrait de ${avocat.nom}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-[var(--primary)]">
                {avocat.nom.slice(0, 1)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--primary)]">{avocat.nom}</h1>
            <p className="mt-2 inline-flex rounded-full bg-[var(--secondary-soft)] px-3 py-1 text-sm font-semibold text-[var(--secondary)]">
              {avocat.specialite}
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-600">
          Fiche avocat · Inscrit le {inscritLe}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/dashboard/reservations?avocat=${encodeURIComponent(avocat.id)}`}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Réserver une consultation
          </Link>
          <Link
            href="/dashboard/historique"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[var(--primary)] shadow-sm transition hover:bg-slate-50"
          >
            Voir mon historique
          </Link>
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
}
