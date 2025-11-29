import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PhotographerVerifyStepProps {
  phone: string;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PhotographerVerifyStep({ 
  phone,
  verificationCode, 
  setVerificationCode, 
  onSubmit, 
  onCancel 
}: PhotographerVerifyStepProps) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Подтверждение телефона</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <p className="text-sm text-muted-foreground">
          SMS-код отправлен на номер <span className="font-semibold">{phone}</span>
        </p>
        <div>
          <Label htmlFor="code">
            Код подтверждения <span className="text-destructive">*</span>
          </Label>
          <Input
            id="code"
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
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button 
            onClick={onSubmit}
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
          >
            Подтвердить
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
