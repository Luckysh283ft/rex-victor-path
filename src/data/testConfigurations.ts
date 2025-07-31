import { TestConfiguration } from '@/types';

// Rex JEE Mock Test - Comprehensive Test Configurations
export const testConfigurations: TestConfiguration[] = [
  {
    id: 'jee_main_full',
    name: 'JEE Main Full Test',
    nameHindi: 'JEE मुख्य पूर्ण टेस्ट',
    type: 'Full Test',
    typeHindi: 'पूर्ण टेस्ट',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    totalQuestions: 90,
    duration: 180, // 3 hours
    physicsQuestions: 30,
    chemistryQuestions: 30,
    mathQuestions: 30,
    negativeMarking: true,
    marksPerQuestion: 4,
    negativeMarks: -1
  },
  {
    id: 'jee_advanced_full',
    name: 'JEE Advanced Full Test',
    nameHindi: 'JEE उन्नत पूर्ण टेस्ट',
    type: 'Full Test',
    typeHindi: 'पूर्ण टेस्ट',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    totalQuestions: 54,
    duration: 180, // 3 hours
    physicsQuestions: 18,
    chemistryQuestions: 18,
    mathQuestions: 18,
    negativeMarking: true,
    marksPerQuestion: 3,
    negativeMarks: -1
  },
  {
    id: 'physics_test',
    name: 'Physics Subject Test',
    nameHindi: 'भौतिकी विषय टेस्ट',
    type: 'Subject Test',
    typeHindi: 'विषय टेस्ट',
    subjects: ['Physics'],
    totalQuestions: 30,
    duration: 60, // 1 hour
    physicsQuestions: 30,
    chemistryQuestions: 0,
    mathQuestions: 0,
    negativeMarking: true,
    marksPerQuestion: 4,
    negativeMarks: -1
  },
  {
    id: 'chemistry_test',
    name: 'Chemistry Subject Test',
    nameHindi: 'रसायन विज्ञान विषय टेस्ट',
    type: 'Subject Test',
    typeHindi: 'विषय टेस्ट',
    subjects: ['Chemistry'],
    totalQuestions: 30,
    duration: 60, // 1 hour
    physicsQuestions: 0,
    chemistryQuestions: 30,
    mathQuestions: 0,
    negativeMarking: true,
    marksPerQuestion: 4,
    negativeMarks: -1
  },
  {
    id: 'mathematics_test',
    name: 'Mathematics Subject Test',
    nameHindi: 'गणित विषय टेस्ट',
    type: 'Subject Test',
    typeHindi: 'विषय टेस्ट',
    subjects: ['Mathematics'],
    totalQuestions: 30,
    duration: 60, // 1 hour
    physicsQuestions: 0,
    chemistryQuestions: 0,
    mathQuestions: 30,
    negativeMarking: true,
    marksPerQuestion: 4,
    negativeMarks: -1
  },
  {
    id: 'quick_test',
    name: 'Quick Practice Test',
    nameHindi: 'त्वरित अभ्यास टेस्ट',
    type: 'Custom',
    typeHindi: 'कस्टम',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    totalQuestions: 15,
    duration: 20, // 20 minutes
    physicsQuestions: 5,
    chemistryQuestions: 5,
    mathQuestions: 5,
    negativeMarking: false,
    marksPerQuestion: 4,
    negativeMarks: 0
  },
  {
    id: 'mechanics_topic',
    name: 'Mechanics Topic Test',
    nameHindi: 'यांत्रिकी टॉपिक टेस्ट',
    type: 'Topic Test',
    typeHindi: 'टॉपिक टेस्ट',
    subjects: ['Physics'],
    totalQuestions: 20,
    duration: 40, // 40 minutes
    physicsQuestions: 20,
    chemistryQuestions: 0,
    mathQuestions: 0,
    negativeMarking: true,
    marksPerQuestion: 4,
    negativeMarks: -1
  },
  {
    id: 'organic_chemistry_topic',
    name: 'Organic Chemistry Topic Test',
    nameHindi: 'कार्बनिक रसायन टॉपिक टेस्ट',
    type: 'Topic Test',
    typeHindi: 'टॉपिक टेस्ट',
    subjects: ['Chemistry'],
    totalQuestions: 20,
    duration: 40, // 40 minutes
    physicsQuestions: 0,
    chemistryQuestions: 20,
    mathQuestions: 0,
    negativeMarking: true,
    marksPerQuestion: 4,
    negativeMarks: -1
  },
  {
    id: 'calculus_topic',
    name: 'Calculus Topic Test',
    nameHindi: 'कलन टॉपिक टेस्ट',
    type: 'Topic Test',
    typeHindi: 'टॉपिक टेस्ट',
    subjects: ['Mathematics'],
    totalQuestions: 20,
    duration: 40, // 40 minutes
    physicsQuestions: 0,
    chemistryQuestions: 0,
    mathQuestions: 20,
    negativeMarking: true,
    marksPerQuestion: 4,
    negativeMarks: -1
  },
  {
    id: 'mixed_difficulty',
    name: 'Mixed Difficulty Test',
    nameHindi: 'मिश्रित कठिनाई टेस्ट',
    type: 'Custom',
    typeHindi: 'कस्टम',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    totalQuestions: 45,
    duration: 90, // 1.5 hours
    physicsQuestions: 15,
    chemistryQuestions: 15,
    mathQuestions: 15,
    negativeMarking: true,
    marksPerQuestion: 4,
    negativeMarks: -1
  }
];

export const getTestConfigById = (id: string): TestConfiguration | undefined => {
  return testConfigurations.find(config => config.id === id);
};

export const getTestConfigsByType = (type: TestConfiguration['type']): TestConfiguration[] => {
  return testConfigurations.filter(config => config.type === type);
};

export const getSubjectTests = (): TestConfiguration[] => {
  return testConfigurations.filter(config => config.type === 'Subject Test');
};

export const getTopicTests = (): TestConfiguration[] => {
  return testConfigurations.filter(config => config.type === 'Topic Test');
};

export const getFullTests = (): TestConfiguration[] => {
  return testConfigurations.filter(config => config.type === 'Full Test');
};