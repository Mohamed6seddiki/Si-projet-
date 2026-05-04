"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import { DeleteConsultationButton } from "@/components/dashboard/delete-consultation-button";
import type { ConsultationWithDocument } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

type Props = {
  consultations: ConsultationWithDocument[];
};

export function ConsultationsTable({ consultations }: Props) {
  if (consultations.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_35px_rgba(4,22,39,0.08)]">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--primary)]">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
              <path d="M8 7h8" />
              <path d="M8 11h8" />
              <path d="M8 15h5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--primary)]">
              Aucune consultation pour le moment
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Créez votre première consultation via le formulaire ci-contre.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_10px_35px_rgba(4,22,39,0.08)] ring-1 ring-black/[0.03]">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--surface-muted)] text-left text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Avocat</th>
              <th className="px-4 py-3 font-semibold">Spécialité</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Document</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((consultation) => (
              <tr key={consultation.id} className="border-t border-[var(--surface-subtle)]">
                <td className="px-4 py-3 font-medium text-[var(--primary)]">
                  {consultation.avocats?.nom ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {consultation.avocats?.specialite ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDateTime(consultation.date_consultation)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={consultation.status} />
                </td>
                <td className="px-4 py-3">
                  {consultation.document_url ? (
                    <a
                      href={consultation.document_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[var(--secondary)] underline-offset-4 hover:underline"
                    >
                      Ouvrir PDF
                    </a>
                  ) : (
                    <span className="text-slate-400">Indisponible</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteConsultationButton consultationId={consultation.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-[var(--surface-subtle)] md:hidden">
        {consultations.map((consultation) => (
          <li key={consultation.id} className="space-y-3 p-4">
            <div>
              <p className="text-sm font-semibold text-[var(--primary)]">
                {consultation.avocats?.nom ?? "-"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {consultation.avocats?.specialite ?? "-"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={consultation.status} />
              <span className="text-xs text-slate-600">
                {formatDateTime(consultation.date_consultation)}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                {consultation.document_url ? (
                  <a
                    href={consultation.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[var(--secondary)] underline-offset-4 hover:underline"
                  >
                    Ouvrir PDF
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Document indisponible</span>
                )}
              </div>
              <DeleteConsultationButton consultationId={consultation.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
