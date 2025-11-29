import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ReviewDialog from './ReviewDialog';
import StarRating from './StarRating';

interface Review {
  id: number;
  name: string;
  phone: string;
  text: string;
  rating: number;
  date: string;
}

interface ReviewSectionProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

export default function ReviewSection({ reviews, onAddReview }: ReviewSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Icon name="MessageSquare" size={20} />
          Отзывы ({reviews.length})
        </h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить отзыв
        </Button>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Пока нет отзывов. Будьте первым!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.phone}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
                <div className="mt-2 mb-2">
                  <StarRating rating={review.rating} readonly size={16} />
                </div>
                <p className="text-sm mt-2">{review.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ReviewDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={onAddReview}
      />
    </div>
  );
}