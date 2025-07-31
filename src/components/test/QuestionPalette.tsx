import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, CheckCircle, Bookmark, Circle, Eye } from 'lucide-react';
import { useTest } from '@/contexts/TestContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface QuestionPaletteProps {
  onClose: () => void;
  className?: string;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({ onClose, className }) => {
  const { 
    questions, 
    currentQuestionIndex, 
    getQuestionStatus, 
    navigateToQuestion,
    getProgressStats 
  } = useTest();
  
  const { language, t } = useLanguage();
  const progressStats = getProgressStats();

  const getQuestionIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'bookmarked':
        return <Bookmark className="h-4 w-4 text-warning" />;
      case 'visited':
        return <Eye className="h-4 w-4 text-info" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getQuestionBadgeClass = (status: string, index: number) => {
    const isCurrentQuestion = index === currentQuestionIndex;
    
    const baseClass = "w-10 h-10 text-sm font-medium transition-all duration-200 hover:scale-105";
    
    if (isCurrentQuestion) {
      return cn(baseClass, "bg-primary text-primary-foreground ring-2 ring-primary/50 ring-offset-2");
    }
    
    switch (status) {
      case 'answered':
        return cn(baseClass, "bg-success/20 text-success border-success/50 hover:bg-success/30");
      case 'bookmarked':
        return cn(baseClass, "bg-warning/20 text-warning border-warning/50 hover:bg-warning/30");
      case 'visited':
        return cn(baseClass, "bg-info/20 text-info border-info/50 hover:bg-info/30");
      default:
        return cn(baseClass, "bg-muted text-muted-foreground border-border hover:bg-muted/70");
    }
  };

  const physicsQuestions = questions.filter(q => q.subject === 'Physics');
  const chemistryQuestions = questions.filter(q => q.subject === 'Chemistry');
  const mathQuestions = questions.filter(q => q.subject === 'Mathematics');

  const renderQuestionSection = (sectionQuestions: typeof questions, subject: string, startIndex: number) => {
    if (sectionQuestions.length === 0) return null;

    const subjectName = language === 'hi' 
      ? (subject === 'Physics' ? 'भौतिकी' : subject === 'Chemistry' ? 'रसायन विज्ञान' : 'गणित')
      : subject;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">{subjectName}</h4>
          <Badge variant="outline" className="text-xs">
            {sectionQuestions.length} {t('questions', 'Questions', 'प्रश्न')}
          </Badge>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {sectionQuestions.map((question, index) => {
            const questionIndex = startIndex + index;
            const status = getQuestionStatus(question.id);
            
            return (
              <Button
                key={question.id}
                variant="outline"
                onClick={() => {
                  navigateToQuestion(questionIndex);
                  onClose();
                }}
                className={getQuestionBadgeClass(status, questionIndex)}
              >
                {questionIndex + 1}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "bg-background/80 backdrop-blur-sm flex items-center justify-center p-4",
      language === 'hi' && "font-devanagari",
      className
    )}>
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-bold text-primary">
            {t('questionPalette', 'Question Palette', 'प्रश्न पैलेट')}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>{t('answered', 'Answered', 'उत्तरित')} ({progressStats.answered})</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Bookmark className="h-4 w-4 text-warning" />
              <span>{t('bookmarked', 'Bookmarked', 'बुकमार्क')} ({progressStats.bookmarked})</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-info" />
              <span>{t('visited', 'Visited', 'देखे गए')} ({progressStats.visited})</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Circle className="h-4 w-4 text-muted-foreground" />
              <span>{t('unvisited', 'Unvisited', 'न देखे गए')} ({progressStats.remaining})</span>
            </div>
          </div>

          {/* Current Question Indicator */}
          <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">
              {currentQuestionIndex + 1}
            </div>
            <span className="text-sm font-medium">
              {t('currentQuestion', 'Current Question', 'वर्तमान प्रश्न')}
            </span>
          </div>

          {/* Questions by Subject */}
          <div className="space-y-6">
            {renderQuestionSection(physicsQuestions, 'Physics', 0)}
            {renderQuestionSection(chemistryQuestions, 'Chemistry', physicsQuestions.length)}
            {renderQuestionSection(mathQuestions, 'Mathematics', physicsQuestions.length + chemistryQuestions.length)}
          </div>

          {/* Summary */}
          <div className="p-4 bg-card border rounded-lg">
            <h4 className="font-medium mb-3 text-primary">
              {t('testSummary', 'Test Summary', 'टेस्ट सारांश')}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{t('total', 'Total', 'कुल')}:</span>
                <span className="ml-2 font-medium">{questions.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t('answered', 'Answered', 'उत्तरित')}:</span>
                <span className="ml-2 font-medium text-success">{progressStats.answered}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t('bookmarked', 'Bookmarked', 'बुकमार्क')}:</span>
                <span className="ml-2 font-medium text-warning">{progressStats.bookmarked}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t('remaining', 'Remaining', 'बचे')}:</span>
                <span className="ml-2 font-medium">{questions.length - progressStats.answered}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};