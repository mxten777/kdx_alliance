// Auto-generated Supabase types placeholder
// Run `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts`
// after connecting to your Supabase project

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          organization: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      admin_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['admin_roles']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['admin_roles']['Insert']>
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string | null
          category: string
          status: string
          start_date: string
          end_date: string
          registration_start: string | null
          registration_end: string | null
          location: string | null
          location_detail: string | null
          max_participants: number | null
          current_participants: number
          is_free: boolean
          ticket_price: number
          host_organization_id: string | null
          cover_image_url: string | null
          gallery_images: Json
          tags: string[]
          contact_email: string | null
          contact_phone: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          applicant_name: string
          organization: string | null
          phone: string
          email: string
          participant_count: number
          memo: string | null
          status: string
          admin_memo: string | null
          privacy_agreed: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['event_registrations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['event_registrations']['Insert']>
      }
      tours: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string | null
          tour_type: string
          status: string
          duration_hours: number | null
          max_participants: number | null
          min_participants: number
          operating_days: string[]
          operating_hours: string | null
          location: string | null
          meeting_point: string | null
          parking_info: string | null
          requirements: string | null
          host_organization_id: string | null
          cover_image_url: string | null
          gallery_images: Json
          tags: string[]
          contact_email: string | null
          contact_phone: string | null
          is_free: boolean
          fee: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tours']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tours']['Insert']>
      }
      tour_reservations: {
        Row: {
          id: string
          tour_id: string
          applicant_name: string
          organization: string
          phone: string
          email: string
          desired_date: string
          participant_count: number
          visit_purpose: string | null
          memo: string | null
          status: string
          admin_memo: string | null
          privacy_agreed: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tour_reservations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tour_reservations']['Insert']>
      }
      spaces: {
        Row: {
          id: string
          name: string
          space_type: string
          description: string | null
          content: string | null
          capacity: number | null
          area_sqm: number | null
          floor: string | null
          building: string | null
          location: string | null
          operating_hours: string | null
          equipment: string[]
          rules: string | null
          images: Json
          is_available: boolean
          hourly_rate: number
          is_free: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['spaces']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['spaces']['Insert']>
      }
      space_reservations: {
        Row: {
          id: string
          space_id: string
          applicant_name: string
          organization: string | null
          phone: string
          email: string
          desired_date: string
          start_time: string
          end_time: string
          purpose: string
          participant_count: number | null
          memo: string | null
          status: string
          admin_memo: string | null
          privacy_agreed: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['space_reservations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['space_reservations']['Insert']>
      }
      inquiries: {
        Row: {
          id: string
          inquiry_type: string
          applicant_name: string
          organization: string | null
          phone: string
          email: string
          subject: string
          content: string
          status: string
          admin_memo: string | null
          reply_content: string | null
          replied_at: string | null
          replied_by: string | null
          privacy_agreed: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['inquiries']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
      }
      notices: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          is_pinned: boolean
          is_published: boolean
          author_id: string | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['notices']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['notices']['Insert']>
      }
      support_posts: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          summary: string | null
          deadline: string | null
          target_audience: string | null
          budget_amount: number | null
          attached_files: Json
          external_url: string | null
          is_published: boolean
          is_pinned: boolean
          author_id: string | null
          view_count: number
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['support_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['support_posts']['Insert']>
      }
      faq_categories: {
        Row: {
          id: string
          name: string
          slug: string
          sort_order: number
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['faq_categories']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['faq_categories']['Insert']>
      }
      faqs: {
        Row: {
          id: string
          category_id: string | null
          question: string
          answer: string
          is_published: boolean
          sort_order: number
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['faqs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['faqs']['Insert']>
      }
      public_organizations: {
        Row: {
          id: string
          name: string
          name_en: string | null
          org_type: string
          industry: string | null
          description: string | null
          logo_url: string | null
          website_url: string | null
          contact_email: string | null
          contact_phone: string | null
          address: string | null
          representative: string | null
          employee_count: number | null
          founded_year: number | null
          tags: string[]
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['public_organizations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['public_organizations']['Insert']>
      }
      parking_zones: {
        Row: {
          id: string
          name: string
          code: string
          zone_type: string
          total_spaces: number
          occupied_spaces: number
          reserved_spaces: number
          description: string | null
          location: string | null
          operating_hours: string
          is_active: boolean
          has_ev_charger: boolean
          has_disabled_space: boolean
          disabled_spaces: number
          ev_charger_count: number
          last_updated_at: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['parking_zones']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['parking_zones']['Insert']>
      }
      parking_status_snapshots: {
        Row: {
          id: string
          zone_id: string
          total_spaces: number
          occupied_spaces: number
          reserved_spaces: number
          occupancy_rate: number | null
          snapshot_time: string
          event_id: string | null
          note: string | null
        }
        Insert: Omit<Database['public']['Tables']['parking_status_snapshots']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['parking_status_snapshots']['Insert']>
      }
      safety_profiles: {
        Row: {
          id: string
          profile_type: string
          name: string
          organization: string | null
          phone: string | null
          email: string | null
          visit_purpose: string | null
          visit_date: string | null
          expected_checkout: string | null
          actual_checkout: string | null
          is_active: boolean
          related_event_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['safety_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['safety_profiles']['Insert']>
      }
      safety_tags: {
        Row: {
          id: string
          profile_id: string
          tag_code: string
          tag_type: string
          issued_at: string
          returned_at: string | null
          is_active: boolean
          battery_level: number | null
          last_ping_at: string | null
          current_zone_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['safety_tags']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['safety_tags']['Insert']>
      }
      safety_events: {
        Row: {
          id: string
          event_type: string
          severity: string
          profile_id: string | null
          tag_id: string | null
          zone_id: string | null
          description: string | null
          location_detail: string | null
          is_resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          resolution_note: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['safety_events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['safety_events']['Insert']>
      }
      safety_zones: {
        Row: {
          id: string
          name: string
          code: string
          zone_type: string
          description: string | null
          floor: string | null
          building: string | null
          capacity: number | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['safety_zones']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['safety_zones']['Insert']>
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          label: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>
      }
      chat_sessions: {
        Row: {
          id: string
          session_key: string
          user_agent: string | null
          ip_address: string | null
          created_at: string
          last_active_at: string
        }
        Insert: Omit<Database['public']['Tables']['chat_sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['chat_sessions']['Insert']>
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: string
          content: string
          metadata: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['chat_messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['chat_messages']['Insert']>
      }
      ai_feedback_logs: {
        Row: {
          id: string
          message_id: string | null
          session_id: string | null
          rating: number | null
          feedback_text: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_feedback_logs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ai_feedback_logs']['Insert']>
      }
      dashboard_daily_metrics: {
        Row: {
          id: string
          metric_date: string
          new_event_registrations: number
          new_tour_reservations: number
          new_space_reservations: number
          new_inquiries: number
          new_safety_events: number
          chat_sessions_count: number
          active_parking_occupancy: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['dashboard_daily_metrics']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['dashboard_daily_metrics']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
