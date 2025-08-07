import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Lightbulb,
  Target,
  TrendingUp,
  Heart,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  subject?: string;
  topic?: string;
}

interface StudentContext {
  weakAreas?: string[];
  lastTestScore?: number;
  subjectPreference?: string;
  currentTopic?: string;
  recentMistakes?: string[];
}

interface ComprehensiveAITutorProps {
  className?: string;
  studentContext?: StudentContext;
  onDoubtResolved?: (topic: string) => void;
}

// Comprehensive JEE Knowledge Base
const jeeKnowledgeBase = {
  Physics: {
    Mechanics: {
      keywords: ['किनेमेटिक्स', 'डायनामिक्स', 'वेग', 'त्वरण', 'बल', 'गति', 'संवेग', 'टक्कर', 'घूर्णन', 'जड़त्व'],
      concepts: ['न्यूटन के नियम', 'कार्य-ऊर्जा सिद्धांत', 'संवेग संरक्षण', 'घूर्णी गति', 'गुरुत्वाकर्षण'],
      formulas: ['v = u + at', 'F = ma', 'KE = ½mv²', 'L = Iω', 'τ = rF'],
      tips: ['हमेशा उचित चिह्न convention अपनाएं', 'Vector quantities में दिशा का ध्यान रखें']
    },
    Thermodynamics: {
      keywords: ['ऊष्मा', 'तापमान', 'दाब', 'आयतन', 'एन्ट्रॉपी', 'कार्नो', 'इंजन', 'प्रक्रिया'],
      concepts: ['ऊष्मागतिकी का पहला नियम', 'द्वितीय नियम', 'समतापी प्रक्रिया', 'रुद्धोष्म प्रक्रिया'],
      formulas: ['ΔU = Q - W', 'PV = nRT', 'η = 1 - T₂/T₁'],
      tips: ['P-V diagram बनाकर प्रक्रिया समझें', 'Sign convention सावधानी से करें']
    },
    Electrodynamics: {
      keywords: ['विद्युत', 'चुंबक', 'धारा', 'प्रतिरोध', 'संधारित्र', 'प्रेरण', 'तरंग'],
      concepts: ['कूलम्ब का नियम', 'गॉस का नियम', 'फैराडे का नियम', 'लेंज़ का नियम'],
      formulas: ['F = qE', 'V = IR', 'C = Q/V', 'ε = -dΦ/dt'],
      tips: ['Electric field lines कभी intersect नहीं करती', 'Right hand rule का प्रयोग करें']
    },
    Optics: {
      keywords: ['प्रकाश', 'लेंस', 'दर्पण', 'अपवर्तन', 'परावर्तन', 'व्यतिकरण', 'विवर्तन'],
      concepts: ['स्नेल का नियम', 'लेंस सूत्र', 'यंग का प्रयोग', 'फ्रेनेल का द्विप्रिज्म'],
      formulas: ['1/f = 1/u + 1/v', 'n₁sinθ₁ = n₂sinθ₂', 'β = λD/d'],
      tips: ['Ray diagrams बनाना सीखें', 'Sign convention याद रखें']
    },
    ModernPhysics: {
      keywords: ['परमाणु', 'नाभिक', 'फोटॉन', 'द्रव्य तरंग', 'रेडियोएक्टिव', 'क्वांटम'],
      concepts: ['प्लांक का सिद्धांत', 'आइंस्टाइन का सिद्धांत', 'बोर मॉडल', 'हाइज़ेनबर्ग सिद्धांत'],
      formulas: ['E = hν', 'λ = h/p', 'E = mc²', 'R = λN'],
      tips: ['Energy units का conversion सीखें', 'Photoelectric effect के concept clear करें']
    }
  },
  Chemistry: {
    PhysicalChemistry: {
      keywords: ['मोल', 'सांद्रता', 'संतुलन', 'अम्ल', 'क्षार', 'रेडॉक्स', 'इलेक्ट्रोकेमिस्ट्री'],
      concepts: ['Le Chatelier सिद्धांत', 'pH scale', 'Buffer solutions', 'Galvanic cells'],
      formulas: ['Kw = [H⁺][OH⁻]', 'ΔG = -nFE°', 'Rate = k[A]ᵐ[B]ⁿ'],
      tips: ['Equilibrium में ICE table बनाएं', 'Oxidation states सावधानी से calculate करें']
    },
    OrganicChemistry: {
      keywords: ['हाइड्रोकार्बन', 'functional group', 'isomerism', 'reaction mechanism', 'synthesis'],
      concepts: ['Markovnikov rule', 'SN1 vs SN2', 'Elimination reactions', 'Aromatic compounds'],
      formulas: ['Degree of unsaturation = (2C + 2 + N - H - X)/2'],
      tips: ['Mechanism arrows सही दिशा में खींचें', 'Stereochemistry का ध्यान रखें']
    },
    InorganicChemistry: {
      keywords: ['periodic table', 'coordination compounds', 'metallurgy', 'd-block', 'f-block'],
      concepts: ['Crystal field theory', 'Ligand field theory', 'Periodic trends', 'Extraction of metals'],
      formulas: ['CFSE = -0.4Δₒ × t₂g + 0.6Δₒ × eₘ'],
      tips: ['Electronic configuration सही लिखें', 'Color और magnetism correlate करें']
    }
  },
  Mathematics: {
    Algebra: {
      keywords: ['समीकरण', 'असमानता', 'क्रम', 'श्रेणी', 'द्विपद', 'आव्यूह', 'सारणिक'],
      concepts: ['Quadratic equations', 'AP, GP, HP', 'Binomial theorem', 'Matrix operations'],
      formulas: ['(a+b)ⁿ = Σ ⁿCᵣ aⁿ⁻ʳ bʳ', 'det(AB) = det(A)det(B)'],
      tips: ['Complex numbers को polar form में convert करना सीखें', 'Matrix rank से system solve करें']
    },
    Calculus: {
      keywords: ['सीमा', 'अवकलन', 'समाकलन', 'निरंतरता', 'अधिकतम', 'न्यूनतम', 'क्षेत्रफल'],
      concepts: ['L\'Hospital rule', 'Integration by parts', 'Partial fractions', 'Applications of derivatives'],
      formulas: ['∫ udv = uv - ∫ vdu', 'd/dx(xⁿ) = nxⁿ⁻¹'],
      tips: ['Integration में substitution technique master करें', 'Derivative rules याद करें']
    },
    Geometry: {
      keywords: ['निर्देशांक', 'रेखा', 'वृत्त', 'परवलय', 'दीर्घवृत्त', 'अतिपरवलय', 'त्रिविमीय'],
      concepts: ['Distance formula', 'Section formula', 'Conic sections', 'Vector geometry'],
      formulas: ['Distance = √[(x₂-x₁)² + (y₂-y₁)²]', 'x²/a² + y²/b² = 1'],
      tips: ['Geometrical interpretation हमेशा करें', 'Parametric form useful है']
    },
    Trigonometry: {
      keywords: ['त्रिकोणमिति', 'sin', 'cos', 'tan', 'व्युत्क्रम', 'समीकरण', 'सर्वसमिका'],
      concepts: ['Trigonometric identities', 'Inverse functions', 'Height and distance'],
      formulas: ['sin²θ + cos²θ = 1', 'sin(A±B) = sinA cosB ± cosA sinB'],
      tips: ['Unit circle के values याद करें', 'Principal values सही range में रखें']
    },
    Statistics: {
      keywords: ['प्रायिकता', 'संयोजन', 'क्रमचय', 'वितरण', 'माध्य', 'मानक विचलन'],
      concepts: ['Conditional probability', 'Bayes theorem', 'Normal distribution', 'Regression'],
      formulas: ['P(A|B) = P(A∩B)/P(B)', 'σ = √(Σ(x-μ)²/n)'],
      tips: ['Tree diagrams बनाकर probability solve करें', 'Counting principles clear करें']
    }
  }
};

