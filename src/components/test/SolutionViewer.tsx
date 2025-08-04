import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  Play,
  ExternalLink,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Youtube,
  FileText,
  Clock,
  Award
} from 'lucide-react';
import { Question, TestAttempt } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SolutionViewerProps {
  questions: Question[];
  testAttempt: TestAttempt;
  onClose: () => void;
  className?: string;
}

export const SolutionViewer: React.FC<SolutionViewerProps> = ({
  questions,
  testAttempt,
  onClose,
  className
}) => {
  const { language, t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showOnlyWrong, setShowOnlyWrong] = useState(true);
  const [activeTab, setActiveTab] = useState('solution');

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = testAttempt.answers[currentQuestion?.id];
  
  // Check if answer is correct
  const isCorrect = () => {
    if (!currentQuestion || userAnswer === undefined) return false;
    
    if (currentQuestion.questionType === 'single-correct' && typeof currentQuestion.correctAnswer === 'number') {
      return userAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.questionType === 'multiple-correct' && Array.isArray(currentQuestion.correctAnswer)) {
      return currentQuestion.correctAnswer.includes(userAnswer);
    } else if (currentQuestion.questionType === 'integer-answer') {
      return userAnswer === currentQuestion.correctAnswer;
    }
    return false;
  };

  // Filter questions based on showOnlyWrong
  const filteredQuestions = showOnlyWrong 
    ? questions.filter(q => {
        const userAns = testAttempt.answers[q.id];
        if (userAns === undefined) return true; // unattempted
        
        if (q.questionType === 'single-correct' && typeof q.correctAnswer === 'number') {
          return userAns !== q.correctAnswer;
        } else if (q.questionType === 'multiple-correct' && Array.isArray(q.correctAnswer)) {
          return !q.correctAnswer.includes(userAns);
        } else if (q.questionType === 'integer-answer') {
          return userAns !== q.correctAnswer;
        }
        return false;
      })
    : questions;

  const currentFilteredIndex = filteredQuestions.findIndex(q => q.id === currentQuestion?.id);

  const navigateToQuestion = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentFilteredIndex - 1)
      : Math.min(filteredQuestions.length - 1, currentFilteredIndex + 1);
    
    const targetQuestion = filteredQuestions[newIndex];
    const originalIndex = questions.findIndex(q => q.id === targetQuestion.id);
    setCurrentQuestionIndex(originalIndex);
  };

  const generateVideoSearchQuery = (question: Question): string => {
    const subject = question.subject;
    const topic = question.topic;
    return `JEE Advanced ${subject} ${topic} Solution in Hindi`;
  };

  const generateYouTubeUrl = (query: string): string => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  };

  const getQuestionTypeDisplay = (type: string) => {
    const types = {
      'single-correct': language === 'hi' ? 'एकल सही' : 'Single Correct',
      'multiple-correct': language === 'hi' ? 'बहु सही' : 'Multiple Correct',
      'integer-answer': language === 'hi' ? 'पूर्णांक उत्तर' : 'Integer Answer',
      'matrix-match': language === 'hi' ? 'मैट्रिक्स मिलान' : 'Matrix Match',
      'comprehension': language === 'hi' ? 'गद्यांश' : 'Comprehension'
    };
    return types[type] || type;
  };

  const getCorrectAnswerDisplay = (question: Question) => {
    if (question.questionType === 'single-correct' && typeof question.correctAnswer === 'number') {
      const options = language === 'hi' ? question.optionsHindi : question.options;
      return `${String.fromCharCode(65 + question.correctAnswer)} - ${options[question.correctAnswer]}`;
    } else if (question.questionType === 'multiple-correct' && Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.map(ans => String.fromCharCode(65 + ans)).join(', ');
    } else if (question.questionType === 'integer-answer') {
      return String(question.correctAnswer);
    }
    return String(question.correctAnswer);
  };

  const getUserAnswerDisplay = (question: Question, userAnswer: number) => {
    if (question.questionType === 'single-correct') {
      const options = language === 'hi' ? question.optionsHindi : question.options;
      return `${String.fromCharCode(65 + userAnswer)} - ${options[userAnswer]}`;
    } else if (question.questionType === 'multiple-correct') {
      return String.fromCharCode(65 + userAnswer);
    }
    return String(userAnswer);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {t('noQuestions', 'No Questions Available', 'कोई प्रश्न उपलब्ध नहीं')}
          </h2>
          <Button onClick={onClose}>
            {t('goBack', 'Go Back', 'वापस जाएं')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen bg-gradient-hero",
      language === 'hi' && "font-devanagari",
      className
    )}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back', 'Back', 'वापस')}
            </Button>
            
            <div>
              <h1 className="text-xl font-bold text-primary">
                {t('solutionViewer', 'Solution Viewer', 'समाधान दर्शक')}
              </h1>
              <p className="text-sm text-muted-foreground">
                Question {currentFilteredIndex + 1} of {filteredQuestions.length}
                {showOnlyWrong && ` (${t('wrongOnly', 'Wrong/Unattempted only', 'केवल गलत/अनुत्तरित')})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showOnlyWrong ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOnlyWrong(!showOnlyWrong)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showOnlyWrong 
                ? t('showAll', 'Show All', 'सभी दिखाएं')
                : t('showWrong', 'Wrong Only', 'केवल गलत')
              }
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Solution Area */}
          <div className="lg:col-span-3">
            {/* Question Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Question {questions.findIndex(q => q.id === currentQuestion.id) + 1}
                    </Badge>
                    <Badge className={cn(
                      "text-xs",
                      currentQuestion.subject === 'Physics' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                      currentQuestion.subject === 'Chemistry' && "bg-green-500/10 text-green-500 border-green-500/20",
                      currentQuestion.subject === 'Mathematics' && "bg-purple-500/10 text-purple-500 border-purple-500/20"
                    )}>
                      {language === 'hi' ? currentQuestion.subjectHindi : currentQuestion.subject}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getQuestionTypeDisplay(currentQuestion.questionType)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    {userAnswer !== undefined ? (
                      isCorrect() ? (
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t('correct', 'Correct', 'सही')}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          {t('incorrect', 'Incorrect', 'गलत')}
                        </Badge>
                      )
                    ) : (
                      <Badge variant="outline">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {t('unattempted', 'Unattempted', 'अनुत्तरित')}
                      </Badge>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{Math.round(currentQuestion.timeEstimate / 60)}m</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Award className="h-3 w-3" />
                      <span>+{currentQuestion.marks}/-{currentQuestion.negativeMarks}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Question Content */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-lg leading-relaxed mb-6">
                  {language === 'hi' ? currentQuestion.questionTextHindi : currentQuestion.questionText}
                </div>

                {/* Options (if applicable) */}
                {currentQuestion.options && (
                  <div className="space-y-3 mb-6">
                    {(language === 'hi' ? currentQuestion.optionsHindi : currentQuestion.options).map((option, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border-2 flex items-center gap-3",
                          userAnswer === index && !isCorrect() && "border-destructive bg-destructive/5",
                          currentQuestion.questionType === 'single-correct' && 
                          typeof currentQuestion.correctAnswer === 'number' && 
                          index === currentQuestion.correctAnswer && "border-success bg-success/5",
                          currentQuestion.questionType === 'multiple-correct' && 
                          Array.isArray(currentQuestion.correctAnswer) && 
                          currentQuestion.correctAnswer.includes(index) && "border-success bg-success/5"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                          userAnswer === index && !isCorrect() && "bg-destructive text-destructive-foreground",
                          currentQuestion.questionType === 'single-correct' && 
                          typeof currentQuestion.correctAnswer === 'number' && 
                          index === currentQuestion.correctAnswer && "bg-success text-success-foreground",
                          currentQuestion.questionType === 'multiple-correct' && 
                          Array.isArray(currentQuestion.correctAnswer) && 
                          currentQuestion.correctAnswer.includes(index) && "bg-success text-success-foreground",
                          !(userAnswer === index || 
                            (currentQuestion.questionType === 'single-correct' && index === currentQuestion.correctAnswer) ||
                            (currentQuestion.questionType === 'multiple-correct' && Array.isArray(currentQuestion.correctAnswer) && currentQuestion.correctAnswer.includes(index))
                          ) && "bg-muted text-muted-foreground"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t('correctAnswer', 'Correct Answer', 'सही उत्तर')}:
                    </span>
                    <span className="font-medium text-success">
                      {getCorrectAnswerDisplay(currentQuestion)}
                    </span>
                  </div>
                  
                  {userAnswer !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t('yourAnswer', 'Your Answer', 'आपका उत्तर')}:
                      </span>
                      <span className={cn(
                        "font-medium",
                        isCorrect() ? "text-success" : "text-destructive"
                      )}>
                        {getUserAnswerDisplay(currentQuestion, userAnswer)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Solution Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="solution">{t('solution', 'Solution', 'समाधान')}</TabsTrigger>
                <TabsTrigger value="video">{t('video', 'Video', 'वीडियो')}</TabsTrigger>
                <TabsTrigger value="tips">{t('tips', 'Tips', 'सुझाव')}</TabsTrigger>
              </TabsList>

              <TabsContent value="solution" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t('detailedSolution', 'Detailed Solution', 'विस्तृत समाधान')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="leading-relaxed">
                        {language === 'hi' ? currentQuestion.explanationHindi : currentQuestion.explanation}
                      </p>
                      
                      {currentQuestion.formula && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                          <div className="text-sm font-medium text-primary mb-2">
                            {t('keyFormula', 'Key Formula', 'मुख्य सूत्र')}:
                          </div>
                          <div className="font-mono text-sm">
                            {language === 'hi' ? currentQuestion.formulaHindi : currentQuestion.formula}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="video" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Youtube className="h-5 w-5" />
                      {t('videoSolutions', 'Video Solutions', 'वीडियो समाधान')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-sm font-medium mb-2">
                          {t('searchQuery', 'Search Query', 'खोज प्रश्न')}:
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          "{generateVideoSearchQuery(currentQuestion)}"
                        </div>
                        <Button
                          onClick={() => window.open(generateYouTubeUrl(generateVideoSearchQuery(currentQuestion)), '_blank')}
                          className="w-full"
                        >
                          <Youtube className="h-4 w-4 mr-2" />
                          {t('searchOnYoutube', 'Search on YouTube', 'YouTube पर खोजें')}
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {t('videoNote', 'Note: This will search for relevant video solutions on YouTube. Look for channels like "Physics Wallah", "Unacademy", or "Vedantu" for quality content.', 
                          'नोट: यह YouTube पर संबंधित वीडियो समाधान खोजेगा। गुणवत्तापूर्ण सामग्री के लिए "Physics Wallah", "Unacademy", या "Vedantu" जैसे चैनल देखें।')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tips" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      {t('tipsAndTricks', 'Tips & Common Mistakes', 'सुझाव और सामान्य गलतियां')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <span className="font-medium text-warning">
                            {t('commonMistakes', 'Common Mistakes', 'सामान्य गलतियां')}:
                          </span>
                        </div>
                        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                          <li>{language === 'hi' ? 'गणनाओं में जल्दबाजी करना' : 'Rushing through calculations'}</li>
                          <li>{language === 'hi' ? 'इकाइयों की जांच न करना' : 'Not checking units'}</li>
                          <li>{language === 'hi' ? 'प्रश्न को पूरा न पढ़ना' : 'Not reading the question completely'}</li>
                        </ul>
                      </div>
                      
                      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-success" />
                          <span className="font-medium text-success">
                            {t('proTips', 'Pro Tips', 'प्रो टिप्स')}:
                          </span>
                        </div>
                        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                          <li>{language === 'hi' ? 'पहले दिए गए डेटा को व्यवस्थित करें' : 'Organize given data first'}</li>
                          <li>{language === 'hi' ? 'आवश्यक सूत्रों की पहचान करें' : 'Identify required formulas'}</li>
                          <li>{language === 'hi' ? 'चरणबद्ध तरीके से हल करें' : 'Solve step by step'}</li>
                          <li>{language === 'hi' ? 'अंतिम उत्तर की जांच करें' : 'Verify your final answer'}</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Navigation Sidebar */}
          <div className="space-y-6">
            {/* Navigation Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {t('navigation', 'Navigation', 'नेवीगेशन')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => navigateToQuestion('prev')}
                  disabled={currentFilteredIndex === 0}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('previous', 'Previous', 'पिछला')}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigateToQuestion('next')}
                  disabled={currentFilteredIndex === filteredQuestions.length - 1}
                  className="w-full"
                >
                  {t('next', 'Next', 'अगला')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {t('quickStats', 'Quick Stats', 'त्वरित आंकड़े')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('total', 'Total', 'कुल')}:</span>
                  <span>{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('filtered', 'Filtered', 'फ़िल्टर किए गए')}:</span>
                  <span>{filteredQuestions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('current', 'Current', 'वर्तमान')}:</span>
                  <span>{currentFilteredIndex + 1} / {filteredQuestions.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};