'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get signUp function, current user, and auth loading state from useAuth hook
  const { signUp, user, loading: authLoading, signOut } = useAuth(); // Ensure signOut is destructured
  const router = useRouter();

  // Effect to handle redirection based on user authentication and profile status
  useEffect(() => {
    // If authentication is still loading, do nothing yet
    if (authLoading) {
      return;
    }

    // If there's no user, stay on the signup page
    if (!user) {
      console.log('SignUpPage useEffect: No user found, staying on signup page.');
      return;
    }

    // If a user object exists, check their profile status
    const checkProfileAndRedirect = async () => {
      console.log('SignUpPage useEffect: User found:', user.id, 'Checking company profile...');
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (companyData) {
        // User has a company profile, redirect to dashboard
        console.log('SignUpPage useEffect: Company profile found, redirecting to dashboard.');
        router.push('/dashboard');
      } else if (companyError && companyError.code === 'PGRST116') {
        // User exists in auth.users, but no company profile found (PGRST116 = no rows found)
        // This means they need to complete onboarding, so redirect to onboarding page
        console.log('SignUpPage useEffect: No company profile found, redirecting to onboarding.');
        router.push('/onboarding');
      } else if (companyError) {
        // A different error occurred when checking company profile (e.g., user_id not found in public.users)
        // This suggests a stale user session or a database inconsistency.
        // Explicitly sign out to clear the client-side session.
        console.error('SignUpPage useEffect: Error checking company profile (not PGRST116):', companyError.message, companyError);
        console.log('SignUpPage useEffect: Stale session detected, signing out to clear state.');
        await signOut(); // Crucial: Clear the client-side session
        // After signOut, the useEffect will re-run, !user will be true, and it will correctly stay on signup.
        toast.error('Your session was invalid. Please sign up or sign in again.');
      }
    };

    checkProfileAndRedirect();
  }, [user, authLoading, router, signOut]); // Add signOut to dependencies


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const emailTrimmed = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to sign up with email:', emailTrimmed);
      const { data: authData, error: authError } = await signUp(emailTrimmed, password);

      if (authError) {
        console.error('SignUpPage: Supabase authentication error during signup:', authError);
        setError(authError.message); // Display the exact error message from Supabase
        setLoading(false);
        return;
      }

      if (!authData?.session) {
        // This path is taken if email confirmation is required and no session is immediately created
        setSuccessMessage('Account created! Please check your email to confirm your account and log in.');
        toast.success('Account created! Please check your email for a confirmation link.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAcceptedTerms(false);
        setLoading(false);
        return;
      }

      // If a session exists (email confirmation not required or already confirmed via magic link/etc.)
      const authenticatedUser = authData.user;

      if (authenticatedUser) {
        console.log('SignUpPage: Authenticated User ID from authData:', authenticatedUser.id);
        console.log('SignUpPage: Authenticated User Email from authData:', authenticatedUser.email);

        // The public.users entry is now handled by the database trigger 'on_auth_user_created'.
        // No client-side upsert to public.users is needed here.

        toast.success('Account created successfully! Please complete your company profile.');
        router.push('/onboarding');
      } else {
        setError('Account created, but user data not found after authentication. Please try logging in.');
      }
    } catch (err: unknown) { // Use unknown for catch clause variable
      console.error('SignUpPage: An unexpected error occurred during signup:', err instanceof Error ? err.message : err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join TenderHub and start connecting with businesses
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {successMessage && (
                <Alert variant="default" className="bg-green-500 text-white">
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
