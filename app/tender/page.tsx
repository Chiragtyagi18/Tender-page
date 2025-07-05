'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { 
  Search,
  Calendar,
  DollarSign,
  Building2,
  Users,
  Filter,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Tender {
  id: string;
  title: string;
  description: string;
  deadline: string;
  budget: number | null;
  status: string;
  created_at: string;
  company: {
    id: string;
    name: string;
    industry: string;
    logo_url: string | null;
  };
  applications: { count: number }[];
}

const industries = [
  'All Industries',
  'Technology',
  'Construction',
  'Healthcare',
  'Manufacturing',
  'Finance',
  'Education',
  'Retail',
  'Transportation',
  'Energy',
  'Food & Beverage',
  'Consulting',
  'Other',
];

const budgetRanges = [
  'All Budgets',
  '$0 - $10,000',
  '$10,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000 - $500,000',
  '$500,000+',
];

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('All Budgets');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchTenders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tenders, searchQuery, selectedIndustry, selectedBudgetRange, sortBy]);

  const fetchTenders = async () => {
    try {
      const { data, error } = await supabase
        .from('tenders')
        .select(`
          *,
          company:companies(
            id,
            name,
            industry,
            logo_url
          ),
          applications:applications(count)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenders(data || []);
    } catch (error: any) {
      toast.error('Failed to load tenders');
      console.error('Tenders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tenders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        tender =>
          tender.title.toLowerCase().includes(query) ||
          tender.description.toLowerCase().includes(query) ||
          tender.company.name.toLowerCase().includes(query)
      );
    }

    // Industry filter
    if (selectedIndustry !== 'All Industries') {
      filtered = filtered.filter(tender => tender.company.industry === selectedIndustry);
    }

    // Budget filter
    if (selectedBudgetRange !== 'All Budgets') {
      filtered = filtered.filter(tender => {
        if (!tender.budget) return false;
        
        switch (selectedBudgetRange) {
          case '$0 - $10,000':
            return tender.budget <= 10000;
          case '$10,000 - $50,000':
            return tender.budget > 10000 && tender.budget <= 50000;
          case '$50,000 - $100,000':
            return tender.budget > 50000 && tender.budget <= 100000;
          case '$100,000 - $500,000':
            return tender.budget > 100000 && tender.budget <= 500000;
          case '$500,000+':
            return tender.budget > 500000;
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'deadline':
        filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'budget-high':
        filtered.sort((a, b) => (b.budget || 0) - (a.budget || 0));
        break;
      case 'budget-low':
        filtered.sort((a, b) => (a.budget || 0) - (b.budget || 0));
        break;
    }

    setFilteredTenders(filtered);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Tenders</h1>
        <p className="text-gray-600">
          Discover business opportunities and submit your proposals
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tenders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBudgetRange} onValueChange={setSelectedBudgetRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                {budgetRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="budget-high">Budget (High to Low)</SelectItem>
                <SelectItem value="budget-low">Budget (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {filteredTenders.length} tender{filteredTenders.length !== 1 ? 's' : ''} found
        </h2>
      </div>

      <div className="grid gap-6">
        {filteredTenders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tenders found
              </h3>
              <p className="text-gray-600 text-center">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTenders.map((tender) => {
            const daysUntilDeadline = getDaysUntilDeadline(tender.deadline);
            const isUrgent = daysUntilDeadline <= 7;
            
            return (
              <Card key={tender.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={tender.company.logo_url || ''} alt={tender.company.name} />
                        <AvatarFallback>
                          {tender.company.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="line-clamp-1 mb-1">{tender.title}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span>{tender.company.name}</span>
                          <Badge variant="outline">{tender.company.industry}</Badge>
                        </div>
                      </div>
                    </div>
                    {isUrgent && (
                      <Badge variant="destructive" className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {tender.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className={isUrgent ? 'text-red-600 font-medium' : ''}>
                          {format(new Date(tender.deadline), 'MMM d, yyyy')}
                        </span>
                      </div>
                      {tender.budget && (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${tender.budget.toLocaleString()}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {tender.applications[0]?.count || 0} applications
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/tender/${tender.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}