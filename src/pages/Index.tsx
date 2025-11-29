import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const mockModels: Profile[] = [
  { id: 1001, name: 'Анастасия Волкова', city: 'Москва', style: 'Fashion, Lifestyle', coverImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&fit=crop', lastLogin: new Date() },
  { id: 1002, name: 'Виктория Смирнова', city: 'Санкт-Петербург', style: 'Beauty, Portrait', coverImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop', lastLogin: new Date(Date.now() - 86400000) },
  { id: 1003, name: 'Дарья Новикова', city: 'Екатеринбург', style: 'Editorial, Commercial', coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop', lastLogin: new Date(Date.now() - 172800000) },
  { id: 1004, name: 'Мария Козлова', city: 'Казань', style: 'Artistic, Conceptual', coverImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=500&fit=crop', lastLogin: new Date(Date.now() - 259200000) },
];

const mockPhotographers: Profile[] = [
  { id: 2001, name: 'Александр Петров', city: 'Москва', style: 'Fashion, Beauty', coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', lastLogin: new Date() },
  { id: 2002, name: 'Дмитрий Иванов', city: 'Санкт-Петербург', style: 'Portrait, Street', coverImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop', lastLogin: new Date(Date.now() - 86400000) },
  { id: 2003, name: 'Сергей Морозов', city: 'Новосибирск', style: 'Commercial, Editorial', coverImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop', lastLogin: new Date(Date.now() - 172800000) },
];

export default function Index() {
  const [currentPage, setCurrentPage] = useState<PageType>('models');
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });

  const currentProfiles = currentPage === 'models' ? mockModels : mockPhotographers;

  const handleLogin = () => {
    if (loginForm.login === 'ad' && loginForm.password === '112233') {
      setUserRole('admin');
      setIsLoginOpen(false);
    }
  };

  const handleAddProfile = () => {
    if (userRole === 'guest') {
      setIsLoginOpen(true);
    }
  };

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
              <SheetContent className="w-full sm:max-w-md animate-slide-in-right">
                <SheetHeader>
                  <SheetTitle>Расширенный поиск</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="search-name">Имя</Label>
                    <Input id="search-name" placeholder="Введите имя" />
                  </div>
                  <div>
                    <Label htmlFor="search-city">Город</Label>
                    <Select>
                      <SelectTrigger id="search-city">
                        <SelectValue placeholder="Выберите город" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moscow">Москва</SelectItem>
                        <SelectItem value="spb">Санкт-Петербург</SelectItem>
                        <SelectItem value="ekb">Екатеринбург</SelectItem>
                        <SelectItem value="kazan">Казань</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="search-style">Стиль съёмки</Label>
                    <Input id="search-style" placeholder="Fashion, Beauty, Portrait..." />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                    Применить фильтры
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-secondary to-accent hover:opacity-90 transition-all hover-scale"
              onClick={handleAddProfile}
            >
              <Icon name="UserPlus" className="mr-2" size={20} />
              Добавить анкету
            </Button>

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
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover-scale border-2 border-muted/50 hover:border-primary/50 bg-card/80 backdrop-blur-sm animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
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
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {profile.name}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="MapPin" size={14} className="mr-1" />
                    {profile.city}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="Sparkles" size={14} className="mr-1" />
                    {profile.style}
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
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
      </div>
    </div>
  );
}
