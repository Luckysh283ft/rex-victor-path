// Rex JEE Mock Test Application Types

export interface Question {
  id: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  subjectHindi: 'भौतिकी' | 'रसायन विज्ञान' | 'गणित';
  topic: string;
  topicHindi: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  difficultyHindi: 'आसान' | 'मध्यम' | 'कठिन';
  questionText: string;
  questionTextHindi: string;
  options: string[];
  optionsHindi: string[];
  correctAnswer: number;
  explanation: string;
  explanationHindi: string;
  formula?: string;
  formulaHindi?: string;
  marks: number;
  timeEstimate: number; // in seconds
}

export interface TestConfiguration {
  id: string;
  name: string;
  nameHindi: string;
  type: 'Full Test' | 'Subject Test' | 'Topic Test' | 'Custom';
  typeHindi: 'पूर्ण टेस्ट' | 'विषय टेस्ट' | 'टॉपिक टेस्ट' | 'कस्टम';
  subjects: ('Physics' | 'Chemistry' | 'Mathematics')[];
  totalQuestions: number;
  duration: number; // in minutes
  physicsQuestions: number;
  chemistryQuestions: number;
  mathQuestions: number;
  negativeMarking: boolean;
  marksPerQuestion: number;
  negativeMarks: number;
}

export interface TestAttempt {
  id: string;
  testConfigId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  answers: Record<string, number>;
  bookmarked: string[];
  visitedQuestions: string[];
  timeSpentPerQuestion: Record<string, number>;
  isCompleted: boolean;
  score?: number;
  percentile?: number;
  subjectWiseScore?: {
    Physics: { correct: number; incorrect: number; unattempted: number; marks: number };
    Chemistry: { correct: number; incorrect: number; unattempted: number; marks: number };
    Mathematics: { correct: number; incorrect: number; unattempted: number; marks: number };
  };
}

export interface TestResult {
  id: string;
  testAttemptId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  percentile: number;
  timeTaken: number; // in minutes
  questionsCorrect: number;
  questionsIncorrect: number;
  questionsUnattempted: number;
  subjectWiseAnalysis: {
    Physics: SubjectAnalysis;
    Chemistry: SubjectAnalysis;
    Mathematics: SubjectAnalysis;
  };
  strengthTopics: string[];
  weaknessTopics: string[];
  timeAnalysis: {
    averageTimePerQuestion: number;
    fastestQuestion: number;
    slowestQuestion: number;
    timeManagement: 'Excellent' | 'Good' | 'Average' | 'Poor';
  };
  recommendations: string[];
  recommendationsHindi: string[];
}

export interface SubjectAnalysis {
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  accuracy: number;
  topicWiseAnalysis: Record<string, {
    correct: number;
    total: number;
    percentage: number;
  }>;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  targetExam: 'JEE Main' | 'JEE Advanced' | 'Both';
  targetYear: number;
  currentClass: '11th' | '12th' | 'Dropper';
  preferredLanguage: 'English' | 'Hindi' | 'Both';
  strongSubjects: ('Physics' | 'Chemistry' | 'Mathematics')[];
  weakSubjects: ('Physics' | 'Chemistry' | 'Mathematics')[];
  dailyTarget: number; // questions per day
  studyHours: number;
  testHistory: string[];
  achievements: Achievement[];
  totalTestsTaken: number;
  averageScore: number;
  bestScore: number;
  currentStreak: number;
  longestStreak: number;
}

export interface Achievement {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  icon: string;
  category: 'Tests' | 'Score' | 'Streak' | 'Subject' | 'Time' | 'Special';
  dateEarned: Date;
  points: number;
}

export interface StudyMaterial {
  id: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  topic: string;
  topicHindi: string;
  type: 'Formula' | 'Concept' | 'Trick' | 'Example';
  title: string;
  titleHindi: string;
  content: string;
  contentHindi: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  tags: string[];
  relatedQuestions: string[];
}

export type Language = 'en' | 'hi';

export interface AppSettings {
  language: Language;
  theme: 'dark' | 'light';
  fontSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoSave: boolean;
  showFormulas: boolean;
  showHints: boolean;
  negativeMarkingWarning: boolean;
}