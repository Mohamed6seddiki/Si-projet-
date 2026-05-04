import Link from "next/link";

export function HomeContent() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12">
      <div>
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-slate-500">
          Pour les clients
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-[var(--primary)] sm:text-6xl lg:text-7xl max-w-2xl">
          Trouvez un avocat, déposez votre dossier, suivez l&apos;avancement.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Avocat-Link centralise la prise de rendez-vous, l&apos;envoi sécurisé de vos PDF et le suivi
          du statut de chaque consultation — sur mobile comme sur ordinateur.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(2,6,23,0.12)] transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:ring-offset-2"
          >
            Se connecter
          </Link>
          <Link
            href="/login?next=/dashboard/reservations"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3.5 text-sm font-semibold text-[var(--primary)] shadow-sm transition hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary-soft)] focus-visible:ring-offset-2"
          >
            Accéder au tableau de bord
          </Link>
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { k: "PDF", v: "Pièces jointes sécurisées" },
            { k: "Suivi", v: "Statuts clairs (en attente, accepté, terminé)" },
            { k: "RLS", v: "Données isolées par utilisateur" },
          ].map((item) => (
            <div
              key={item.k}
              className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_8px_25px_rgba(4,22,39,0.06)]"
            >
              <dt className="text-xs font-semibold tracking-wide text-[var(--secondary)]">
                {item.k}
              </dt>
              <dd className="mt-2 text-sm font-medium text-slate-700">{item.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative">
        <div className="absolute -inset-2 rounded-[1.75rem] bg-gradient-to-br from-[var(--secondary-soft)]/45 via-white to-[var(--surface-muted)] opacity-85 blur-xl" />
        <div className="relative overflow-hidden rounded-[1.75rem] border border-black/6 bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(4,22,39,0.10)] sm:p-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
            Aperçu
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--primary)]">
            Un parcours simple, de la connexion au suivi
          </h2>
          <ol className="mt-6 space-y-4 text-sm text-slate-600">
            <li className="flex gap-3">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-bold text-[var(--primary)]">
                1
              </span>
              <span>Connexion sécurisée à votre compte client.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-bold text-[var(--primary)]">
                2
              </span>
              <span>Choix d&apos;un avocat, date et heure de consultation.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-bold text-[var(--primary)]">
                3
              </span>
              <span>Téléversement de votre document PDF et suivi du statut.</span>
            </li>
          </ol>
          <div className="mt-8 rounded-2xl bg-[var(--surface-muted)] p-4 text-xs text-slate-600">
            Astuce : sur mobile, la liste des consultations passe en cartes pour une lecture confortable.
          </div>
        </div>
      </div>
    </div>
  );
}
