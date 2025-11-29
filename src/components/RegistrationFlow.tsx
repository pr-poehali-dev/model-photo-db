import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import RegistrationInitialStep from './registration/RegistrationInitialStep';
import RegistrationVerifyStep from './registration/RegistrationVerifyStep';
import RegistrationProfileStep from './registration/RegistrationProfileStep';

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

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      {step === 'initial' && (
        <RegistrationInitialStep
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleInitialSubmit}
          onCancel={handleCancel}
        />
      )}
      {step === 'verify' && (
        <RegistrationVerifyStep
          phone={formData.phone}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          onSubmit={handleVerifySubmit}
          onCancel={handleCancel}
        />
      )}
      {step === 'profile' && (
        <RegistrationProfileStep
          formData={formData}
          setFormData={setFormData}
          toggleStyle={toggleStyle}
          onSubmit={handleProfileSubmit}
          onCancel={handleCancel}
        />
      )}
    </Dialog>
  );
}
