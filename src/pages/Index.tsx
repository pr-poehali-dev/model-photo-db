import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RegistrationFlow from '@/components/RegistrationFlow';
import PhotographerRegistrationFlow from '@/components/PhotographerRegistrationFlow';
import ModelViewDialog from '@/components/ModelViewDialog';
import PhotographerViewDialog from '@/components/PhotographerViewDialog';
import { Toaster } from '@/components/ui/toaster';

type UserRole = 'guest' | 'model' | 'photographer' | 'admin';
type PageType = 'models' | 'photographers';

interface Profile {
  id: number;
  name: string;
  city: string;
  style: string;
  coverImage: string;
  lastLogin: Date;
}

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

const mockModels: Profile[] = [
  { id: 1001, name: 'Анастасия Волкова', city: 'Москва', style: 'Fashion, Lifestyle', coverImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&fit=crop', lastLogin: new Date() },
  { id: 1002, name: 'Виктория Смирнова', city: 'Санкт-Петербург', style: 'Beauty, Portrait', coverImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop', lastLogin: new Date(Date.now() - 86400000) },
  { id: 1003, name: 'Дарья Новикова', city: 'Екатеринбург', style: 'Editorial, Commercial', coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop', lastLogin: new Date(Date.now() - 172800000) },
  { id: 1004, name: 'Мария Козлова', city: 'Казань', style: 'Artistic, Conceptual', coverImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=500&fit=crop', lastLogin: new Date(Date.now() - 259200000) },
];

const mockModelsDetailed: Model[] = [
  {
    id: 1001,
    name: 'Анастасия Волкова',
    age: 24,
    city: 'Москва',
    height: '175',
    phone: '+7 (999) 123-45-67',
    cooperationFormat: 'paid',
    rate: '5000',
    sensitivityLevel: 'Купальник',
    hairLength: 'По лопатки',
    styles: ['Fashion', 'Lifestyle', 'Beauty'],
    experience: '3 года опыта, работала с известными брендами',
    messenger: 'Telegram: @anastasia_v',
    portfolio: 'https://portfolio.example.com/anastasia',
    instagram: '@anastasia.volkova',
    physicalFeatures: 'Голубые глаза, светлые волосы',
    sensitiveTopics: 'Не работаю с underwater съёмками',
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=700&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=700&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=700&fit=crop&q=80',
    ]
  },
  {
    id: 1002,
    name: 'Виктория Смирнова',
    age: 21,
    city: 'Санкт-Петербург',
    height: '168',
    phone: '+7 (999) 234-56-78',
    cooperationFormat: 'tfp',
    sensitivityLevel: 'Портрет',
    hairLength: 'До плеч',
    styles: ['Beauty', 'Portrait'],
    experience: '1 год опыта, активно развиваю портфолио',
    messenger: 'WhatsApp: +7 (999) 234-56-78',
    instagram: '@victoria.smirnova',
    physicalFeatures: 'Карие глаза, темные волосы',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=700&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=500&h=700&fit=crop&q=80',
    ]
  },
  {
    id: 1003,
    name: 'Дарья Новикова',
    age: 26,
    city: 'Екатеринбург',
    height: '172',
    phone: '+7 (999) 345-67-89',
    cooperationFormat: 'paid',
    rate: '4000',
    sensitivityLevel: 'Бельё',
    hairLength: 'Каре',
    styles: ['Editorial', 'Commercial', 'Fashion'],
    experience: '5 лет опыта, работала в рекламных кампаниях',
    messenger: 'Telegram: @daria_n',
    portfolio: 'https://portfolio.example.com/daria',
    instagram: '@daria.novikova',
    physicalFeatures: 'Зелёные глаза, рыжие волосы',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=700&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=700&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=500&h=700&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=700&fit=crop&q=80',
    ]
  },
  {
    id: 1004,
    name: 'Мария Козлова',
    age: 23,
    city: 'Казань',
    height: '178',
    cooperationFormat: 'tfp',
    sensitivityLevel: 'Гламур',
    hairLength: 'По пояс',
    styles: ['Artistic', 'Conceptual', 'Fashion'],
    experience: '2 года опыта в творческих проектах',
    messenger: 'Telegram: @maria_k',
    instagram: '@maria.kozlova',
    physicalFeatures: 'Серые глаза, длинные чёрные волосы',
    sensitiveTopics: 'Предпочитаю художественные проекты',
    images: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=700&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=700&fit=crop&q=80',
    ]
  },
];

