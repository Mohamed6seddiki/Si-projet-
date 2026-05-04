export type Database = {
  public: {
    Tables: {
      avocats: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          id: string;
          nom: string;
          specialite: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          id?: string;
          nom: string;
          specialite: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          id?: string;
          nom?: string;
          specialite?: string;
        };
        Relationships: [];
      };
      consultations: {
        Row: {
          avocat_id: string;
          avocat_user_id: string | null;
          client_id: string;
          created_at: string;
          date_consultation: string;
          fichier_url: string;
          id: string;
          status: "pending" | "accepted" | "completed";
        };
        Insert: {
          avocat_id: string;
          avocat_user_id?: string | null;
          client_id: string;
          created_at?: string;
          date_consultation: string;
          fichier_url: string;
          id?: string;
          status?: "pending" | "accepted" | "completed";
        };
        Update: {
          avocat_id?: string;
          avocat_user_id?: string | null;
          client_id?: string;
          created_at?: string;
          date_consultation?: string;
          fichier_url?: string;
          id?: string;
          status?: "pending" | "accepted" | "completed";
        };
        Relationships: [
          {
            columns: ["avocat_id"];
            foreignKeyName: "consultations_avocat_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "avocats";
          },
          {
            columns: ["client_id"];
            foreignKeyName: "consultations_client_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "users";
          },
        ];
      };
      lawyer_profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          nom: string;
          specialite: string | null;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          nom: string;
          specialite?: string | null;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          nom?: string;
          specialite?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["user_id"];
            foreignKeyName: "lawyer_profiles_user_id_fkey";
            isOneToOne: true;
            referencedColumns: ["id"];
            referencedRelation: "users";
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database["public"];
type PublicTableName = keyof PublicSchema["Tables"];

export type TableRow<Table extends PublicTableName> =
  PublicSchema["Tables"][Table]["Row"];

export type TableInsert<Table extends PublicTableName> =
  PublicSchema["Tables"][Table]["Insert"];

export type TableUpdate<Table extends PublicTableName> =
  PublicSchema["Tables"][Table]["Update"];
