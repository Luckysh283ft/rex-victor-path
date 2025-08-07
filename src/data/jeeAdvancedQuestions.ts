import { Question } from '@/types';

export const jeeAdvancedQuestions: Question[] = [
  // Sample questions for demo
  {
    id: 'phy_p1_001',
    subject: 'Physics',
    subjectHindi: 'भौतिकी',
    topic: 'Kinematics',
    topicHindi: 'गतिकी',
    difficulty: 'Moderate',
    difficultyHindi: 'मध्यम',
    questionType: 'single-correct',
    questionTypeHindi: 'एकल सही',
    questionText: 'एक कण समय t = 0 पर मूल बिंदु से चलना शुरू करता है। इसका वेग v = 3t² + 2t है। t = 4 सेकंड पर कण का विस्थापन क्या होगा?',
    questionTextHindi: 'एक कण समय t = 0 पर मूल बिंदु से चलना शुरू करता है। इसका वेग v = 3t² + 2t है। t = 4 सेकंड पर कण का विस्थापन क्या होगा?',
    options: ['64 मीटर', '80 मीटर', '96 मीटर', '112 मीटर'],
    optionsHindi: ['64 मीटर', '80 मीटर', '96 मीटर', '112 मीटर'],
    correctAnswer: 1,
    explanation: 'विस्थापन s = ∫v dt = ∫(3t² + 2t) dt = t³ + t² + C\nt = 0 पर s = 0, इसलिए C = 0\nt = 4 पर: s = 4³ + 4² = 64 + 16 = 80 मीटर',
    explanationHindi: 'विस्थापन s = ∫v dt = ∫(3t² + 2t) dt = t³ + t² + C\nt = 0 पर s = 0, इसलिए C = 0\nt = 4 पर: s = 4³ + 4² = 64 + 16 = 80 मीटर',
    marks: 3,
    negativeMarks: 1,
    timeEstimate: 120,
    chapters: ['Mechanics']
  }
];

// Create additional questions to fill both papers
const createSampleQuestions = (): Question[] => {
  const baseQuestions: Question[] = [];
  const subjects = ['Physics', 'Chemistry', 'Mathematics'] as const;
  const questionTypes = ['single-correct', 'multiple-correct', 'integer-answer'] as const;
  
  for (let i = 0; i < 108; i++) {
    const subject = subjects[i % 3];
    const questionType = questionTypes[i % 3];
    
    baseQuestions.push({
      id: `q_${i + 1}`,
      subject,
      subjectHindi: subject === 'Physics' ? 'भौतिकी' : subject === 'Chemistry' ? 'रसायन विज्ञान' : 'गणित',
      topic: 'Sample Topic',
      topicHindi: 'नमूना विषय',
      difficulty: 'Moderate',
      difficultyHindi: 'मध्यम',
      questionType,
      questionTypeHindi: questionType === 'single-correct' ? 'एकल सही' : questionType === 'multiple-correct' ? 'बहु सही' : 'पूर्णांक उत्तर',
      questionText: `Sample question ${i + 1} in ${subject}`,
      questionTextHindi: `${subject === 'Physics' ? 'भौतिकी' : subject === 'Chemistry' ? 'रसायन विज्ञान' : 'गणित'} में नमूना प्रश्न ${i + 1}`,
      options: questionType !== 'integer-answer' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
      optionsHindi: questionType !== 'integer-answer' ? ['विकल्प A', 'विकल्प B', 'विकल्प C', 'विकल्प D'] : undefined,
      correctAnswer: questionType === 'integer-answer' ? '42' : questionType === 'multiple-correct' ? [0, 2] : 1,
      explanation: 'Sample explanation',
      explanationHindi: 'नमूना व्याख्या',
      marks: questionType === 'multiple-correct' ? 4 : 3,
      negativeMarks: questionType === 'integer-answer' ? 0 : questionType === 'multiple-correct' ? 2 : 1,
      timeEstimate: 120,
      chapters: ['Sample Chapter']
    });
  }
  
  return baseQuestions;
};

export const allQuestions = createSampleQuestions();

export const getQuestionsByPaper = (paper: number): Question[] => {
  if (paper === 1) {
    return allQuestions.slice(0, 54);
  } else {
    return allQuestions.slice(54, 108);
  }
};