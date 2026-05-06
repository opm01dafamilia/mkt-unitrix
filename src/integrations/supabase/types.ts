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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ad_generations: {
        Row: {
          campaign_goal: string
          created_at: string
          generated_ads: Json | null
          id: string
          platform: string
          product_service: string
          target_audience: string
          user_id: string
        }
        Insert: {
          campaign_goal: string
          created_at?: string
          generated_ads?: Json | null
          id?: string
          platform: string
          product_service: string
          target_audience: string
          user_id: string
        }
        Update: {
          campaign_goal?: string
          created_at?: string
          generated_ads?: Json | null
          id?: string
          platform?: string
          product_service?: string
          target_audience?: string
          user_id?: string
        }
        Relationships: []
      }
      campaign_analysis: {
        Row: {
          ad_cost: number | null
          analysis_result: Json | null
          campaign_name: string
          clicks: number | null
          created_at: string
          end_date: string | null
          id: string
          impressions: number | null
          leads: number | null
          objective: string | null
          platform: string | null
          sales: number | null
          start_date: string | null
          user_id: string
        }
        Insert: {
          ad_cost?: number | null
          analysis_result?: Json | null
          campaign_name: string
          clicks?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          impressions?: number | null
          leads?: number | null
          objective?: string | null
          platform?: string | null
          sales?: number | null
          start_date?: string | null
          user_id: string
        }
        Update: {
          ad_cost?: number | null
          analysis_result?: Json | null
          campaign_name?: string
          clicks?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          impressions?: number | null
          leads?: number | null
          objective?: string | null
          platform?: string | null
          sales?: number | null
          start_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      content_ideas: {
        Row: {
          content_type: string
          created_at: string
          generated_ideas: Json | null
          id: string
          niche: string
          platform: string
          user_id: string
        }
        Insert: {
          content_type: string
          created_at?: string
          generated_ideas?: Json | null
          id?: string
          niche: string
          platform: string
          user_id: string
        }
        Update: {
          content_type?: string
          created_at?: string
          generated_ideas?: Json | null
          id?: string
          niche?: string
          platform?: string
          user_id?: string
        }
        Relationships: []
      }
      copy_generations: {
        Row: {
          content_type: string
          created_at: string
          generated_copy: Json | null
          id: string
          product_service: string
          sales_goal: string
          target_audience: string
          user_id: string
        }
        Insert: {
          content_type: string
          created_at?: string
          generated_copy?: Json | null
          id?: string
          product_service: string
          sales_goal: string
          target_audience: string
          user_id: string
        }
        Update: {
          content_type?: string
          created_at?: string
          generated_copy?: Json | null
          id?: string
          product_service?: string
          sales_goal?: string
          target_audience?: string
          user_id?: string
        }
        Relationships: []
      }
      funnel_generations: {
        Row: {
          created_at: string
          funnel_type: string
          generated_funnel: Json | null
          id: string
          product_service: string
          user_id: string
        }
        Insert: {
          created_at?: string
          funnel_type: string
          generated_funnel?: Json | null
          id?: string
          product_service: string
          user_id: string
        }
        Update: {
          created_at?: string
          funnel_type?: string
          generated_funnel?: Json | null
          id?: string
          product_service?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_type: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean
          main_goal: string | null
          niche: string | null
          onboarding_completed: boolean
          plan: string | null
          status: string
          trial_ends_at: string | null
          user_id: string
        }
        Insert: {
          business_type?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
          main_goal?: string | null
          niche?: string | null
          onboarding_completed?: boolean
          plan?: string | null
          status?: string
          trial_ends_at?: string | null
          user_id: string
        }
        Update: {
          business_type?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
          main_goal?: string | null
          niche?: string | null
          onboarding_completed?: boolean
          plan?: string | null
          status?: string
          trial_ends_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
