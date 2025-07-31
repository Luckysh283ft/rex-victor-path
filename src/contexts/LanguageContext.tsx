import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, englishText: string, hindiText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  // Navigation and UI
  welcome: { en: 'Welcome to Rex JEE', hi: 'रेक्स JEE में आपका स्वागत है' },
  startTest: { en: 'Start Test', hi: 'टेस्ट शुरू करें' },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  myTests: { en: 'My Tests', hi: 'मेरे टेस्ट' },
  results: { en: 'Results', hi: 'परिणाम' },
  profile: { en: 'Profile', hi: 'प्रोफाइल' },
  settings: { en: 'Settings', hi: 'सेटिंग्स' },
  help: { en: 'Help', hi: 'सहायता' },
  
  // Test Interface
  timeRemaining: { en: 'Time Remaining', hi: 'समय बचा' },
  question: { en: 'Question', hi: 'प्रश्न' },
  of: { en: 'of', hi: 'का' },
  next: { en: 'Next', hi: 'अगला' },
  previous: { en: 'Previous', hi: 'पिछला' },
  submit: { en: 'Submit', hi: 'जमा करें' },
  bookmark: { en: 'Bookmark', hi: 'बुकमार्क' },
  clear: { en: 'Clear', hi: 'साफ़ करें' },
  showSolution: { en: 'Show Solution', hi: 'समाधान दिखाएं' },
  hideSolution: { en: 'Hide Solution', hi: 'समाधान छुपाएं' },
  
  // Subjects
  physics: { en: 'Physics', hi: 'भौतिकी' },
  chemistry: { en: 'Chemistry', hi: 'रसायन विज्ञान' },
  mathematics: { en: 'Mathematics', hi: 'गणित' },
  
  // Difficulty Levels
  easy: { en: 'Easy', hi: 'आसान' },
  medium: { en: 'Medium', hi: 'मध्यम' },
  hard: { en: 'Hard', hi: 'कठिन' },
  
  // Test Types
  fullTest: { en: 'Full Test', hi: 'पूर्ण टेस्ट' },
  subjectTest: { en: 'Subject Test', hi: 'विषय टेस्ट' },
  topicTest: { en: 'Topic Test', hi: 'टॉपिक टेस्ट' },
  customTest: { en: 'Custom Test', hi: 'कस्टम टेस्ट' },
  
  // Status Messages
  loading: { en: 'Loading...', hi: 'लोड हो रहा है...' },
  saving: { en: 'Saving...', hi: 'सेव हो रहा है...' },
  saved: { en: 'Saved successfully', hi: 'सफलतापूर्वक सेव हो गया' },
  error: { en: 'An error occurred', hi: 'एक त्रुटि हुई' },
  
  // Confirmations
  submitTest: { en: 'Are you sure you want to submit the test?', hi: 'क्या आप वाकई टेस्ट सबमिट करना चाहते हैं?' },
  exitTest: { en: 'Are you sure you want to exit the test?', hi: 'क्या आप वाकई टेस्ट से बाहर निकलना चाहते हैं?' },
  
  // Results
  score: { en: 'Score', hi: 'अंक' },
  percentage: { en: 'Percentage', hi: 'प्रतिशत' },
  percentile: { en: 'Percentile', hi: 'प्रतिशतांक' },
  correct: { en: 'Correct', hi: 'सही' },
  incorrect: { en: 'Incorrect', hi: 'गलत' },
  unattempted: { en: 'Unattempted', hi: 'अनुत्तरित' },
  timeTaken: { en: 'Time Taken', hi: 'लिया गया समय' },
  
  // Performance Analysis
  excellent: { en: 'Excellent', hi: 'उत्कृष्ट' },
  good: { en: 'Good', hi: 'अच्छा' },
  average: { en: 'Average', hi: 'औसत' },
  poor: { en: 'Poor', hi: 'खराब' },
  needsImprovement: { en: 'Needs Improvement', hi: 'सुधार की जरूरत' },
  
  // Time Units
  hours: { en: 'hours', hi: 'घंटे' },
  minutes: { en: 'minutes', hi: 'मिनट' },
  seconds: { en: 'seconds', hi: 'सेकंड' },
  
  // Common Actions
  continue: { en: 'Continue', hi: 'जारी रखें' },
  cancel: { en: 'Cancel', hi: 'रद्द करें' },
  confirm: { en: 'Confirm', hi: 'पुष्टि करें' },
  retry: { en: 'Retry', hi: 'पुनः प्रयास करें' },
  
  // Achievement Messages
  firstTest: { en: 'Completed your first test!', hi: 'आपका पहला टेस्ट पूरा हुआ!' },
  perfectScore: { en: 'Perfect Score Achievement!', hi: 'परफेक्ट स्कोर उपलब्धि!' },
  streak: { en: 'Daily Streak Maintained!', hi: 'दैनिक स्ट्रीक बनाए रखी!' }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('rex-language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('rex-language', lang);
  };

  const t = (key: string, englishText: string, hindiText: string): string => {
    return language === 'hi' ? hindiText : englishText;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: changeLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};