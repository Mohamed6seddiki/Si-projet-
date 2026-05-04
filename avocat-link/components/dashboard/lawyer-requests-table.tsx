"use client";

import { useActionState } from "react";

import { updateConsultationStatusAction } from "@/lib/supabase/actions";
import type { Consultation } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

type Props = {
  consultations: Consultation[];
};

type ActionState = {
  error?: string;
  success?: string;
};

const initialState: ActionState = {};

function StatusActionButton({
  consultationId,
  status,
  label,
}: {
  consultationId: string;
  status: "accepted" | "completed";
  label: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateConsultationStatusAction,
    initialState,
  );

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <input type="hidden" name="consultation_id" value={consultationId} />
        <input type="hidden" name="status" value={status} />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Traitement…" : label}
        </button>
      </form>
      {state.error ? (
        <p className="text-xs text-red-600">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-xs text-emerald-700">{state.success}</p>
      ) : null}
    </div>
  );
}

export function LawyerRequestsTable({ consultations }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-[var(--surface-muted)] text-left text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Client</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Statut</th>
            <th className="px-4 py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {consultations.map((consultation) => (
            <tr key={consultation.id} className="border-t border-[var(--surface-subtle)] align-top">
              <td className="px-4 py-3 font-medium text-[var(--primary)]">
                {consultation.client?.nom ?? consultation.client_id.slice(0, 8)}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatDateTime(consultation.date_consultation)}
              </td>
              <td className="px-4 py-3 text-slate-600 capitalize">
                {consultation.status}
              </td>
              <td className="px-4 py-3">
                {consultation.status === "pending" ? (
                  <StatusActionButton
                    consultationId={consultation.id}
                    status="accepted"
                    label="Confirmer"
                  />
                ) : consultation.status === "accepted" ? (
                  <StatusActionButton
                    consultationId={consultation.id}
                    status="completed"
                    label="Terminer"
                  />
                ) : (
                  <span className="text-slate-400">Aucune action</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}