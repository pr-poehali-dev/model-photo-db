import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import StarRating from './StarRating';

type ReviewStep = 'form' | 'verify';

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { name: string; phone: string; text: string; rating: number }) => void;
}

export default function ReviewDialog({ isOpen, onClose, onSubmit }: ReviewDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<ReviewStep>('form');
  const [reviewData, setReviewData] = useState({ name: '', phone: '', text: '', rating: 5 });
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode] = useState('1234');

  const handleFormSubmit = () => {
    if (!reviewData.name || !reviewData.phone || !reviewData.text || reviewData.rating === 0) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'SMS отправлен',
      description: `Код подтверждения отправлен на номер ${reviewData.phone}`,
    });
    
    setStep('verify');
  };

  const handleVerifySubmit = () => {
    if (verificationCode !== sentCode) {
      toast({
        title: 'Ошибка',
        description: 'Неверный код подтверждения',
        variant: 'destructive'
      });
      return;
    }

    onSubmit(reviewData);
    
    toast({
      title: 'Отзыв опубликован',
      description: 'Спасибо за ваш отзыв!',
    });

    handleClose();
  };

  const handleClose = () => {
    setStep('form');
    setReviewData({ name: '', phone: '', text: '', rating: 5 });
    setVerificationCode('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {step === 'form' ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить отзыв</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="review-name">Ваше имя</Label>
              <Input
                id="review-name"
                value={reviewData.name}
                onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                placeholder="Александр"
              />
            </div>
            <div>
              <Label htmlFor="review-phone">Телефон</Label>
              <Input
                id="review-phone"
                value={reviewData.phone}
                onChange={(e) => setReviewData({ ...reviewData, phone: e.target.value })}
                placeholder="+7 900 123 45 67"
              />
            </div>
            <div>
              <Label htmlFor="review-text">Отзыв</Label>
              <Textarea
                id="review-text"
                value={reviewData.text}
                onChange={(e) => setReviewData({ ...reviewData, text: e.target.value })}
                placeholder="Напишите ваш отзыв..."
                rows={4}
              />
            </div>
            <div>
              <Label>Рейтинг</Label>
              <div className="mt-2">
                <StarRating
                  rating={reviewData.rating}
                  onRatingChange={(rating) => setReviewData({ ...reviewData, rating })}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Отмена
              </Button>
              <Button onClick={handleFormSubmit} className="flex-1 bg-gradient-to-r from-primary to-secondary">
                Далее
              </Button>
            </div>
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Подтверждение телефона</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              SMS-код отправлен на номер <span className="font-semibold">{reviewData.phone}</span>
            </p>
            <div>
              <Label htmlFor="verify-code">Код подтверждения</Label>
              <Input
                id="verify-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Введите код из SMS"
                maxLength={4}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Для тестирования используйте код: 1234
            </p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Отмена
              </Button>
              <Button onClick={handleVerifySubmit} className="flex-1 bg-gradient-to-r from-primary to-secondary">
                Подтвердить
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}