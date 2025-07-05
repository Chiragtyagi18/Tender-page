'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  // Add this log to see if the component is even being rendered
  console.log('AuthCallbackPage: Component rendered.');

  useEffect(() => {
    console.log('AuthCallbackPage useEffect: Running...');
    console.log('AuthCallbackPage useEffect: authLoading =', authLoading, ', user =', user);

    // If authentication state is still loading, wait
    if (authLoading) {
      console.log('AuthCallbackPage: Authentication is loading, waiting...');
      return;
    }

    // If no user is found after auth loads, something went wrong or session is invalid/expired.
    // Redirect to sign-in.
    if (!user) {
      console.log('AuthCallbackPage: No user found after auth load, redirecting to sign-in.');
      toast.error('Authentication failed or session expired. Please sign in again.');
      router.push('/auth/signin');
      return;
    }

    // If a user is found, check if they have a company profile
    const checkCompanyProfileAndRedirect = async () => {
      console.log('AuthCallbackPage: User found:', user.id, 'Checking for company profile...');
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (companyData) {
        // User has a company profile, redirect to dashboard
        console.log('AuthCallbackPage: Company profile found, redirecting to dashboard.');
        toast.success('Welcome back!');
        router.push('/dashboard');
      } else if (companyError && companyError.code === 'PGRST116') {
        // User exists in auth.users (and public.users via trigger), but no company profile.
        // Redirect to onboarding.
        console.log('AuthCallbackPage: No company profile found, redirecting to onboarding.');
        toast.info('Please complete your company profile.');
        router.push('/onboarding');
      } else if (companyError) {
        // Other database error when checking company profile.
        console.error('AuthCallbackPage: Error checking company profile:', companyError.message, companyError);
        console.log('AuthCallbackPage: Stale session detected, signing out to clear state.');
        await signOut(); // Force sign out to clear client-side session
        toast.error('An issue occurred with your session. Please sign up or sign in again.');
        router.push('/auth/signin'); // Redirect to sign-in after sign out
      }
    };

    // Only run the profile check if user is available and auth is not loading
    if (user && !authLoading) {
      checkCompanyProfileAndRedirect();
    }
  }, [user, authLoading, router, signOut]);

  // Display a loading message while the redirect logic is running
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-lg text-blue-600">Processing authentication, please wait...</p>
    </div>
  );
}
