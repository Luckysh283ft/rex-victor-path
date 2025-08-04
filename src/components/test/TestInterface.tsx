import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Pause, 
  Play,
  Grid3X3,
  Calculator,
  BookOpen,
  HelpCircle,
  Bot
} from 'lucide-react';
import { QuestionCard } from './QuestionCard';
import { QuestionPalette } from './QuestionPalette';
import { TestResults } from './TestResults';
import { SolutionViewer } from './SolutionViewer';
import { AIAssistant } from '../ai/AIAssistant';
import { Timer } from '@/components/ui/timer';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { useTest } from '@/contexts/TestContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const TestInterface: React.FC = () => {
  const { 
    currentQuestion, 
    currentQuestionIndex, 
    questions,
    answers, 
    timeRemaining,
    isTestActive,
    isTestCompleted,
    currentTest,
    saveAnswer,
    clearAnswer,
    nextQuestion,
    previousQuestion,
    submitTest,
    pauseTest,
    resumeTest,
    getProgressStats
  } = useTest();
  
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [showPalette, setShowPalette] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const progressStats = getProgressStats();

  if (!currentQuestion || !isTestActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {t('noActiveTest', 'No Active Test', 'कोई सक्रिय टेस्ट नहीं')}
          </h2>
          <p className="text-muted-foreground">
            {t('noTestMessage', 'Please start a test to continue', 'कृपया जारी रखने के लिए एक टेस्ट शुरू करें')}
          </p>
        </Card>
      </div>
    );
  }

  const handleAnswerSelect = (answer: number) => {
    saveAnswer(currentQuestion.id, answer);
  };

  const handleClearAnswer = () => {
    clearAnswer(currentQuestion.id);
  };

  const handleSubmit = () => {
    toast({
      title: t('confirmSubmission', 'Confirm Submission', 'सबमिशन की पुष्टि करें'),
      description: t('submitConfirm', 'Are you sure you want to submit the test?', 'क्या आप वाकई टेस्ट सबमिट करना चाहते हैं?'),
    });
    // In a real app, you'd show a confirmation dialog
    submitTest();
    setShowResults(true);
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeTest();
      setIsPaused(false);
    } else {
      pauseTest();
      setIsPaused(true);
    }
  };

  const selectedAnswer = answers[currentQuestion.id];

  // Show results if test is completed
  if (isTestCompleted || showResults) {
    if (showSolutions && currentTest) {
      return (
        <SolutionViewer
          questions={questions}
          testAttempt={currentTest}
          onClose={() => setShowSolutions(false)}
        />
      );
    }
    
    if (currentTest) {
      return (
        <TestResults
          testAttempt={currentTest}
          questions={questions}
          onReturnToDashboard={() => window.location.reload()}
          onViewSolutions={() => setShowSolutions(true)}
          onRestartTest={() => window.location.reload()}
        />
      );
    }
  }

  return (
    <div className={cn(
      "min-h-screen bg-background",
      language === 'hi' && "font-devanagari"
    )}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary">
                Rex JEE Mock Test
              </h1>
              <Separator orientation="vertical" className="h-6" />
              <Timer timeInSeconds={timeRemaining} critical={timeRemaining < 300} />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCalculator(!showCalculator)}
                className="hidden md:flex"
              >
                <Calculator className="h-4 w-4 mr-2" />
                {t('calculator', 'Calculator', 'कैलकुलेटर')}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFormulas(!showFormulas)}
                className="hidden md:flex"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {t('formulas', 'Formulas', 'सूत्र')}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="hidden md:flex"
              >
                <Bot className="h-4 w-4 mr-2" />
                {t('aiHelp', 'AI Help', 'AI सहायता')}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePauseResume}
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    {t('resume', 'Resume', 'जारी रखें')}
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    {t('pause', 'Pause', 'रोकें')}
                  </>
                )}
              </Button>

              <Button
                variant="default"
                onClick={handleSubmit}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Send className="h-4 w-4 mr-2" />
                {t('submit', 'Submit', 'जमा करें')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3 space-y-6">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelect}
              onClearAnswer={handleClearAnswer}
            />

            {/* Navigation Controls */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('previous', 'Previous', 'पिछला')}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPalette(!showPalette)}
                    className="flex items-center gap-2"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    {t('palette', 'Question Palette', 'प्रश्न पैलेट')}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center gap-2"
                >
                  {t('next', 'Next', 'अगला')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Indicator */}
            <ProgressIndicator
              current={currentQuestionIndex}
              total={questions.length}
              answered={progressStats.answered}
              bookmarked={progressStats.bookmarked}
            />

            {/* Quick Stats */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-primary">
                {t('quickStats', 'Quick Stats', 'त्वरित आंकड़े')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('answered', 'Answered', 'उत्तरित')}:
                  </span>
                  <span className="font-medium text-success">
                    {progressStats.answered}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('bookmarked', 'Bookmarked', 'बुकमार्क')}:
                  </span>
                  <span className="font-medium text-warning">
                    {progressStats.bookmarked}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('remaining', 'Remaining', 'बचे हुए')}:
                  </span>
                  <span className="font-medium text-muted-foreground">
                    {questions.length - progressStats.answered}
                  </span>
                </div>
              </div>
            </Card>

            {/* Help & Instructions */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-primary flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                {t('instructions', 'Instructions', 'निर्देश')}
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>{t('inst1', 'Click on an option to select your answer', 'अपना उत्तर चुनने के लिए एक विकल्प पर क्लिक करें')}</p>
                <p>{t('inst2', 'Use bookmark to mark questions for review', 'समीक्षा के लिए प्रश्नों को चिह्नित करने के लिए बुकमार्क का उपयोग करें')}</p>
                <p>{t('inst3', 'Your answers are automatically saved', 'आपके उत्तर स्वचालित रूप से सेव हो जाते हैं')}</p>
                <p>{t('inst4', 'Submit the test before time runs out', 'समय समाप्त होने से पहले टेस्ट सबमिट करें')}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Question Palette Modal */}
      {showPalette && (
        <QuestionPalette
          onClose={() => setShowPalette(false)}
          className="fixed inset-0 z-50"
        />
      )}

      {/* AI Assistant */}
      <AIAssistant
        currentQuestion={currentQuestion}
        isOpen={showAIAssistant}
        onToggle={() => setShowAIAssistant(!showAIAssistant)}
      />
    </div>
  );
};