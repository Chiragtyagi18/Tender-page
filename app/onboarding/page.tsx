// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { useAuth } from '@/hooks/use-auth';
// import { Building2, UploadCloud } from 'lucide-react';
// import { toast } from 'sonner';
// import { supabase } from '@/lib/supabase';

// export default function OnboardingPage() {
//   const [companyName, setCompanyName] = useState('');
//   const [industry, setIndustry] = useState('');
//   const [description, setDescription] = useState('');
//   const [companyLogo, setCompanyLogo] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

//   const { user, loading: authLoading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.push('/auth/signin');
//       return;
//     }

//     if (!authLoading && user) {
//       const checkCompanyProfile = async () => {
//         console.log('Onboarding: Verifying public.companies entry for user ID:', user.id);
//         const { data, error: companyError } = await supabase
//           .from('companies')
//           .select('id')
//           .eq('user_id', user.id)
//           .single();

//         if (data) {
//           console.log('Onboarding: Company profile found, redirecting to dashboard.');
//           router.push('/dashboard');
//         } else if (companyError && companyError.code !== 'PGRST116') {
//           console.error('Onboarding: Error checking company profile:', companyError.message, companyError);
//           setError('Failed to load company profile. Please try again.');
//         } else {
//           console.log('Onboarding: No existing company profile found, proceed with onboarding.');
//         }
//       };
//       checkCompanyProfile();
//     }
//   }, [user, authLoading, router]);

//   const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setCompanyLogo(file);
//       setLogoPreviewUrl(URL.createObjectURL(file));
//       console.log('Onboarding: File selected for upload:', file.name, 'Size:', file.size, 'Type:', file.type);
//     } else {
//       setCompanyLogo(null);
//       setLogoPreviewUrl(null);
//       console.log('Onboarding: No file selected.');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (!user) {
//       setError('User not authenticated. Please sign in again.');
//       setLoading(false);
//       return;
//     }

//     let logoUrl: string | null = null; // Initialize logoUrl as null

//     try {
//       console.log('Onboarding: Starting form submission for user:', user.id);
//       console.log('Onboarding: companyLogo state:', companyLogo);

//       // 1. Upload company logo to Supabase Storage if a file is selected
//       if (companyLogo) {
//         const filePath = `${user.id}/${Date.now()}-${companyLogo.name}`;
//         console.log('Onboarding: Attempting to upload file to path:', filePath);

//         const { data: uploadData, error: uploadError } = await supabase.storage
//           .from('photos') // Ensure this matches your bucket name
//           .upload(filePath, companyLogo, {
//             cacheControl: '3600',
//             upsert: false,
//           });

//         if (uploadError) {
//           console.error('Onboarding: Error uploading company logo:', uploadError.message, uploadError);
//           setError(`Failed to upload logo: ${uploadError.message}`);
//           setLoading(false);
//           return;
//         }

//         console.log('Onboarding: File uploaded successfully. Upload data:', uploadData);

//         // Get the public URL of the uploaded image
//         const { data: publicUrlData } = supabase.storage
//           .from('photos') // Ensure this matches your bucket name
//           .getPublicUrl(filePath);

//         logoUrl = publicUrlData.publicUrl;
//         console.log('Onboarding Debug: Generated publicUrlData:', publicUrlData); // Log the full data object
//         console.log('Onboarding Debug: Final logoUrl to be saved:', logoUrl);

//         if (!logoUrl) {
//             console.warn('Onboarding: logoUrl is null or empty after getPublicUrl. This might indicate a problem with bucket public settings or policy.');
//             // Optionally, set an error here if you want to prevent saving without a valid URL
//             // setError('Failed to get public URL for logo. Please check bucket settings.');
//             // setLoading(false);
//             // return;
//         }

//       } else {
//         console.log('Onboarding: No company logo file selected for upload.');
//       }

//       // 2. Upsert company data (including logo URL) to public.companies
//       console.log('Onboarding: Attempting to upsert company data with payload:', {
//         user_id: user.id,
//         name: companyName,
//         industry: industry,
//         description: description,
//         logo_url: logoUrl, // This is where the URL is saved
//       });

//       const { data: companyData, error: companyUpsertError } = await supabase
//         .from('companies')
//         .upsert(
//           {
//             user_id: user.id,
//             name: companyName,
//             industry: industry,
//             description: description,
//             logo_url: logoUrl, // This is where the URL is saved
//           },
//           { onConflict: 'user_id' }
//         )
//         .select();

//       if (companyUpsertError) {
//         console.error('Onboarding: CRITICAL ERROR upserting company profile:', companyUpsertError.message, companyUpsertError);
//         setError(`Failed to save company profile: ${companyUpsertError.message}`);
//         setLoading(false);
//         return;
//       }

//       console.log('Onboarding: Company profile saved successfully:', companyData);
//       toast.success('Company profile saved successfully!');
//       router.push('/dashboard');

//     } catch (err: any) { // Catch any unexpected errors
//       console.error('Onboarding: An unexpected error occurred during onboarding:', err.message || err);
//       setError('An unexpected error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (authLoading || !user) {
//     return (
//       <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
//         <p>Loading user data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <div className="flex justify-center">
//             <Building2 className="h-12 w-12 text-blue-600" />
//           </div>
//           <h2 className="mt-6 text-3xl font-bold text-gray-900">
//             Complete Your Company Profile
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Tell us about your company to get started with TenderHub.
//           </p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Company Details</CardTitle>
//             <CardDescription>
//               Provide the essential information about your organization.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {error && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}

