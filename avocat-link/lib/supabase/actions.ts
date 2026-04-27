"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAuthCallbackUrl,
  getSafeRedirectPath,
} from "@/lib/auth/redirect";
import { CONSULTATION_BUCKET } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

type ActionResult = {
  error?: string;
  success?: string;
};

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function toIsoDateTime(localDateTime: string) {
  const date = new Date(localDateTime);
  if (Number.isNaN(date.getTime())) {
    throw new Error("La date de consultation est invalide.");
  }

  return date.toISOString();
}

export async function signInAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");
  const nextPath = formData.get("next");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Veuillez fournir un email et un mot de passe valides." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { error: "Veuillez fournir un email et un mot de passe valides." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");

  const redirectPath = getSafeRedirectPath(
    typeof nextPath === "string" ? nextPath : undefined,
  );

  redirect(redirectPath);
}

export async function signUpAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");
  const nextPath = formData.get("next");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Veuillez fournir un email et un mot de passe valides." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return { error: "Veuillez fournir un email et un mot de passe valides." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caracteres." };
  }

  const supabase = await createClient();

  const redirectPath = getSafeRedirectPath(
    typeof nextPath === "string" ? nextPath : undefined,
  );

  const { error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      emailRedirectTo: createAuthCallbackUrl(getBaseUrl(), redirectPath),
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "Compte cree. Verifiez votre boite mail pour confirmer votre inscription.",
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createConsultationAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const avocatId = formData.get("avocat_id");
  const dateConsultation = formData.get("date_consultation");
  const file = formData.get("fichier_pdf");

  if (
    typeof avocatId !== "string" ||
    typeof dateConsultation !== "string" ||
    !(file instanceof File)
  ) {
    return { error: "Veuillez completer tous les champs requis." };
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { error: "Seuls les fichiers PDF sont autorises." };
  }

  if (file.type && file.type !== "application/pdf") {
    return { error: "Le fichier doit etre un PDF valide." };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Session invalide. Veuillez vous reconnecter." };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filePath = `${user.id}/consultations/${crypto.randomUUID()}-${safeName}`;

  let isoDate: string;

  try {
    isoDate = toIsoDateTime(dateConsultation);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Date de consultation invalide.",
    };
  }

  const { error: uploadError } = await supabase.storage
    .from(CONSULTATION_BUCKET)
    .upload(filePath, file, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { error: insertError } = await supabase.from("consultations").insert({
    client_id: user.id,
    avocat_id: avocatId,
    date_consultation: isoDate,
    status: "pending",
    fichier_url: filePath,
  });

  if (insertError) {
    await supabase.storage.from(CONSULTATION_BUCKET).remove([filePath]);
    return { error: insertError.message };
  }

  revalidatePath("/dashboard");

  return { success: "Consultation creee avec succes." };
}
