"use client";

import { useState } from "react";
import { deleteConsultationAction } from "@/lib/supabase/actions";

type Props = {
  consultationId: string;
};

export function DeleteConsultationButton({ consultationId }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette consultation ?")) {
      return;
    }

    setError(null);
    setPending(true);

    const result = await deleteConsultationAction(consultationId);

    if (result.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:opacity-60"
        aria-label="Supprimer cette consultation"
      >
        {pending ? "Suppression…" : "Supprimer"}
      </button>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
