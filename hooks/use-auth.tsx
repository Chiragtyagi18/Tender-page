'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthError, Session } from '@supabase/supabase-js'; // Import Session type
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // Updated return types to include data object from Supabase auth methods
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; data: { user: User | null; session: Session | null } | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null; data: { user: User | null; session: Session | null } | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser ] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user status
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for authentication state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null); // Update user state based on session
      setLoading(false); // Authentication state is now known
    });

    // Clean up the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount

  /**
   * Signs in a user with email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise resolving to an object containing data (user, session) or an error.
   */
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error }; // Return both data and error
  };

  /**
   * Signs up a new user with email and password.
   * @param email - The new user's email address.
   * @param password - The new user's password.
   * @returns A promise resolving to an object containing data (user, session) or an error.
   */
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error }; // Return both data and error
  };

  /**
   * Signs out the current user.
   * @returns A promise that resolves when the user is signed out.
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // The context value provided to consumers
  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