// Motivational quotes and tips
const motivationalContent = [
  "🌟 हर गलती एक नई सीख है। JEE की तैयारी में धैर्य रखें!",
  "💪 सफलता के लिए निरंतर अभ्यास जरूरी है। आप कर सकते हैं!",
  "🎯 Focus और consistency ही JEE में success की key है।",
  "📚 जब भी कोई concept कठिन लगे, basics पर वापस जाएं।",
  "⚡ Speed के साथ accuracy भी जरूरी है। Balance बनाए रखें।",
  "🔥 हर दिन कुछ नया सीखें। Knowledge compound होती है!",
];

const studyTips = [
  "📝 हर topic के लिए अपना formula sheet बनाएं",
  "⏰ Time management practice करने के लिए mock tests दें",
  "🤔 हर गलत answer की detailed analysis करें",
  "📖 NCERT को thoroughly पढ़ें - basics strong रखें",
  "🎨 Complex problems के लिए diagrams/flowcharts बनाएं",
  "🔄 Regular revision schedule follow करें",
];

// Advanced response patterns
const responsePatterns = [
  {
    pattern: /कैसे (हल|solve) करें|how to solve|कैसे करते हैं/i,
    generator: (query: string, context?: StudentContext) => {
      const subject = detectSubject(query);
      const topic = detectTopic(query, subject);
      
      return `${subject ? `${subject} में` : ''} इस तरह के प्रश्न हल करने के लिए:\n\n` +
        `🔍 **Step-by-step approach:**\n` +
        `1. पहले given data को carefully पढ़ें\n` +
        `2. Required formula identify करें\n` +
        `3. Units check करें\n` +
        `4. Step by step calculation करें\n` +
        `5. Answer को verify करें\n\n` +
        `${topic ? getTopicGuidance(topic, subject) : ''}` +
        `💡 **Pro tip:** Practice makes perfect! रोज़ाना similar problems solve करें।\n\n` +
        `${getRandomMotivation()}`;
    }
  },
  {
    pattern: /फॉर्मूला|formula|सूत्र/i,
    generator: (query: string, context?: StudentContext) => {
      const subject = detectSubject(query);
      const topic = detectTopic(query, subject);
      
      let formulas = getRelevantFormulas(topic, subject);
      
      return `📐 **Important Formulas:**\n\n${formulas}\n\n` +
        `💭 **याद रखने की tip:** रोज़ाना formulas को practice करें और understand करें कि कब कौन सा use करना है।\n\n` +
        `${getRandomStudyTip()}`;
    }
  },
  {
    pattern: /concept|अवधारणा|समझाएं|explain/i,
    generator: (query: string, context?: StudentContext) => {
      const subject = detectSubject(query);
      const topic = detectTopic(query, subject);
      
      return `🎯 **Concept Explanation:**\n\n` +
        `${getConceptExplanation(topic, subject)}\n\n` +
        `🔗 **Related Topics:** ${getRelatedTopics(topic, subject)}\n\n` +
        `📚 **Study Strategy:** इस concept को अच्छे से समझने के लिए पहले basic definitions clear करें, फिर examples solve करें।\n\n` +
        `${getRandomMotivation()}`;
    }
  },
  {
    pattern: /गलती|mistake|error|गलत/i,
    generator: (query: string, context?: StudentContext) => {
      return `🤔 **Common Mistakes और उनके Solutions:**\n\n` +
        `❌ **अक्सर होने वाली गलतियां:**\n` +
        `• Sign conventions को ignore करना\n` +
        `• Units conversion में गलती\n` +
        `• Formula misapplication\n` +
        `• Calculation errors\n\n` +
        `✅ **कैसे बचें:**\n` +
        `• हर step carefully check करें\n` +
        `• Dimensional analysis करें\n` +
        `• Practice से pattern recognition improve करें\n\n` +
        `💪 Don't worry! Mistakes से ही तो सीखते हैं। आप बेहतर कर रहे हैं!`;
    }
  },
  {
    pattern: /टिप्स|tips|trick|shortcut/i,
    generator: (query: string, context?: StudentContext) => {
      const subject = detectSubject(query);
      
      return `🚀 **Smart Tips & Tricks:**\n\n` +
        `${getSubjectSpecificTips(subject)}\n\n` +
        `⚡ **Time-saving techniques:**\n` +
        `• Options को eliminate करके answer करें\n` +
        `• Approximation techniques सीखें\n` +
        `• Pattern recognition develop करें\n\n` +
        `${getRandomStudyTip()}`;
    }
  },
  {
    pattern: /मुश्किल|कठिन|difficult|hard/i,
    generator: (query: string, context?: StudentContext) => {
      return `💪 **कठिन topics को handle करने का strategy:**\n\n` +
        `🎯 **Step-by-step approach:**\n` +
        `1. Basic concepts को पहले strong करें\n` +
        `2. Easy problems से start करें\n` +
        `3. Gradually difficulty level बढ़ाएं\n` +
        `4. Multiple approaches try करें\n` +
        `5. Regular practice करें\n\n` +
        `🌟 **याद रखें:** हर topper भी कभी beginner था। आप भी कर सकते हैं!\n\n` +
        `${getRandomMotivation()}`;
    }
  },
  {
    pattern: /समय|time|management|speed/i,
    generator: (query: string, context?: StudentContext) => {
      return `⏰ **Time Management Strategies:**\n\n` +
        `🎯 **Exam में:**\n` +
        `• Easy questions पहले solve करें\n` +
        `• Time limit set करें per question\n` +
        `• Don't get stuck on one question\n` +
        `• Mock tests regularly दें\n\n` +
        `📚 **Study में:**\n` +
        `• Pomodoro technique use करें\n` +
        `• Daily goals set करें\n` +
        `• Weak areas पर extra time दें\n\n` +
        `💡 Practice speed और accuracy दोनों साथ में!`;
    }
  }
];

