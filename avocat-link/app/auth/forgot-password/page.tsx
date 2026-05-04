import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { PublicShell } from "@/components/layout/public-shell";

export default function ForgotPasswordPage() {
  return (
    <PublicShell authMinimal>
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
        <h1 className="text-2xl font-bold text-[var(--primary)]">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-slate-600">
          Saisissez votre adresse e-mail. Si un compte existe, vous recevrez un lien pour choisir un
          nouveau mot de passe.
        </p>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <ForgotPasswordForm />
        </div>
        <p className="mt-6 text-center text-sm text-slate-600">
          <Link href="/login" className="font-semibold text-[var(--accent-strong)] hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </PublicShell>
  );
}
