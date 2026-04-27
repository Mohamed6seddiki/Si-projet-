"use client";

import { useFormStatus } from "react-dom";

import { signOutAction } from "@/lib/supabase/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white disabled:opacity-60"
    >
      {pending ? "Deconnexion..." : "Se deconnecter"}
    </button>
  );
}

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <SubmitButton />
    </form>
  );
}
