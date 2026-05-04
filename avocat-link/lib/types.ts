export type ConsultationStatus = "pending" | "accepted" | "completed";

export type Avocat = {
  id: string;
  nom: string;
  specialite: string;
  avatar_url: string | null;
  user_id?: string | null;
  created_at: string;
};

export type Client = {
  id: string;
  nom: string;
  created_at: string;
};

export type Consultation = {
  id: string;
  client_id: string;
  avocat_id: string;
  avocat_user_id?: string | null;
  date_consultation: string;
  status: ConsultationStatus;
  fichier_url: string;
  created_at: string;
  avocats?: Pick<Avocat, "id" | "nom" | "specialite" | "avatar_url"> | null;
  client?: Pick<Client, "id" | "nom"> | null;
};

export type LawyerProfile = {
  user_id: string;
  nom: string;
  specialite: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type ConsultationWithDocument = Consultation & {
  document_url: string | null;
};
