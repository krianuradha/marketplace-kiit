import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface ProductCardProps {
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
  isSold?: boolean;
}

export function ProductCard({
  id,
  title,
  description,
  price,
  category,
  imageUrl,
  usedTime,
  seller,
  isSold = false,
}: ProductCardProps) {
  const priceInRupees = (price / 100).toFixed(2);

  return (
    <Card className="neomorph-card overflow-hidden hover:shadow-[3px_3px_8px_rgba(0,0,0,0.08),-3px_-3px_8px_rgba(255,255,255,0.8)] dark:hover:shadow-[3px_3px_8px_rgba(0,0,0,0.6),-3px_-3px_8px_rgba(255,255,255,0.1)] transition-all duration-300 flex flex-col h-full">
      <div className="relative w-full h-40 sm:h-48 bg-muted overflow-hidden rounded-t-lg">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        {isSold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg">
              Sold
            </Badge>
          </div>
        )}
        <Badge className="absolute top-2 right-2" variant="secondary">
          {category}
        </Badge>
      </div>

      <CardContent className="pt-3 sm:pt-4 flex-1 flex flex-col">
        <Link href={`/products/${id}`}>
          <h3 className="font-semibold text-sm sm:text-lg hover:text-primary line-clamp-1 transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
          {description}
        </p>
        <div className="flex items-center justify-between mt-3 mt-auto">
          <div>
            <p className="text-lg sm:text-xl font-bold text-primary">₹{priceInRupees}</p>
            <p className="text-xs text-muted-foreground">{usedTime}</p>
          </div>
          <Link href={`/seller/${seller.id}`}>
            <Badge variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
              {seller.name}
            </Badge>
          </Link>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Link href={`/products/${id}`} className="w-full">
          <Button 
            variant="outline" 
            className="w-full neomorph-button text-xs sm:text-sm" 
            disabled={isSold}
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            {isSold ? 'Sold' : 'View & Chat'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
