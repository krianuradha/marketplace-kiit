'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface Chat {
  id: string;
  product: {
    id: string;
    title: string;
    imageUrl?: string;
    price: number;
  };
  otherUser: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function ChatsPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Chats</h1>
          <p className="text-muted-foreground">Manage your conversations with buyers and sellers</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <p className="text-muted-foreground">Loading chats...</p>
          </div>
        ) : chats.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No chats yet</p>
              <p className="text-sm text-muted-foreground mb-6">
                Start by browsing products and messaging sellers
              </p>
              <Button asChild>
                <Link href="/queens-castle">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {chats.map(chat => (
              <Link key={chat.id} href={`/chat/${chat.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="flex items-center gap-4 pt-6">
                    {chat.product.imageUrl && (
                      <img
                        src={chat.product.imageUrl}
                        alt={chat.product.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{chat.product.title}</h3>
                      <p className="text-sm text-muted-foreground">with {chat.otherUser.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        ₹{(chat.product.price / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
