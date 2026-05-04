import Link from "next/link";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { PublicShell } from "@/components/layout/public-shell";
import { createClient } from "@/lib/supabase/server";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PublicShell authMinimal>
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
        <h1 className="text-2xl font-bold text-[var(--primary)]">Nouveau mot de passe</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choisissez un mot de passe sécurisé (au moins 8 caractères).
        </p>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          {user ? (
            <ResetPasswordForm />
          ) : (
            <p className="text-sm text-slate-600">
              Lien invalide ou session expirée. Demandez un nouveau lien depuis la page{" "}
              <Link href="/auth/forgot-password" className="font-semibold text-[var(--accent-strong)] hover:underline">
                mot de passe oublié
              </Link>
              .
            </p>
          )}
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
