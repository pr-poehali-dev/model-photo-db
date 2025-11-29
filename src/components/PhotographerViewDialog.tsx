import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ReviewSection from './reviews/ReviewSection';

interface Photographer {
  id: number;
  name: string;
  city: string;
  style: string;
  coverImage: string;
  email?: string;
  specialization?: string[];
  experience?: string;
  equipment?: string;
  workingFormats?: string[];
  priceFrom?: string;
  portfolio?: string;
  instagram?: string;
  additionalInfo?: string;
  images?: string[];
  profilePhoto?: string;
}

interface PhotographerViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  photographer: Photographer | null;
  allPhotographers: Photographer[];
  onNavigate: (direction: 'prev' | 'next') => void;
}

export default function PhotographerViewDialog({ 
  isOpen, 
  onClose, 
  photographer, 
  allPhotographers,
  onNavigate 
}: PhotographerViewDialogProps) {
  const [reviews, setReviews] = useState<Array<{ id: number; name: string; phone: string; text: string; rating: number; date: string }>>([]);

  if (!photographer) return null;

  const currentIndex = allPhotographers.findIndex(p => p.id === photographer.id);
  const photographerNumber = currentIndex + 1;
  const totalPhotographers = allPhotographers.length;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalPhotographers - 1;

  const handlePrev = () => {
    if (canGoPrev) onNavigate('prev');
  };

  const handleNext = () => {
    if (canGoNext) onNavigate('next');
  };

  const handleAddReview = (review: { name: string; phone: string; text: string; rating: number }) => {
    const newReview = {
      id: Date.now(),
      ...review,
      date: new Date().toLocaleDateString('ru-RU')
    };
    setReviews([...reviews, newReview]);
  };

  const displayImages = photographer.images || [photographer.coverImage];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                disabled={!canGoPrev}
                className="flex-shrink-0"
              >
                <Icon name="ChevronLeft" size={24} />
              </Button>
              
              <div className="flex-1 text-center">
                <h2 className="text-3xl font-bold">{photographer.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">ID: {photographer.id}</p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                disabled={!canGoNext}
                className="flex-shrink-0"
              >
                <Icon name="ChevronRight" size={24} />
              </Button>
            </div>

            <div className="text-muted-foreground text-center text-sm">
              Анкета {photographerNumber} из {totalPhotographers}
            </div>

            {photographer.profilePhoto && (
              <div className="flex justify-center">
                <img 
                  src={photographer.profilePhoto} 
                  alt={photographer.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Город:</span> {photographer.city}
              </div>
              
              {photographer.email && (
                <div>
                  <span className="font-semibold">Email:</span> {photographer.email}
                </div>
              )}

              {photographer.specialization && photographer.specialization.length > 0 && (
                <div>
                  <span className="font-semibold">Специализация:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {photographer.specialization.map(spec => (
                      <Badge key={spec} variant="secondary">{spec}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {photographer.experience && (
                <div>
                  <span className="font-semibold">Опыт работы:</span>
                  <p className="mt-1">{photographer.experience}</p>
                </div>
              )}

              {photographer.equipment && (
                <div>
                  <span className="font-semibold">Оборудование:</span>
                  <p className="mt-1">{photographer.equipment}</p>
                </div>
              )}

              {photographer.workingFormats && photographer.workingFormats.length > 0 && (
                <div>
                  <span className="font-semibold">Форматы работы:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {photographer.workingFormats.map(format => (
                      <Badge key={format} variant="outline">{format}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {photographer.priceFrom && (
                <div>
                  <span className="font-semibold">Цена от:</span> {photographer.priceFrom}
                </div>
              )}

              {photographer.portfolio && (
                <div>
                  <span className="font-semibold">Портфолио:</span>{' '}
                  <a href={photographer.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {photographer.portfolio}
                  </a>
                </div>
              )}

              {photographer.instagram && (
                <div>
                  <span className="font-semibold">Instagram:</span>{' '}
                  <a href={`https://instagram.com/${photographer.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {photographer.instagram}
                  </a>
                </div>
              )}

              {photographer.additionalInfo && (
                <div>
                  <span className="font-semibold">Дополнительная информация:</span>
                  <p className="mt-1">{photographer.additionalInfo}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {displayImages.map((image, index) => (
                <div 
                  key={index}
                  className="aspect-[3/4] rounded-lg overflow-hidden bg-muted"
                >
                  <img
                    src={image}
                    alt={`${photographer.name} - работа ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="border-t pt-6 mt-6">
              <ReviewSection reviews={reviews} onAddReview={handleAddReview} />
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={onClose} className="min-w-32">
                Ок
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
