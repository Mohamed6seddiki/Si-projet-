import Link from "next/link";

export function DashboardFooter() {
  return (
    <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-xs text-slate-500 sm:flex-row">
      <p>Avocat-Link © {new Date().getFullYear()} — Consultations juridiques sécurisées</p>
      <div className="flex flex-wrap justify-center gap-4 font-medium">
        <Link href="/legal/privacy" className="hover:text-[var(--primary)]">
          Confidentialité
        </Link>
        <Link href="/legal/terms" className="hover:text-[var(--primary)]">
          Conditions
        </Link>
        <Link href="/" className="hover:text-[var(--primary)]">
          Accueil public
        </Link>
      </div>
    </footer>
  );
}
