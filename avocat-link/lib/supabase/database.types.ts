export type Database = {
  public: {
    Tables: {
      avocats: {
        Row: {
          created_at: string;
          id: string;
          nom: string;
          specialite: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          nom: string;
          specialite: string;
        };
        Update: {
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
          client_id: string;
          created_at: string;
          date_consultation: string;
          fichier_url: string;
          id: string;
          status: "pending" | "accepted" | "completed";
        };
        Insert: {
          avocat_id: string;
          client_id: string;
          created_at?: string;
          date_consultation: string;
          fichier_url: string;
          id?: string;
          status?: "pending" | "accepted" | "completed";
        };
        Update: {
          avocat_id?: string;
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
