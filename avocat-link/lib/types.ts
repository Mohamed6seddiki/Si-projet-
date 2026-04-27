export type ConsultationStatus = "pending" | "accepted" | "completed";

export type Avocat = {
  id: string;
  nom: string;
  specialite: string;
  created_at: string;
};

export type Consultation = {
  id: string;
  client_id: string;
  avocat_id: string;
  date_consultation: string;
  status: ConsultationStatus;
  fichier_url: string;
  created_at: string;
  avocats?: Pick<Avocat, "id" | "nom" | "specialite"> | null;
};

export type ConsultationWithDocument = Consultation & {
  document_url: string | null;
};
