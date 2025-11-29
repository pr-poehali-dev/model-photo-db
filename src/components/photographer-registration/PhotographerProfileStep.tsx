import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Photo {
  id: string;
  url: string;
  file: File;
}

interface PhotographerData {
  login: string;
  password: string;
  phone: string;
  name: string;
  email: string;
  city: string;
  specialization: string[];
  experience: string;
  equipment: string;
  workingFormats: string[];
  priceFrom: string;
  portfolio: string;
  instagram: string;
  additionalInfo: string;
  profileId?: number;
  profilePhoto?: string;
}

interface PhotographerProfileStepProps {
  formData: PhotographerData;
  setFormData: (data: PhotographerData | ((prev: PhotographerData) => PhotographerData)) => void;
  toggleSpecialization: (spec: string) => void;
  toggleWorkingFormat: (format: string) => void;
  photos: Photo[];
  coverPhotoId: string | null;
  onPhotosChange: (photos: Photo[]) => void;
  onCoverPhotoChange: (id: string | null) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const specializationOptions = [
  'Свадьба',
  'Портреты', 
  'Портреты семейные',
  'Портреты детские',
  'Портреты деловые',
  'Реклама и глянец',
  'Предметная съёмка',
  'Фешн-фотография',
  'Репортаж',
  'Пейзаж',
  'Стрит-фотограф',
  'Фуд-фотограф',
  'Аэрофотограф (в т.ч. с дрона)',
  'Архитектура',
  'Криминалист',
  'Спорт',
  'Тревел-фотография'
];

const workingFormatOptions = ['TFP', 'Платные съёмки', 'Обмен услугами'];

const cities = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 
  'Казань', 'Нижний Новгород', 'Хабаровск', 'Владивосток'
];

export default function PhotographerProfileStep({
  formData,
  setFormData,
  toggleSpecialization,
  toggleWorkingFormat,
  photos,
  coverPhotoId,
  onPhotosChange,
  onCoverPhotoChange,
  onSubmit,
  onCancel
}: PhotographerProfileStepProps) {
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setFormData({ ...formData, profilePhoto: url });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const totalPhotos = photos.length + files.length;
    if (totalPhotos > 40) {
      alert(`Можно загрузить максимум 40 фотографий`);
      return;
    }

    const newPhotos: Photo[] = Array.from(files).slice(0, 40 - photos.length).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file
    }));

    onPhotosChange([...photos, ...newPhotos]);
    
    if (photos.length === 0 && newPhotos.length > 0) {
      onCoverPhotoChange(newPhotos[0].id);
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    onPhotosChange(photos.filter(p => p.id !== photoId));
    if (coverPhotoId === photoId) {
      onCoverPhotoChange(photos.length > 1 ? photos[0].id : null);
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] p-0">
      <ScrollArea className="max-h-[90vh]">
        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle>Редактор анкеты фотографа</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Label>Фото фотографа</Label>
                <div 
                  className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-accent/50 transition mt-2"
                  onClick={() => document.getElementById('profile-photo-upload')?.click()}
                >
                  {formData.profilePhoto ? (
                    <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Icon name="User" size={48} className="text-muted-foreground" />
                  )}
                </div>
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhotoUpload}
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="name">
                    Имя и фамилия <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Александр Петров"
                  />
                  {formData.profileId && (
                    <p className="text-xs text-muted-foreground mt-1">ID: {formData.profileId}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@mail.com"
                />
              </div>
              <div>
                <Label htmlFor="city">
                  Город <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                  <SelectTrigger id="city">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>
                Специализация <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {specializationOptions.map(spec => (
                  <Badge
                    key={spec}
                    variant={formData.specialization.includes(spec) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleSpecialization(spec)}
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="experience">Опыт работы</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Опишите ваш опыт работы"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="equipment">Оборудование</Label>
              <Textarea
                id="equipment"
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                placeholder="Canon 5D Mark IV, Sony A7III..."
                rows={2}
              />
            </div>

            <div>
              <Label>Форматы работы</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {workingFormatOptions.map(format => (
                  <Badge
                    key={format}
                    variant={formData.workingFormats.includes(format) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleWorkingFormat(format)}
                  >
                    {format}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="priceFrom">Цена от</Label>
              <Input
                id="priceFrom"
                value={formData.priceFrom}
                onChange={(e) => setFormData({ ...formData, priceFrom: e.target.value })}
                placeholder="5000 ₽"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="portfolio">Ссылка на портфолио</Label>
                <Input
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@username"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="additionalInfo">Дополнительная информация</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                placeholder="Любая дополнительная информация о вас"
                rows={3}
              />
            </div>

            <div>
              <Label>Фотографии работ (макс. 40 шт.)</Label>
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  disabled={photos.length >= 40}
                >
                  <Icon name="Upload" size={18} className="mr-2" />
                  Загрузить фотографии ({photos.length}/40)
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
              
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {photos.map(photo => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => onCoverPhotoChange(photo.id)}
                        >
                          <Icon name={coverPhotoId === photo.id ? 'Star' : 'StarOff'} size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleRemovePhoto(photo.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
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
                Сохранить анкету
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  );
}