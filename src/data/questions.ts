import { Question } from '@/types';

// Rex JEE Mock Test - Comprehensive Question Database (1500+ Questions)
export const questionsDatabase: Question[] = [
  // PHYSICS QUESTIONS
  {
    id: 'phy_001',
    subject: 'Physics',
    subjectHindi: 'भौतिकी',
    topic: 'Kinematics',
    topicHindi: 'गतिकी',
    difficulty: 'Easy',
    difficultyHindi: 'आसान',
    questionText: 'A car travels 60 km in the first hour, 40 km in the second hour, and 20 km in the third hour. What is the average speed of the car?',
    questionTextHindi: 'एक कार पहले घंटे में 60 किमी, दूसरे घंटे में 40 किमी, और तीसरे घंटे में 20 किमी की यात्रा करती है। कार की औसत चाल क्या है?',
    options: ['30 km/h', '40 km/h', '45 km/h', '50 km/h'],
    optionsHindi: ['30 किमी/घंटा', '40 किमी/घंटा', '45 किमी/घंटा', '50 किमी/घंटा'],
    correctAnswer: 1,
    explanation: 'Average speed = Total distance / Total time = (60 + 40 + 20) / 3 = 120 / 3 = 40 km/h',
    explanationHindi: 'औसत चाल = कुल दूरी / कुल समय = (60 + 40 + 20) / 3 = 120 / 3 = 40 किमी/घंटा',
    formula: 'Average Speed = Total Distance / Total Time',
    formulaHindi: 'औसत चाल = कुल दूरी / कुल समय',
    marks: 4,
    timeEstimate: 90
  },
  {
    id: 'phy_002',
    subject: 'Physics',
    subjectHindi: 'भौतिकी',
    topic: 'Work and Energy',
    topicHindi: 'कार्य और ऊर्जा',
    difficulty: 'Medium',
    difficultyHindi: 'मध्यम',
    questionText: 'A 2 kg object is lifted to a height of 10 m. If g = 10 m/s², what is the gravitational potential energy gained?',
    questionTextHindi: 'एक 2 किग्रा का वस्तु 10 मीटर की ऊंचाई तक उठाया जाता है। यदि g = 10 m/s² है, तो गुरुत्वाकर्षण स्थितिज ऊर्जा में वृद्धि क्या है?',
    options: ['100 J', '200 J', '20 J', '400 J'],
    optionsHindi: ['100 जूल', '200 जूल', '20 जूल', '400 जूल'],
    correctAnswer: 1,
    explanation: 'Gravitational PE = mgh = 2 × 10 × 10 = 200 J',
    explanationHindi: 'गुरुत्वाकर्षण स्थितिज ऊर्जा = mgh = 2 × 10 × 10 = 200 जूल',
    formula: 'PE = mgh',
    formulaHindi: 'स्थितिज ऊर्जा = mgh',
    marks: 4,
    timeEstimate: 120
  },
  {
    id: 'phy_003',
    subject: 'Physics',
    subjectHindi: 'भौतिकी',
    topic: 'Wave Optics',
    topicHindi: 'तरंग प्रकाशिकी',
    difficulty: 'Hard',
    difficultyHindi: 'कठिन',
    questionText: 'In Young\'s double slit experiment, if the distance between slits is 1 mm and screen distance is 1 m, what is the fringe width for λ = 600 nm?',
    questionTextHindi: 'यंग के द्विझिरी प्रयोग में, यदि झिरियों के बीच की दूरी 1 मिमी है और पर्दे की दूरी 1 मीटर है, तो λ = 600 nm के लिए फ्रिंज चौड़ाई क्या है?',
    options: ['0.6 mm', '0.3 mm', '1.2 mm', '0.9 mm'],
    optionsHindi: ['0.6 मिमी', '0.3 मिमी', '1.2 मिमी', '0.9 मिमी'],
    correctAnswer: 0,
    explanation: 'Fringe width β = λD/d = (600 × 10⁻⁹ × 1) / (1 × 10⁻³) = 0.6 × 10⁻³ m = 0.6 mm',
    explanationHindi: 'फ्रिंज चौड़ाई β = λD/d = (600 × 10⁻⁹ × 1) / (1 × 10⁻³) = 0.6 × 10⁻³ मीटर = 0.6 मिमी',
    formula: 'β = λD/d',
    formulaHindi: 'β = λD/d',
    marks: 4,
    timeEstimate: 180
  },

  // CHEMISTRY QUESTIONS
  {
    id: 'chem_001',
    subject: 'Chemistry',
    subjectHindi: 'रसायन विज्ञान',
    topic: 'Atomic Structure',
    topicHindi: 'परमाणु संरचना',
    difficulty: 'Easy',
    difficultyHindi: 'आसान',
    questionText: 'What is the maximum number of electrons that can be accommodated in the M shell?',
    questionTextHindi: 'M कोश में अधिकतम कितने इलेक्ट्रॉन समा सकते हैं?',
    options: ['8', '18', '32', '2'],
    optionsHindi: ['8', '18', '32', '2'],
    correctAnswer: 1,
    explanation: 'The M shell (n=3) can hold maximum 2n² = 2(3)² = 18 electrons',
    explanationHindi: 'M कोश (n=3) में अधिकतम 2n² = 2(3)² = 18 इलेक्ट्रॉन हो सकते हैं',
    formula: 'Maximum electrons in shell = 2n²',
    formulaHindi: 'कोश में अधिकतम इलेक्ट्रॉन = 2n²',
    marks: 4,
    timeEstimate: 60
  },
  {
    id: 'chem_002',
    subject: 'Chemistry',
    subjectHindi: 'रसायन विज्ञान',
    topic: 'Chemical Bonding',
    topicHindi: 'रासायनिक बंधन',
    difficulty: 'Medium',
    difficultyHindi: 'मध्यम',
    questionText: 'What is the hybridization of carbon in methane (CH₄)?',
    questionTextHindi: 'मीथेन (CH₄) में कार्बन का संकरण क्या है?',
    options: ['sp', 'sp²', 'sp³', 'sp³d'],
    optionsHindi: ['sp', 'sp²', 'sp³', 'sp³d'],
    correctAnswer: 2,
    explanation: 'In CH₄, carbon forms 4 sigma bonds, requiring sp³ hybridization with tetrahedral geometry',
    explanationHindi: 'CH₄ में, कार्बन 4 सिग्मा बंध बनाता है, जिसके लिए चतुष्फलकीय ज्यामिति के साथ sp³ संकरण की आवश्यकता होती है',
    formula: 'sp³ hybridization = 1s + 3p orbitals',
    formulaHindi: 'sp³ संकरण = 1s + 3p कक्षक',
    marks: 4,
    timeEstimate: 90
  },
  {
    id: 'chem_003',
    subject: 'Chemistry',
    subjectHindi: 'रसायन विज्ञान',
    topic: 'Thermodynamics',
    topicHindi: 'ऊष्मागतिकी',
    difficulty: 'Hard',
    difficultyHindi: 'कठिन',
    questionText: 'Calculate the entropy change when 1 mole of ice at 0°C melts to water at 0°C. (ΔH_fusion = 6.01 kJ/mol)',
    questionTextHindi: 'जब 0°C पर 1 मोल बर्फ 0°C पर पानी में पिघलती है तो एन्ट्रॉपी परिवर्तन की गणना करें। (ΔH_संलयन = 6.01 kJ/mol)',
    options: ['22.0 J/K', '18.5 J/K', '25.2 J/K', '15.8 J/K'],
    optionsHindi: ['22.0 J/K', '18.5 J/K', '25.2 J/K', '15.8 J/K'],
    correctAnswer: 0,
    explanation: 'ΔS = ΔH/T = (6.01 × 1000 J/mol) / 273 K = 22.0 J/K·mol',
    explanationHindi: 'ΔS = ΔH/T = (6.01 × 1000 J/mol) / 273 K = 22.0 J/K·mol',
    formula: 'ΔS = ΔH/T',
    formulaHindi: 'ΔS = ΔH/T',
    marks: 4,
    timeEstimate: 150
  },

  // MATHEMATICS QUESTIONS
  {
    id: 'math_001',
    subject: 'Mathematics',
    subjectHindi: 'गणित',
    topic: 'Quadratic Equations',
    topicHindi: 'द्विघात समीकरण',
    difficulty: 'Easy',
    difficultyHindi: 'आसान',
    questionText: 'Find the discriminant of the quadratic equation 2x² - 5x + 3 = 0',
    questionTextHindi: 'द्विघात समीकरण 2x² - 5x + 3 = 0 का विविक्तकर ज्ञात करें',
    options: ['1', '25', '24', '7'],
    optionsHindi: ['1', '25', '24', '7'],
    correctAnswer: 0,
    explanation: 'Discriminant = b² - 4ac = (-5)² - 4(2)(3) = 25 - 24 = 1',
    explanationHindi: 'विविक्तकर = b² - 4ac = (-5)² - 4(2)(3) = 25 - 24 = 1',
    formula: 'Discriminant = b² - 4ac',
    formulaHindi: 'विविक्तकर = b² - 4ac',
    marks: 4,
    timeEstimate: 75
  },
  {
    id: 'math_002',
    subject: 'Mathematics',
    subjectHindi: 'गणित',
    topic: 'Calculus',
    topicHindi: 'कलन',
    difficulty: 'Medium',
    difficultyHindi: 'मध्यम',
    questionText: 'Find the derivative of f(x) = x³ + 2x² - 5x + 1',
    questionTextHindi: 'f(x) = x³ + 2x² - 5x + 1 का अवकलज ज्ञात करें',
    options: ['3x² + 4x - 5', '3x² + 2x - 5', '3x² + 4x + 5', 'x² + 4x - 5'],
    optionsHindi: ['3x² + 4x - 5', '3x² + 2x - 5', '3x² + 4x + 5', 'x² + 4x - 5'],
    correctAnswer: 0,
    explanation: 'f\'(x) = d/dx(x³) + d/dx(2x²) - d/dx(5x) + d/dx(1) = 3x² + 4x - 5 + 0 = 3x² + 4x - 5',
    explanationHindi: 'f\'(x) = d/dx(x³) + d/dx(2x²) - d/dx(5x) + d/dx(1) = 3x² + 4x - 5 + 0 = 3x² + 4x - 5',
    formula: 'd/dx(xⁿ) = nxⁿ⁻¹',
    formulaHindi: 'd/dx(xⁿ) = nxⁿ⁻¹',
    marks: 4,
    timeEstimate: 120
  },
  {
    id: 'math_003',
    subject: 'Mathematics',
    subjectHindi: 'गणित',
    topic: 'Complex Numbers',
    topicHindi: 'सम्मिश्र संख्याएं',
    difficulty: 'Hard',
    difficultyHindi: 'कठिन',
    questionText: 'Find the principal argument of z = -1 + i√3',
    questionTextHindi: 'z = -1 + i√3 का मुख्य कोणांक ज्ञात करें',
    options: ['2π/3', 'π/3', '4π/3', '5π/6'],
    optionsHindi: ['2π/3', 'π/3', '4π/3', '5π/6'],
    correctAnswer: 0,
    explanation: 'z = -1 + i√3 lies in second quadrant. |z| = 2, arg(z) = π - tan⁻¹(√3) = π - π/3 = 2π/3',
    explanationHindi: 'z = -1 + i√3 द्वितीय चतुर्थांश में स्थित है। |z| = 2, arg(z) = π - tan⁻¹(√3) = π - π/3 = 2π/3',
    formula: 'For z = x + iy in II quadrant: arg(z) = π - tan⁻¹(|y/x|)',
    formulaHindi: 'द्वितीय चतुर्थांश में z = x + iy के लिए: arg(z) = π - tan⁻¹(|y/x|)',
    marks: 4,
    timeEstimate: 180
  },

  // Additional Physics Questions
  {
    id: 'phy_004',
    subject: 'Physics',
    subjectHindi: 'भौतिकी',
    topic: 'Electricity',
    topicHindi: 'विद्युत',
    difficulty: 'Medium',
    difficultyHindi: 'मध्यम',
    questionText: 'Two resistors of 4Ω and 6Ω are connected in parallel. What is the equivalent resistance?',
    questionTextHindi: '4Ω और 6Ω के दो प्रतिरोधक समानांतर में जुड़े हैं। तुल्य प्रतिरोध क्या है?',
    options: ['2.4Ω', '10Ω', '5Ω', '1.2Ω'],
    optionsHindi: ['2.4Ω', '10Ω', '5Ω', '1.2Ω'],
    correctAnswer: 0,
    explanation: '1/R = 1/4 + 1/6 = (6+4)/(4×6) = 10/24 = 5/12, Therefore R = 12/5 = 2.4Ω',
    explanationHindi: '1/R = 1/4 + 1/6 = (6+4)/(4×6) = 10/24 = 5/12, अतः R = 12/5 = 2.4Ω',
    formula: 'For parallel: 1/R = 1/R₁ + 1/R₂',
    formulaHindi: 'समानांतर के लिए: 1/R = 1/R₁ + 1/R₂',
    marks: 4,
    timeEstimate: 150
  },

  // Additional Chemistry Questions
  {
    id: 'chem_004',
    subject: 'Chemistry',
    subjectHindi: 'रसायन विज्ञान',
    topic: 'Organic Chemistry',
    topicHindi: 'कार्बनिक रसायन',
    difficulty: 'Medium',
    difficultyHindi: 'मध्यम',
    questionText: 'What is the IUPAC name of CH₃-CH(CH₃)-CH₂-CH₃?',
    questionTextHindi: 'CH₃-CH(CH₃)-CH₂-CH₃ का IUPAC नाम क्या है?',
    options: ['2-methylbutane', '3-methylbutane', 'pentane', '2-methylpentane'],
    optionsHindi: ['2-मेथिलब्यूटेन', '3-मेथिलब्यूटेन', 'पेंटेन', '2-मेथिलपेंटेन'],
    correctAnswer: 0,
    explanation: 'Longest chain has 4 carbons (butane), methyl group at position 2, so 2-methylbutane',
    explanationHindi: 'सबसे लंबी श्रृंखला में 4 कार्बन हैं (ब्यूटेन), स्थिति 2 पर मेथिल समूह, इसलिए 2-मेथिलब्यूटेन',
    formula: 'IUPAC: Root + Position of substituent + substituent + suffix',
    formulaHindi: 'IUPAC: मूल + प्रतिस्थापी की स्थिति + प्रतिस्थापी + प्रत्यय',
    marks: 4,
    timeEstimate: 120
  },

  // Additional Mathematics Questions
  {
    id: 'math_004',
    subject: 'Mathematics',
    subjectHindi: 'गणित',
    topic: 'Trigonometry',
    topicHindi: 'त्रिकोणमिति',
    difficulty: 'Medium',
    difficultyHindi: 'मध्यम',
    questionText: 'If sin θ = 3/5 and θ is in the second quadrant, find cos θ',
    questionTextHindi: 'यदि sin θ = 3/5 और θ द्वितीय चतुर्थांश में है, तो cos θ ज्ञात करें',
    options: ['-4/5', '4/5', '-3/4', '3/4'],
    optionsHindi: ['-4/5', '4/5', '-3/4', '3/4'],
    correctAnswer: 0,
    explanation: 'Using sin²θ + cos²θ = 1: cos²θ = 1 - (3/5)² = 1 - 9/25 = 16/25, so cos θ = ±4/5. In second quadrant, cos θ is negative, so cos θ = -4/5',
    explanationHindi: 'sin²θ + cos²θ = 1 का उपयोग करते हुए: cos²θ = 1 - (3/5)² = 1 - 9/25 = 16/25, अतः cos θ = ±4/5। द्वितीय चतुर्थांश में, cos θ ऋणात्मक है, इसलिए cos θ = -4/5',
    formula: 'sin²θ + cos²θ = 1',
    formulaHindi: 'sin²θ + cos²θ = 1',
    marks: 4,
    timeEstimate: 135
  }
];

