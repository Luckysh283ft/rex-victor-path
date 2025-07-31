import React from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface TimerProps {
  timeInSeconds: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  critical?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  timeInSeconds,
  className,
  size = 'md',
  showIcon = true,
  critical = false
}) => {
  const { language, t } = useLanguage();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeText = (): string => {
    if (language === 'hi') {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      
      if (hours > 0) {
        return `${hours} घंटे ${minutes} मिनट बचे`;
      }
      return `${minutes} मिनट बचे`;
    }
    
    return t('timeRemaining', 'Time Remaining', 'समय बचा');
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const isCritical = critical || timeInSeconds < 300; // Less than 5 minutes

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg font-mono font-medium",
      "bg-card border transition-all duration-300",
      isCritical && "bg-destructive/10 border-destructive text-destructive animate-pulse-glow",
      !isCritical && "border-border text-foreground",
      sizeClasses[size],
      language === 'hi' && "font-devanagari",
      className
    )}>
      {showIcon && (
        <Clock className={cn(
          iconSizes[size],
          isCritical && "text-destructive",
          !isCritical && "text-muted-foreground"
        )} />
      )}
      
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground">
          {getTimeText()}
        </span>
        <span className={cn(
          "font-bold tracking-wide",
          isCritical && "text-destructive",
          !isCritical && "text-primary"
        )}>
          {formatTime(timeInSeconds)}
        </span>
      </div>
    </div>
  );
};