// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// It is CRUCIAL to load these from environment variables for security and deployment.
// These variables will be injected by Next.js from your .env.local (development)
// or from Vercel's environment settings (deployment).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure that the environment variables are set.
// This check will throw an error during build or runtime if variables are missing.
// Make sure they are set in your .env.local (for local) and Vercel (for deployment).
if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create the Supabase client instance
// TypeScript now knows that supabaseUrl and supabaseAnonKey are definitely strings
// because of the checks above.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for your database schema (useful for type-safe queries)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          industry: string;
          description: string | null;
          logo_url: string | null;
          website: string | null;
          phone: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          industry: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          industry?: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tenders: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          description: string;
          deadline: string;
          budget: number | null;
          status: 'open' | 'closed' | 'awarded';
          requirements: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          description: string;
          deadline: string;
          budget?: number | null;
          status?: 'open' | 'closed' | 'awarded';
          requirements?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          title?: string;
          description?: string;
          deadline?: string;
          budget?: number | null;
          status?: 'open' | 'closed' | 'awarded';
          requirements?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          tender_id: string;
          company_id: string;
          proposal_text: string;
          proposed_budget: number | null;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tender_id: string;
          company_id: string;
          proposal_text: string;
          proposed_budget?: number | null;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tender_id?: string;
          company_id?: string;
          proposal_text?: string;
          proposed_budget?: number | null;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      company_services: {
        Row: {
          id: string;
          company_id: string;
          service_name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          service_name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          service_name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
