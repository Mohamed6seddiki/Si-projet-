"use client";

import { useActionState, useId } from "react";

import { updateLawyerProfileAction } from "@/lib/supabase/actions";
import type { Avocat } from "@/lib/types";

type ActionState = {
  error?: string;
  success?: string;
};

type Props = {
  initialProfile: Avocat | null;
  userEmail: string;
};

const initialState: ActionState = {};

export function LawyerProfileForm({ initialProfile, userEmail }: Props) {
  const [state, formAction, pending] = useActionState(
    updateLawyerProfileAction,
    initialState,
  );
  const nomId = useId();
  const specialId = useId();
  const avatarId = useId();

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2.5">
        <label htmlFor={nomId} className="text-sm font-semibold text-slate-700">
          Nom affiché
        </label>
        <input
          id={nomId}
          name="nom"
          defaultValue={initialProfile?.nom ?? ""}
          disabled={pending}
          required
          className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-3 text-sm shadow-[0_2px_10px_rgb(0,0,0,0.02)] outline-none backdrop-blur-sm transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      <div className="space-y-2.5">
        <label htmlFor={specialId} className="text-sm font-semibold text-slate-700">
          Spécialité
        </label>
        <input
          id={specialId}
          name="specialite"
          defaultValue={initialProfile?.specialite ?? ""}
          disabled={pending}
          required
          className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-3 text-sm shadow-[0_2px_10px_rgb(0,0,0,0.02)] outline-none backdrop-blur-sm transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      <div className="space-y-2.5">
        <label htmlFor={avatarId} className="text-sm font-semibold text-slate-700">
          URL de l&apos;avatar
        </label>
        <input
          id={avatarId}
          name="avatar_url"
          defaultValue={initialProfile?.avatar_url ?? ""}
          disabled={pending}
          placeholder="/avocats/mon-avatar.png ou https://..."
          className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-3 text-sm shadow-[0_2px_10px_rgb(0,0,0,0.02)] outline-none backdrop-blur-sm transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      <div className="relative mt-2 overflow-hidden rounded-2xl border border-indigo-100/60 bg-indigo-50/40 p-5 backdrop-blur-md">
        <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-indigo-500/10 blur-xl"></div>
        <div className="relative">
          <p className="flex items-center gap-2 text-sm font-bold text-indigo-900">
            <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Compte public
          </p>
          <p className="mt-1 text-sm leading-relaxed text-indigo-800/80">
            Votre profil avocat reste visible pour les clients dans l&apos;annuaire.
          </p>
          <p className="mt-2 text-xs font-semibold text-indigo-500">{userEmail}</p>
        </div>
      </div>

      {state.error ? (
        <div className="flex animate-in fade-in slide-in-from-top-2 items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-600 shadow-sm backdrop-blur-sm" role="alert">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{state.error}</p>
        </div>
      ) : null}

      {state.success ? (
        <div className="flex animate-in fade-in slide-in-from-top-2 items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700 shadow-sm backdrop-blur-sm" role="status">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{state.success}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-95 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enregistrement…
          </span>
        ) : (
          "Enregistrer mon profil"
        )}
      </button>
    </form>
  );
}