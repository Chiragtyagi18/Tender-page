// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: For production applications, it is HIGHLY recommended to load these
// from environment variables (e.g., process.env.NEXT_PUBLIC_SUPABASE_URL)
// rather than hardcoding them directly in the file for security reasons.
// This prevents your sensitive keys from being exposed in your client-side code.

// Using the hardcoded values you provided:
const supabaseUrl = "https://cnbzqfpqnkyghosmvqbh.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuYnpxZnBxbmt5Z2hvc212cWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NzI4NTEsImV4cCI6MjA2NzA0ODg1MX0.M3ZVnCwFNeAqzA8SH1ttO__rQfyse0nf5A4KBGtDi2M";

// Create the Supabase client instance
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
