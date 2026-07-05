'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MessageCircle, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  section: string;
  imageUrl?: string;
  usedTime: string;
  negotiable: boolean;
  isSold: boolean;
  createdAt: string;
  seller: {
    id: string;
    name: string;
    gender: string;
  };
}

interface User {
  userId: string;
  email: string;
  name: string;
  gender: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setProductId(id);
      fetchProduct(id);
      fetchUser();
    });
  }, [params]);

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      } else {
        toast.error('Product not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const handleChat = async () => {
    if (!user) {
      toast.error('Please login to chat');
      router.push('/login');
      return;
    }

    if (!product) return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          buyerId: user.userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/chat/${data.chat.id}`);
      } else {
        toast.error('Failed to start chat');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to start chat');
    }
  };

  const handleDelete = async () => {
    if (!productId) return;

    if (!confirm('Are you sure you want to delete this product?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Product deleted successfully');
        router.push(product?.section === "Queen's Castle" ? '/queens-castle' : '/kings-castle');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-96">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  const isOwner = user && user.userId === product.seller.id;
  const priceInRupees = (product.price / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={product.section === "Queen's Castle" ? '/queens-castle' : '/kings-castle'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="flex flex-col">
            <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
              {product.isSold && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg">
                    Sold
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                  <div className="flex gap-2 mb-4">
                    <Badge>{product.category}</Badge>
                    <Badge variant="outline">{product.usedTime}</Badge>
                    {product.negotiable && <Badge variant="secondary">Negotiable</Badge>}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Price</p>
                <p className="text-4xl font-bold text-primary">₹{priceInRupees}</p>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{product.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seller Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Listed by</p>
                    <p className="font-semibold">{product.seller.name}</p>
                    <Badge variant="outline">
                      {product.seller.gender === 'F' ? "Queen's Castle" : "King Palace"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-8">
              {isOwner ? (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Listing'}
                </Button>
              ) : (
                <Button
                  onClick={handleChat}
                  disabled={product.isSold}
                  className="w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {product.isSold ? 'Already Sold' : 'Message Seller'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