//               <div className="space-y-2">
//                 <Label htmlFor="companyName">Company Name</Label>
//                 <Input
//                   id="companyName"
//                   name="companyName"
//                   type="text"
//                   required
//                   value={companyName}
//                   onChange={(e) => setCompanyName(e.target.value)}
//                   placeholder="e.g., Acme Corp"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="industry">Industry</Label>
//                 <Input
//                   id="industry"
//                   name="industry"
//                   type="text"
//                   value={industry}
//                   onChange={(e) => setIndustry(e.target.value)}
//                   placeholder="e.g., Technology, Construction, Healthcare"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="description">Company Description</Label>
//                 <Input
//                   id="description"
//                   name="description"
//                   type="text"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="A brief description of your company"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="companyLogo">Company Logo</Label>
//                 <div className="flex items-center space-x-4">
//                   <Input
//                     id="companyLogo"
//                     name="companyLogo"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleLogoChange}
//                     className="flex-grow"
//                   />
//                   {logoPreviewUrl && (
//                     <img
//                       src={logoPreviewUrl}
//                       alt="Logo Preview"
//                       className="w-20 h-20 object-contain rounded-md border border-gray-200"
//                     />
//                   )}
//                   {!logoPreviewUrl && (
//                     <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-400">
//                       <UploadCloud className="w-8 h-8" />
//                     </div>
//                   )}
//                 </div>
//                 <p className="text-sm text-gray-500">Upload your company&apos;s logo (Max 5MB)</p>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={loading}
//               >
//                 {loading ? 'Saving Profile...' : 'Save Company Profile'}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { Building2, UploadCloud } from 'lucide-react'; // Added UploadCloud icon
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase'; // Import the Supabase client

export default function OnboardingPage() {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState(''); // New state for industry
  const [description, setDescription] = useState('');
  const [companyLogo, setCompanyLogo] = useState<File | null>(null); // State for company logo file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null); // State for logo preview

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if no user or if user already has a company profile
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin'); // Redirect to sign-in if no user
      return;
    }

    if (!authLoading && user) {
      const checkCompanyProfile = async () => {
        console.log('Onboarding: Verifying public.companies entry for user ID:', user.id);
        const { data, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (data) {
          console.log('Onboarding: Company profile found, redirecting to dashboard.');
          router.push('/dashboard');
        } else if (companyError && companyError.code !== 'PGRST116') { // PGRST116 means "no rows found"
          console.error('Onboarding: Error checking company profile:', companyError.message, companyError);
          setError('Failed to load company profile. Please try again.');
        } else {
          console.log('Onboarding: No existing company profile found, proceed with onboarding.');
          // Continue with onboarding, no redirection needed
        }
      };
      checkCompanyProfile();
    }
  }, [user, authLoading, router]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyLogo(file);
      setLogoPreviewUrl(URL.createObjectURL(file)); // Create a URL for preview
    } else {
      setCompanyLogo(null);
      setLogoPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user) {
      setError('User not authenticated. Please sign in again.');
      setLoading(false);
      return;
    }

    let logoUrl: string | null = null;

    try {
      // 1. Upload company logo to Supabase Storage if a file is selected
      if (companyLogo) {
        const filePath = `${user.id}/${Date.now()}-${companyLogo.name}`; // Unique path for the logo
        console.log('Onboarding: Attempting to upload file to path:', filePath);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photos') // *** UPDATED: Using 'photos' bucket name here ***
          .upload(filePath, companyLogo, {
            cacheControl: '3600', // Cache for 1 hour
            upsert: false, // Do not overwrite existing files with the same name
          });

        if (uploadError) {
          console.error('Onboarding: Error uploading company logo:', uploadError.message, uploadError);
          setError(`Failed to upload logo: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        // Get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('photos') // *** UPDATED: Using 'photos' bucket name here ***
          .getPublicUrl(filePath);

        logoUrl = publicUrlData.publicUrl;
        console.log('Onboarding: Company logo uploaded successfully. URL:', logoUrl);
      }

      // 2. Upsert company data (including logo URL) to public.companies
      console.log('Onboarding: Attempting to upsert company data for user ID:', user.id);
      const { data: companyData, error: companyUpsertError } = await supabase
        .from('companies')
        .upsert(
          {
            user_id: user.id,
            name: companyName,
            industry: industry, // Include industry
            description: description,
            logo_url: logoUrl, // Include logo URL
          },
          { onConflict: 'user_id' } // Update if user_id already exists
        )
        .select(); // Select the inserted/updated row to confirm

      if (companyUpsertError) {
        console.error('Onboarding: CRITICAL ERROR upserting company profile:', companyUpsertError.message, companyUpsertError);
        setError(`Failed to save company profile: ${companyUpsertError.message}`);
        setLoading(false);
        return;
      }

      console.log('Onboarding: Company profile saved successfully:', companyData);
      toast.success('Company profile saved successfully!');
      router.push('/dashboard'); // Redirect to dashboard after successful onboarding

    } catch (err: unknown) {
      console.error('Onboarding: An unexpected error occurred during onboarding:', err instanceof Error ? err.message : err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Complete Your Company Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tell us about your company to get started with TenderHub.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>
              Provide the essential information about your organization.
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
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Acme Corp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Technology, Construction, Healthcare"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of your company"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyLogo">Company Logo</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="companyLogo"
                    name="companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="flex-grow"
                  />
                  {logoPreviewUrl && (
                    <img
                      src={logoPreviewUrl}
                      alt="Logo Preview"
                      className="w-20 h-20 object-contain rounded-md border border-gray-200"
                    />
                  )}
                  {!logoPreviewUrl && (
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-400">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">Upload your company&apos;s logo (Max 5MB)</p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Saving Profile...' : 'Save Company Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
