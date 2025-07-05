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

  const { signUp, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authentication is still loading, do nothing
    if (authLoading) {
      return;
    }

    // Only attempt to redirect if a user object exists AND their email is confirmed.
    // This prevents redirection for unconfirmed users or stale user objects from deleted accounts.
    if (user && user.email_confirmed_at) {
      const checkAndRedirect = async () => {
        console.log('SignUpPage useEffect: Checking for existing company profile for user ID:', user.id);
        const { data, error: companyCheckError } = await supabase
          .from('companies')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (data) {
          console.log('SignUpPage useEffect: Company profile found, redirecting to dashboard.');
          router.push('/dashboard');
        } else if (companyCheckError && companyCheckError.code !== 'PGRST116') { // PGRST116 means "no rows found"
          console.error('SignUpPage useEffect: Error checking company profile:', companyCheckError.message, companyCheckError);
        } else {
          console.log('SignUpPage useEffect: No existing company profile found, redirecting to onboarding.');
          router.push('/onboarding');
        }
      };
      checkAndRedirect();
    }
    // If user is null, or user exists but email is not confirmed,
    // then the signup page should remain visible.
  }, [user, authLoading, router]);


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
      const { data: authData, error: authError } = await signUp(emailTrimmed, password);

      if (authError) {
        console.error('SignUpPage: Supabase authentication error during signup:', authError);
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData?.session) {
        setSuccessMessage('Account created! Please check your email to confirm your account and log in.');
        toast.success('Account created! Please check your email for a confirmation link.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAcceptedTerms(false);
        setLoading(false);
        return;
      }

      const authenticatedUser = authData.user;

      if (authenticatedUser) {
        console.log('SignUpPage: Authenticated User ID from authData:', authenticatedUser.id);
        console.log('SignUpPage: Authenticated User Email from authData:', authenticatedUser.email);

        const { data: upsertData, error: userProfileUpsertError } = await supabase
          .from('users')
          .upsert(
            {
              id: authenticatedUser.id,
              email: authenticatedUser.email!,
            },
            { onConflict: 'id' }
          );

        if (userProfileUpsertError) {
          console.error('SignUpPage: CRITICAL ERROR upserting user profile to public.users table:', userProfileUpsertError.message, userProfileUpsertError);
          setError('Failed to save user profile. Please try again.');
          setLoading(false);
          return;
        } else {
          console.log('SignUpPage: User profile upserted successfully into public.users:', upsertData);
        }

        toast.success('Account created successfully! Please complete your company profile.');
        router.push('/onboarding');
      } else {
        setError('Account created, but user data not found after authentication. Please try logging in.');
      }
    } catch (err) {
      console.error('SignUpPage: An unexpected error occurred during signup:', err);
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
