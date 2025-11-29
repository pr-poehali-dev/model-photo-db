import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type RegistrationStep = 'initial' | 'verify' | 'profile';

interface StepConfig {
  id: RegistrationStep;
  title: string;
  icon: string;
}

const steps: StepConfig[] = [
  { id: 'initial', title: 'Регистрация', icon: 'UserPlus' },
  { id: 'verify', title: 'Подтверждение', icon: 'ShieldCheck' },
  { id: 'profile', title: 'Анкета', icon: 'FileEdit' }
];

interface RegistrationProgressBarProps {
  currentStep: RegistrationStep;
}

export default function RegistrationProgressBar({ currentStep }: RegistrationProgressBarProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full py-4 px-6 border-b bg-muted/20">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isActive && 'bg-primary border-primary text-primary-foreground animate-pulse',
                    isUpcoming && 'bg-background border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={20} />
                  ) : (
                    <Icon name={step.icon} size={20} />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-2 font-medium transition-colors duration-300',
                    (isActive || isCompleted) && 'text-foreground',
                    isUpcoming && 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-6">
                  <div
                    className={cn(
                      'h-full transition-all duration-500',
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
