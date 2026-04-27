import type { Avocat } from "@/lib/types";

export function AvocatsGrid({ avocats }: { avocats: Avocat[] }) {
  if (avocats.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 text-sm text-slate-600 shadow-[0_10px_35px_rgba(4,22,39,0.08)]">
        Aucun avocat disponible.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {avocats.map((avocat) => (
        <article
          key={avocat.id}
          className="rounded-3xl bg-white p-5 shadow-[0_10px_35px_rgba(4,22,39,0.08)]"
        >
          <p className="text-xl font-semibold text-[var(--primary)]">{avocat.nom}</p>
          <p className="mt-2 inline-flex rounded-full bg-[var(--secondary-soft)] px-3 py-1 text-xs font-semibold text-[var(--secondary)]">
            {avocat.specialite}
          </p>
        </article>
      ))}
    </div>
  );
}
