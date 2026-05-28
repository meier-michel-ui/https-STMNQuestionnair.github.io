export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clinicians: {
        Row: {
          country: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          years_of_experience: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          years_of_experience?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          years_of_experience?: string | null
        }
        Relationships: []
      }
      implant_diameters: {
        Row: {
          diameter: number
          id: string
          sort_order: number
          system_code: string
        }
        Insert: {
          diameter: number
          id?: string
          sort_order?: number
          system_code: string
        }
        Update: {
          diameter?: number
          id?: string
          sort_order?: number
          system_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "implant_diameters_system_code_fkey"
            columns: ["system_code"]
            isOneToOne: false
            referencedRelation: "implant_systems"
            referencedColumns: ["code"]
          },
        ]
      }
      implant_lengths: {
        Row: {
          id: string
          length: number
          sort_order: number
          system_code: string
        }
        Insert: {
          id?: string
          length: number
          sort_order?: number
          system_code: string
        }
        Update: {
          id?: string
          length?: number
          sort_order?: number
          system_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "implant_lengths_system_code_fkey"
            columns: ["system_code"]
            isOneToOne: false
            referencedRelation: "implant_systems"
            referencedColumns: ["code"]
          },
        ]
      }
      implant_selections: {
        Row: {
          clinician_id: string
          created_at: string
          diameter: number
          id: string
          implant_system: string
          indication: string
          length: number
          preference: string
        }
        Insert: {
          clinician_id: string
          created_at?: string
          diameter: number
          id?: string
          implant_system: string
          indication: string
          length: number
          preference: string
        }
        Update: {
          clinician_id?: string
          created_at?: string
          diameter?: number
          id?: string
          implant_system?: string
          indication?: string
          length?: number
          preference?: string
        }
        Relationships: [
          {
            foreignKeyName: "implant_selections_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "clinicians"
            referencedColumns: ["id"]
          },
        ]
      }
      implant_systems: {
        Row: {
          code: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      implant_valid_combinations: {
        Row: {
          diameter: number
          id: string
          length: number
          system_code: string
        }
        Insert: {
          diameter: number
          id?: string
          length: number
          system_code: string
        }
        Update: {
          diameter?: number
          id?: string
          length?: number
          system_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "implant_valid_combinations_system_code_fkey"
            columns: ["system_code"]
            isOneToOne: false
            referencedRelation: "implant_systems"
            referencedColumns: ["code"]
          },
        ]
      }
      indication_comments: {
        Row: {
          clinician_id: string
          comment: string
          created_at: string
          id: string
          indication: string
        }
        Insert: {
          clinician_id: string
          comment: string
          created_at?: string
          id?: string
          indication: string
        }
        Update: {
          clinician_id?: string
          comment?: string
          created_at?: string
          id?: string
          indication?: string
        }
        Relationships: [
          {
            foreignKeyName: "indication_comments_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "clinicians"
            referencedColumns: ["id"]
          },
        ]
      }
      suggested_dimensions: {
        Row: {
          clinician_id: string
          created_at: string
          id: string
          indication: string
          suggestion_text: string
        }
        Insert: {
          clinician_id: string
          created_at?: string
          id?: string
          indication: string
          suggestion_text: string
        }
        Update: {
          clinician_id?: string
          created_at?: string
          id?: string
          indication?: string
          suggestion_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggested_dimensions_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "clinicians"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
