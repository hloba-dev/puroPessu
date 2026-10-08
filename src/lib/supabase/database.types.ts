/**
 * Database types for supabase/migrations.
 * Hand-maintained to mirror the migrations; once the project is linked you can regenerate
 * the standard format with `npm run db:types` (supabase gen types) — the exports stay compatible.
 */
export type Json = string | number | boolean | null | {[key: string]: Json | undefined} | Json[];

type TableDef<Row, Optional extends keyof Row = never> = {
  Row: Row;
  Insert: Omit<Row, Optional> & Partial<Pick<Row, Optional>>;
  Update: Partial<Row>;
  Relationships: [];
};

type LocaleCode = string;

export type Database = {
  public: {
    Tables: {
      service_categories: TableDef<
        {id: number; slug: string; name: Json; sort: number; is_active: boolean},
        'id' | 'sort' | 'is_active'
      >;
      services: TableDef<
        {
          id: number;
          category_id: number;
          slug: string;
          name: Json;
          description: Json;
          price_cents: number;
          price_from: boolean;
          unit: Database['public']['Enums']['service_unit'];
          duration_min: number;
          is_small: boolean;
          is_addon: boolean;
          is_active: boolean;
          sort: number;
        },
        'id' | 'description' | 'price_from' | 'unit' | 'duration_min' | 'is_small' | 'is_addon' | 'is_active' | 'sort'
      >;
      service_options: TableDef<
        {id: number; service_id: number; slug: string; name: Json; price_cents: number; duration_min: number},
        'id' | 'duration_min'
      >;
      settings: TableDef<{key: string; value: Json; updated_at: string}, 'updated_at'>;
      postal_codes: TableDef<{code: string; municipality: string; lat: number; lng: number}>;
      staff: TableDef<{id: number; name: string; is_active: boolean}, 'id' | 'is_active'>;
      gift_cards: TableDef<
        {
          id: string;
          code: string | null;
          amount_cents: number | null;
          balance_cents: number | null;
          service_id: number | null;
          buyer_name: string;
          buyer_email: string;
          buyer_phone: string | null;
          recipient_name: string | null;
          message: string | null;
          locale: LocaleCode;
          status: Database['public']['Enums']['gift_card_status'];
          valid_until: string | null;
          redeemed_booking_id: string | null;
          created_at: string;
        },
        | 'id'
        | 'code'
        | 'amount_cents'
        | 'balance_cents'
        | 'service_id'
        | 'buyer_phone'
        | 'recipient_name'
        | 'message'
        | 'locale'
        | 'status'
        | 'valid_until'
        | 'redeemed_booking_id'
        | 'created_at'
      >;
      bookings: TableDef<
        {
          id: string;
          ref_code: string;
          locale: LocaleCode;
          status: Database['public']['Enums']['booking_status'];
          customer_type: Database['public']['Enums']['customer_type'];
          name: string;
          phone: string;
          email: string;
          company: string | null;
          y_tunnus: string | null;
          address: string;
          postal_code: string;
          city: string;
          floor: string | null;
          parking: string | null;
          notes: string | null;
          starts_at: string;
          ends_at: string;
          duration_min: number;
          staff_id: number;
          subtotal_cents: number;
          travel_cents: number;
          min_fill_cents: number;
          promo_cents: number;
          promo_details: Json;
          discount_cents: number;
          total_cents: number;
          gift_card_code: string | null;
          photos: string[];
          marketing_consent: boolean;
          manage_token: string;
          created_at: string;
        },
        | 'id'
        | 'locale'
        | 'status'
        | 'customer_type'
        | 'company'
        | 'y_tunnus'
        | 'floor'
        | 'parking'
        | 'notes'
        | 'travel_cents'
        | 'min_fill_cents'
        | 'promo_cents'
        | 'promo_details'
        | 'photos'
        | 'discount_cents'
        | 'gift_card_code'
        | 'marketing_consent'
        | 'created_at'
      >;
      booking_items: TableDef<
        {
          id: number;
          booking_id: string;
          service_id: number | null;
          service_slug: string;
          name: string;
          option_ids: number[];
          option_slugs: string[];
          qty: number;
          unit_price_cents: number;
          duration_min: number;
          very_dirty: boolean;
        },
        'id' | 'service_id' | 'option_ids' | 'option_slugs' | 'duration_min' | 'very_dirty'
      >;
      blocked_times: TableDef<
        {
          id: string;
          staff_id: number | null;
          starts_at: string;
          ends_at: string;
          reason: string | null;
          created_at: string;
        },
        'id' | 'staff_id' | 'reason' | 'created_at'
      >;
      quote_requests: TableDef<
        {
          id: string;
          contact_name: string;
          company: string;
          email: string;
          phone: string | null;
          y_tunnus: string | null;
          sector: Database['public']['Enums']['quote_sector'];
          items: string;
          preferred_time: Database['public']['Enums']['preferred_time'];
          billing_address: string | null;
          notes: string | null;
          photos: string[];
          locale: LocaleCode;
          status: Database['public']['Enums']['request_status'];
          created_at: string;
        },
        'id' | 'phone' | 'y_tunnus' | 'billing_address' | 'notes' | 'photos' | 'locale' | 'status' | 'created_at'
      >;
      contact_messages: TableDef<
        {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          locale: LocaleCode;
          status: Database['public']['Enums']['request_status'];
          created_at: string;
        },
        'id' | 'phone' | 'locale' | 'status' | 'created_at'
      >;
      data_deletion_requests: TableDef<
        {
          id: string;
          email: string;
          phone: string | null;
          details: string | null;
          locale: LocaleCode;
          status: Database['public']['Enums']['request_status'];
          created_at: string;
        },
        'id' | 'phone' | 'details' | 'locale' | 'status' | 'created_at'
      >;
      gallery_items: TableDef<
        {
          id: string;
          before_url: string;
          after_url: string;
          caption: Json;
          service_slug: string;
          sort: number;
          is_featured: boolean;
          created_at: string;
        },
        'id' | 'caption' | 'service_slug' | 'sort' | 'is_featured' | 'created_at'
      >;
      reviews: TableDef<
        {
          id: string;
          author: string;
          rating: number;
          text: string;
          locale: LocaleCode;
          source: Database['public']['Enums']['review_source'];
          date: string;
          is_published: boolean;
          created_at: string;
        },
        'id' | 'locale' | 'source' | 'date' | 'is_published' | 'created_at'
      >;
      admins: TableDef<{user_id: string; email: string | null; created_at: string}, 'email' | 'created_at'>;
      rate_limits: TableDef<{key: string; bucket: string; count: number}, 'count'>;
    };
    Views: {[_ in never]: never};
    Functions: {
      book_slot: {Args: {p_booking: Json; p_items: Json}; Returns: Json};
      reschedule_booking: {Args: {p_token: string; p_starts: string; p_ends: string}; Returns: Json};
      hit_rate_limit: {Args: {p_key: string; p_window_seconds: number; p_max: number}; Returns: boolean};
      customer_has_bookings: {Args: {p_email: string; p_phone: string}; Returns: boolean};
      is_admin: {Args: Record<PropertyKey, never>; Returns: boolean};
    };
    Enums: {
      service_unit: 'item' | 'piece' | 'm2';
      booking_status: 'pending' | 'confirmed' | 'done' | 'cancelled';
      customer_type: 'private' | 'business';
      quote_sector: 'office' | 'hotel_restaurant' | 'healthcare' | 'carpet' | 'other';
      preferred_time: 'workhours' | 'evening' | 'weekend' | 'flexible';
      gift_card_status: 'requested' | 'paid' | 'redeemed' | 'expired';
      review_source: 'google' | 'site';
      request_status: 'new' | 'in_progress' | 'done';
    };
    CompositeTypes: {[_ in never]: never};
  };
};

type PublicSchema = Database['public'];
export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];
export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update'];
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T];
