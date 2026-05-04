"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";

import { signInAction, signUpAction } from "@/lib/supabase/actions";

type ActionState = {
  error?: string;
  success?: string;
};

const initialState: ActionState = {};

type Props = {
  nextPath: string;
  callbackError?: "callback_failed";
};

function LogoMark() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--primary) shadow-md">
      <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3L4 7v6c0 4.5 3 8.5 8 10 5-1.5 8-5.5 8-10V7l-8-4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function SignInFields({
  pending,
  nextPath,
}: {
  pending: boolean;
  nextPath: string;
}) {
  const emailId = useId();
  const passwordId = useId();

  return (
    <>
      <input type="hidden" name="next" value={nextPath} />

      <div className="space-y-2">
        <label htmlFor={emailId} className="text-sm font-medium text-slate-700">
          Adresse e-mail
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </span>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nom@cabinet.com"
            required
            disabled={pending}
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-(--accent-strong) focus:ring-2 focus:ring-(--accent)"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={passwordId} className="text-sm font-medium text-slate-700">
            Mot de passe
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-xs font-semibold text-(--accent-strong) hover:underline"
          >
            Mot de passe oublié&nbsp;?
          </Link>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </span>
          <input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            disabled={pending}
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-3 text-sm outline-none transition focus:border-(--accent-strong) focus:ring-2 focus:ring-(--accent)"
          />
        </div>
      </div>
    </>
  );
}

function SignUpFields({ pending, nextPath }: { pending: boolean; nextPath: string }) {
  const [role, setRole] = useState<"client" | "avocat">("client");
  const [showPw, setShowPw] = useState(false);
  const emailId = useId();
  const passwordId = useId();
  const termsId = useId();

  return (
    <>
      <input type="hidden" name="next" value={nextPath} />
      <input type="hidden" name="role" value={role} />

      <div>
        <p className="text-sm font-medium text-slate-700">Créer un compte en tant que</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("client")}
            className={[
              "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition",
              role === "client"
                ? "border-(--accent-strong) bg-(--accent) text-(--primary)"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
            ].join(" ")}
            aria-pressed={role === "client"}
            aria-label="Créer un compte client"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Client
          </button>
          <button
            type="button"
            onClick={() => setRole("avocat")}
            className={[
              "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition",
              role === "avocat"
                ? "border-[var(--accent-strong)] bg-[var(--accent)] text-[var(--primary)]"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
            ].join(" ")}
            aria-pressed={role === "avocat"}
            aria-label="Créer un compte avocat"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 4V9m0 4l6 2m-6-2l6-2" />
            </svg>
            Avocat
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Nom complet</label>
        <input
          name="full_name"
          type="text"
          autoComplete="name"
          placeholder="Jean Dupont"
          disabled={pending}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-(--accent-strong) focus:ring-2 focus:ring-(--accent)"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={emailId} className="text-sm font-medium text-slate-700">
          Adresse e-mail
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nom@cabinet.com"
          required
          disabled={pending}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-(--accent-strong) focus:ring-2 focus:ring-(--accent)"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={passwordId} className="text-sm font-medium text-slate-700">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id={passwordId}
            name="password"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            placeholder="8 caractères minimum"
            required
            disabled={pending}
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-3 pr-12 text-sm outline-none transition focus:border-(--accent-strong) focus:ring-2 focus:ring-(--accent)"
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label={showPw ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              {showPw ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

        <div className="flex items-start gap-2">
        <input
          id={termsId}
          type="checkbox"
          required
            className="mt-1 h-4 w-4 rounded border-slate-300 text-(--primary) focus:ring-2 focus:ring-(--accent) focus:ring-offset-2"
        />
        <label htmlFor={termsId} className="text-sm text-slate-600">
          J&apos;accepte les{" "}
          <Link href="/legal/terms" className="font-semibold text-(--accent-strong) hover:underline">
            conditions d&apos;utilisation
          </Link>{" "}
          et la{" "}
          <Link href="/legal/privacy" className="font-semibold text-(--accent-strong) hover:underline">
            politique de confidentialité
          </Link>
          .
        </label>
      </div>
    </>
  );
}

export function AuthPanel({ nextPath, callbackError }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInFormAction, signingIn] = useActionState(
    signInAction,
    initialState,
  );
  const [signUpState, signUpFormAction, signingUp] = useActionState(
    signUpAction,
    initialState,
  );

  const pending = signingIn || signingUp;
  const state = mode === "signin" ? signInState : signUpState;

  if (mode === "signin") {
    return (
      <div className="flex flex-col items-center px-4 py-10 sm:py-14">
        <div className="flex flex-col items-center text-center">
          <LogoMark />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-(--primary)">
            Avocat-Link
          </h1>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            Portail professionnel de consultations juridiques
          </p>
        </div>

        <div className="mt-8 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <h2 className="text-xl font-bold text-(--primary)">Bon retour</h2>
          <p className="mt-1 text-sm text-slate-600">
            Saisissez vos identifiants pour vous connecter.
          </p>

          {callbackError ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
              Le lien de confirmation est invalide ou a expiré. Reconnectez-vous.
            </div>
          ) : null}

          <form action={signInFormAction} className="mt-6 space-y-4">
            <SignInFields pending={pending} nextPath={nextPath} />

            {state.error ? (
              <p role="alert" className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-(--error)">
                {state.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-(--primary) py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Pas encore de compte ?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="font-semibold text-(--accent-strong) hover:underline"
            >
              Créer un compte
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[min(100vh,900px)] lg:min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex relative flex-col bg-(--primary) p-8 text-white lg:p-12">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="text-lg font-bold">Avocat-Link</span>
          </div>
          <h2 className="mt-10 text-3xl font-bold leading-tight lg:text-4xl">
            Sécurisez votre avenir juridique avec une précision numérique.
          </h2>
          <ul className="mt-8 space-y-6 text-sm text-white/85">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-white">Confiance renforcée</p>
                <p className="mt-1 text-white/75">
                  Processus de vérification et échanges conformes au secret professionnel.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-white">Rapidité</p>
                <p className="mt-1 text-white/75">
                  Prise en charge des demandes et suivi des dossiers en un seul espace.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-white">Experts</p>
                <p className="mt-1 text-white/75">
                  Annuaire d&apos;avocats et créneaux pour organiser vos consultations.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-(--primary)">Créer un compte</h2>
          <p className="mt-1 text-sm text-slate-600">Rejoignez le futur de la consultation juridique.</p>

          {callbackError ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
              Le lien de confirmation est invalide ou a expiré. Reconnectez-vous.
            </div>
          ) : null}

          <form action={signUpFormAction} className="mt-6 space-y-4">
            <SignUpFields pending={pending} nextPath={nextPath} />

            {state.error ? (
              <p role="alert" className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-(--error)">
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
              className="w-full rounded-lg bg-(--primary) py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--secondary) focus-visible:ring-offset-2"
            >
              {pending ? "Création…" : "Créer mon compte"}
            </button>

            <p className="mt-2 text-xs text-slate-500">Vous recevrez un e-mail de confirmation pour activer votre compte.</p>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Déjà un compte ? {" "}
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="font-semibold text-(--accent-strong) hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
    );
}
