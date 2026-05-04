"use client";

import { useActionState } from "react";

import { updatePasswordAction } from "@/lib/supabase/actions";

const initial: { error?: string; success?: string } = {};

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, initial);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="new-password" className="text-sm font-medium text-slate-700">
          Nouveau mot de passe
        </label>
        <input
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          disabled={pending}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[var(--accent-strong)] focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm-password" className="text-sm font-medium text-slate-700">
          Confirmer le mot de passe
        </label>
        <input
          id="confirm-password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          disabled={pending}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[var(--accent-strong)] focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-[var(--error)]">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p role="status" className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[var(--primary)] py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Mise à jour…" : "Enregistrer le mot de passe"}
      </button>
    </form>
  );
}
