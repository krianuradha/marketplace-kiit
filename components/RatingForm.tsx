'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RatingFormProps {
  sellerId: string;
  buyerId: string;
  productId: string;
  productTitle: string;
  onSuccess?: () => void;
}

export default function RatingForm({
  sellerId,
  buyerId,
  productId,
  productTitle,
  onSuccess,
}: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setMessage('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId,
          buyerId,
          productId,
          rating,
          review: review || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit rating');

      setMessage('Rating submitted successfully!');
      setRating(0);
      setReview('');
      onSuccess?.();
    } catch (error) {
      setMessage('Error submitting rating. Please try again.');
      console.error('Rating error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="neomorph-card">
      <CardHeader>
        <CardTitle>Rate this seller</CardTitle>
        <CardDescription>Share your experience with {productTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>

          <Textarea
            placeholder="Share your feedback (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="min-h-24 neomorph-inset"
          />

          {message && (
            <p
              className={`text-sm ${
                message.includes('successfully') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full neomorph-button">
            {loading ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
