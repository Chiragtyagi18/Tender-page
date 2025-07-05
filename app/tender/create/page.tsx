
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function CreateTenderPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState<string>(''); // Keep as string for input, convert to number for DB
  const [requirements, setRequirements] = useState('');
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }

    const fetchCompanyId = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data, error: companyError } = await supabase
            .from('companies')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (companyError) {
            console.error('CreateTender: Error fetching company ID:', companyError.message, companyError);
            setError('Could not find your company profile. Please complete onboarding first.');
            setLoading(false);
            return;
          }
          setCompanyId(data.id);
        } catch (err: unknown) { // Changed 'any' to 'unknown'
          console.error('CreateTender: An unexpected error fetching company ID:', err instanceof Error ? err.message : err);
          setError('An unexpected error occurred. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    if (user && !authLoading) {
      fetchCompanyId();
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user || !companyId) {
      setError('User not authenticated or company profile not found.');
      setLoading(false);
      return;
    }

    if (!title.trim() || !description.trim() || !deadline.trim()) {
      setError('Title, description, and deadline are required.');
      setLoading(false);
      return;
    }

    const parsedBudget = budget ? parseFloat(budget) : null;
    if (budget && isNaN(parsedBudget!)) {
      setError('Budget must be a valid number.');
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('tenders')
        .insert({
          company_id: companyId,
          title: title.trim(),
          description: description.trim(),
          deadline: new Date(deadline).toISOString(),
          budget: parsedBudget,
          requirements: requirements.trim() || null,
        });

      if (insertError) {
        console.error('CreateTender: Error creating tender:', insertError.message, insertError);
        setError(`Failed to create tender: ${insertError.message}`);
      } else {
        toast.success('Tender created successfully!');
        router.push('/dashboard');
      }
    } catch (err: unknown) { // Changed 'any' to 'unknown'
      console.error('CreateTender: An unexpected error occurred:', err instanceof Error ? err.message : err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading || !user || !companyId) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Create New Tender</CardTitle>
          <CardDescription className="text-gray-600">
            Fill in the details for your new tender opportunity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Tender Title</Label>
              <Input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Development of New E-commerce Platform"
                className="rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the tender requirements."
                className="flex h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Optional)</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., 50000 (USD)"
                className="rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (Optional)</Label>
              <textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="List any specific technical or qualification requirements."
                className="flex h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <Button type="submit" className="w-full rounded-md" disabled={loading}>
              {loading ? 'Creating Tender...' : 'Create Tender'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
