import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import PhotographerInitialStep from './photographer-registration/PhotographerInitialStep';
import PhotographerVerifyStep from './photographer-registration/PhotographerVerifyStep';
import PhotographerProfileStep from './photographer-registration/PhotographerProfileStep';

type RegistrationStep = 'initial' | 'verify' | 'profile';

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

interface PhotographerRegistrationFlowProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PhotographerRegistrationFlow({ open, onClose, onSuccess }: PhotographerRegistrationFlowProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<RegistrationStep>('initial');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode] = useState('1234');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [coverPhotoId, setCoverPhotoId] = useState<string | null>(null);
  const [profileId] = useState<number>(Math.floor(Math.random() * 9000) + 2000);
  const [formData, setFormData] = useState<PhotographerData>({
    login: '',
    password: '',
    phone: '',
    name: '',
    email: '',
    city: 'Хабаровск',
    specialization: [],
    experience: '',
    equipment: '',
    workingFormats: [],
    priceFrom: '',
    portfolio: '',
    instagram: '',
    additionalInfo: ''
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

  const handleProfileSubmit = async () => {
    if (!formData.name || !formData.email || 
        !formData.city || formData.specialization.length === 0) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      let profilePhotoUrl = null;
      
      if (photos.length > 0 && coverPhotoId) {
        const coverPhoto = photos.find(p => p.id === coverPhotoId);
        if (coverPhoto) {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(coverPhoto.file);
          });
          profilePhotoUrl = await base64Promise;
        }
      }
      
      const response = await fetch('https://functions.poehali.dev/ca71ce4c-5d1f-47f4-bf13-9817e53809c1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          experienceYears: formData.experience ? parseInt(formData.experience) : 0,
          specializations: formData.specialization,
          equipment: formData.equipment,
          portfolioLinks: formData.portfolio ? [formData.portfolio] : [],
          instagram: formData.instagram,
          vk: null,
          telegram: null,
          aboutMe: formData.additionalInfo,
          priceRange: formData.priceFrom,
          cooperationFormat: formData.workingFormats.includes('paid') ? 'paid' : 'tfp',
          isBlocked: false,
          profilePhotoUrl: profilePhotoUrl
        })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();

      toast({
        title: 'Анкета сохранена',
        description: `Ваша анкета #${data.id} успешно создана!`,
      });

      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
      setStep('initial');
      setPhotos([]);
      setCoverPhotoId(null);
      setFormData({
        login: '',
        password: '',
        phone: '',
        name: '',
        email: '',
        city: 'Хабаровск',
        specialization: [],
        experience: '',
        equipment: '',
        workingFormats: [],
        priceFrom: '',
        portfolio: '',
        instagram: '',
        additionalInfo: ''
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить анкету. Попробуйте ещё раз.',
        variant: 'destructive'
      });
    }
  };

  const handleCancel = () => {
    onClose();
    setStep('initial');
    setVerificationCode('');
  };

  const toggleSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec) 
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }));
  };

  const toggleWorkingFormat = (format: string) => {
    setFormData(prev => ({
      ...prev,
      workingFormats: prev.workingFormats.includes(format) 
        ? prev.workingFormats.filter(f => f !== format)
        : [...prev.workingFormats, format]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      {step === 'initial' && (
        <PhotographerInitialStep
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleInitialSubmit}
          onCancel={handleCancel}
        />
      )}
      {step === 'verify' && (
        <PhotographerVerifyStep
          phone={formData.phone}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          onSubmit={handleVerifySubmit}
          onCancel={handleCancel}
        />
      )}
      {step === 'profile' && (
        <PhotographerProfileStep
          formData={{ ...formData, profileId }}
          setFormData={setFormData}
          toggleSpecialization={toggleSpecialization}
          toggleWorkingFormat={toggleWorkingFormat}
          photos={photos}
          coverPhotoId={coverPhotoId}
          onPhotosChange={setPhotos}
          onCoverPhotoChange={setCoverPhotoId}
          onSubmit={handleProfileSubmit}
          onCancel={handleCancel}
        />
      )}
    </Dialog>
  );
}