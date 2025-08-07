import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timer } from '@/components/ui/timer';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QuestionCard } from './QuestionCard';
import { AnswerKeyModal } from './AnswerKeyModal';
import { TestResults } from './TestResults';
import { Question, TestAttempt, TestResult } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Clock, Play, Pause, Square, BookOpen, Flag, Calculator, Save, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MockTestEngineProps {
  questions: Question[];
  testTitle: string;
  duration: number; // minutes
  onTestComplete: (result: TestResult) => void;
  onExit: () => void;
}

interface QuestionStatus {
  answered: boolean;
  marked: boolean;
  visited: boolean;
  reviewLater: boolean;
}

export const MockTestEngine: React.FC<MockTestEngineProps> = ({
  questions,
  testTitle,
  duration,
  onTestComplete,
  onExit
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, QuestionStatus>>({});
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // seconds
  const [isTestPaused, setIsTestPaused] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [autoSaveInterval, setAutoSaveInterval] = useState<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion = questions[currentQuestionIndex];

  // Auto-save functionality
  const saveProgress = useCallback(() => {
    const testAttempt: TestAttempt = {
      id: `test_${Date.now()}`,
      testConfigId: testTitle,
      questions,
      answers,
      timeSpent: (duration * 60) - timeRemaining,
      startTime: new Date(),
      submittedAt: null,
      score: 0,
      maxScore: questions.reduce((sum, q) => sum + (q.marks || 3), 0),
      isCompleted: false,
      bookmarked: [],
      visitedQuestions: [],
      timeSpentPerQuestion: {}
    };
    
    localStorage.setItem('currentTest', JSON.stringify(testAttempt));
  }, [answers, timeRemaining, duration, questions, testTitle]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveProgress, 30000);
    setAutoSaveInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [saveProgress]);

  // Timer functionality
  useEffect(() => {
    if (!isTestPaused && !isTestSubmitted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTestPaused, isTestSubmitted, timeRemaining]);

  // Initialize question statuses
  useEffect(() => {
    const initialStatuses: Record<string, QuestionStatus> = {};
    questions.forEach(q => {
      initialStatuses[q.id] = {
        answered: false,
        marked: false,
        visited: false,
        reviewLater: false
      };
    });
    // Mark first question as visited
    if (questions[0]) {
      initialStatuses[questions[0].id].visited = true;
    }
    setQuestionStatuses(initialStatuses);
  }, [questions]);

  const handleAnswerSelect = (answer: any) => {
    const questionId = currentQuestion.id;
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    setQuestionStatuses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answered: true
      }
    }));
  };

  const handleClearAnswer = () => {
    const questionId = currentQuestion.id;
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
    
    setQuestionStatuses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answered: false
      }
    }));
  };

  const handleMarkForReview = () => {
    const questionId = currentQuestion.id;
    setQuestionStatuses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        reviewLater: !prev[questionId].reviewLater
      }
    }));
  };

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      const questionId = questions[index].id;
      setQuestionStatuses(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          visited: true
        }
      }));
      setShowPalette(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  };

  const calculateResult = (): TestResult => {
    let totalScore = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unattempted = 0;
    const subjectWiseAnalysis: Record<string, any> = {};

    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const subject = question.subject;
      
      if (!subjectWiseAnalysis[subject]) {
        subjectWiseAnalysis[subject] = {
          total: 0,
          correct: 0,
          wrong: 0,
          unattempted: 0,
          score: 0,
          maxScore: 0
        };
      }
      
      subjectWiseAnalysis[subject].total++;
      subjectWiseAnalysis[subject].maxScore += question.marks || 3;
      
      if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
        unattempted++;
        subjectWiseAnalysis[subject].unattempted++;
      } else {
        let isCorrect = false;
        
        if (question.questionType === 'multiple-correct' && Array.isArray(question.correctAnswer)) {
          isCorrect = Array.isArray(userAnswer) && 
                     userAnswer.length === (question.correctAnswer as number[]).length &&
                     userAnswer.every(ans => (question.correctAnswer as number[]).includes(ans));
        } else if (question.questionType === 'integer-answer') {
          isCorrect = parseInt(userAnswer) === parseInt(question.correctAnswer as string);
        } else {
          isCorrect = userAnswer === question.correctAnswer;
        }
        
        if (isCorrect) {
          correctAnswers++;
          totalScore += question.marks || 3;
          subjectWiseAnalysis[subject].correct++;
          subjectWiseAnalysis[subject].score += question.marks || 3;
        } else {
          wrongAnswers++;
          totalScore -= question.negativeMarks || 1;
          subjectWiseAnalysis[subject].wrong++;
          subjectWiseAnalysis[subject].score -= question.negativeMarks || 1;
        }
      }
    });

    const maxScore = questions.reduce((sum, q) => sum + (q.marks || 3), 0);
    const percentage = (totalScore / maxScore) * 100;
    const accuracy = correctAnswers / (correctAnswers + wrongAnswers) * 100 || 0;

    return {
      id: `result_${Date.now()}`,
      testAttemptId: `test_${Date.now()}`,
      totalScore: Math.max(0, totalScore),
      maxScore,
      percentage: Math.max(0, percentage),
      percentile: Math.min(99, Math.max(1, percentage + Math.random() * 10)),
      timeTaken: Math.round(((duration * 60) - timeRemaining) / 60),
      questionsCorrect: correctAnswers,
      questionsIncorrect: wrongAnswers,
      questionsUnattempted: unattempted,
      subjectWiseAnalysis: {
        Physics: subjectWiseAnalysis.Physics || { totalQuestions: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0, percentage: 0, timeSpent: 0, accuracy: 0, topicWiseAnalysis: {} },
        Chemistry: subjectWiseAnalysis.Chemistry || { totalQuestions: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0, percentage: 0, timeSpent: 0, accuracy: 0, topicWiseAnalysis: {} },
        Mathematics: subjectWiseAnalysis.Mathematics || { totalQuestions: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0, percentage: 0, timeSpent: 0, accuracy: 0, topicWiseAnalysis: {} }
      },
      strengthTopics: [],
      weaknessTopics: [],
      timeAnalysis: {
        averageTimePerQuestion: Math.round(((duration * 60) - timeRemaining) / questions.length),
        fastestQuestion: 30,
        slowestQuestion: 300,
        timeManagement: percentage > 80 ? 'Excellent' : percentage > 60 ? 'Good' : percentage > 40 ? 'Average' : 'Poor'
      },
      recommendations: generateRecommendations(subjectWiseAnalysis),
      recommendationsHindi: generateRecommendations(subjectWiseAnalysis)
    };
  };

  const generateRecommendations = (analysis: Record<string, any>): string[] => {
    const recommendations: string[] = [];
    
    Object.entries(analysis).forEach(([subject, data]) => {
      const accuracy = data.correct / (data.correct + data.wrong) * 100 || 0;
      if (accuracy < 50) {
        recommendations.push(`${subject} में अधिक अभ्यास की आवश्यकता है`);
      }
      if (data.unattempted > data.total * 0.2) {
        recommendations.push(`${subject} में समय प्रबंधन में सुधार करें`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('बेहतरीन प्रदर्शन! इसी तरह अभ्यास जारी रखें');
    }

    return recommendations;
  };

  const handleSubmitTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    
    setIsTestSubmitted(true);
    const result = calculateResult();
    setTestResult(result);
    setShowResults(true);
    
    // Save to localStorage
    const savedTests = JSON.parse(localStorage.getItem('completedTests') || '[]');
    savedTests.push(result);
    localStorage.setItem('completedTests', JSON.stringify(savedTests));
    localStorage.removeItem('currentTest');
    
    toast({
      title: "टेस्ट सफलतापूर्वक जमा किया गया",
      description: `आपका स्कोर: ${result.totalScore}/${result.maxScore}`,
    });
  };

  const handleAutoSubmit = () => {
    toast({
      title: "समय समाप्त!",
      description: "टेस्ट स्वचालित रूप से जमा किया जा रहा है",
      variant: "destructive"
    });
    handleSubmitTest();
  };

  const getQuestionStatusColor = (questionId: string) => {
    const status = questionStatuses[questionId];
    if (!status) return 'bg-muted';
    
    if (status.answered && status.reviewLater) return 'bg-purple-500';
    if (status.answered) return 'bg-success';
    if (status.reviewLater) return 'bg-warning';
    if (status.visited) return 'bg-destructive';
    return 'bg-muted';
  };

  const getProgressStats = () => {
    const answered = Object.values(questionStatuses).filter(s => s.answered).length;
    const marked = Object.values(questionStatuses).filter(s => s.reviewLater).length;
    const visited = Object.values(questionStatuses).filter(s => s.visited).length;
    const notVisited = questions.length - visited;
    
    return { answered, marked, visited, notVisited };
  };

  if (showResults && testResult) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <TestResults
            testAttempt={{
              id: testResult.id,
              testConfigId: 'mock-test',
              questions,
              answers,
              timeSpent: testResult.timeTaken * 60,
              startTime: new Date(),
              submittedAt: new Date(),
              score: testResult.totalScore,
              maxScore: testResult.maxScore,
              isCompleted: true,
              bookmarked: [],
              visitedQuestions: [],
              timeSpentPerQuestion: {},
              endTime: new Date()
            }}
            questions={questions}
            onReturnToDashboard={onExit}
            onRestartTest={() => window.location.reload()}
            onViewSolutions={() => setShowAnswerKey(true)}
          />
          
          {showAnswerKey && (
            <AnswerKeyModal
              open={showAnswerKey}
              onOpenChange={setShowAnswerKey}
              questions={questions}
              testAttempt={{
                id: testResult.id,
                testConfigId: 'mock-test',
                questions,
                answers,
                timeSpent: testResult.timeTaken * 60,
                startTime: new Date(),
                submittedAt: new Date(),
                score: testResult.totalScore,
                maxScore: testResult.maxScore,
                isCompleted: true,
                bookmarked: [],
                visitedQuestions: [],
                timeSpentPerQuestion: {}
              }}
              onViewSolution={() => {}}
            />
          )}
        </div>
      </div>
    );
  }

  const stats = getProgressStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">{testTitle}</h1>
              <Badge variant="secondary">
                प्रश्न {currentQuestionIndex + 1} / {questions.length}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <Timer 
                timeInSeconds={timeRemaining} 
                critical={timeRemaining < 300}
                showIcon
              />
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTestPaused(!isTestPaused)}
                >
                  {isTestPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {isTestPaused ? 'जारी रखें' : 'रोकें'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveProgress}
                >
                  <Save className="h-4 w-4 mr-2" />
                  सेव करें
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Square className="h-4 w-4 mr-2" />
                      जमा करें
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>टेस्ट जमा करें</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>क्या आप वाकई टेस्ट जमा करना चाहते हैं?</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>हल किए गए: {stats.answered}</div>
                        <div>समीक्षा के लिए: {stats.marked}</div>
                        <div>देखे गए: {stats.visited}</div>
                        <div>नहीं देखे: {stats.notVisited}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSubmitTest} className="flex-1">
                          हाँ, जमा करें
                        </Button>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            रद्द करें
                          </Button>
                        </DialogTrigger>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={(stats.answered / questions.length) * 100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>प्रगति: {stats.answered}/{questions.length}</span>
              <span>{Math.round((stats.answered / questions.length) * 100)}% पूर्ण</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={answers[currentQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
              onClearAnswer={handleClearAnswer}
            />
            
            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  पिछला
                </Button>
                <Button
                  variant="outline"
                  onClick={handleMarkForReview}
                  className={cn(
                    questionStatuses[currentQuestion.id]?.reviewLater && "bg-warning text-warning-foreground"
                  )}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  समीक्षा के लिए
                </Button>
              </div>
              
              <Button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                अगला
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Question Palette */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">प्रश्न पैलेट</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-1 mb-4">
                  {questions.map((question, index) => (
                    <Button
                      key={question.id}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0 text-xs",
                        getQuestionStatusColor(question.id),
                        currentQuestionIndex === index && "ring-2 ring-primary"
                      )}
                      onClick={() => navigateToQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded"></div>
                    <span>उत्तर दिया गया</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-destructive rounded"></div>
                    <span>देखा गया</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-warning rounded"></div>
                    <span>समीक्षा के लिए</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>उत्तर दिया + समीक्षा</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted rounded"></div>
                    <span>नहीं देखा गया</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">सांख्यिकी</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>उत्तर दिए गए:</span>
                    <Badge variant="secondary">{stats.answered}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>समीक्षा के लिए:</span>
                    <Badge variant="secondary">{stats.marked}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>नहीं देखे गए:</span>
                    <Badge variant="secondary">{stats.notVisited}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>कुल प्रश्न:</span>
                    <Badge>{questions.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">निर्देश</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• प्रत्येक प्रश्न के लिए केवल एक सही उत्तर है</p>
                  <p>• गलत उत्तर के लिए नकारात्मक अंक काटे जाएंगे</p>
                  <p>• समय समाप्त होने पर टेस्ट स्वचालित रूप से जमा हो जाएगा</p>
                  <p>• आप किसी भी समय अपना उत्तर बदल सकते हैं</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};