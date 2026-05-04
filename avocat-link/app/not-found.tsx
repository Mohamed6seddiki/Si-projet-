import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";

export default function NotFound() {
  return (
    <PublicShell variant="marketing">
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center text-center">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-slate-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--primary)] sm:text-4xl">
          Page introuvable
        </h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Le lien est peut-être expiré, ou l&apos;adresse contient une erreur.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[var(--primary)] shadow-sm transition hover:bg-[var(--surface-muted)]"
          >
            Connexion
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
