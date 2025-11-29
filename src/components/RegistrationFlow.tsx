import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

type RegistrationStep = 'initial' | 'verify' | 'profile';

interface RegistrationData {
  login: string;
  password: string;
  phone: string;
  name: string;
  birthDate: string;
  email: string;
  city: string;
  height: string;
  cooperationFormat: 'tfp' | 'paid' | '';
  rate: string;
  sensitivityLevel: string;
  hairLength: string;
  styles: string[];
  experience: string;
  messenger: string;
  portfolio: string;
  instagram: string;
  physicalFeatures: string;
  sensitiveTopics: string;
}

const cities = [
  'Абакан', 'Азов', 'Анапа', 'Архангельск', 'Астрахань', 'Барнаул', 'Белгород', 
  'Благовещенск', 'Брянск', 'Великий Новгород', 'Владивосток', 'Владимир', 
  'Волгоград', 'Вологда', 'Воронеж', 'Екатеринбург', 'Иваново', 'Ижевск', 
  'Иркутск', 'Йошкар-Ола', 'Казань', 'Калининград', 'Калуга', 'Кемерово', 
  'Киров', 'Краснодар', 'Красноярск', 'Курск', 'Липецк', 'Магадан', 'Магнитогорск', 
  'Махачкала', 'Москва', 'Мурманск', 'Набережные Челны', 'Нижний Новгород', 
  'Новокузнецк', 'Новосибирск', 'Омск', 'Оренбург', 'Орёл', 'Пенза', 'Пермь', 
  'Петрозаводск', 'Псков', 'Ростов-на-Дону', 'Рязань', 'Самара', 
  'Санкт-Петербург', 'Саранск', 'Саратов', 'Севастополь', 'Симферополь', 
  'Смоленск', 'Сочи', 'Ставрополь', 'Сургут', 'Тамбов', 'Тверь', 'Тольятти', 
  'Томск', 'Тула', 'Тюмень', 'Улан-Удэ', 'Ульяновск', 'Уфа', 'Хабаровск', 
  'Чебоксары', 'Челябинск', 'Чита', 'Южно-Сахалинск', 'Якутск', 'Ярославль'
];

const hairLengths = [
  'Без волос',
  'Ежик',
  'До ушей',
  'До середины шеи',
  'Каре',
  'До плеч',
  'По лопатки',
  'По пояс',
  'Ниже пояса'
];

const sensitivityLevels = [
  'Портрет',
  'Купальник',
  'Бельё',
  'Гламур',
  'Эротика',
  'Ню',
  'Метарт',
  'Порно'
];

const photoStyles = [
  'Fashion',
  'Portrait',
  'Street',
  'Boudoir',
  'Beauty',
  'Editorial',
  'Commercial',
  'Artistic',
  'Lifestyle',
  'Conceptual'
];

interface RegistrationFlowProps {
  open: boolean;
  onClose: () => void;
}

