// // lib/supabase.ts
// import { createClient } from '@supabase/supabase-js';

// // IMPORTANT: For production applications, it is HIGHLY recommended to load these
// // from environment variables (e.g., process.env.NEXT_PUBLIC_SUPABASE_URL)
// // rather than hardcoding them directly in the file for security reasons.
// // This prevents your sensitive keys from being exposed in your client-side code.

// // Retrieve Supabase URL and Anon Key from environment variables.
// // These variables are expected to be set in your .env.local file (for Next.js)
// // or your deployment environment.
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// // --- FIX START ---
// // Ensure that the environment variables are defined.
// // If they are not, throw an error to prevent the application from starting
// // with missing critical configuration. This is crucial for production readiness.
// if (!supabaseUrl) {
//   throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
// }
// if (!supabaseAnonKey) {
//   throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
// }
// // --- FIX END ---

// // Create the Supabase client instance.
// // TypeScript now knows that supabaseUrl and supabaseAnonKey are definitely strings
// // because of the checks above.
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // Type definitions for your database schema (useful for type-safe queries)
// export type Database = {
//   public: {
//     Tables: {
//       users: {
//         Row: {
//           id: string;
//           email: string;
//           created_at: string;
//           updated_at: string;
//         };
//         Insert: {
//           id?: string;
//           email: string;
//           created_at?: string;
//           updated_at?: string;
//         };
//         Update: {
//           id?: string;
//           email?: string;
//           created_at?: string;
//           updated_at?: string;
//         };
//       };
//       companies: {
//         Row: {
//           id: string;
//           user_id: string;
//           name: string;
//           industry: string;
//           description: string | null;
//           logo_url: string | null;
//           website: string | null;
//           phone: string | null;
//           address: string | null;
//           created_at: string;
//           updated_at: string;
//         };
//         Insert: {
//           id?: string;
//           user_id: string;
//           name: string;
//           industry: string;
//           description?: string | null;
//           logo_url?: string | null;
//           website?: string | null;
//           phone?: string | null;
//           address?: string | null;
//           created_at?: string;
//           updated_at?: string;
//         };
//         Update: {
//           id?: string;
//           user_id?: string;
//           name?: string;
//           industry?: string;
//           description?: string | null;
//           logo_url?: string | null;
//           website?: string | null;
//           phone?: string | null;
//           address?: string | null;
//           created_at?: string;
//           updated_at?: string;
//         };
//       };
//       tenders: {
//         Row: {
//           id: string;
//           company_id: string;
//           title: string;
//           description: string;
//           deadline: string;
//           budget: number | null;
//           status: 'open' | 'closed' | 'awarded';
//           requirements: string | null;
//           created_at: string;
//           updated_at: string;
//         };
//         Insert: {
//           id?: string;
//           company_id: string;
//           title: string;
//           description: string;
//           deadline: string;
//           budget?: number | null;
//           status?: 'open' | 'closed' | 'awarded';
//           requirements?: string | null;
//           created_at?: string;
//           updated_at?: string;
//         };
//         Update: {
//           id?: string;
//           company_id?: string;
//           title?: string;
//           description?: string;
//           deadline?: string;
//           budget?: number | null;
//           status?: 'open' | 'closed' | 'awarded';
//           requirements?: string | null;
//           created_at?: string;
//           updated_at?: string;
//         };
//       };
//       applications: {
//         Row: {
//           id: string;
//           tender_id: string;
//           company_id: string;
//           proposal_text: string;
//           proposed_budget: number | null;
//           status: 'pending' | 'accepted' | 'rejected';
//           created_at: string;
//           updated_at: string;
//         };
//         Insert: {
//           id?: string;
//           tender_id: string;
//           company_id: string;
//           proposal_text: string;
//           proposed_budget?: number | null;
//           status?: 'pending' | 'accepted' | 'rejected';
//           created_at?: string;
//           updated_at?: string;
//         };
//         Update: {
//           id?: string;
//           tender_id?: string;
//           company_id?: string;
//           proposal_text?: string;
//           proposed_budget?: number | null;
//           status?: 'pending' | 'accepted' | 'rejected';
//           created_at?: string;
//           updated_at?: string;
//         };
//       };
//       company_services: {
//         Row: {
//           id: string;
//           company_id: string;
//           service_name: string;
//           description: string | null;
//           created_at: string;
//         };
//         Insert: {
//           id?: string;
//           company_id: string;
//           service_name: string;
//           description?: string | null;
//           created_at?: string;
//         };
//         Update: {
//           id?: string;
//           company_id?: string;
//           service_name?: string;
//           description?: string | null;
//           created_at?: string;
//         };
//       };
//     };
//   };
// };



// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: For production applications, it is HIGHLY recommended to load these
// from environment variables (e.g., process.env.NEXT_PUBLIC_SUPABASE_URL)
// rather than hardcoding them directly in the file for security reasons.
// This prevents your sensitive keys from being exposed in your client-side code.

// Retrieve Supabase URL and Anon Key from environment variables.
// These variables are expected to be set in your .env.local file (for Next.js)
// or your deployment environment.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// --- FIX START ---
// Ensure that the environment variables are defined.
// If they are not, throw an error to prevent the application from starting
// with missing critical configuration. This is crucial for production readiness.
if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}
// --- FIX END ---

// Create the Supabase client instance.
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
