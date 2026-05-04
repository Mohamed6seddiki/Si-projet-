"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAuthCallbackUrl,
  getSafeRedirectPath,
} from "@/lib/auth/redirect";
import { CONSULTATION_BUCKET, MAX_CONSULTATION_PDF_BYTES } from "@/lib/constants";
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
    return { error: "Veuillez fournir un e-mail et un mot de passe valides." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { error: "Veuillez fournir un e-mail et un mot de passe valides." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");

  const role = data.user?.user_metadata?.role;
  const defaultRedirect = role === "lawyer" ? "/dashboard/avocat" : "/dashboard/reservations";
  const finalRedirect = getSafeRedirectPath(
    typeof nextPath === "string" ? nextPath : undefined,
    defaultRedirect,
  );

  redirect(finalRedirect);
}

export async function signUpAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");
  const nextPath = formData.get("next");
  const fullNameRaw = formData.get("full_name");
  const roleRaw = formData.get("role");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Veuillez fournir un e-mail et un mot de passe valides." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return { error: "Veuillez fournir un e-mail et un mot de passe valides." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const role =
    roleRaw === "lawyer" || roleRaw === "client" ? roleRaw : null;
  if (!role) {
    return { error: "Veuillez choisir un profil (client ou avocat)." };
  }

  const fullName =
    typeof fullNameRaw === "string" && fullNameRaw.trim().length > 0
      ? fullNameRaw.trim()
      : null;

  const supabase = await createClient();

  const defaultRedirect = role === "lawyer" ? "/dashboard/avocat" : "/dashboard/reservations";
  const redirectPath = getSafeRedirectPath(
    typeof nextPath === "string" ? nextPath : undefined,
    defaultRedirect,
  );

  const userMetadata: Record<string, string> = { role };
  if (fullName) {
    userMetadata.full_name = fullName;
  }

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      emailRedirectTo: createAuthCallbackUrl(getBaseUrl(), redirectPath),
      data: userMetadata,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user && role === "lawyer") {
    const fullNameFallback = fullName ?? normalizedEmail.split("@")[0] ?? "Avocat";
    await supabase
      .from("lawyer_profiles")
      .insert({ user_id: data.user.id, nom: fullNameFallback });
  }

  return {
    success:
      "Compte créé. Vérifiez votre boîte mail pour confirmer votre inscription.",
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const RESET_SUCCESS =
  "Si un compte correspond à cette adresse, un e-mail avec un lien de réinitialisation vient d’être envoyé.";

export async function requestPasswordResetAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Veuillez saisir une adresse e-mail valide." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const supabase = await createClient();
  const next = encodeURIComponent("/auth/reset-password");
  const redirectTo = `${getBaseUrl()}/auth/callback?next=${next}`;

  await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo,
  });

  return { success: RESET_SUCCESS };
}

export async function updatePasswordAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const password = formData.get("password");
  const confirm = formData.get("confirm_password");

  if (typeof password !== "string" || typeof confirm !== "string") {
    return { error: "Mot de passe invalide." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  if (password !== confirm) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Session expirée. Ouvrez à nouveau le lien reçu par e-mail." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/reservations");
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
    return { error: "Veuillez compléter tous les champs requis." };
  }

  if (!avocatId.trim()) {
    return { error: "Veuillez sélectionner un avocat." };
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { error: "Seuls les fichiers PDF sont autorisés." };
  }

  if (file.type && file.type !== "application/pdf") {
    return { error: "Le fichier doit être un PDF valide." };
  }

  if (file.size > MAX_CONSULTATION_PDF_BYTES) {
    return {
      error: `Le fichier dépasse la taille maximale autorisée (${MAX_CONSULTATION_PDF_BYTES / (1024 * 1024)} Mo).`,
    };
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

  revalidatePath("/dashboard", "layout");

  return { success: "Consultation créée avec succès." };
}
