'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Menu, Plus, LogOut, Home } from 'lucide-react';

interface User {
  userId: string;
  email: string;
  name: string;
  gender: string;
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const userSection = user?.gender === 'F' ? 'queens-castle' : 'kings-castle';

  return (
    <nav className="neomorph-outset sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href={user ? `/${userSection}` : '/login'} className="flex items-center gap-2 font-bold text-lg hover:opacity-90 transition-opacity">
            <Home className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden sm:inline">Marketplace</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {!isLoading && user && (
            <>
              <Button asChild variant="default" size="sm" className="neomorph-button hidden sm:flex">
                <Link href="/create-product">
                  <Plus className="w-4 h-4 mr-2" />
                  Sell
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="neomorph-button md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="neomorph-card">
                  <DropdownMenuItem>
                    <Link href="/create-product" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Sell Item
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/${userSection}`}>
                      {user.gender === 'F' ? "Queen's Castle" : "King Palace"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/chat">My Chats</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full text-destructive">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="neomorph-button hidden md:flex">
                    <Menu className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="neomorph-card">
                  <DropdownMenuItem>
                    <Link href={`/${userSection}`}>
                      {user.gender === 'F' ? "Queen's Castle" : "King Palace"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/chat">My Chats</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full text-destructive">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!isLoading && !user && (
            <div className="flex gap-2">
              <Button asChild variant="default" size="sm" className="neomorph-button hidden sm:flex">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="neomorph-button hidden sm:flex">
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button asChild variant="default" size="sm" className="neomorph-button sm:hidden">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