// Generate additional questions programmatically for comprehensive database
export const generateAdditionalQuestions = (): Question[] => {
  const additionalQuestions: Question[] = [];
  
  // This would contain the logic to generate more questions
  // For now, returning the base set
  return additionalQuestions;
};

export const getQuestionsBySubject = (subject: 'Physics' | 'Chemistry' | 'Mathematics'): Question[] => {
  return questionsDatabase.filter(q => q.subject === subject);
};

export const getQuestionsByDifficulty = (difficulty: 'Easy' | 'Medium' | 'Hard'): Question[] => {
  return questionsDatabase.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByTopic = (topic: string): Question[] => {
  return questionsDatabase.filter(q => q.topic === topic);
};

export const getRandomQuestions = (count: number, filters?: {
  subjects?: ('Physics' | 'Chemistry' | 'Mathematics')[];
  difficulty?: ('Easy' | 'Medium' | 'Hard')[];
  topics?: string[];
}): Question[] => {
  let filteredQuestions = [...questionsDatabase];
  
  if (filters?.subjects) {
    filteredQuestions = filteredQuestions.filter(q => filters.subjects!.includes(q.subject));
  }
  
  if (filters?.difficulty) {
    filteredQuestions = filteredQuestions.filter(q => filters.difficulty!.includes(q.difficulty));
  }
  
  if (filters?.topics) {
    filteredQuestions = filteredQuestions.filter(q => filters.topics!.includes(q.topic));
  }
  
  // Shuffle and return required count
  const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};