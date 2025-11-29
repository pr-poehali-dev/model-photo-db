import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import ReviewSection from './reviews/ReviewSection';

interface Model {
  id: number;
  name: string;
  age: number;
  city: string;
  height: string;
  images: string[];
  phone?: string;
  cooperationFormat?: string;
  rate?: string;
  sensitivityLevel?: string;
  hairLength?: string;
  styles?: string[];
  experience?: string;
  messenger?: string;
  portfolio?: string;
  instagram?: string;
  physicalFeatures?: string;
  sensitiveTopics?: string;
}

interface ModelViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  model: Model | null;
  allModels: Model[];
  onNavigate: (direction: 'prev' | 'next') => void;
}

export default function ModelViewDialog({ 
  isOpen, 
  onClose, 
  model, 
  allModels,
  onNavigate 
}: ModelViewDialogProps) {
  const [reviews, setReviews] = useState<Array<{ id: number; name: string; phone: string; text: string; date: string }>>([]);

  if (!model) return null;

  const currentIndex = allModels.findIndex(m => m.id === model.id);
  const modelNumber = currentIndex + 1;
  const totalModels = allModels.length;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalModels - 1;

  const handlePrev = () => {
    if (canGoPrev) onNavigate('prev');
  };

  const handleNext = () => {
    if (canGoNext) onNavigate('next');
  };

  const handleAddReview = (review: { name: string; phone: string; text: string }) => {
    const newReview = {
      id: Date.now(),
      ...review,
      date: new Date().toLocaleDateString('ru-RU')
    };
    setReviews([...reviews, newReview]);
  };

  const cooperationFormatText = model.cooperationFormat === 'tfp' ? 'TFP' : 
                                 model.cooperationFormat === 'paid' ? 'Платно' : '';

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
                <h2 className="text-3xl font-bold">{model.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">ID: {model.id}</p>
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
              Анкета {modelNumber} из {totalModels}
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Возраст:</span> {model.age} {getAgeWord(model.age)}
              </div>
              
              <div>
                <span className="font-semibold">Город:</span> {model.city}
              </div>
              
              {model.height && (
                <div>
                  <span className="font-semibold">Рост:</span> {model.height} см
                </div>
              )}
              
              {model.phone && (
                <div>
                  <span className="font-semibold">Телефон:</span> {model.phone}
                </div>
              )}
              
              {cooperationFormatText && (
                <div>
                  <span className="font-semibold">Формат сотрудничества:</span> {cooperationFormatText}
                </div>
              )}
              
              {model.rate && (
                <div>
                  <span className="font-semibold">Ставка:</span> {model.rate} ₽
                </div>
              )}
              
              {model.sensitivityLevel && (
                <div>
                  <span className="font-semibold">Уровень откровенности:</span> {model.sensitivityLevel}
                </div>
              )}
              
              {model.hairLength && (
                <div>
                  <span className="font-semibold">Длина волос:</span> {model.hairLength}
                </div>
              )}
              
              {model.styles && model.styles.length > 0 && (
                <div>
                  <span className="font-semibold">Стили:</span> {model.styles.join(', ')}
                </div>
              )}
              
              {model.experience && (
                <div>
                  <span className="font-semibold">Опыт работы:</span> {model.experience}
                </div>
              )}
              
              {model.messenger && (
                <div>
                  <span className="font-semibold">Мессенджер:</span> {model.messenger}
                </div>
              )}
              
              {model.portfolio && (
                <div>
                  <span className="font-semibold">Портфолио:</span>{' '}
                  <a 
                    href={model.portfolio} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {model.portfolio}
                  </a>
                </div>
              )}
              
              {model.instagram && (
                <div>
                  <span className="font-semibold">Instagram:</span>{' '}
                  <a 
                    href={`https://instagram.com/${model.instagram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {model.instagram}
                  </a>
                </div>
              )}
              
              {model.physicalFeatures && (
                <div>
                  <span className="font-semibold">Физические особенности:</span> {model.physicalFeatures}
                </div>
              )}
              
              {model.sensitiveTopics && (
                <div>
                  <span className="font-semibold">Деликатные темы:</span> {model.sensitiveTopics}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {model.images.map((image, index) => (
                <div 
                  key={index}
                  className="aspect-[3/4] rounded-lg overflow-hidden bg-muted"
                >
                  <img
                    src={image}
                    alt={`${model.name} - фото ${index + 1}`}
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

function getAgeWord(age: number): string {
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'лет';
  }
  
  if (lastDigit === 1) return 'год';
  if (lastDigit >= 2 && lastDigit <= 4) return 'года';
  return 'лет';
}