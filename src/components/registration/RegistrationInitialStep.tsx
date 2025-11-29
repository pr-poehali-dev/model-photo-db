import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface RegistrationData {
  login: string;
  password: string;
  phone: string;
}

interface RegistrationInitialStepProps {
  formData: RegistrationData;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function RegistrationInitialStep({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel 
}: RegistrationInitialStepProps) {
  return (
    <DialogContent className="animate-scale-in max-w-md">
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center gap-2">
          <Icon name="UserPlus" size={24} />
          Регистрация анкеты
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="reg-login">Логин <span className="text-destructive">*</span></Label>
          <Input
            id="reg-login"
            value={formData.login}
            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
            placeholder="Введите логин"
          />
        </div>
        <div>
          <Label htmlFor="reg-password">Пароль <span className="text-destructive">*</span></Label>
          <Input
            id="reg-password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Введите пароль"
          />
        </div>
        <div>
          <Label htmlFor="reg-phone">Телефон <span className="text-destructive">*</span></Label>
          <Input
            id="reg-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+7 (___) ___-__-__"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button onClick={onSubmit} className="bg-gradient-to-r from-primary to-secondary">
          Продолжить
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
