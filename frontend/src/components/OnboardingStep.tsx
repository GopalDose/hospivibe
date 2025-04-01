
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/context/AuthContext';

interface OnboardingStepProps {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
  userRole: UserRole;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  children?: React.ReactNode;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  step,
  totalSteps,
  title,
  description,
  userRole,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  children
}) => {
  const getRoleColor = (role: UserRole) => {
    const colors = {
      admin: 'from-role-admin/70 to-role-admin',
      doctor: 'from-role-doctor/70 to-role-doctor',
      nurse: 'from-role-nurse/70 to-role-nurse',
      patient: 'from-role-patient/70 to-role-patient'
    };
    return colors[role];
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl animate-scale-in">
      <div className="onboarding-progress">
        <div 
          className={cn(
            "onboarding-progress-bar bg-gradient-to-r", 
            getRoleColor(userRole)
          )} 
          style={{ width: `${(step / totalSteps) * 100}%` }} 
        />
      </div>
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
          <span className={cn(
            "px-2 py-1 text-xs rounded-full", 
            `bg-role-${userRole}/10 text-role-${userRole}`
          )}>
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} View
          </span>
        </div>
        <CardTitle className="text-2xl font-bold mt-2">{title}</CardTitle>
        {description && (
          <p className="text-gray-500 mt-1">{description}</p>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="py-2">
          {children}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
          className={isFirstStep ? 'opacity-0' : 'button-effect'}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <Button
          onClick={onNext}
          className={cn(
            "button-effect bg-gradient-to-r",
            getRoleColor(userRole),
            "text-white border-none"
          )}
        >
          {isLastStep ? 'Get Started' : 'Next'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingStep;
