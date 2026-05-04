import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";

export default function PrivacyPage() {
  return (
    <PublicShell variant="marketing">
      <div className="mx-auto max-w-2xl py-8">
        <h1 className="text-3xl font-bold text-[var(--primary)]">Politique de confidentialité</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Les données nécessaires au fonctionnement d&apos;Avocat-Link (compte utilisateur,
          consultations, documents transmis) sont traitées pour permettre la mise en relation et le
          suivi des dossiers. Les fichiers sont stockés de façon sécurisée ; l&apos;accès est limité
          par les règles de sécurité configurées sur la plateforme (authentification, politiques de
          lecture côté base et stockage).
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Vous pouvez exercer vos droits (accès, rectification, suppression selon les cas) auprès du
          responsable de traitement désigné pour votre déploiement. Cette page peut être complétée
          par les mentions légales propres à votre structure.
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