export default function RegistrationFlow({ open, onClose }: RegistrationFlowProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<RegistrationStep>('initial');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode] = useState('1234');
  const [formData, setFormData] = useState<RegistrationData>({
    login: '',
    password: '',
    phone: '',
    name: '',
    birthDate: '',
    email: '',
    city: 'Хабаровск',
    height: '',
    cooperationFormat: '',
    rate: '',
    sensitivityLevel: '',
    hairLength: '',
    styles: [],
    experience: '',
    messenger: '',
    portfolio: '',
    instagram: '',
    physicalFeatures: '',
    sensitiveTopics: ''
  });

  const handleInitialSubmit = () => {
    if (!formData.login || !formData.password || !formData.phone) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Код отправлен',
      description: `SMS-код отправлен на номер ${formData.phone}`,
    });
    
    setStep('verify');
  };

  const handleVerifySubmit = () => {
    if (verificationCode === sentCode) {
      toast({
        title: 'Успешно',
        description: 'Номер телефона подтверждён',
      });
      setStep('profile');
    } else {
      toast({
        title: 'Ошибка',
        description: 'Неверный код подтверждения',
        variant: 'destructive'
      });
    }
  };

  const handleProfileSubmit = () => {
    if (!formData.name || !formData.birthDate || !formData.email || 
        !formData.city || !formData.height || !formData.cooperationFormat || 
        !formData.sensitivityLevel) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    if (formData.cooperationFormat === 'paid' && !formData.rate) {
      toast({
        title: 'Ошибка',
        description: 'Укажите ставку для платного сотрудничества',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Анкета сохранена',
      description: 'Ваша анкета успешно создана!',
    });

    onClose();
    setStep('initial');
    setFormData({
      login: '',
      password: '',
      phone: '',
      name: '',
      birthDate: '',
      email: '',
      city: 'Хабаровск',
      height: '',
      cooperationFormat: '',
      rate: '',
      sensitivityLevel: '',
      hairLength: '',
      styles: [],
      experience: '',
      messenger: '',
      portfolio: '',
      instagram: '',
      physicalFeatures: '',
      sensitiveTopics: ''
    });
  };

  const handleCancel = () => {
    onClose();
    setStep('initial');
    setVerificationCode('');
  };

  const toggleStyle = (style: string) => {
    setFormData(prev => ({
      ...prev,
      styles: prev.styles.includes(style) 
        ? prev.styles.filter(s => s !== style)
        : [...prev.styles, style]
    }));
  };

  const renderInitialStep = () => (
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
        <Button variant="outline" onClick={handleCancel}>
          Отмена
        </Button>
        <Button onClick={handleInitialSubmit} className="bg-gradient-to-r from-primary to-secondary">
          Продолжить
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  const renderVerifyStep = () => (
    <DialogContent className="animate-scale-in max-w-md">
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center gap-2">
          <Icon name="ShieldCheck" size={24} />
          Подтверждение телефона
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Мы отправили код на номер <strong>{formData.phone}</strong>
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
        <Button variant="outline" onClick={handleCancel}>
          Отмена
        </Button>
        <Button onClick={handleVerifySubmit} className="bg-gradient-to-r from-primary to-secondary">
          Подтвердить
          <Icon name="Check" size={16} className="ml-2" />
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  const renderProfileStep = () => (
    <DialogContent className="animate-scale-in max-w-4xl max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center gap-2">
          <Icon name="FileEdit" size={24} />
          Редактор анкеты
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Icon name="AlertCircle" size={18} className="text-destructive" />
              Обязательные поля
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profile-name">Имя <span className="text-destructive">*</span></Label>
                <Input
                  id="profile-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ваше имя"
                />
              </div>
              
              <div>
                <Label htmlFor="profile-birthdate">
                  Дата рождения <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="profile-birthdate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  В анкете указывается только количество полных лет
                </p>
              </div>

              <div>
                <Label htmlFor="profile-email">E-mail <span className="text-destructive">*</span></Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@mail.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  В анкете не указывается. Нужен для решения технических вопросов
                </p>
              </div>

              <div>
                <Label htmlFor="profile-city">Город <span className="text-destructive">*</span></Label>
                <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                  <SelectTrigger id="profile-city">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="profile-height">Рост (см) <span className="text-destructive">*</span></Label>
                <Input
                  id="profile-height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="165"
                />
              </div>

              <div>
                <Label htmlFor="profile-sensitivity">
                  Уровень откровенности <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.sensitivityLevel} onValueChange={(value) => setFormData({ ...formData, sensitivityLevel: value })}>
                  <SelectTrigger id="profile-sensitivity">
                    <SelectValue placeholder="Выберите уровень" />
                  </SelectTrigger>
                  <SelectContent>
                    {sensitivityLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <Label>Формат сотрудничества <span className="text-destructive">*</span></Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.cooperationFormat === 'tfp' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, cooperationFormat: 'tfp', rate: '' })}
                  className="flex-1"
                >
                  TFP (Time for Print)
                </Button>
                <Button
                  type="button"
                  variant={formData.cooperationFormat === 'paid' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, cooperationFormat: 'paid' })}
                  className="flex-1"
                >
                  Платное сотрудничество
                </Button>
              </div>
              {formData.cooperationFormat === 'paid' && (
                <div className="mt-3">
                  <Label htmlFor="profile-rate">Ставка / Гонорар <span className="text-destructive">*</span></Label>
                  <Input
                    id="profile-rate"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    placeholder="Например: 5000 руб/час"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Icon name="Sparkles" size={18} className="text-primary" />
              Дополнительные поля
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profile-hair">Длина волос</Label>
                <Select value={formData.hairLength} onValueChange={(value) => setFormData({ ...formData, hairLength: value })}>
                  <SelectTrigger id="profile-hair">
                    <SelectValue placeholder="Выберите длину" />
                  </SelectTrigger>
                  <SelectContent>
                    {hairLengths.map(length => (
                      <SelectItem key={length} value={length}>{length}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="profile-messenger">Основной мессенджер</Label>
                <Input
                  id="profile-messenger"
                  value={formData.messenger}
                  onChange={(e) => setFormData({ ...formData, messenger: e.target.value })}
                  placeholder="Telegram, WhatsApp..."
                />
              </div>

              <div>
                <Label htmlFor="profile-portfolio">Ссылка на портфолио</Label>
                <Input
                  id="profile-portfolio"
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="profile-instagram">Instagram</Label>
                <Input
                  id="profile-instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Предпочитаемые образы и стили</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                {photoStyles.map(style => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={`style-${style}`}
                      checked={formData.styles.includes(style)}
                      onCheckedChange={() => toggleStyle(style)}
                    />
                    <Label
                      htmlFor={`style-${style}`}
                      className="text-sm cursor-pointer"
                    >
                      {style}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
              <div>
                <Label htmlFor="profile-experience">Опыт съёмок</Label>
                <Textarea
                  id="profile-experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Сколько снимаешься, с кем работала, удобно ли позировать без подробных указаний или нужен постоянный дирекшн"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="profile-physical">Физические особенности</Label>
                <Textarea
                  id="profile-physical"
                  value={formData.physicalFeatures}
                  onChange={(e) => setFormData({ ...formData, physicalFeatures: e.target.value })}
                  placeholder="Татуировки, шрамы, комплексы, любимые/нелюбимые ракурсы"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="profile-sensitive">Чувствительные темы</Label>
                <Textarea
                  id="profile-sensitive"
                  value={formData.sensitiveTopics}
                  onChange={(e) => setFormData({ ...formData, sensitiveTopics: e.target.value })}
                  placeholder="Некомфортные позы, эмоции, места съёмки (толпа людей, тесные пространства и т.п.)"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={handleCancel}>
          Отмена
        </Button>
        <Button onClick={handleProfileSubmit} className="bg-gradient-to-r from-primary to-secondary">
          <Icon name="Save" size={16} className="mr-2" />
          Сохранить анкету
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      {step === 'initial' && renderInitialStep()}
      {step === 'verify' && renderVerifyStep()}
      {step === 'profile' && renderProfileStep()}
    </Dialog>
  );
}