const mockPhotographers: Profile[] = [
  { id: 2001, name: 'Александр Петров', city: 'Москва', style: 'Fashion, Beauty', coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', lastLogin: new Date() },
  { id: 2002, name: 'Дмитрий Иванов', city: 'Санкт-Петербург', style: 'Portrait, Street', coverImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop', lastLogin: new Date(Date.now() - 86400000) },
  { id: 2003, name: 'Сергей Морозов', city: 'Новосибирск', style: 'Commercial, Editorial', coverImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop', lastLogin: new Date(Date.now() - 172800000) },
];

const API_BASE = 'https://functions.poehali.dev/5e52c74c-057c-4f72-a08d-5d924468db69';

export default function Index() {
  const [currentPage, setCurrentPage] = useState<PageType>('models');
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isPhotographerRegistrationOpen, setIsPhotographerRegistrationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModelViewOpen, setIsModelViewOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [isPhotographerViewOpen, setIsPhotographerViewOpen] = useState(false);
  const [selectedPhotographerId, setSelectedPhotographerId] = useState<number | null>(null);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [userProfileId, setUserProfileId] = useState<number | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [filters, setFilters] = useState({
    city: '',
    minHeight: '',
    maxHeight: '',
    minAge: '',
    maxAge: '',
    opennessLevel: '',
    cooperationFormat: '',
    specialization: ''
  });

  const currentProfiles = profiles.length > 0 ? profiles : (currentPage === 'models' ? mockModels : mockPhotographers);

  const loadProfiles = async (page = 1, resetList = false) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        type: currentPage === 'models' ? 'model' : 'photographer',
        page: page.toString()
      });

      if (filters.city) params.append('city', filters.city);
      if (filters.minHeight) params.append('minHeight', filters.minHeight);
      if (filters.maxHeight) params.append('maxHeight', filters.maxHeight);
      if (filters.minAge) params.append('minAge', filters.minAge);
      if (filters.maxAge) params.append('maxAge', filters.maxAge);
      if (filters.opennessLevel) params.append('opennessLevel', filters.opennessLevel);
      if (filters.cooperationFormat) params.append('cooperationFormat', filters.cooperationFormat);
      if (filters.specialization) params.append('specialization', filters.specialization);

      const response = await fetch(`${API_BASE}?${params}`);
      const data = await response.json();

      if (data.profiles && Array.isArray(data.profiles)) {
        const mappedProfiles: Profile[] = data.profiles.map((p: any) => ({
          id: p.id,
          name: p.fullName || p.name || 'Без имени',
          city: p.city || 'Не указан',
          style: p.specializations?.join(', ') || p.opennessLevel || p.cooperationFormat || 'Не указан',
          coverImage: p.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop',
          lastLogin: p.lastLogin ? new Date(p.lastLogin) : new Date()
        }));

        if (resetList) {
          setProfiles(mappedProfiles);
        } else {
          setProfiles(prev => [...prev, ...mappedProfiles]);
        }
        
        setHasMore(mappedProfiles.length === 20);
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setProfiles([]);
    setCurrentPageNum(1);
    setHasMore(true);
    loadProfiles(1, true);
  }, [currentPage]);

  const handleApplyFilters = () => {
    setProfiles([]);
    setCurrentPageNum(1);
    setHasMore(true);
    loadProfiles(1, true);
    setIsSearchOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      city: '',
      minHeight: '',
      maxHeight: '',
      minAge: '',
      maxAge: '',
      opennessLevel: '',
      cooperationFormat: '',
      specialization: ''
    });
  };

  const handleLoadMore = () => {
    const nextPage = currentPageNum + 1;
    setCurrentPageNum(nextPage);
    loadProfiles(nextPage, false);
  };

  const handleLogin = () => {
    if (loginForm.login === 'ad' && loginForm.password === '112233') {
      setUserRole('admin');
      setUserProfileId(1001);
      setIsLoginOpen(false);
    }
  };

  const handleAddProfile = () => {
    if (currentPage === 'models') {
      setIsRegistrationOpen(true);
    } else {
      setIsPhotographerRegistrationOpen(true);
    }
  };

  const handleMyProfile = () => {
    if (currentPage === 'models') {
      setIsRegistrationOpen(true);
    } else {
      setIsPhotographerRegistrationOpen(true);
    }
  };

  const handleViewModel = (modelId: number) => {
    setSelectedModelId(modelId);
    setIsModelViewOpen(true);
  };

  const handleViewPhotographer = (photographerId: number) => {
    setSelectedPhotographerId(photographerId);
    setIsPhotographerViewOpen(true);
  };

  const handleNavigateModel = (direction: 'prev' | 'next') => {
    if (selectedModelId === null) return;
    
    const currentIndex = mockModelsDetailed.findIndex(m => m.id === selectedModelId);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedModelId(mockModelsDetailed[currentIndex - 1].id);
    } else if (direction === 'next' && currentIndex < mockModelsDetailed.length - 1) {
      setSelectedModelId(mockModelsDetailed[currentIndex + 1].id);
    }
  };

  const handleNavigatePhotographer = (direction: 'prev' | 'next') => {
    if (selectedPhotographerId === null) return;
    
    const currentIndex = mockPhotographers.findIndex(p => p.id === selectedPhotographerId);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedPhotographerId(mockPhotographers[currentIndex - 1].id);
    } else if (direction === 'next' && currentIndex < mockPhotographers.length - 1) {
      setSelectedPhotographerId(mockPhotographers[currentIndex + 1].id);
    }
  };

  const selectedModel = selectedModelId ? {
    id: selectedModelId,
    name: profiles.find(p => p.id === selectedModelId)?.name || 'Модель',
    age: 25,
    city: profiles.find(p => p.id === selectedModelId)?.city || 'Не указан',
    height: '170',
    images: [profiles.find(p => p.id === selectedModelId)?.coverImage || ''],
    styles: [profiles.find(p => p.id === selectedModelId)?.style || '']
  } : null;
  
  const selectedPhotographer = selectedPhotographerId ? {
    id: selectedPhotographerId,
    name: profiles.find(p => p.id === selectedPhotographerId)?.name || 'Фотограф',
    city: profiles.find(p => p.id === selectedPhotographerId)?.city || 'Не указан',
    images: [profiles.find(p => p.id === selectedPhotographerId)?.coverImage || ''],
    specialization: [profiles.find(p => p.id === selectedPhotographerId)?.style || '']
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pointer-events-none" />
      
      <div className="relative container mx-auto px-4 py-8">
        <header className="mb-12 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {currentPage === 'models' ? '✨ Фотомодели' : '📸 Фотографы'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {currentPage === 'models' 
                ? 'Найдите идеальную модель для вашего проекта'
                : 'Найдите талантливого фотографа для съёмки'}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all hover-scale">
                  <Icon name="Search" className="mr-2" size={20} />
                  Поиск
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md animate-slide-in-right overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Расширенный поиск</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6 pb-6">
                  <div>
                    <Label htmlFor="search-city">Город</Label>
                    <Input 
                      id="search-city" 
                      placeholder="Москва, Санкт-Петербург..." 
                      value={filters.city}
                      onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>

                  {currentPage === 'models' && (
                    <>
                      <div>
                        <Label>Рост (см)</Label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="От" 
                            type="number"
                            value={filters.minHeight}
                            onChange={(e) => setFilters(prev => ({ ...prev, minHeight: e.target.value }))}
                          />
                          <Input 
                            placeholder="До" 
                            type="number"
                            value={filters.maxHeight}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxHeight: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Возраст</Label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="От" 
                            type="number"
                            value={filters.minAge}
                            onChange={(e) => setFilters(prev => ({ ...prev, minAge: e.target.value }))}
                          />
                          <Input 
                            placeholder="До" 
                            type="number"
                            value={filters.maxAge}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxAge: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="openness-level">Уровень откровенности</Label>
                        <Select value={filters.opennessLevel} onValueChange={(value) => setFilters(prev => ({ ...prev, opennessLevel: value }))}>
                          <SelectTrigger id="openness-level">
                            <SelectValue placeholder="Выберите уровень" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Портрет">Портрет</SelectItem>
                            <SelectItem value="Купальник">Купальник</SelectItem>
                            <SelectItem value="Бельё">Бельё</SelectItem>
                            <SelectItem value="Гламур">Гламур</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {currentPage === 'photographers' && (
                    <div>
                      <Label htmlFor="specialization">Специализация</Label>
                      <Input 
                        id="specialization" 
                        placeholder="Fashion, Beauty, Portrait..."
                        value={filters.specialization}
                        onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="cooperation-format">Формат сотрудничества</Label>
                    <Select value={filters.cooperationFormat} onValueChange={(value) => setFilters(prev => ({ ...prev, cooperationFormat: value }))}>
                      <SelectTrigger id="cooperation-format">
                        <SelectValue placeholder="Выберите формат" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tfp">TFP (Time for Prints)</SelectItem>
                        <SelectItem value="paid">Платное</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-primary to-secondary"
                      onClick={handleApplyFilters}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Загрузка...' : 'Применить'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleClearFilters}
                    >
                      Сбросить
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {userRole === 'guest' ? (
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-secondary to-accent hover:opacity-90 transition-all hover-scale"
                onClick={handleAddProfile}
              >
                <Icon name="UserPlus" className="mr-2" size={20} />
                Добавить анкету
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-secondary to-accent hover:opacity-90 transition-all hover-scale"
                onClick={handleMyProfile}
              >
                <Icon name="User" className="mr-2" size={20} />
                Моя анкета
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="border-2 hover:bg-card transition-all hover-scale"
              onClick={() => setCurrentPage(currentPage === 'models' ? 'photographers' : 'models')}
            >
              <Icon name={currentPage === 'models' ? 'Camera' : 'Users'} className="mr-2" size={20} />
              {currentPage === 'models' ? 'Фотографы' : 'Модели'}
            </Button>

            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="hover:bg-card">
                  <Icon name="LogIn" className="mr-2" size={18} />
                  Войти
                </Button>
              </DialogTrigger>
              <DialogContent className="animate-scale-in">
                <DialogHeader>
                  <DialogTitle>Вход в систему</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="login">Логин</Label>
                    <Input 
                      id="login" 
                      value={loginForm.login}
                      onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })}
                      placeholder="Введите логин"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Пароль</Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Введите пароль"
                    />
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-secondary"
                    onClick={handleLogin}
                  >
                    Войти
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Нет аккаунта? Зарегистрируйтесь через "Добавить анкету"
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            {userRole === 'admin' && (
              <Badge variant="destructive" className="ml-2">
                <Icon name="Shield" size={14} className="mr-1" />
                Администратор
              </Badge>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProfiles.map((profile, index) => (
            <Card 
              key={profile.id} 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover-scale border-2 border-muted/50 hover:border-primary/50 bg-card/80 backdrop-blur-sm animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => currentPage === 'models' ? handleViewModel(profile.id) : handleViewPhotographer(profile.id)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={profile.coverImage} 
                    alt={profile.name}
                    className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm">
                    #{profile.id}
                  </Badge>
                </div>
                
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {profile.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="MapPin" size={14} className="mr-1" />
                    {profile.city}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="Sparkles" size={14} className="mr-1" />
                    {profile.style}
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentPage === 'models') {
                          handleViewModel(profile.id);
                        } else {
                          handleViewPhotographer(profile.id);
                        }
                      }}
                    >
                      <Icon name="Eye" size={14} className="mr-1" />
                      Смотреть
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {new Date(profile.lastLogin).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">Загрузка профилей...</p>
          </div>
        )}

        {!isLoading && profiles.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">Профили не найдены</p>
            <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить параметры поиска</p>
          </div>
        )}

        {!isLoading && hasMore && profiles.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              size="lg"
              variant="outline"
              onClick={handleLoadMore}
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-none hover:opacity-90"
            >
              <Icon name="ChevronDown" className="mr-2" size={20} />
              Загрузить ещё
            </Button>
          </div>
        )}

        <RegistrationFlow 
          open={isRegistrationOpen} 
          onClose={() => setIsRegistrationOpen(false)}
          onSuccess={() => {
            setProfiles([]);
            setCurrentPageNum(1);
            loadProfiles(1, true);
          }}
        />
        
        <PhotographerRegistrationFlow
          open={isPhotographerRegistrationOpen}
          onClose={() => setIsPhotographerRegistrationOpen(false)}
          onSuccess={() => {
            setProfiles([]);
            setCurrentPageNum(1);
            loadProfiles(1, true);
          }}
        />
        
        <ModelViewDialog
          isOpen={isModelViewOpen}
          onClose={() => setIsModelViewOpen(false)}
          model={selectedModel}
          allModels={mockModelsDetailed}
          onNavigate={handleNavigateModel}
        />
        
        <PhotographerViewDialog
          isOpen={isPhotographerViewOpen}
          onClose={() => setIsPhotographerViewOpen(false)}
          photographer={selectedPhotographer}
          allPhotographers={mockPhotographers}
          onNavigate={handleNavigatePhotographer}
        />
        
        <Toaster />
      </div>
    </div>
  );
}