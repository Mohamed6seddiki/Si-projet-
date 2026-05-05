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
    <div className="flex flex-col items-start gap-1">
      <form action={formAction}>
        <input type="hidden" name="consultation_id" value={consultationId} />
        <input type="hidden" name="status" value={status} />
        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? (
            "Traitement…"
          ) : (
            <span className="flex items-center gap-1.5">
              {label}
            </span>
          )}
        </button>
      </form>
      {state.error ? (
        <p className="text-[10px] font-medium text-red-500">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-[10px] font-medium text-emerald-500">{state.success}</p>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50/80 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
        </span>
        En attente
      </span>
    );
  }
  if (status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/80 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        Accepté
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/20 backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
      Terminé
    </span>
  );
}

export function LawyerRequestsTable({ consultations }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="border-b border-slate-200/50 bg-slate-50/30">
          <tr>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Client
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Date
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Statut
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/60">
          {consultations.map((consultation) => (
            <tr 
              key={consultation.id} 
              className="group align-middle transition-colors hover:bg-slate-50/40"
            >
              <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">
                {consultation.client?.nom ?? consultation.client_id.slice(0, 8)}
              </td>
              <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-500">
                {formatDateTime(consultation.date_consultation)}
              </td>
              <td className="whitespace-nowrap px-5 py-4">
                <StatusBadge status={consultation.status} />
              </td>
              <td className="px-5 py-4">
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
                  <span className="text-xs font-medium italic text-slate-400">Aucune action</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}