// Helper functions
const detectSubject = (query: string): string | null => {
  const subjectKeywords = {
    'Physics': ['भौतिक', 'physics', 'mechanics', 'thermodynamics', 'electro', 'optics', 'modern'],
    'Chemistry': ['रसायन', 'chemistry', 'organic', 'inorganic', 'physical', 'chemical'],
    'Mathematics': ['गणित', 'math', 'algebra', 'calculus', 'geometry', 'trigonometry']
  };
  
  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    if (keywords.some(keyword => query.toLowerCase().includes(keyword.toLowerCase()))) {
      return subject;
    }
  }
  return null;
};

const detectTopic = (query: string, subject: string | null): string | null => {
  if (!subject || !jeeKnowledgeBase[subject as keyof typeof jeeKnowledgeBase]) return null;
  
  const subjectData = jeeKnowledgeBase[subject as keyof typeof jeeKnowledgeBase];
  
  for (const [topic, data] of Object.entries(subjectData)) {
    if (data.keywords.some(keyword => query.toLowerCase().includes(keyword.toLowerCase()))) {
      return topic;
    }
  }
  return null;
};

const getTopicGuidance = (topic: string, subject: string | null): string => {
  if (!subject || !jeeKnowledgeBase[subject as keyof typeof jeeKnowledgeBase]) return '';
  
  const subjectData = jeeKnowledgeBase[subject as keyof typeof jeeKnowledgeBase];
  const topicData = subjectData[topic as keyof typeof subjectData] as any;
  
  if (!topicData) return '';
  
  return `📚 **${topic} के लिए specific tips:**\n` +
    `${topicData.tips?.join('\n• ') || 'Regular practice करें'}\n\n`;
};

