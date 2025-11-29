import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import RegistrationProgressBar from './RegistrationProgressBar';
import PhotoGallery from './PhotoGallery';

interface Photo {
  id: string;
  url: string;
  file: File;
}

interface RegistrationData {
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
  profileId?: number;
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

interface RegistrationProfileStepProps {
  formData: RegistrationData;
  setFormData: (data: any) => void;
  toggleStyle: (style: string) => void;
  photos: Photo[];
  coverPhotoId: string | null;
  onPhotosChange: (photos: Photo[]) => void;
  onCoverPhotoChange: (photoId: string | null) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function RegistrationProfileStep({ 
  formData, 
  setFormData, 
  toggleStyle,
  photos,
  coverPhotoId,
  onPhotosChange,
  onCoverPhotoChange,
  onSubmit, 
  onCancel 
}: RegistrationProfileStepProps) {
  return (
    <DialogContent className="animate-scale-in max-w-4xl max-h-[90vh]">
      <RegistrationProgressBar currentStep="profile" />
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center gap-2">
          <Icon name="FileEdit" size={24} />
          Редактор анкеты
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
        <div className="space-y-6">
          <div className="border-b pb-4">
            <PhotoGallery
              photos={photos}
              coverPhotoId={coverPhotoId}
              onPhotosChange={onPhotosChange}
              onCoverPhotoChange={onCoverPhotoChange}
            />
          </div>

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
                {formData.profileId && (
                  <p className="text-xs text-muted-foreground mt-1">ID: {formData.profileId}</p>
                )}
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
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button onClick={onSubmit} className="bg-gradient-to-r from-primary to-secondary">
          <Icon name="Save" size={16} className="mr-2" />
          Сохранить анкету
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}