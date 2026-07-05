'use client';

import { useEffect, useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Rating {
  id: string;
  rating: number;
  review: string | null;
  buyer_name: string;
  avatar_url: string | null;
  product_title: string;
  created_at: string;
}

interface SellerProfileProps {
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
}

export default function SellerProfile({
  sellerId,
  sellerName,
  sellerAvatar,
}: SellerProfileProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState({ averageRating: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`/api/ratings?sellerId=${sellerId}`);
        if (!response.ok) throw new Error('Failed to fetch ratings');
        const data = await response.json();
        setRatings(data.ratings);
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [sellerId]);

  const getTrustBadge = (rating: number) => {
    if (rating >= 4.5) return { text: 'Highly Trusted', color: 'bg-green-100 text-green-800' };
    if (rating >= 4) return { text: 'Trusted', color: 'bg-blue-100 text-blue-800' };
    if (rating >= 3) return { text: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'New Seller', color: 'bg-gray-100 text-gray-800' };
  };

  const trustBadge = getTrustBadge(stats.averageRating);

  return (
    <Card className="neomorph-card w-full">
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={sellerAvatar} alt={sellerName} />
            <AvatarFallback>{sellerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle>{sellerName}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(stats.averageRating)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">
                {stats.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({stats.totalRatings} {stats.totalRatings === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <Badge className={`mt-2 ${trustBadge.color}`}>
              {trustBadge.text}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {!loading && ratings.length > 0 && (
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold">Recent Reviews</h3>
            {ratings.slice(0, 5).map((rating) => (
              <div key={rating.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={rating.avatar_url || undefined} />
                    <AvatarFallback>{rating.buyer_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{rating.buyer_name}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 my-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rating.rating
                                ? 'fill-primary text-primary'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        for {rating.product_title}
                      </span>
                    </div>
                    {rating.review && (
                      <p className="text-sm text-muted-foreground mt-1">{rating.review}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}

      {!loading && ratings.length === 0 && (
        <CardContent>
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No reviews yet</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