const getRelevantFormulas = (topic: string | null, subject: string | null): string => {
  if (!topic || !subject || !jeeKnowledgeBase[subject as keyof typeof jeeKnowledgeBase]) {
    return '• F = ma (Newton\'s second law)\n• PV = nRT (Ideal gas equation)\n• ∫ dx = x + C (Basic integration)';
  }
  
  const subjectData = jeeKnowledgeBase[subject as keyof typeof jeeKnowledgeBase];
  const topicData = subjectData[topic as keyof typeof subjectData] as any;
  
  if (!topicData || !topicData.formulas) return 'कुछ basic formulas practice करें।';
  
  return topicData.formulas.map((formula: string) => `• ${formula}`).join('\n');
};

const getConceptExplanation = (topic: string | null, subject: string | null): string => {
  if (!topic || !subject || !jeeKnowledgeBase[subject as keyof typeof jeeKnowledgeBase]) {
    return 'इस topic के basics को समझने के लिए NCERT से शुरू करें।';
  }
  
  const subjectData = jeeKnowledgeBase[subject as keyof typeof jeeKnowledgeBase];
  const topicData = subjectData[topic as keyof typeof subjectData] as any;
  
  if (!topicData || !topicData.concepts) return 'इस topic के fundamentals को clear करें।';
  
  return `यह topic मुख्यतः इन concepts पर based है:\n` +
    topicData.concepts.map((concept: string) => `• ${concept}`).join('\n');
};

