import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Question, TestAttempt, TestConfiguration } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface TestContextType {
  currentTest: TestAttempt | null;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  bookmarkedQuestions: string[];
  timeRemaining: number;
  isTestActive: boolean;
  isTestCompleted: boolean;
  
  // Actions
  startTest: (config: TestConfiguration, questions: Question[]) => void;
  submitTest: () => void;
  saveAnswer: (questionId: string, answer: number) => void;
  clearAnswer: (questionId: string) => void;
  toggleBookmark: (questionId: string) => void;
  navigateToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  pauseTest: () => void;
  resumeTest: () => void;
  
  // Data
  questions: Question[];
  testConfig: TestConfiguration | null;
  getQuestionStatus: (questionId: string) => 'answered' | 'bookmarked' | 'visited' | 'unvisited';
  getProgressStats: () => {
    answered: number;
    bookmarked: number;
    visited: number;
    remaining: number;
  };
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTest, setCurrentTest] = useState<TestAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testConfig, setTestConfig] = useState<TestConfiguration | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  
  const { toast } = useToast();

  // Auto-save functionality
  useEffect(() => {
    if (currentTest && isTestActive && !isPaused) {
      const autoSaveInterval = setInterval(() => {
        // Save to localStorage
        const testData = {
          currentTest,
          answers,
          bookmarkedQuestions,
          visitedQuestions,
          currentQuestionIndex,
          timeRemaining,
          lastSaved: new Date().toISOString()
        };
        localStorage.setItem(`rex-test-${currentTest.id}`, JSON.stringify(testData));
      }, 10000); // Auto-save every 10 seconds

      return () => clearInterval(autoSaveInterval);
    }
  }, [currentTest, answers, bookmarkedQuestions, visitedQuestions, currentQuestionIndex, timeRemaining, isTestActive, isPaused]);

  // Timer functionality
  useEffect(() => {
    if (isTestActive && !isPaused && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTestActive, isPaused, timeRemaining]);

  const startTest = useCallback((config: TestConfiguration, testQuestions: Question[]) => {
    const newTest: TestAttempt = {
      id: `test_${Date.now()}`,
      testConfigId: config.id,
      userId: 'user_1', // Would come from auth context
      startTime: new Date(),
      answers: {},
      bookmarked: [],
      visitedQuestions: [],
      timeSpentPerQuestion: {},
      isCompleted: false
    };

    setCurrentTest(newTest);
    setTestConfig(config);
    setQuestions(testQuestions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setBookmarkedQuestions([]);
    setVisitedQuestions([testQuestions[0]?.id || '']);
    setTimeRemaining(config.duration * 60); // Convert minutes to seconds
    setIsTestActive(true);
    setIsTestCompleted(false);
    setIsPaused(false);

    toast({
      title: "Test Started",
      description: `${config.name} has begun. Good luck!`,
    });
  }, [toast]);

  const submitTest = useCallback(() => {
    if (!currentTest) return;

    const completedTest: TestAttempt = {
      ...currentTest,
      endTime: new Date(),
      answers,
      bookmarked: bookmarkedQuestions,
      visitedQuestions,
      isCompleted: true
    };

    setCurrentTest(completedTest);
    setIsTestActive(false);
    setIsTestCompleted(true);

    // Save final results
    localStorage.setItem(`rex-test-result-${currentTest.id}`, JSON.stringify(completedTest));
    localStorage.removeItem(`rex-test-${currentTest.id}`);

    toast({
      title: "Test Submitted",
      description: "Your test has been submitted successfully!",
    });
  }, [currentTest, answers, bookmarkedQuestions, visitedQuestions, toast]);

  const saveAnswer = useCallback((questionId: string, answer: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Mark question as visited if not already
    if (!visitedQuestions.includes(questionId)) {
      setVisitedQuestions(prev => [...prev, questionId]);
    }

    toast({
      title: "Answer Saved",
      description: "Your answer has been saved automatically.",
      duration: 1000,
    });
  }, [visitedQuestions, toast]);

  const clearAnswer = useCallback((questionId: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });

    toast({
      title: "Answer Cleared",
      description: "Your answer has been cleared.",
      duration: 1000,
    });
  }, [toast]);

  const toggleBookmark = useCallback((questionId: string) => {
    setBookmarkedQuestions(prev => {
      const isBookmarked = prev.includes(questionId);
      if (isBookmarked) {
        toast({
          title: "Bookmark Removed",
          description: "Question bookmark has been removed.",
          duration: 1000,
        });
        return prev.filter(id => id !== questionId);
      } else {
        toast({
          title: "Question Bookmarked",
          description: "Question has been bookmarked for review.",
          duration: 1000,
        });
        return [...prev, questionId];
      }
    });
  }, [toast]);

  const navigateToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      const questionId = questions[index].id;
      
      if (!visitedQuestions.includes(questionId)) {
        setVisitedQuestions(prev => [...prev, questionId]);
      }
    }
  }, [questions, visitedQuestions]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length, navigateToQuestion]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, navigateToQuestion]);

  const pauseTest = useCallback(() => {
    setIsPaused(true);
    toast({
      title: "Test Paused",
      description: "Your test has been paused. Timer is stopped.",
    });
  }, [toast]);

  const resumeTest = useCallback(() => {
    setIsPaused(false);
    toast({
      title: "Test Resumed",
      description: "Your test has been resumed. Timer is running.",
    });
  }, [toast]);

  const getQuestionStatus = useCallback((questionId: string): 'answered' | 'bookmarked' | 'visited' | 'unvisited' => {
    if (answers[questionId] !== undefined) return 'answered';
    if (bookmarkedQuestions.includes(questionId)) return 'bookmarked';
    if (visitedQuestions.includes(questionId)) return 'visited';
    return 'unvisited';
  }, [answers, bookmarkedQuestions, visitedQuestions]);

  const getProgressStats = useCallback(() => {
    const answered = Object.keys(answers).length;
    const bookmarked = bookmarkedQuestions.length;
    const visited = visitedQuestions.length;
    const remaining = questions.length - visited;

    return { answered, bookmarked, visited, remaining };
  }, [answers, bookmarkedQuestions, visitedQuestions, questions.length]);

  // Load saved test on component mount
  useEffect(() => {
    const savedTests = Object.keys(localStorage)
      .filter(key => key.startsWith('rex-test-'))
      .map(key => localStorage.getItem(key))
      .filter(Boolean)
      .map(data => JSON.parse(data!))
      .filter(test => !test.isCompleted);

    if (savedTests.length > 0) {
      const latestTest = savedTests[savedTests.length - 1];
      // Could restore the latest incomplete test here
      console.log('Found incomplete test:', latestTest);
    }
  }, []);

  const currentQuestion = questions[currentQuestionIndex] || null;

  return (
    <TestContext.Provider value={{
      currentTest,
      currentQuestion,
      currentQuestionIndex,
      answers,
      bookmarkedQuestions,
      timeRemaining,
      isTestActive,
      isTestCompleted,
      questions,
      testConfig,
      
      startTest,
      submitTest,
      saveAnswer,
      clearAnswer,
      toggleBookmark,
      navigateToQuestion,
      nextQuestion,
      previousQuestion,
      pauseTest,
      resumeTest,
      getQuestionStatus,
      getProgressStats
    }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};