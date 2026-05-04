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

function formatAuthError(message: string) {
  const normalized = message.trim().toLowerCase();

  if (normalized.includes("email rate limit") || normalized.includes("rate limit")) {
    return "Limite d'envoi d'e-mails atteinte. Reessayez plus tard ou configurez un SMTP (ou desactivez la confirmation d'e-mail en local).";
  }

  if (normalized.includes("email not confirmed")) {
    return "Adresse e-mail non confirmee. Verifiez votre boite mail avant de vous connecter.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Identifiants invalides.";
  }

  if (normalized.includes("user already registered")) {
    return "Un compte existe deja avec cette adresse e-mail.";
  }

  return message;
}

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

function isLawyerRole(role: string | null | undefined) {
  return role === "avocat" || role === "lawyer";
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
    return { error: formatAuthError(error.message) };
  }

  revalidatePath("/dashboard", "layout");

  const role = data.user?.user_metadata?.role;
  const defaultRedirect = isLawyerRole(role)
    ? "/dashboard/avocat"
    : "/dashboard/reservations";
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
    roleRaw === "client" || roleRaw === "avocat" || roleRaw === "lawyer"
      ? roleRaw === "lawyer"
        ? "avocat"
        : roleRaw
      : null;
  if (!role) {
    return { error: "Veuillez choisir un profil (client ou avocat)." };
  }

  const fullName =
    typeof fullNameRaw === "string" && fullNameRaw.trim().length > 0
      ? fullNameRaw.trim()
      : null;

  const supabase = await createClient();

  const defaultRedirect = role === "avocat" ? "/dashboard/avocat" : "/dashboard/reservations";
  const redirectPath = getSafeRedirectPath(
    typeof nextPath === "string" ? nextPath : undefined,
    defaultRedirect,
  );

  const userMetadata: Record<string, string> = { role };
  if (fullName) {
    userMetadata.full_name = fullName;
  }

  const { error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      emailRedirectTo: createAuthCallbackUrl(getBaseUrl(), redirectPath),
      data: userMetadata,
    },
  });

  if (error) {
    return { error: formatAuthError(error.message) };
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

  const { data: avocatRow, error: avocatError } = await supabase
    .from("avocats")
    .select("user_id")
    .eq("id", avocatId)
    .maybeSingle();

  if (avocatError) {
    return { error: avocatError.message };
  }

  if (!avocatRow) {
    return { error: "Avocat introuvable." };
  }

  if (!avocatRow.user_id) {
    return { error: "L'avocat selectionne n'est pas lie a un compte utilisateur." };
  }

  const { error: insertError } = await supabase.from("consultations").insert({
    client_id: user.id,
    avocat_id: avocatId,
    avocat_user_id: avocatRow.user_id,
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

export async function deleteConsultationAction(
  consultationId: string,
): Promise<ActionResult> {
  if (!consultationId) {
    return { error: "ID de consultation invalide." };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Session invalide. Veuillez vous reconnecter." };
  }

  // Get the consultation to verify ownership and get the file path
  const { data: consultation, error: fetchError } = await supabase
    .from("consultations")
    .select("client_id, fichier_url")
    .eq("id", consultationId)
    .single();

  if (fetchError || !consultation) {
    return { error: "Consultation introuvable." };
  }

  // Verify user owns this consultation
  if (consultation.client_id !== user.id) {
    return { error: "Vous n'avez pas la permission de supprimer cette consultation." };
  }

  // Delete the file from storage if it exists
  if (consultation.fichier_url) {
    await supabase.storage
      .from(CONSULTATION_BUCKET)
      .remove([consultation.fichier_url]);
  }

  // Delete the consultation record
  const { error: deleteError } = await supabase
    .from("consultations")
    .delete()
    .eq("id", consultationId)
    .eq("client_id", user.id);

  if (deleteError) {
    return { error: deleteError.message };
  }

  revalidatePath("/dashboard", "layout");

  return { success: "Consultation supprimée avec succès." };
}

export async function updateLawyerProfileAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const nom = formData.get("nom");
  const specialite = formData.get("specialite");
  const avatarUrl = formData.get("avatar_url");

  if (typeof nom !== "string" || !nom.trim()) {
    return { error: "Le nom est requis." };
  }

  if (typeof specialite !== "string" || !specialite.trim()) {
    return { error: "La spécialité est requise." };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Session invalide. Veuillez vous reconnecter." };
  }

  const trimmedNom = nom.trim();
  const trimmedSpecialite = specialite.trim();
  const trimmedAvatarUrl = typeof avatarUrl === "string" ? avatarUrl.trim() : "";

  const { error: upsertError } = await supabase.from("avocats").upsert(
    {
      user_id: user.id,
      nom: trimmedNom,
      specialite: trimmedSpecialite,
      avatar_url: trimmedAvatarUrl || null,
    },
    {
      onConflict: "user_id",
    },
  );

  if (upsertError) {
    return { error: upsertError.message };
  }

  revalidatePath("/dashboard", "layout");

  return { success: "Profil avocat mis à jour avec succès." };
}

export async function updateConsultationStatusAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const consultationId = formData.get("consultation_id");
  const nextStatus = formData.get("status");

  if (typeof consultationId !== "string" || !consultationId.trim()) {
    return { error: "ID de consultation invalide." };
  }

  if (nextStatus !== "accepted" && nextStatus !== "completed") {
    return { error: "Statut de consultation invalide." };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Session invalide. Veuillez vous reconnecter." };
  }

  const { data: consultation, error: fetchError } = await supabase
    .from("consultations")
    .select("id, status, avocat_user_id")
    .eq("id", consultationId)
    .maybeSingle();

  if (fetchError || !consultation) {
    return { error: "Consultation introuvable." };
  }

  if (consultation.avocat_user_id !== user.id) {
    return { error: "Vous ne pouvez pas modifier cette consultation." };
  }

  if (nextStatus === "accepted" && consultation.status !== "pending") {
    return { error: "Seules les demandes en attente peuvent être confirmées." };
  }

  if (nextStatus === "completed" && consultation.status !== "accepted") {
    return { error: "Seules les consultations acceptées peuvent être terminées." };
  }

  const { error: updateError } = await supabase
    .from("consultations")
    .update({ status: nextStatus })
    .eq("id", consultationId)
    .eq("avocat_user_id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard", "layout");

  return {
    success:
      nextStatus === "accepted"
        ? "Demande confirmée avec succès."
        : "Consultation marquée comme terminée.",
  };
}
