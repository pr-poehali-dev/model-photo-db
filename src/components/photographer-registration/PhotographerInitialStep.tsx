import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PhotographerData {
  login: string;
  password: string;
  phone: string;
  name: string;
  birthDate: string;
  email: string;
  city: string;
  specialization: string[];
  experience: string;
  equipment: string;
  workingFormats: string[];
  priceRange: string;
  portfolio: string;
  instagram: string;
  additionalInfo: string;
}

interface PhotographerInitialStepProps {
  formData: PhotographerData;
  setFormData: (data: PhotographerData | ((prev: PhotographerData) => PhotographerData)) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PhotographerInitialStep({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel 
}: PhotographerInitialStepProps) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Регистрация фотографа</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <div>
          <Label htmlFor="login">
            Логин <span className="text-destructive">*</span>
          </Label>
          <Input
            id="login"
            value={formData.login}
            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
            placeholder="Введите логин"
          />
        </div>
        <div>
          <Label htmlFor="password">
            Пароль <span className="text-destructive">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Введите пароль"
          />
        </div>
        <div>
          <Label htmlFor="phone">
            Телефон <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+7 (999) 123-45-67"
          />
        </div>
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
            Ok
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
