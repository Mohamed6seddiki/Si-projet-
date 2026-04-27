import type { ConsultationStatus } from "@/lib/types";
import { getStatusLabel } from "@/lib/utils";

const statusClasses: Record<ConsultationStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  accepted: "bg-emerald-100 text-emerald-900",
  completed: "bg-slate-200 text-slate-800",
};

export function StatusBadge({ status }: { status: ConsultationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${statusClasses[status]}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
