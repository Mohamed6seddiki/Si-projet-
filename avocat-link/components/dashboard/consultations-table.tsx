import { StatusBadge } from "@/components/ui/status-badge";
import type { ConsultationWithDocument } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

type Props = {
  consultations: ConsultationWithDocument[];
};

export function ConsultationsTable({ consultations }: Props) {
  if (consultations.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 text-sm text-slate-600 shadow-[0_10px_35px_rgba(4,22,39,0.08)]">
        Aucune consultation pour le moment.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_35px_rgba(4,22,39,0.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--surface-muted)] text-left text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Avocat</th>
              <th className="px-4 py-3 font-semibold">Specialite</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Document</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
