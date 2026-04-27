import "server-only";

import { CONSULTATION_BUCKET } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type {
  Avocat,
  Consultation,
  ConsultationWithDocument,
} from "@/lib/types";

type RawConsultation = Omit<Consultation, "avocats"> & {
  avocats: Array<Pick<Avocat, "id" | "nom" | "specialite">> | null;
};

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}

export async function getAvocats() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("avocats")
    .select("id, nom, specialite, created_at")
    .order("nom", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Avocat[];
}

export async function getConsultationsForUser() {
  const supabase = await createClient();

  return getConsultationsForUserWithClient(supabase);
}

async function getConsultationsForUserWithClient(
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }

  if (!user) {
    return [] as Consultation[];
  }

  const { data, error } = await supabase
    .from("consultations")
    .select(
      "id, client_id, avocat_id, date_consultation, status, fichier_url, created_at, avocats(id, nom, specialite)",
    )
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as RawConsultation[];

  return rows.map((row) => ({
    ...row,
    avocats: row.avocats?.[0] ?? null,
  }));
}

export async function getConsultationsWithDocumentsForUser() {
  const supabase = await createClient();
  const consultations = await getConsultationsForUserWithClient(supabase);

  const mapped = await Promise.all(
    consultations.map(async (consultation) => {
      const { data } = await supabase.storage
        .from(CONSULTATION_BUCKET)
        .createSignedUrl(consultation.fichier_url, 60 * 30);

      return {
        ...consultation,
        document_url: data?.signedUrl ?? null,
      } as ConsultationWithDocument;
    }),
  );

  return mapped;
}
