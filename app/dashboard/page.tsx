'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  FileText,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Plus,
  Eye,
  Calendar,
  Loader2 // Added Loader2 for loading state
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Define interfaces for data structures
interface Company {
  id: string;
  name: string;
  industry: string;
  logo_url: string | null;
}

interface Tender {
  id: string;
  title: string;
  description: string;
  deadline: string;
  budget: number | null;
  status: 'open' | 'closed' | 'awarded'; // Use specific literal types for status
  created_at: string;
  applications: { count: number }[]; // Supabase count aggregate
}

interface Application {
  id: string;
  proposal_text: string;
  proposed_budget: number | null;
  status: 'pending' | 'accepted' | 'rejected'; // Use specific literal types for status
  created_at: string;
  tender: {
    title: string;
    company: {
      name: string;
    };
  };
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth(); // Destructure signOut
  const router = useRouter(); // Initialize useRouter
  const [company, setCompany] = useState<Company | null>(null);
  const [tenders, ] = useState<Tender[]>([]);
  const [applications, ] = useState<Application[]>([]);
  const [stats, ] = useState({
    totalTenders: 0,
    activeTenders: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [dataLoading, setDataLoading] = useState(true); // State for data fetching specific to this component

  useEffect(() => {
    if (!authLoading && !user) {
      console.log('Dashboard: User not authenticated, redirecting to signin.');
      router.push('/auth/signin');
      return; // Return null or a loading indicator immediately
    }

    if (user) {
      const fetchCompanyProfile = async () => {
        setDataLoading(true); // Use setDataLoading instead of setLoadingProfile
        try {
          console.log('Dashboard: Attempting to fetch company profile for user ID:', user.id);
          const { data, error: fetchError } = await supabase
            .from('companies')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Dashboard: Error fetching company profile:', fetchError.message, fetchError);
            toast.error(`Failed to load company profile: ${fetchError.message}`);
            setCompany(null);
            router.push('/onboarding');
            return;
          }

          if (data) {
            console.log('Dashboard: Company profile fetched successfully:', data);
            setCompany(data);
          } else {
            console.log('Dashboard: No company profile found for user. Redirecting to onboarding.');
            setCompany(null);
            router.push('/onboarding');
            return;
          }
        } catch (err) {
          console.error('Dashboard: An unexpected error occurred while fetching profile:', err);
          toast.error('An unexpected error occurred while loading your profile.');
          setCompany(null);
          router.push('/onboarding');
          return;
        } finally {
          setDataLoading(false); // Data loading is complete
        }
      };

      fetchCompanyProfile();
    }
  }, [user, authLoading, router]); // Depend on user, authLoading, and router

  // const handleSignOut = async () => {
  //   await signOut();
  //   router.push('/auth/signin');
  // };

  // Show loading spinner while authentication or data is loading
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center flex-col">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  // If user is logged in but no company profile exists, prompt for onboarding
  // This check should happen AFTER dataLoading is false and company state is determined
  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-600 mb-6">
            Set up your company profile to start using TenderHub.
          </p>
          <Button asChild>
            <Link href="/onboarding">Complete Setup</Link>
          </Button>
        </div>
      </div>
    );
  }

  // If company profile exists, render the full dashboard
  const statCards = [
    {
      title: 'Total Tenders',
      value: stats.totalTenders,
      description: 'Tenders posted',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Active Tenders',
      value: stats.activeTenders,
      description: 'Currently open',
      icon: Clock,
      color: 'text-green-600',
    },
    {
      title: 'Applications Sent',
      value: stats.totalApplications,
      description: 'Total applications',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Pending Responses',
      value: stats.pendingApplications,
      description: 'Awaiting response',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 rounded-full overflow-hidden">
            <AvatarImage
              src={company.logo_url || undefined}
              alt={`${company.name} Logo`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://placehold.co/64x64/E0E7FF/4F46E5?text=${company.name.charAt(0).toUpperCase()}`;
              }}
            />
            <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
              {company.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-600">{company.industry}</p>
          </div>
        </div>
        <Button asChild className="rounded-lg shadow-md">
          <Link href="/tender/create">
            <span>
              <Plus className="h-4 w-4 mr-2" />
              Post New Tender
            </span>
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title} className="rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tenders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tenders">My Tenders</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="tenders" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Tenders</h2>
            <Button variant="outline" asChild className="rounded-lg">
              <Link href="/tenders">View All</Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {tenders.length === 0 ? (
              <Card className="rounded-lg shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No tenders posted yet
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    Start by posting your first tender to find qualified suppliers.
                  </p>
                  <Button asChild className="rounded-lg">
                    <Link href="/tenders/create">Post Your First Tender</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              tenders.map((tender) => (
                <Card key={tender.id} className="rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="line-clamp-1">{tender.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {tender.description}
                        </CardDescription>
                      </div>
                      <Badge variant={tender.status === 'open' ? 'default' : 'secondary'} className="rounded-full px-3 py-1">
                        {tender.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          {format(new Date(tender.deadline), 'MMM d,PPPP')}
                        </div>
                        {tender.budget !== null && (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                            ${tender.budget.toLocaleString()}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-500" />
                          {tender.applications[0]?.count || 0} applications
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild className="rounded-lg">
                        <Link href={`/tenders/${tender.id}`}>
                          <span>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Applications</h2>
            <Button variant="outline" asChild className="rounded-lg">
              <Link href="/applications">View All</Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {applications.length === 0 ? (
              <Card className="rounded-lg shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No applications sent yet
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    Browse available tenders and submit your proposals.
                  </p>
                  <Button asChild className="rounded-lg">
                    <Link href="/tenders">Browse Tenders</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              applications.map((application) => (
                <Card key={application.id} className="rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="line-clamp-1">
                          {application.tender.title}
                        </CardTitle>
                        <CardDescription>
                          {application.tender.company.name}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          application.status === 'accepted'
                            ? 'default'
                            : application.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="rounded-full px-3 py-1"
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div>
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          Applied {format(new Date(application.created_at), 'MMM d,PPPP')}
                        </div>
                        {application.proposed_budget !== null && (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                            ${application.proposed_budget.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild className="rounded-lg">
                        <Link href={`/applications/${application.id}`}>
                          <span>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