const getRelatedTopics = (topic: string | null, subject: string | null): string => {
  if (!topic || !subject) return 'All topics are interconnected in JEE.';
  
  const relatedMap: Record<string, string[]> = {
    'Mechanics': ['Thermodynamics', 'Waves'],
    'Thermodynamics': ['Mechanics', 'Kinetic Theory'],
    'Optics': ['Waves', 'Modern Physics'],
    'Algebra': ['Coordinate Geometry', 'Calculus'],
    'Calculus': ['Algebra', 'Coordinate Geometry']
  };
  
  return relatedMap[topic]?.join(', ') || 'सभी topics आपस में connected हैं';
};

const getSubjectSpecificTips = (subject: string | null): string => {
  const tips = {
    'Physics': '• Units और dimensions हमेशा check करें\n• Diagrams बनाकर solve करें\n• Vector analysis clearly करें',
    'Chemistry': '• Reactions को properly balance करें\n• Molecular geometry visualize करें\n• Periodic trends याद रखें',
    'Mathematics': '• Steps को clearly लिखें\n• Alternative methods try करें\n• Geometric interpretation करें'
  };
  
  return tips[subject as keyof typeof tips] || '• Regular practice करें\n• Concepts को clear रखें\n• Mock tests दें';
};

const getRandomMotivation = (): string => {
  return motivationalContent[Math.floor(Math.random() * motivationalContent.length)];
};

const getRandomStudyTip = (): string => {
  return studyTips[Math.floor(Math.random() * studyTips.length)];
};

const findRelevantConcepts = (query: string): string[] => {
  const concepts: string[] = [];
  const queryLower = query.toLowerCase();
  
  Object.values(jeeKnowledgeBase).forEach(subject => {
    Object.values(subject).forEach(topic => {
      if (topic.keywords.some(keyword => queryLower.includes(keyword.toLowerCase()))) {
        concepts.push(...(topic.concepts || []));
      }
    });
  });
  
  return [...new Set(concepts)].slice(0, 5);
};

const generateContextualResponse = (query: string, context?: StudentContext): string => {
  // Check for pattern matches first
  for (const pattern of responsePatterns) {
    if (pattern.pattern.test(query)) {
      return pattern.generator(query, context);
    }
  }
  
  // If no pattern matches, use concept-based response
  const relevantConcepts = findRelevantConcepts(query);
  const subject = detectSubject(query);
  const topic = detectTopic(query, subject);
  
  if (relevantConcepts.length === 0) {
    return `🤔 मैं आपके प्रश्न को बेहतर तरीके से समझना चाहता हूं।\n\n` +
      `कृपया अपना doubt इस format में पूछें:\n` +
      `• Subject mention करें (Physics/Chemistry/Mathematics)\n` +
      `• Specific topic बताएं\n` +
      `• आपकी exact difficulty क्या है\n\n` +
      `उदाहरण: "Physics में Mechanics के Newton's laws समझाएं"\n\n` +
      `${getRandomMotivation()}`;
  }
  
  let response = `${subject ? `📚 **${subject}** में ` : ''}आपके प्रश्न के अनुसार:\n\n`;
  
  if (topic) {
    response += `🎯 **${topic}** पर focused guidance:\n`;
    response += getTopicGuidance(topic, subject);
  }
  
  response += `💡 **Key Concepts:**\n${relevantConcepts.map(concept => `• ${concept}`).join('\n')}\n\n`;
  
  if (context?.weakAreas?.includes(subject || '')) {
    response += `📈 **आपके लिए special tip:** यह आपका weak area है, इसलिए extra practice करें और basics को strong बनाएं।\n\n`;
  }
  
  response += getRandomMotivation();
  
  return response;
};

