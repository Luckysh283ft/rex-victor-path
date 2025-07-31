import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  FileText, 
  Award, 
  Play, 
  Users,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { TestConfiguration } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface TestCardProps {
  config: TestConfiguration;
  onStartTest: (config: TestConfiguration) => void;
  className?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  estimatedTime?: string;
  lastAttemptScore?: number;
  averageScore?: number;
  attempts?: number;
}

export const TestCard: React.FC<TestCardProps> = ({
  config,
  onStartTest,
  className,
  difficulty = 'Medium',
  estimatedTime,
  lastAttemptScore,
  averageScore,
  attempts = 0
}) => {
  const { language, t } = useLanguage();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full Test':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Subject Test':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Topic Test':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Custom':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-success/10 text-success border-success/20';
      case 'Medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Hard':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const testName = language === 'hi' ? config.nameHindi : config.name;
  const testType = language === 'hi' ? config.typeHindi : config.type;
  const difficultyText = language === 'hi' 
    ? (difficulty === 'Easy' ? 'आसान' : difficulty === 'Medium' ? 'मध्यम' : 'कठिन')
    : difficulty;

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-lg hover:shadow-primary/10",
      "border-border hover:border-primary/30 cursor-pointer",
      "bg-gradient-card",
      language === 'hi' && "font-devanagari",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn("text-xs font-medium", getTypeColor(config.type))}>
                {testType}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", getDifficultyColor(difficulty))}>
                {difficultyText}
              </Badge>
            </div>
            
            <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
              {testName}
            </CardTitle>
            
            <CardDescription className="text-sm text-muted-foreground">
              {config.subjects.join(' • ')} • {config.totalQuestions} {t('questions', 'Questions', 'प्रश्न')}
            </CardDescription>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Award className="h-3 w-3" />
            <span>{config.marksPerQuestion}M</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Test Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{config.duration} {t('minutes', 'min', 'मिनट')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{config.totalQuestions} Q</span>
          </div>
          
          {config.negativeMarking && (
            <div className="flex items-center gap-2 text-destructive">
              <span className="text-xs">-{Math.abs(config.negativeMarks)}M</span>
              <span className="text-xs">{t('negative', 'Negative', 'नकारात्मक')}</span>
            </div>
          )}
          
          {attempts > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{attempts} {t('attempts', 'attempts', 'प्रयास')}</span>
            </div>
          )}
        </div>

        {/* Subject Distribution */}
        {config.subjects.length > 1 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              {t('distribution', 'Question Distribution', 'प्रश्न वितरण')}
            </div>
            <div className="flex items-center gap-2 text-xs">
              {config.physicsQuestions > 0 && (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  {language === 'hi' ? 'भौतिकी' : 'Phy'} {config.physicsQuestions}
                </span>
              )}
              {config.chemistryQuestions > 0 && (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {language === 'hi' ? 'रसायन' : 'Chem'} {config.chemistryQuestions}
                </span>
              )}
              {config.mathQuestions > 0 && (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  {language === 'hi' ? 'गणित' : 'Math'} {config.mathQuestions}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Performance Stats */}
        {(lastAttemptScore !== undefined || averageScore !== undefined) && (
          <div className="p-3 bg-muted/20 rounded-lg space-y-2">
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {t('performance', 'Performance', 'प्रदर्शन')}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              {lastAttemptScore !== undefined && (
                <div>
                  <span className="text-muted-foreground">{t('last', 'Last', 'अंतिम')}:</span>
                  <span className="ml-1 font-medium text-primary">{lastAttemptScore}%</span>
                </div>
              )}
              {averageScore !== undefined && (
                <div>
                  <span className="text-muted-foreground">{t('avg', 'Avg', 'औसत')}:</span>
                  <span className="ml-1 font-medium text-success">{averageScore}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Start Test Button */}
        <Button
          onClick={() => onStartTest(config)}
          className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 group-hover:shadow-button"
          size="lg"
        >
          <Play className="h-4 w-4 mr-2" />
          {t('startTest', 'Start Test', 'टेस्ट शुरू करें')}
        </Button>

        {/* Quick Info */}
        <div className="text-xs text-muted-foreground text-center">
          {estimatedTime && (
            <span>{t('estimated', 'Est. time', 'अनुमानित समय')}: {estimatedTime}</span>
          )}
          {!estimatedTime && (
            <span>{t('autoSave', 'Auto-save enabled', 'ऑटो-सेव सक्षम')}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};