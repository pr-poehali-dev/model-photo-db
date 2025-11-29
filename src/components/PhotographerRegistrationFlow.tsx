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

interface PhotographerRegistrationFlowProps {
  open: boolean;
  onClose: () => void;
}

export default function PhotographerRegistrationFlow({ open, onClose }: PhotographerRegistrationFlowProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<RegistrationStep>('initial');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode] = useState('1234');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [coverPhotoId, setCoverPhotoId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PhotographerData>({
    login: '',
    password: '',
    phone: '',
    name: '',
    birthDate: '',
    email: '',
    city: 'Хабаровск',
    specialization: [],
    experience: '',
    equipment: '',
    workingFormats: [],
    priceRange: '',
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

  const handleProfileSubmit = () => {
    if (!formData.name || !formData.birthDate || !formData.email || 
        !formData.city || formData.specialization.length === 0) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
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
    setPhotos([]);
    setCoverPhotoId(null);
    setFormData({
      login: '',
      password: '',
      phone: '',
      name: '',
      birthDate: '',
      email: '',
      city: 'Хабаровск',
      specialization: [],
      experience: '',
      equipment: '',
      workingFormats: [],
      priceRange: '',
      portfolio: '',
      instagram: '',
      additionalInfo: ''
    });
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
          formData={formData}
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
