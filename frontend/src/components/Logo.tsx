
import React from 'react';
import { Stethoscope } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`text-hospital-600 animate-pulse-subtle`}>
        <Stethoscope className={sizeClasses[size]} strokeWidth={2} />
      </div>
      {withText && (
        <span className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-hospital-700 to-hospital-500 bg-clip-text text-transparent`}>
          HospiVibe
        </span>
      )}
    </div>
  );
};

export default Logo;
