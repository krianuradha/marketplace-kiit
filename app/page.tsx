'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Zap, Lock, MessageCircle } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        const section = data.user.gender === 'F' ? 'queens-castle' : 'kings-castle';
        router.push(`/${section}`);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            Hostel Marketplace
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A safe and secure community for hostel residents to buy and sell items within their hostel
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/signup">Get Started</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/login">Login</a>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <div className="mb-2">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Safe & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gender-based sections ensure privacy and safety within your community
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Easy Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create listings in minutes with photos, prices, and detailed descriptions
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Direct Messaging</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Chat directly with buyers and sellers to negotiate and finalize deals
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with your hostel community and build trust through transactions
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Sections Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-primary" />
                <CardTitle>Queen&apos;s Castle</CardTitle>
              </div>
              <CardDescription>For girls hostel residents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                A dedicated marketplace exclusively for hostel girls to buy and sell items safely within their community.
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="/signup">Join Queen&apos;s Castle</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-secondary" />
                <CardTitle>King Palace</CardTitle>
              </div>
              <CardDescription>For boys hostel residents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                A dedicated marketplace exclusively for hostel boys to buy and sell items safely within their community.
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="/signup">Join King Palace</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