export const ComprehensiveAITutor: React.FC<ComprehensiveAITutorProps> = ({
  className,
  studentContext,
  onDoubtResolved
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `🙏 नमस्ते! मैं आपका JEE Advanced AI Tutor हूं। 

🎯 मैं आपकी मदद कर सकता हूं:
• Physics, Chemistry, Mathematics के किसी भी topic में
• Problem solving techniques और shortcuts में  
• Concept clarification और formulas में
• Study strategies और time management में
• Motivational support में

💬 आप हिंदी या English में पूछ सकते हैं। मैं step-by-step explain करूंगा।

🚀 तो बताइए, आज किस topic में help चाहिए?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: "कृपया दोबारा कोशिश करें।",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, [toast]);

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = generateContextualResponse(userMessage.text, studentContext);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        subject: detectSubject(userMessage.text) || undefined,
        topic: detectTopic(userMessage.text, detectSubject(userMessage.text)) || undefined
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Notify parent component about doubt resolution
      if (aiMessage.topic && onDoubtResolved) {
        onDoubtResolved(aiMessage.topic);
      }
      
      toast({
        title: "AI Response Ready",
        description: "आपका doubt resolve हो गया!",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Error",
        description: "कुछ technical issue है। कृपया दोबारा try करें।",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, studentContext, onDoubtResolved, toast]);

  const handleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice not supported",
        description: "आपका browser voice input support नहीं करता।",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast({
          title: "सुन रहा हूं...",
          description: "अपना सवाल बोलें।"
        });
      } catch (error) {
        console.error('Speech recognition error:', error);
        toast({
          title: "Voice input error",
          description: "कृपया दोबारा कोशिश करें।",
          variant: "destructive"
        });
      }
    }
  }, [isListening, toast]);

  const speakText = useCallback((text: string) => {
    if (!speechSynthesisRef.current) return;

    if (isSpeaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current.speak(utterance);
  }, [isSpeaking]);

  const quickActions = [
    { label: "फॉर्मूला", icon: BookOpen, query: "Important formulas बताएं" },
    { label: "टिप्स", icon: Lightbulb, query: "Study tips दें" },
    { label: "Strategy", icon: Target, query: "JEE strategy बताएं" },
    { label: "Motivation", icon: Heart, query: "Motivate करें" }
  ];

  return (
    <Card className={cn("flex flex-col h-[600px] bg-gradient-card border-border/50", className)}>
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-devanagari">JEE Advanced AI गुरु</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Smart
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages area */}
        <ScrollArea className="flex-1 px-4 py-2">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'ai' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-4 py-2 text-sm font-devanagari",
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-secondary text-secondary-foreground'
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  
                  {message.sender === 'ai' && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/20">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(message.text)}
                        className="h-6 px-2 text-xs"
                      >
                        {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                      </Button>
                      
                      {message.subject && (
                        <Badge variant="outline" className="text-xs">
                          {message.subject}
                        </Badge>
                      )}
                      
                      {message.topic && (
                        <Badge variant="outline" className="text-xs">
                          {message.topic}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">You</span>
                  </div>
                )}
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground animate-pulse" />
                </div>
                <div className="bg-secondary rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2 text-secondary-foreground">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs font-devanagari">सोच रहा हूं...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Quick actions */}
        <div className="px-4 py-2 border-t border-border/50">
          <div className="flex gap-2 flex-wrap">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                onClick={() => setInputText(action.query)}
                className="text-xs font-devanagari h-7"
              >
                <action.icon className="h-3 w-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-border/50 bg-background/50">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="अपना doubt यहां लिखें... (हिंदी या English में)"
                className="min-h-[60px] resize-none font-devanagari pr-12 bg-input border-border"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceInput}
                className={cn(
                  "absolute bottom-2 right-2 h-8 w-8 p-0",
                  isListening && "text-red-500 animate-pulse"
                )}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isProcessing}
              className="px-6 bg-gradient-primary hover:opacity-90 font-devanagari"
            >
              <Send className="h-4 w-4 mr-2" />
              भेजें
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span className="font-devanagari">Enter दबाएं या भेजें button पर click करें</span>
            <span>{inputText.length}/500</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};