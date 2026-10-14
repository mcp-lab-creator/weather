import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const PHOTO_BUCKET = "complaint-photos";

let client: SupabaseClient | null = null;

/** Server-only client using the service-role key (bypasses RLS). Never import in client components. */
export function db(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export type Complaint = {
  id: string;
  tracking_id: string;
  name: string;
  mobile: string;
  ward: number;
  category: string;
  description: string;
  photo_url: string | null;
  status: string;
  remarks: string | null;
  created_at: string;
};

export type Scheme = {
  id: string;
  sort_order: number;
  name_hi: string;
  name_en: string | null;
  benefit_hi: string;
  benefit_en: string | null;
  eligibility_hi: string;
  eligibility_en: string | null;
  documents_hi: string;
  documents_en: string | null;
};

export type Notice = {
  id: string;
  type: "notice" | "gram_sabha";
  title_hi: string;
  title_en: string | null;
  body_hi: string;
  body_en: string | null;
  notice_date: string;
  created_at: string;
};
