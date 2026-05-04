import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";

export default function TermsPage() {
  return (
    <PublicShell variant="marketing">
      <div className="mx-auto max-w-2xl py-8">
        <h1 className="text-3xl font-bold text-[var(--primary)]">Conditions d&apos;utilisation</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Avocat-Link met à disposition un outil de prise de contact et de suivi de demandes de
          consultation. L&apos;utilisation du service implique le respect des lois en vigueur, une
          utilisation loyale du système (notamment concernant les documents transmis), et la
          confidentialité des accès. Les relations juridiques entre vous et un avocat restent régies
          par les règles déontologiques et contractuelles applicables entre avocat et client.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Nous pouvons faire évoluer ces conditions ; la version publiée sur cette page fait foi.
          Pour toute question, contactez le support de votre organisation ou l&apos;administrateur
          du service.
        </p>
        <p className="mt-8">
          <Link href="/login" className="text-sm font-semibold text-[var(--accent-strong)] hover:underline">
            Retour
          </Link>
        </p>
      </div>
    </PublicShell>
  );
}
