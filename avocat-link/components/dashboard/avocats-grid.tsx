import Image from "next/image";
import Link from "next/link";

import type { Avocat } from "@/lib/types";

export function AvocatsGrid({ avocats }: { avocats: Avocat[] }) {
  if (avocats.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_35px_rgba(4,22,39,0.08)]">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--primary)]">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              <path d="M4 22a8 8 0 0 1 16 0" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--primary)]">
              Aucun avocat disponible
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Revenez plus tard ou rafraîchissez la page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {avocats.map((avocat) => (
        <Link
          key={avocat.id}
          href={`/dashboard/avocats/${avocat.id}`}
          className="block rounded-3xl border border-black/5 bg-white p-4 shadow-[0_10px_35px_rgba(4,22,39,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(4,22,39,0.12)] sm:p-5"
        >
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
              {avocat.avatar_url && avocat.avatar_url.startsWith("/") ? (
                <Image
                  src={avocat.avatar_url}
                  alt={`Portrait de ${avocat.nom}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : avocat.avatar_url ? (
                <img
                  src={avocat.avatar_url}
                  alt={`Portrait de ${avocat.nom}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-[var(--primary)]">
                  {avocat.nom.slice(0, 1)}
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--primary)] sm:text-xl">
                {avocat.nom}
              </p>
              <p className="mt-2 inline-flex rounded-full bg-[var(--secondary-soft)] px-3 py-1 text-xs font-semibold text-[var(--secondary)]">
                {avocat.specialite}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs font-medium text-[var(--accent-strong)]">Voir la fiche →</p>
        </Link>
      ))}
    </div>
  );
}
