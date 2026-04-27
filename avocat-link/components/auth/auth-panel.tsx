"use client";

import { useActionState, useState } from "react";

import { signInAction, signUpAction } from "@/lib/supabase/actions";

type Mode = "signin" | "signup";

type AuthState = {
  error?: string;
  success?: string;
};

const initialState: AuthState = {};

export function AuthPanel({ nextPath }: { nextPath: string }) {
  const [mode, setMode] = useState<Mode>("signin");
  const [signInState, signInFormAction, signInPending] = useActionState(
    signInAction,
    initialState,
  );
  const [signUpState, signUpFormAction, signUpPending] = useActionState(
    signUpAction,
    initialState,
  );

  const isPending = mode === "signin" ? signInPending : signUpPending;
  const state = mode === "signin" ? signInState : signUpState;

  return (
    <div className="w-full max-w-lg rounded-3xl bg-white/90 p-8 shadow-[0_12px_40px_rgba(4,22,39,0.12)] backdrop-blur-sm sm:p-10">
      <div className="mb-8 flex gap-2 rounded-full bg-[var(--surface-muted)] p-1">
        <button
          type="button"
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "signin"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--primary)] hover:bg-white"
          }`}
          onClick={() => setMode("signin")}
        >
          Connexion
        </button>
        <button
          type="button"
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "signup"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--primary)] hover:bg-white"
          }`}
          onClick={() => setMode("signup")}
        >
          Inscription
        </button>
      </div>

      <form
        action={mode === "signin" ? signInFormAction : signUpFormAction}
        className="space-y-5"
      >
        <input type="hidden" name="next" value={nextPath} />

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-[var(--outline)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary-soft)]"
            placeholder="vous@exemple.fr"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            minLength={mode === "signup" ? 8 : undefined}
            className="w-full rounded-xl border border-[var(--outline)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary-soft)]"
            placeholder="Au moins 8 caracteres"
          />
        </div>

        {state.error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-[var(--error)]">
            {state.error}
          </p>
        ) : null}

        {state.success ? (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {state.success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-soft)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Traitement..."
            : mode === "signin"
              ? "Se connecter"
              : "Creer un compte"}
        </button>
      </form>

      <p className="mt-6 text-xs leading-relaxed text-slate-600">
        Vos informations et documents sont traites via une infrastructure securisee,
        avec acces restreint a votre compte.
      </p>
    </div>
  );
}
