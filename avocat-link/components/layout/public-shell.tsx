import Link from "next/link";

type PublicShellProps = {
  children: React.ReactNode;
  variant?: "marketing" | "auth";
  /** Connexion / pages auth : fond clair, sans barre du haut */
  authMinimal?: boolean;
};

export function PublicShell({
  children,
  variant = "marketing",
  authMinimal = false,
}: PublicShellProps) {
  if (authMinimal) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--background)]">
        <a
          href="#public-main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--primary)] focus:shadow-lg"
        >
          Aller au contenu
        </a>
        <div id="public-main" className="flex-1">
          {children}
        </div>
        <footer className="border-t border-slate-200 bg-white py-6">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
            <p>Avocat-Link © {new Date().getFullYear()} — Consultations juridiques sécurisées</p>
            <div className="flex flex-wrap justify-center gap-4 font-medium">
              <a href="#" className="hover:text-[var(--primary)]">
                Confidentialité
              </a>
              <a href="#" className="hover:text-[var(--primary)]">
                Conditions
              </a>
              <a href="#" className="hover:text-[var(--primary)]">
                Aide
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  const outer =
    variant === "auth"
      ? "min-h-screen bg-[var(--background)]"
      : "min-h-screen bg-[var(--background)]";

  return (
    <div className={outer}>
      <a
        href="#public-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--primary)] focus:shadow-lg"
      >
        Aller au contenu
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-[var(--primary)]">Avocat-Link</span>
            <span className="hidden text-sm font-medium text-slate-600 sm:inline">
              Consultations juridiques
            </span>
          </Link>

          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-[var(--primary)]"
            >
              Accueil
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-white shadow-sm transition hover:opacity-95"
            >
              Connexion
            </Link>
          </nav>
        </div>
      </header>

      <div
        id="public-main"
        className={
          variant === "auth"
            ? "p-2 sm:p-4 lg:p-6"
            : "relative isolate flex-1 overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
        }
      >
        {variant === "marketing" ? (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(59,130,246,0.08)_0%,transparent_45%),radial-gradient(circle_at_90%_0%,rgba(15,23,42,0.06)_0%,transparent_40%)]"
            />
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </>
        ) : (
          children
        )}
      </div>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Avocat-Link</p>
          <div className="flex flex-wrap justify-center gap-4 font-medium">
            <a href="#" className="hover:text-[var(--primary)]">
              Confidentialité
            </a>
            <a href="#" className="hover:text-[var(--primary)]">
              Conditions
            </a>
            <a href="#" className="hover:text-[var(--primary)]">
              Aide
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
