'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { 
  Search, FileText, Building, TrendingUp, Shield, Clock, ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();

  const features = [
    { icon: FileText, title: 'Tender Management', description: 'Create, publish, and manage tenders with ease.' },
    { icon: Search, title: 'Smart Search', description: 'Find companies by industry, services, or location.' },
    { icon: Building, title: 'Company Profiles', description: 'Showcase your business with portfolios.' },
    { icon: Shield, title: 'Secure Platform', description: 'Encrypted data and secure authentication.' },
    { icon: Clock, title: 'Real-time Updates', description: 'Instant notifications on tender updates.' },
    { icon: TrendingUp, title: 'Analytics Dashboard', description: 'Track performance metrics and insights.' },
  ];

  const stats = [
    { label: 'Active Tenders', value: '2,500+' },
    { label: 'Registered Companies', value: '15,000+' },
    { label: 'Successful Partnerships', value: '8,500+' },
    { label: 'Total Value Traded', value: '$2.4B+' },
  ];

  if (loading) return null;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center">
          <Badge className="mb-4 bg-blue-500/20 text-blue-100 border-blue-400/30">
            The Future of B2B Procurement
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Connect, Compete, <span className="text-blue-200">Collaborate</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-blue-100 mb-8">
            The leading B2B tender management platform to connect and grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                  <Link href="/auth/signup">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50" asChild>
                  <Link href="/tender">Browse Tenders</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools to streamline procurement and connect you with the right partners.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600 text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to transform your procurement?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands already using TenderHub to streamline their procurement process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
              <Link href="/auth/signup">
                 Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-200" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
