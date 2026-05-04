"use client";

import Image from "next/image";
import { useActionState, useMemo, useState } from "react";

import { MAX_CONSULTATION_PDF_BYTES } from "@/lib/constants";
import { createConsultationAction } from "@/lib/supabase/actions";
import type { Avocat } from "@/lib/types";

type ActionState = { error?: string; success?: string };

const initialState: ActionState = {};

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function toDateTimeLocalValue(day: Date, timeHHmm: string) {
  const [h, m] = timeHHmm.split(":").map(Number);
  const d = new Date(day);
  d.setHours(h, m, 0, 0);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(h)}:${pad2(m)}`;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function StepCircle({
  n,
  status,
}: {
  n: number;
  status: "done" | "current" | "todo";
}) {
  const cls =
    status === "done" || status === "current"
      ? "bg-[var(--primary)] text-white"
      : "bg-slate-200 text-slate-500";
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${cls}`}
    >
      {n}
    </span>
  );
}

type Props = {
  avocats: Avocat[];
  /** Pré-sélection (ex. depuis la fiche avocat ou ?avocat=uuid) */
  initialAvocatId?: string | null;
};

export function BookingWorkflow({ avocats, initialAvocatId = null }: Props) {
  const [state, formAction, pending] = useActionState(createConsultationAction, initialState);
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (
      initialAvocatId &&
      avocats.some((a) => a.id === initialAvocatId)
    ) {
      return initialAvocatId;
    }
    return null;
  });

  const [cursorMonth, setCursorMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(12, 0, 0, 0);
    return d;
  });
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>("10:30");
  const [clientError, setClientError] = useState<string | null>(null);

  const selectedAvocat = useMemo(
    () => avocats.find((a) => a.id === selectedId) ?? null,
    [avocats, selectedId],
  );

  const datetimeValue =
    selectedDay && selectedTime ? toDateTimeLocalValue(selectedDay, selectedTime) : "";

  const step1Done = Boolean(selectedId);
  const step2Done = Boolean(selectedTime && selectedDay);
  const step3Ready = step1Done && step2Done;

  const step1Status: "done" | "current" | "todo" = step1Done ? "done" : "current";
  const step2Status: "done" | "current" | "todo" = step2Done
    ? "done"
    : step1Done
      ? "current"
      : "todo";
  const step3Status: "done" | "current" | "todo" = step3Ready ? "current" : "todo";

  const monthLabel = cursorMonth.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => {
    const year = cursorMonth.getFullYear();
    const month = cursorMonth.getMonth();
    const first = new Date(year, month, 1);
    const startPad = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: ({ day: number; inMonth: boolean } | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, inMonth: true });
    while (cells.length % 7 !== 0) cells.push(null);
    return { cells, year, month };
  }, [cursorMonth]);

  function selectCalendarDay(day: number) {
    const d = new Date(calendarDays.year, calendarDays.month, day, 12, 0, 0, 0);
    setSelectedDay(d);
    setClientError(null);
  }

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    setClientError(null);
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("fichier_pdf");
    if (!(fileInput instanceof HTMLInputElement) || !fileInput.files?.length) {
      e.preventDefault();
      setClientError("Veuillez joindre un document PDF.");
      return;
    }
    const pdfFile = fileInput.files[0];
    if (pdfFile.size > MAX_CONSULTATION_PDF_BYTES) {
      e.preventDefault();
      setClientError(
        `Le fichier dépasse ${MAX_CONSULTATION_PDF_BYTES / (1024 * 1024)} Mo.`,
      );
      return;
    }
    if (!selectedId) {
      e.preventDefault();
      setClientError("Veuillez sélectionner un avocat.");
      return;
    }
    if (!datetimeValue) {
      e.preventDefault();
      setClientError("Veuillez choisir une date et un créneau.");
      return;
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] lg:items-start">
      <form
        id="consultation-booking-form"
        action={formAction}
        onSubmit={onFormSubmit}
        className="space-y-6"
      >
        <input type="hidden" name="avocat_id" value={selectedId ?? ""} />
        <input type="hidden" name="date_consultation" value={datetimeValue} />

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-[var(--primary)]">Progression</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <StepCircle n={1} status={step1Status} />
                <span className="text-xs font-medium text-slate-600">Avocat</span>
              </div>
              <span className="hidden text-slate-300 sm:inline" aria-hidden>
                —
              </span>
              <div className="flex items-center gap-2">
                <StepCircle n={2} status={step2Status} />
                <span className="text-xs font-medium text-slate-600">Créneau</span>
              </div>
              <span className="hidden text-slate-300 sm:inline" aria-hidden>
                —
              </span>
              <div className="flex items-center gap-2">
                <StepCircle n={3} status={step3Status} />
                <span className="text-xs font-medium text-slate-600">Documents</span>
              </div>
              <span className="hidden text-slate-300 sm:inline" aria-hidden>
                —
              </span>
              <div className="flex items-center gap-2 opacity-80">
                <StepCircle n={4} status="todo" />
                <span className="text-xs font-medium text-slate-500">Confirmation</span>
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold text-[var(--primary)]">Expert sélectionné</h2>
            {selectedAvocat ? (
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="text-sm font-semibold text-[var(--accent-strong)] hover:underline"
              >
                Modifier
              </button>
            ) : null}
          </div>

          {selectedAvocat ? (
            <div className="mt-4 flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
                  {selectedAvocat.avatar_url && selectedAvocat.avatar_url.startsWith("/") ? (
                    <Image
                      src={selectedAvocat.avatar_url}
                      alt={`Portrait de ${selectedAvocat.nom}`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : selectedAvocat.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedAvocat.avatar_url}
                      alt={`Portrait de ${selectedAvocat.nom}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-base font-semibold text-[var(--primary)]">
                      {selectedAvocat.nom.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--primary)]">{selectedAvocat.nom}</p>
                  <p className="mt-1 text-sm text-slate-600">{selectedAvocat.specialite}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {avocats.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(a.id);
                    setClientError(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[var(--surface-muted)]">
                      {a.avatar_url && a.avatar_url.startsWith("/") ? (
                        <Image
                          src={a.avatar_url}
                          alt={`Portrait de ${a.nom}`}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : a.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.avatar_url}
                          alt={`Portrait de ${a.nom}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[var(--primary)]">
                          {a.nom.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--primary)]">{a.nom}</p>
                      <p className="mt-1 text-sm text-slate-600">{a.specialite}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-[var(--primary)]">Date et heure</h2>
          <p className="mt-1 text-sm text-slate-600">
            Consultation vidéo d&apos;environ <strong>45 minutes</strong>.
          </p>

          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                  onClick={() =>
                    setCursorMonth(
                      new Date(cursorMonth.getFullYear(), cursorMonth.getMonth() - 1, 1),
                    )
                  }
                  aria-label="Mois précédent"
                >
                  ‹
                </button>
                <p className="text-sm font-semibold capitalize text-[var(--primary)]">
                  {monthLabel}
                </p>
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                  onClick={() =>
                    setCursorMonth(
                      new Date(cursorMonth.getFullYear(), cursorMonth.getMonth() + 1, 1),
                    )
                  }
                  aria-label="Mois suivant"
                >
                  ›
                </button>
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((d) => (
                  <div key={d} className="py-2">
                    {d}
                  </div>
                ))}
                {calendarDays.cells.map((cell, idx) => {
                  if (!cell) {
                    return <div key={`empty-${idx}`} className="h-9" />;
                  }
                  const d = new Date(calendarDays.year, calendarDays.month, cell.day, 12, 0, 0, 0);
                  const isSelected = sameDay(d, selectedDay);
                  const isToday = sameDay(d, new Date());
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectCalendarDay(cell.day)}
                      className={[
                        "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition",
                        isSelected
                          ? "bg-[var(--primary)] text-white"
                          : isToday
                            ? "bg-[var(--accent)] text-[var(--primary)]"
                            : "text-slate-700 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">Créneaux disponibles</p>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {TIME_SLOTS.map((t) => {
                  const active = selectedTime === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setSelectedTime(t);
                        setClientError(null);
                      }}
                      className={[
                        "rounded-lg border px-2 py-2.5 text-xs font-semibold transition sm:text-sm",
                        active
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                      ].join(" ")}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-[var(--primary)]">Pièces du dossier</h2>
          <p className="mt-1 text-sm text-slate-600">
            Téléversez un document au format PDF. Taille maximale&nbsp;:{" "}
            {MAX_CONSULTATION_PDF_BYTES / (1024 * 1024)} Mo.
          </p>

          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 transition hover:border-slate-300 hover:bg-slate-50">
            <svg
              className="h-10 w-10 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="mt-3 text-sm font-semibold text-[var(--primary)]">
              Téléverser un document
            </span>
            <span className="mt-1 text-center text-xs text-slate-500">
              Glisser-déposer ou cliquer pour sélectionner un fichier
            </span>
            <input
              id="fichier_pdf"
              name="fichier_pdf"
              type="file"
              accept="application/pdf,.pdf"
              required
              className="mt-4 w-full max-w-xs text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </label>
        </section>

        {(clientError || state.error) && (
          <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-[var(--error)]">
            {clientError ?? state.error}
          </p>
        )}

        {state.success ? (
          <p role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {state.success}
          </p>
        ) : null}
      </form>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--primary)]">Récapitulatif</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="flex justify-between gap-2">
              <span>Avocat</span>
              <span className="max-w-[55%] text-right font-medium text-slate-900">
                {selectedAvocat?.nom ?? "—"}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Service</span>
              <span className="font-medium text-slate-900">Consultation juridique</span>
            </li>
            <li className="flex justify-between">
              <span>Durée prévue</span>
              <span className="font-medium text-slate-900">45 min</span>
            </li>
            <li className="flex justify-between">
              <span>Date</span>
              <span className="font-medium text-slate-900">
                {selectedDay
                  ? selectedDay.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Heure</span>
              <span className="font-medium text-slate-900">{selectedTime ?? "—"}</span>
            </li>
          </ul>

          <div className="mt-4 flex gap-3 rounded-xl bg-[var(--accent)] p-3 text-xs text-slate-700">
            <svg className="h-5 w-5 shrink-0 text-[var(--accent-strong)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            <p>
              Vos données et documents sont traités de façon sécurisée. Les échanges avec votre
              avocat relèvent du secret professionnel.
            </p>
          </div>

          <button
            type="submit"
            form="consultation-booking-form"
            disabled={pending}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Envoi…" : "Confirmer la réservation"}
            <span aria-hidden>→</span>
          </button>
        </div>

        <div className="rounded-2xl bg-[var(--primary)] p-5 text-white shadow-sm">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
              ?
            </div>
            <div>
              <p className="text-sm font-semibold">Besoin d&apos;aide&nbsp;?</p>
              <p className="mt-1 text-xs text-white/80">
                Support technique disponible pour vous accompagner sur la plateforme.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
