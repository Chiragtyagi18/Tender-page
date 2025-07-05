// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Calendar } from '@/components/ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { useAuth } from '@/hooks/use-auth';
// import { supabase } from '@/lib/supabase';
// import { CalendarIcon, FileText } from 'lucide-react';
// import { format } from 'date-fns';
// import { toast } from 'sonner';
// import { cn } from '@/lib/utils';

// export default function CreateTenderPage() {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     requirements: '',
//     budget: '',
//   });
//   const [deadline, setDeadline] = useState<Date>();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const { user } = useAuth();
//   const router = useRouter();

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user || !deadline) return;

//     setLoading(true);
//     setError('');

//     try {
//       // Get user's company
//       const { data: company, error: companyError } = await supabase
//         .from('companies')
//         .select('id')
//         .eq('user_id', user.id)
//         .single();

//       if (companyError || !company) {
//         setError('Please complete your company profile first');
//         setLoading(false);
//         return;
//       }

//       // Create tender
//       const { error: tenderError } = await supabase
//         .from('tenders')
//         .insert({
//           company_id: company.id,
//           title: formData.title,
//           description: formData.description,
//           requirements: formData.requirements || null,
//           budget: formData.budget ? parseFloat(formData.budget) : null,
//           deadline: deadline.toISOString(),
//           status: 'open',
//         });

//       if (tenderError) throw tenderError;

//       toast.success('Tender created successfully!');
//       router.push('/dashboard');
//     } catch (err: any) {
//       setError(err.message || 'An unexpected error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-2xl">
//       <div className="text-center mb-8">
//         <FileText className="h-12 w-12 text-blue-600 mx-auto" />
//         <h1 className="mt-6 text-3xl font-bold text-gray-900">
//           Create New Tender
//         </h1>
//         <p className="mt-2 text-gray-600">
//           Post your tender to find qualified suppliers
//         </p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Tender Details</CardTitle>
//           <CardDescription>
//             Provide clear information about your requirements
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="title">Tender Title *</Label>
//               <Input
//                 id="title"
//                 required
//                 value={formData.title}
//                 onChange={(e) => handleInputChange('title', e.target.value)}
//                 placeholder="Enter a clear, descriptive title"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description *</Label>
//               <Textarea
//                 id="description"
//                 required
//                 value={formData.description}
//                 onChange={(e) => handleInputChange('description', e.target.value)}
//                 placeholder="Describe what you need in detail..."
//                 rows={5}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="requirements">Specific Requirements</Label>
//               <Textarea
//                 id="requirements"
//                 value={formData.requirements}
//                 onChange={(e) => handleInputChange('requirements', e.target.value)}
//                 placeholder="List any specific requirements, qualifications, or criteria..."
//                 rows={4}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label>Deadline *</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className={cn(
//                         "w-full justify-start text-left font-normal",
//                         !deadline && "text-muted-foreground"
//                       )}
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {deadline ? format(deadline, "PPP") : "Select deadline"}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={deadline}
//                       onSelect={setDeadline}
//                       disabled={(date) => date < new Date()}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="budget">Budget (USD)</Label>
//                 <Input
//                   id="budget"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={formData.budget}
//                   onChange={(e) => handleInputChange('budget', e.target.value)}
//                   placeholder="Enter budget amount"
//                 />
//               </div>
//             </div>

//             <div className="bg-blue-50 p-4 rounded-lg">
//               <h3 className="font-medium text-blue-900 mb-2">Tips for a successful tender:</h3>
//               <ul className="text-sm text-blue-800 space-y-1">
//                 <li>• Be specific about your requirements and expectations</li>
//                 <li>• Include relevant technical specifications or standards</li>
//                 <li>• Set a realistic deadline for submissions</li>
//                 <li>• Provide contact information for questions</li>
//               </ul>
//             </div>

//             <div className="flex justify-end space-x-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => router.back()}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={loading || !deadline}>
//                 {loading ? 'Creating...' : 'Create Tender'}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


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
        } catch (err: any) { // Changed 'Error' to 'any'
          console.error('CreateTender: An unexpected error fetching company ID:', (err as Error).message || err);
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
          deadline: new Date(deadline).toISOString(), // Ensure ISO format for Supabase timestamp
          budget: parsedBudget,
          requirements: requirements.trim() || null,
        });

      if (insertError) {
        console.error('CreateTender: Error creating tender:', insertError.message, insertError);
        setError(`Failed to create tender: ${insertError.message}`);
      } else {
        toast.success('Tender created successfully!');
        router.push('/dashboard'); // Redirect to dashboard or tenders list
      }
    } catch (err: any) { // Changed 'Error' to 'any'
      console.error('CreateTender: An unexpected error occurred:', (err as Error).message || err);
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
