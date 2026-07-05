'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import SellerProfile from '@/components/SellerProfile';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  category: string;
  isSold: boolean;
}

export default function SellerPage() {
  const params = useParams();
  const sellerId = params.id as string;
  const [seller, setSeller] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        // Fetch seller info
        const sellerRes = await fetch(`/api/users/${sellerId}`);
        if (sellerRes.ok) {
          setSeller(await sellerRes.json());
        }

        // Fetch seller's products
        const productsRes = await fetch(`/api/products?sellerId=${sellerId}&sold=false`);
        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching seller data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchSellerData();
    }
  }, [sellerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600">Seller not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SellerProfile
              sellerId={sellerId}
              sellerName={seller.name}
              sellerAvatar={seller.avatarUrl || undefined}
            />
          </div>

          <div className="lg:col-span-2">
            <Card className="neomorph-card">
              <CardHeader>
                <CardTitle>Active Listings</CardTitle>
                <CardDescription>
                  {products.length} item{products.length !== 1 ? 's' : ''} for sale
                </CardDescription>
              </CardHeader>
              <CardContent>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <Link key={product.id} href={`/products/${product.id}`}>
                        <Card className="neomorph-card hover:shadow-lg transition-shadow cursor-pointer h-full">
                          {product.imageUrl && (
                            <div className="aspect-square overflow-hidden rounded-t-lg">
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="pt-4">
                            <h3 className="font-semibold line-clamp-2">{product.title}</h3>
                            <p className="text-primary font-bold mt-2">₹{product.price}</p>
                            <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No active listings
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
