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
      blogs: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          image: string | null
          published: boolean | null
          published_at: string | null
          slug: string | null
          tags: Json | null
          title: string
          updated_at: string | null
          url_word: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          published?: boolean | null
          published_at?: string | null
          slug?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
          url_word?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          published?: boolean | null
          published_at?: string | null
          slug?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
          url_word?: string | null
        }
        Relationships: []
      }
      hero_sections: {
        Row: {
          background_image: string | null
          cards: Json | null
          created_at: string | null
          id: string
          service_id: string | null
          slogan: string | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          background_image?: string | null
          cards?: Json | null
          created_at?: string | null
          id?: string
          service_id?: string | null
          slogan?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          background_image?: string | null
          cards?: Json | null
          created_at?: string | null
          id?: string
          service_id?: string | null
          slogan?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hero_sections_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation: {
        Row: {
          created_at: string | null
          dropdown: Json | null
          href: string
          id: string
          label: string
          sort_order: number | null
          updated_at: string | null
          is_header: boolean | null
        }
        Insert: {
          created_at?: string | null
          dropdown?: Json | null
          href: string
          id?: string
          label: string
          sort_order?: number | null
          updated_at?: string | null
          is_header?: boolean | null
        }
        Update: {
          created_at?: string | null
          dropdown?: Json | null
          href?: string
          id?: string
          label?: string
          sort_order?: number | null
          updated_at?: string | null
          is_header?: boolean | null
        }
        Relationships: []
      }
      prizes: {
        Row: {
          border_color: string | null
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          image: string | null
          period: string | null
          text_color: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          border_color?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          period?: string | null
          text_color?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          border_color?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          period?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_services: {
        Row: {
          created_at: string | null
          id: string
          products: Json | null
          service_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          products?: Json | null
          service_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          products?: Json | null
          service_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          highlight: string | null
          id: string
          image: string | null
          path: string | null
          service_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          highlight?: string | null
          id?: string
          image?: string | null
          path?: string | null
          service_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          highlight?: string | null
          id?: string
          image?: string | null
          path?: string | null
          service_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category_id: string | null
          client: string | null
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          path: string | null
          title: string
          updated_at: string | null
          url_word: string | null
        }
        Insert: {
          category_id?: string | null
          client?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          path?: string | null
          title: string
          updated_at?: string | null
          url_word?: string | null
        }
        Update: {
          category_id?: string | null
          client?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          path?: string | null
          title?: string
          updated_at?: string | null
          url_word?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          gradient: string | null
          href: string | null
          icon: string | null
          id: string
          images: Json | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          gradient?: string | null
          href?: string | null
          icon?: string | null
          id?: string
          images?: Json | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          gradient?: string | null
          href?: string | null
          icon?: string | null
          id?: string
          images?: Json | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          avatar: string | null
          company: string | null
          content: string
          created_at: string | null
          id: string
          position: string | null
          updated_at: string | null
        }
        Insert: {
          author: string
          avatar?: string | null
          company?: string | null
          content: string
          created_at?: string | null
          id?: string
          position?: string | null
          updated_at?: string | null
        }
        Update: {
          author?: string
          avatar?: string | null
          company?: string | null
          content?: string
          created_at?: string | null
          id?: string
          position?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
