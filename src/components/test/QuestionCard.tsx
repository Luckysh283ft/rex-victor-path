import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bookmark, 
  BookmarkCheck, 
  Eye, 
  EyeOff, 
  Calculator,
  FileText,
  Clock,
  Award
} from 'lucide-react';
import { Question } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTest } from '@/contexts/TestContext';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer?: number;
  onAnswerSelect: (answer: number) => void;
  onClearAnswer: () => void;
  className?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
  onClearAnswer,
  className
}) => {
  const { language, t } = useLanguage();
  const { toggleBookmark, bookmarkedQuestions } = useTest();
  const [showSolution, setShowSolution] = useState(false);
  
  const isBookmarked = bookmarkedQuestions.includes(question.id);
  const isAnswered = selectedAnswer !== undefined;

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Physics':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Chemistry':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Mathematics':
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

  const questionText = language === 'hi' ? question.questionTextHindi : question.questionText;
  const options = language === 'hi' ? question.optionsHindi : question.options;
  const subject = language === 'hi' ? question.subjectHindi : question.subject;
  const topic = language === 'hi' ? question.topicHindi : question.topic;
  const difficulty = language === 'hi' ? question.difficultyHindi : question.difficulty;
  const explanation = language === 'hi' ? question.explanationHindi : question.explanation;
  const formula = language === 'hi' ? question.formulaHindi : question.formula;

  return (
    <Card className={cn(
      "w-full transition-all duration-300 hover:shadow-lg",
      "bg-gradient-card border-border",
      language === 'hi' && "font-devanagari",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium">
              {t('question', 'Question', 'प्रश्न')} {questionNumber}
            </Badge>
            <Badge className={cn("text-xs", getSubjectColor(question.subject))}>
              {subject}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", getDifficultyColor(question.difficulty))}>
              {difficulty}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{Math.round(question.timeEstimate / 60)}m</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Award className="h-3 w-3" />
              <span>{question.marks}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleBookmark(question.id)}
              className={cn(
                "h-8 w-8 p-0 transition-colors",
                isBookmarked && "text-warning hover:text-warning/80"
              )}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {t('topic', 'Topic', 'विषय')}: {topic}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question Text */}
        <div className="text-lg leading-relaxed">
          {questionText}
        </div>

        {/* Formula Display (if available) */}
        {formula && (
          <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-accent">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                {t('formula', 'Formula', 'सूत्र')}
              </span>
            </div>
            <div className="font-mono text-sm">{formula}</div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(index)}
              className={cn(
                "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                "hover:border-primary/50 hover:bg-primary/5",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                selectedAnswer === index && [
                  "border-primary bg-primary/10 shadow-button",
                  "ring-2 ring-primary/20"
                ],
                selectedAnswer !== index && "border-border bg-card"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                  selectedAnswer === index 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1 leading-relaxed">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4">
          {isAnswered && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAnswer}
              className="flex items-center gap-2"
            >
              <span>{t('clear', 'Clear', 'साफ़ करें')}</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-2"
          >
            {showSolution ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>{t('hideSolution', 'Hide Solution', 'समाधान छुपाएं')}</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>{t('showSolution', 'Show Solution', 'समाधान दिखाएं')}</span>
              </>
            )}
          </Button>
        </div>

        {/* Solution Section */}
        {showSolution && (
          <div className="mt-6 p-4 bg-success/5 border border-success/20 rounded-lg animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-success" />
              <span className="font-medium text-success">
                {t('solution', 'Solution', 'समाधान')}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm leading-relaxed">{explanation}</div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {t('correctAnswer', 'Correct Answer', 'सही उत्तर')}:
                </span>
                <Badge className="bg-success text-success-foreground">
                  {question.questionType === 'single-correct' && typeof question.correctAnswer === 'number' 
                    ? `${String.fromCharCode(65 + question.correctAnswer)} - ${options[question.correctAnswer]}`
                    : question.questionType === 'multiple-correct' && Array.isArray(question.correctAnswer)
                    ? question.correctAnswer.map(ans => String.fromCharCode(65 + ans)).join(', ')
                    : question.questionType === 'integer-answer'
                    ? String(question.correctAnswer)
                    : question.questionType === 'matrix-match'
                    ? 'Matrix matches shown'
                    : String(question.correctAnswer)
                  }
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};