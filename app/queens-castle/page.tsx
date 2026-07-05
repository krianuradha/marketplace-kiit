'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES } from '@/lib/constants';
import Link from 'next/link';
import { Crown } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  usedTime: string;
  seller: {
    id: string;
    name: string;
    gender: string;
  };
  isSold: boolean;
  createdAt: string;
}

export default function QueensCastlePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        section: "Queen's Castle",
        sold: 'false',
      });
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-2xl sm:text-4xl font-bold text-primary">Queen&apos;s Castle</h1>
          </div>
          <p className="text-xs sm:text-base text-muted-foreground">Exclusive marketplace for hostel girls</p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 sm:mb-8 neomorph-card">
          <p className="text-xs sm:text-sm font-semibold mb-3 text-muted-foreground">Filter by Category</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
              size="sm"
              className="neomorph-button text-xs sm:text-sm h-8 sm:h-9"
            >
              All Categories
            </Button>
            {CATEGORIES.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className="neomorph-button text-xs sm:text-sm h-8 sm:h-9"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <p className="text-sm sm:text-base text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <p className="text-sm sm:text-base text-muted-foreground mb-4">No products found in this category</p>
            <Button asChild className="neomorph-button text-xs sm:text-sm">
              <Link href="/create-product">Create the first listing</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {products.map(product => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
