import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Bookmark } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  answered: number;
  bookmarked: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  answered,
  bookmarked,
  className
}) => {
  const { language, t } = useLanguage();

  const progressPercentage = (current / total) * 100;
  const answeredPercentage = (answered / total) * 100;

  return (
    <div className={cn(
      "flex flex-col gap-3 p-4 bg-card rounded-lg border",
      language === 'hi' && "font-devanagari",
      className
    )}>
      {/* Question Counter */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          {t('question', 'Question', 'प्रश्न')}
        </span>
        <span className="text-lg font-bold text-primary">
          {current + 1} {t('of', 'of', 'का')} {total}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(progressPercentage)}% {t('complete', 'Complete', 'पूर्ण')}</span>
          <span>{total - current - 1} {t('remaining', 'Remaining', 'बचे')}</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="flex items-center gap-1.5 text-sm">
          <CheckCircle className="h-4 w-4 text-success" />
          <span className="text-success font-medium">{answered}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-sm">
          <Bookmark className="h-4 w-4 text-warning" />
          <span className="text-warning font-medium">{bookmarked}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-sm">
          <Circle className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground font-medium">{total - answered}</span>
        </div>
      </div>

      {/* Answer Rate */}
      <div className="mt-2 p-2 bg-muted/30 rounded">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {t('answerRate', 'Answer Rate', 'उत्तर दर')}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(answeredPercentage)}%
          </span>
        </div>
        <Progress value={answeredPercentage} className="h-1 mt-1" />
      </div>
    </div>
  );
};