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
  const specialiteId = useId();
  const avatarId = useId();

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor={nomId} className="text-sm font-medium text-slate-700">
          Nom affiché
        </label>
        <input
          id={nomId}
          name="nom"
          defaultValue={initialProfile?.nom ?? ""}
          disabled={pending}
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-(--accent-strong) focus:ring-2 focus:ring-(--accent)"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={specialiteId} className="text-sm font-medium text-slate-700">
          Spécialité
        </label>
        <input
          id={specialiteId}
          name="specialite"
          defaultValue={initialProfile?.specialite ?? ""}
          disabled={pending}
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-(--accent-strong) focus:ring-2 focus:ring-(--accent)"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={avatarId} className="text-sm font-medium text-slate-700">
          URL de l&apos;avatar
        </label>
        <input
          id={avatarId}
          name="avatar_url"
          defaultValue={initialProfile?.avatar_url ?? ""}
          disabled={pending}
          placeholder="/avocats/mon-avatar.png ou https://..."
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-(--accent-strong) focus:ring-2 focus:ring-(--accent)"
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-(--primary)">Compte public</p>
        <p className="mt-1">Votre profil avocat reste visible pour les clients dans l&apos;annuaire.</p>
        <p className="mt-2 text-xs text-slate-500">{userEmail}</p>
      </div>

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
        className="inline-flex w-full items-center justify-center rounded-xl bg-(--primary) px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : "Enregistrer mon profil"}
      </button>
    </form>
  );
}