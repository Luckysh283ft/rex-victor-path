import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QuestionCard } from './QuestionCard';
import { TestResults } from './TestResults';
import { Question, TestAttempt, TestResult, SubjectAnalysis } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  BookOpen, 
  Flag, 
  Calculator, 
  Save, 
  AlertTriangle,
  SkipForward,
  SkipBack,
  Grid3X3,
  CheckCircle,
  Circle,
  Timer,
  Award,
  TrendingUp,
  Target,
  FileText,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';

interface ComprehensiveTestEngineProps {
  questions: Question[];
  testTitle: string;
  duration: number; // minutes
  paperNumber: number;
  onTestComplete: (result: TestResult) => void;
  onExit: () => void;
}

interface QuestionStatus {
  answered: boolean;
  marked: boolean;
  visited: boolean;
  reviewLater: boolean;
  timeTaken: number;
}

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'] as const;

export const ComprehensiveTestEngine: React.FC<ComprehensiveTestEngineProps> = ({
  questions,
  testTitle,
  duration,
  paperNumber,
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
  const [showCalculator, setShowCalculator] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion = questions[currentQuestionIndex];

  // Initialize question statuses
  useEffect(() => {
    const statuses: Record<string, QuestionStatus> = {};
    questions.forEach(q => {
      statuses[q.id] = {
        answered: false,
        marked: false,
        visited: false,
        reviewLater: false,
        timeTaken: 0
      };
    });
    setQuestionStatuses(statuses);
  }, [questions]);

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
      bookmarked: Object.entries(questionStatuses)
        .filter(([_, status]) => status.marked)
        .map(([id]) => id),
      visitedQuestions: Object.entries(questionStatuses)
        .filter(([_, status]) => status.visited)
        .map(([id]) => id),
      timeSpentPerQuestion: Object.fromEntries(
        Object.entries(questionStatuses).map(([id, status]) => [id, status.timeTaken])
      )
    };
    
    localStorage.setItem('currentTest', JSON.stringify(testAttempt));
    localStorage.setItem('testAnswers', JSON.stringify(answers));
    localStorage.setItem('questionStatuses', JSON.stringify(questionStatuses));
    
    toast({
      title: "Progress Saved",
      description: "आपकी progress automatically save हो गई है।",
      variant: "default"
    });
  }, [answers, timeRemaining, duration, questions, testTitle, questionStatuses, toast]);

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(saveProgress, 30000);
    
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
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
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTestPaused, isTestSubmitted, timeRemaining]);

  // Track time spent on each question
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  useEffect(() => {
    return () => {
      if (currentQuestion) {
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
        setQuestionStatuses(prev => ({
          ...prev,
          [currentQuestion.id]: {
            ...prev[currentQuestion.id],
            timeTaken: (prev[currentQuestion.id]?.timeTaken || 0) + timeSpent,
            visited: true
          }
        }));
      }
    };
  }, [currentQuestion, questionStartTime]);

  const handleAutoSubmit = useCallback(() => {
    toast({
      title: "Time Up!",
      description: "समय समाप्त! Test automatically submit हो रहा है।",
      variant: "destructive"
    });
    
    setTimeout(() => {
      handleSubmitTest();
    }, 2000);
  }, []);

  const calculateDetailedResults = useCallback((): TestResult => {
    let totalScore = 0;
    let totalMarks = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unattemptedAnswers = 0;
    
    const subjectWiseAnalysis: Record<string, SubjectAnalysis> = {};
    
    // Initialize subject analysis
    SUBJECTS.forEach(subject => {
      subjectWiseAnalysis[subject] = {
        totalQuestions: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        score: 0,
        maxScore: 0,
        percentage: 0,
        timeSpent: 0,
        accuracy: 0,
        topicWiseAnalysis: {}
      };
    });

    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isAnswered = userAnswer !== undefined && userAnswer !== null && userAnswer !== '';
      const subject = question.subject as keyof typeof subjectWiseAnalysis;
      
      totalMarks += question.marks;
      subjectWiseAnalysis[subject].totalQuestions++;
      subjectWiseAnalysis[subject].maxScore += question.marks;
      subjectWiseAnalysis[subject].timeSpent += questionStatuses[question.id]?.timeTaken || 0;
      
      // Initialize topic analysis if not exists
      if (!subjectWiseAnalysis[subject].topicWiseAnalysis[question.topic]) {
        subjectWiseAnalysis[subject].topicWiseAnalysis[question.topic] = {
          correct: 0,
          total: 0,
          percentage: 0
        };
      }
      subjectWiseAnalysis[subject].topicWiseAnalysis[question.topic].total++;

      if (!isAnswered) {
        unattemptedAnswers++;
        subjectWiseAnalysis[subject].unattempted++;
        return;
      }

      const isCorrect = checkAnswer(question, userAnswer);
      
      if (isCorrect) {
        correctAnswers++;
        totalScore += question.marks;
        subjectWiseAnalysis[subject].correct++;
        subjectWiseAnalysis[subject].score += question.marks;
        subjectWiseAnalysis[subject].topicWiseAnalysis[question.topic].correct++;
      } else {
        incorrectAnswers++;
        totalScore -= question.negativeMarks;
        subjectWiseAnalysis[subject].incorrect++;
        subjectWiseAnalysis[subject].score -= question.negativeMarks;
      }
    });

    // Calculate percentages and accuracy
    Object.keys(subjectWiseAnalysis).forEach(subject => {
      const analysis = subjectWiseAnalysis[subject];
      analysis.percentage = analysis.maxScore > 0 ? (analysis.score / analysis.maxScore) * 100 : 0;
      analysis.accuracy = analysis.totalQuestions > 0 ? 
        (analysis.correct / (analysis.correct + analysis.incorrect || 1)) * 100 : 0;
      
      // Calculate topic-wise percentages
      Object.keys(analysis.topicWiseAnalysis).forEach(topic => {
        const topicAnalysis = analysis.topicWiseAnalysis[topic];
        topicAnalysis.percentage = topicAnalysis.total > 0 ? 
          (topicAnalysis.correct / topicAnalysis.total) * 100 : 0;
      });
    });

    const percentage = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;
    const percentile = Math.max(0, Math.min(100, 50 + (percentage - 50) * 0.8 + Math.random() * 10));
    
    // Time analysis
    const totalTimeSpent = (duration * 60) - timeRemaining;
    const averageTimePerQuestion = totalTimeSpent / questions.length;
    const answeredQuestions = Object.entries(questionStatuses).filter(([_, status]) => status.timeTaken > 0);
    const fastestTime = Math.min(...answeredQuestions.map(([_, status]) => status.timeTaken));
    const slowestTime = Math.max(...answeredQuestions.map(([_, status]) => status.timeTaken));
    
    let timeManagement: 'Excellent' | 'Good' | 'Average' | 'Poor';
    if (averageTimePerQuestion <= 120) timeManagement = 'Excellent';
    else if (averageTimePerQuestion <= 180) timeManagement = 'Good';
    else if (averageTimePerQuestion <= 240) timeManagement = 'Average';
    else timeManagement = 'Poor';

    // Identify strengths and weaknesses
    const strengthTopics: string[] = [];
    const weaknessTopics: string[] = [];
    
    Object.values(subjectWiseAnalysis).forEach(analysis => {
      Object.entries(analysis.topicWiseAnalysis).forEach(([topic, topicData]) => {
        if (topicData.percentage >= 70) {
          strengthTopics.push(topic);
        } else if (topicData.percentage < 40) {
          weaknessTopics.push(topic);
        }
      });
    });

    // Generate recommendations
    const recommendations: string[] = [];
    const recommendationsHindi: string[] = [];
    
    if (percentage >= 80) {
      recommendations.push("Excellent performance! Keep up the great work.");
      recommendationsHindi.push("शानदार प्रदर्शन! इसी तरह मेहनत करते रहें।");
    } else if (percentage >= 60) {
      recommendations.push("Good performance. Focus on weak areas for improvement.");
      recommendationsHindi.push("अच्छा प्रदर्शन। कमजोर क्षेत्रों पर ध्यान दें।");
    } else {
      recommendations.push("Need more practice. Focus on fundamentals.");
      recommendationsHindi.push("अधिक अभ्यास की जरूरत। बुनियादी बातों पर ध्यान दें।");
    }
    
    if (timeManagement === 'Poor') {
      recommendations.push("Work on time management skills.");
      recommendationsHindi.push("समय प्रबंधन कौशल पर काम करें।");
    }
    
    if (weaknessTopics.length > 0) {
      recommendations.push(`Focus on: ${weaknessTopics.slice(0, 3).join(', ')}`);
      recommendationsHindi.push(`इन विषयों पर ध्यान दें: ${weaknessTopics.slice(0, 3).join(', ')}`);
    }

    return {
      id: `result_${Date.now()}`,
      testAttemptId: `test_${Date.now()}`,
      totalScore,
      maxScore: totalMarks,
      percentage,
      percentile,
      timeTaken: Math.floor(totalTimeSpent / 60),
      questionsCorrect: correctAnswers,
      questionsIncorrect: incorrectAnswers,
      questionsUnattempted: unattemptedAnswers,
      subjectWiseAnalysis: subjectWiseAnalysis as any,
      strengthTopics,
      weaknessTopics,
      timeAnalysis: {
        averageTimePerQuestion,
        fastestQuestion: fastestTime,
        slowestQuestion: slowestTime,
        timeManagement
      },
      recommendations,
      recommendationsHindi
    };
  }, [answers, questions, questionStatuses, duration, timeRemaining]);

  const checkAnswer = (question: Question, userAnswer: any): boolean => {
    if (question.questionType === 'single-correct') {
      return userAnswer === question.correctAnswer;
    } else if (question.questionType === 'multiple-correct') {
      const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
      const userAnswers = Array.isArray(userAnswer) ? userAnswer.sort() : [];
      return JSON.stringify(correctAnswers.sort()) === JSON.stringify(userAnswers);
    } else if (question.questionType === 'integer-answer') {
      return String(userAnswer) === String(question.correctAnswer);
    }
    return false;
  };

  const handleSubmitTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (autoSaveRef.current) {
      clearInterval(autoSaveRef.current);
    }

    setIsTestSubmitted(true);
    
    // Calculate final time for current question
    if (currentQuestion) {
      const finalTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      setQuestionStatuses(prev => ({
        ...prev,
        [currentQuestion.id]: {
          ...prev[currentQuestion.id],
          timeTaken: (prev[currentQuestion.id]?.timeTaken || 0) + finalTimeSpent
        }
      }));
    }

    const result = calculateDetailedResults();
    setTestResult(result);
    
    // Save test attempt to history
    const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    const testAttempt: TestAttempt = {
      id: result.testAttemptId,
      testConfigId: testTitle,
      questions,
      answers,
      timeSpent: result.timeTaken,
      startTime: new Date(Date.now() - ((duration * 60 - timeRemaining) * 1000)),
      submittedAt: new Date(),
      score: result.totalScore,
      maxScore: result.maxScore,
      isCompleted: true,
      bookmarked: Object.entries(questionStatuses)
        .filter(([_, status]) => status.marked)
        .map(([id]) => id),
      visitedQuestions: Object.entries(questionStatuses)
        .filter(([_, status]) => status.visited)
        .map(([id]) => id),
      timeSpentPerQuestion: Object.fromEntries(
        Object.entries(questionStatuses).map(([id, status]) => [id, status.timeTaken])
      )
    };
    
    testHistory.push(testAttempt);
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
    localStorage.removeItem('currentTest');
    localStorage.removeItem('testAnswers');
    localStorage.removeItem('questionStatuses');
    
    setShowResults(true);
    onTestComplete(result);
    
    toast({
      title: "Test Submitted Successfully!",
      description: "आपका test submit हो गया है। Results देखें।",
      variant: "default"
    });
  }, [currentQuestion, questionStartTime, calculateDetailedResults, testTitle, questions, answers, duration, timeRemaining, questionStatuses, onTestComplete, toast]);

  const handleSaveAnswer = useCallback((questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    setQuestionStatuses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answered: answer !== undefined && answer !== null && answer !== '',
        visited: true
      }
    }));
  }, []);

  const handleMarkForReview = useCallback((questionId: string) => {
    setQuestionStatuses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        marked: !prev[questionId]?.marked,
        visited: true
      }
    }));
  }, []);

  const navigateToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      // Save time spent on current question
      if (currentQuestion) {
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
        setQuestionStatuses(prev => ({
          ...prev,
          [currentQuestion.id]: {
            ...prev[currentQuestion.id],
            timeTaken: (prev[currentQuestion.id]?.timeTaken || 0) + timeSpent,
            visited: true
          }
        }));
      }
      
      setCurrentQuestionIndex(index);
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion, questionStartTime]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length, navigateToQuestion]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, navigateToQuestion]);

  const pauseTest = useCallback(() => {
    setIsTestPaused(true);
    toast({
      title: "Test Paused",
      description: "Test को resume करने के लिए Resume button दबाएं।",
      variant: "default"
    });
  }, [toast]);

  const resumeTest = useCallback(() => {
    setIsTestPaused(false);
    toast({
      title: "Test Resumed",
      description: "Test resume हो गया है। All the best!",
      variant: "default"
    });
  }, [toast]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatusColor = (questionId: string): string => {
    const status = questionStatuses[questionId];
    if (!status) return 'bg-muted';
    
    if (status.answered && status.marked) return 'bg-purple-500';
    if (status.answered) return 'bg-success';
    if (status.marked) return 'bg-warning';
    if (status.visited) return 'bg-destructive';
    return 'bg-muted';
  };

  const getProgressStats = () => {
    const answered = Object.values(questionStatuses).filter(s => s.answered).length;
    const marked = Object.values(questionStatuses).filter(s => s.marked).length;
    const visited = Object.values(questionStatuses).filter(s => s.visited).length;
    const remaining = questions.length - answered;
    
    return { answered, marked, visited, remaining };
  };

  const generateAnswerKeyPDF = useCallback(async () => {
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = 20;
    
    // Title
    pdf.setFontSize(16);
    pdf.text(`JEE Advanced ${testTitle} - Answer Key`, 20, yPosition);
    yPosition += 20;
    
    // Test info
    pdf.setFontSize(12);
    pdf.text(`Paper: ${paperNumber}`, 20, yPosition);
    pdf.text(`Total Questions: ${questions.length}`, 120, yPosition);
    yPosition += 10;
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
    pdf.text(`Duration: ${duration} minutes`, 120, yPosition);
    yPosition += 20;
    
    // Subjects
    SUBJECTS.forEach(subject => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.text(`${subject}`, 20, yPosition);
      yPosition += 15;
      
      const subjectQuestions = questions.filter(q => q.subject === subject);
      
      subjectQuestions.forEach((question, index) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(10);
        const questionNumber = questions.indexOf(question) + 1;
        const userAnswer = answers[question.id];
        const isCorrect = checkAnswer(question, userAnswer);
        const status = isCorrect ? '✓' : userAnswer !== undefined ? '✗' : '-';
        
        pdf.text(`Q${questionNumber}. Correct: ${getAnswerDisplay(question.correctAnswer, question)} | Your: ${getAnswerDisplay(userAnswer, question)} | ${status}`, 20, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
    });
    
    // Save PDF
    pdf.save(`JEE_Advanced_${testTitle}_Paper_${paperNumber}_Answer_Key.pdf`);
    
    toast({
      title: "Answer Key Downloaded",
      description: "Answer key PDF successfully download हो गई है।",
      variant: "default"
    });
  }, [answers, questions, testTitle, paperNumber, duration, toast]);

  const getAnswerDisplay = (answer: any, question: Question): string => {
    if (answer === undefined || answer === null || answer === '') return 'Not Attempted';
    
    if (question.questionType === 'integer-answer') {
      return String(answer);
    } else if (question.questionType === 'multiple-correct') {
      if (Array.isArray(answer)) {
        return answer.map(i => String.fromCharCode(65 + i)).join(', ');
      }
      return String(answer);
    } else {
      if (typeof answer === 'number') {
        return String.fromCharCode(65 + answer);
      }
      return String(answer);
    }
  };

  // Show results if test is submitted
  if (showResults && testResult) {
    // Construct a TestAttempt for TestResults component
    const constructedAttempt: TestAttempt = {
      id: testResult.testAttemptId,
      testConfigId: testTitle,
      startTime: new Date(Date.now() - ((duration * 60 - timeRemaining) * 1000)),
      endTime: new Date(),
      answers,
      bookmarked: Object.entries(questionStatuses).filter(([_, s]) => s.marked).map(([id]) => id),
      visitedQuestions: Object.entries(questionStatuses).filter(([_, s]) => s.visited).map(([id]) => id),
      timeSpentPerQuestion: Object.fromEntries(Object.entries(questionStatuses).map(([id, s]) => [id, s.timeTaken])),
      isCompleted: true,
      score: testResult.totalScore,
      percentile: testResult.percentile,
      questions,
      timeSpent: (duration * 60) - timeRemaining,
      submittedAt: new Date(),
      maxScore: testResult.maxScore,
    };

    return (
      <div className="min-h-screen bg-gradient-hero p-4">
        <TestResults 
          testAttempt={constructedAttempt}
          questions={questions}
          onViewSolutions={() => setShowAnswerKey(true)}
          onRestartTest={onExit}
          onReturnToDashboard={onExit}
        />
        
        {showAnswerKey && (
          <Dialog open={showAnswerKey} onOpenChange={setShowAnswerKey}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-devanagari">विस्तृत उत्तर कुंजी</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = checkAnswer(question, userAnswer);
                  
                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">Q{index + 1}</Badge>
                        <Badge variant={isCorrect ? "default" : userAnswer !== undefined ? "destructive" : "secondary"}>
                          {isCorrect ? '✓ सही' : userAnswer !== undefined ? '✗ गलत' : '- नहीं किया'}
                        </Badge>
                      </div>
                      
                      <p className="font-devanagari mb-2">{question.questionTextHindi}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>सही उत्तर:</strong> {getAnswerDisplay(question.correctAnswer, question)}
                        </div>
                        <div>
                          <strong>आपका उत्तर:</strong> {getAnswerDisplay(userAnswer, question)}
                        </div>
                      </div>
                      
                      {question.explanationHindi && (
                        <div className="mt-3 p-3 bg-muted rounded">
                          <strong>व्याख्या:</strong>
                          <p className="font-devanagari mt-1">{question.explanationHindi}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  if (isTestPaused) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-card border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="font-devanagari text-foreground">
              <Pause className="h-8 w-8 mx-auto mb-2 text-warning" />
              Test रुका हुआ है
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Timer className="h-4 w-4" />
              <AlertDescription className="font-devanagari">
                समय रुक गया है। आप जब तैयार हों तो Resume करें।
              </AlertDescription>
            </Alert>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                {formatTime(timeRemaining)}
              </div>
              <p className="text-sm text-muted-foreground font-devanagari">
                बचा हुआ समय
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={resumeTest} className="flex-1 bg-gradient-primary">
                <Play className="h-4 w-4 mr-2" />
                Resume Test
              </Button>
              <Button variant="outline" onClick={onExit}>
                <Square className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getProgressStats();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="bg-gradient-card border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold font-devanagari text-foreground">
              {testTitle} - Paper {paperNumber}
            </h1>
            <Badge variant="outline" className="font-devanagari">
              प्रश्न {currentQuestionIndex + 1} / {questions.length}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg border border-border/50">
              <Clock className={cn(
                "h-4 w-4",
                timeRemaining < 600 ? "text-destructive animate-pulse" : "text-primary"
              )} />
              <span className={cn(
                "font-mono font-bold",
                timeRemaining < 600 ? "text-destructive" : "text-foreground"
              )}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCalculator(!showCalculator)}
              >
                <Calculator className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={saveProgress}
              >
                <Save className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={isTestPaused ? resumeTest : pauseTest}
              >
                {isTestPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSubmitTest}
              >
                <Square className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Main content */}
        <div className="flex-1 p-4">
          <div className="space-y-4">
            {/* Question card */}
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={typeof answers[currentQuestion.id] === 'number' ? answers[currentQuestion.id] : undefined}
              onAnswerSelect={(index) => handleSaveAnswer(currentQuestion.id, index)}
              onClearAnswer={() => handleSaveAnswer(currentQuestion.id, undefined)}
            />
            
            {/* Navigation */}
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <SkipBack className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowPalette(true)}
                    >
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Question Palette
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleSaveAnswer(currentQuestion.id, null)}
                    >
                      Clear Response
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                    <SkipForward className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 p-4 border-l border-border/50">
          <div className="space-y-4">
            {/* Progress stats */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-devanagari">Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-success/20 rounded">
                    <div className="font-bold text-success">{stats.answered}</div>
                    <div className="text-xs font-devanagari">Answered</div>
                  </div>
                  <div className="text-center p-2 bg-warning/20 rounded">
                    <div className="font-bold text-warning">{stats.marked}</div>
                    <div className="text-xs font-devanagari">Marked</div>
                  </div>
                  <div className="text-center p-2 bg-destructive/20 rounded">
                    <div className="font-bold text-destructive">{stats.visited}</div>
                    <div className="text-xs font-devanagari">Visited</div>
                  </div>
                  <div className="text-center p-2 bg-muted/20 rounded">
                    <div className="font-bold text-muted-foreground">{stats.remaining}</div>
                    <div className="text-xs font-devanagari">Remaining</div>
                  </div>
                </div>
                
                <Progress 
                  value={(stats.answered / questions.length) * 100} 
                  className="h-2" 
                />
                <p className="text-xs text-center text-muted-foreground font-devanagari">
                  {Math.round((stats.answered / questions.length) * 100)}% Complete
                </p>
              </CardContent>
            </Card>

            {/* Subject-wise quick access */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-devanagari">Subject Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {SUBJECTS.map((subject, index) => {
                  const startIndex = index * 18;
                  const subjectQuestions = questions.slice(startIndex, startIndex + 18);
                  const subjectAnswered = subjectQuestions.filter(q => 
                    questionStatuses[q.id]?.answered
                  ).length;
                  
                  return (
                    <Button
                      key={subject}
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToQuestion(startIndex)}
                      className="w-full justify-between"
                    >
                      <span className="font-devanagari">
                        {subject === 'Physics' ? 'भौतिकी' :
                         subject === 'Chemistry' ? 'रसायन' : 'गणित'}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {subjectAnswered}/18
                      </Badge>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-devanagari">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 font-devanagari">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning rounded"></div>
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>Answered & Marked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-destructive rounded"></div>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted rounded border"></div>
                  <span>Not Visited</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Question Palette Modal */}
      <Dialog open={showPalette} onOpenChange={setShowPalette}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="font-devanagari">Question Palette</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[500px] p-4">
            {SUBJECTS.map((subject, subjectIndex) => (
              <div key={subject} className="mb-6">
                <h3 className="font-semibold mb-3 font-devanagari">
                  {subject === 'Physics' ? 'भौतिकी' :
                   subject === 'Chemistry' ? 'रसायन विज्ञान' : 'गणित'}
                </h3>
                
                <div className="grid grid-cols-9 gap-2">
                  {questions.slice(subjectIndex * 18, (subjectIndex + 1) * 18).map((question, index) => {
                    const globalIndex = subjectIndex * 18 + index;
                    return (
                      <Button
                        key={question.id}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigateToQuestion(globalIndex);
                          setShowPalette(false);
                        }}
                        className={cn(
                          "w-10 h-10 p-0 text-xs",
                          globalIndex === currentQuestionIndex && "ring-2 ring-primary",
                          getQuestionStatusColor(question.id)
                        )}
                      >
                        {globalIndex + 1}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Calculator Modal */}
      {showCalculator && (
        <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Calculator</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <div className="text-center text-muted-foreground font-devanagari">
                Basic calculator functionality
                <br />
                (Implementation can be added based on requirements)
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};