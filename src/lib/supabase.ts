import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn("Supabase environment variables are missing. Form persistence will be disabled.");
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type SportInterestInsert = {
  first_name?: string;
  email: string;
  city: string;
  state_region?: string;
  country?: string;
  primary_sport: string;
  secondary_sports?: string[];
  skill_level?: string;
  play_frequency?: string;
  looking_for?: string;
  preferred_tier?: "free" | "pro" | "elite";
  source_intent?: "free_signup" | "sport_interest" | "checkout_fallback" | "waitlist";
  launch_status_at_signup?: "pre_release" | "launched";
  landing_path?: string;
  submitted_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export type CheckoutIntentInsert = {
  selected_tier: "pro" | "elite";
  email: string;
  first_name?: string;
  city?: string;
  primary_sport?: string;
  intent_status?: "checkout_not_live" | "checkout_live";
  checkout_path?: string;
  landing_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export type PartnerLeadInsert = {
  contact_name: string;
  email: string;
  organization_name: string;
  organization_type: string;
  city: string;
  partnership_interest?: string;
  notes?: string;
  landing_path?: string;
  submitted_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export function hasSupabaseConfig() {
  return isSupabaseConfigured;
}
