import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import RegistrationProgressBar from './RegistrationProgressBar';

interface RegistrationVerifyStepProps {
  phone: string;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function RegistrationVerifyStep({ 
  phone,
  verificationCode, 
  setVerificationCode, 
  onSubmit, 
  onCancel 
}: RegistrationVerifyStepProps) {
  return (
    <DialogContent className="animate-scale-in max-w-md">
      <RegistrationProgressBar currentStep="verify" />
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center gap-2">
          <Icon name="ShieldCheck" size={24} />
          Подтверждение телефона
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Мы отправили код на номер <strong>{phone}</strong>
        </p>
        <div>
          <Label htmlFor="verify-code">Код подтверждения <span className="text-destructive">*</span></Label>
          <Input
            id="verify-code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Введите код из SMS"
            maxLength={4}
            className="text-center text-2xl tracking-widest"
          />
          <p className="text-xs text-muted-foreground mt-2">
            💡 Для теста используйте код: <strong>1234</strong>
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button onClick={onSubmit} className="bg-gradient-to-r from-primary to-secondary">
          Подтвердить
          <Icon name="Check" size={16} className="ml-2" />
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}