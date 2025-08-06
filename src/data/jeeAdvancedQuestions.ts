import { Question } from '@/types';

export const jeeAdvancedQuestions: Question[] = [
  // Sample questions for demo
  {
    id: 'phy_p1_001',
    text: 'एक कण समय t = 0 पर मूल बिंदु से चलना शुरू करता है। इसका वेग v = 3t² + 2t है। t = 4 सेकंड पर कण का विस्थापन क्या होगा?',
    options: ['64 मीटर', '80 मीटर', '96 मीटर', '112 मीटर'],
    correctAnswer: 1,
    subject: 'Physics',
    topic: 'Kinematics',
    difficulty: 'Medium',
    type: 'single',
    explanation: 'विस्थापन s = ∫v dt = ∫(3t² + 2t) dt = t³ + t² + C\nt = 0 पर s = 0, इसलिए C = 0\nt = 4 पर: s = 4³ + 4² = 64 + 16 = 80 मीटर',
    marks: 3,
    negativeMarks: 1,
    paper: 1
  }
];

export const getQuestionsByPaper = (paper: number): Question[] => {
  return jeeAdvancedQuestions.filter(q => q.paper === paper);
};