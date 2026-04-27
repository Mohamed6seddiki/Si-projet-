"use client";

import { useActionState } from "react";

import { createConsultationAction } from "@/lib/supabase/actions";
import type { Avocat } from "@/lib/types";

type ConsultationActionState = {
  error?: string;
  success?: string;
};

const initialState: ConsultationActionState = {};

type Props = {
  avocats: Avocat[];
};

export function CreateConsultationForm({ avocats }: Props) {
  const [state, formAction, pending] = useActionState(
    createConsultationAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-3xl bg-white p-6 shadow-[0_10px_35px_rgba(4,22,39,0.08)]"
    >
      <h2 className="text-2xl font-semibold text-[var(--primary)]">
        Nouvelle consultation
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Selectionnez un avocat, une date et ajoutez votre document PDF.
      </p>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="avocat_id" className="text-sm font-semibold text-slate-700">
            Avocat
          </label>
          <select
            id="avocat_id"
            name="avocat_id"
            required
            className="w-full rounded-xl border border-[var(--outline)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary-soft)]"
            defaultValue=""
          >
            <option value="" disabled>
              Choisir un avocat
            </option>
            {avocats.map((avocat) => (
              <option key={avocat.id} value={avocat.id}>
                {avocat.nom} - {avocat.specialite}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="date_consultation"
            className="text-sm font-semibold text-slate-700"
          >
            Date et heure
          </label>
          <input
            id="date_consultation"
            name="date_consultation"
            type="datetime-local"
            required
            className="w-full rounded-xl border border-[var(--outline)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary-soft)]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="fichier_pdf"
            className="text-sm font-semibold text-slate-700"
          >
            Document PDF
          </label>
          <input
            id="fichier_pdf"
            name="fichier_pdf"
            type="file"
            accept="application/pdf,.pdf"
            required
            className="w-full rounded-xl border border-[var(--outline)] bg-white px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[var(--surface-muted)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--primary)]"
          />
          <p className="text-xs text-slate-500">Format accepte: PDF uniquement.</p>
        </div>
      </div>

      {state.error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-[var(--error)]">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-soft)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creation en cours..." : "Creer la consultation"}
      </button>
    </form>
  );
}
