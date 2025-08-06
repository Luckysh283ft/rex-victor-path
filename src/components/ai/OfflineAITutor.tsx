import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User, BookOpen, Lightbulb, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  topic?: string;
}

interface OfflineAITutorProps {
  className?: string;
  studentContext?: {
    weakAreas?: string[];
    lastTestScore?: number;
    subjectPreference?: string;
  };
}

// Comprehensive JEE knowledge base
const knowledgeBase = {
  physics: {
    mechanics: {
      keywords: ['गति', 'वेग', 'त्वरण', 'बल', 'संवेग', 'कार्य', 'ऊर्जा', 'motion', 'velocity', 'acceleration', 'force', 'momentum', 'work', 'energy'],
      concepts: {
        'समीकरण': 'किनेमेटिक समीकरण: v = u + at, s = ut + ½at², v² = u² + 2as',
        'न्यूटन के नियम': 'पहला नियम: जड़त्व का नियम, दूसरा नियम: F = ma, तीसरा नियम: क्रिया-प्रतिक्रिया',
        'ऊर्जा संरक्षण': 'कुल ऊर्जा = गतिज ऊर्जा + स्थितिज ऊर्जा (संरक्षित बल के लिए)',
        'युक्ति': 'समस्या हल करते समय पहले दिशा निर्धारित करें, फिर समीकरण लगाएं'
      }
    },
    thermodynamics: {
      keywords: ['गर्मी', 'तापमान', 'दबाव', 'आयतन', 'एन्ट्रॉपी', 'heat', 'temperature', 'pressure', 'volume', 'entropy'],
      concepts: {
        'गैस नियम': 'PV = nRT (आदर्श गैस), PV^γ = constant (रुद्धोष्म प्रक्रिया)',
        'ऊष्मागतिकी के नियम': 'शून्य नियम: तापीय संतुलन, प्रथम नियम: ऊर्जा संरक्षण dU = Q - W',
        'युक्ति': 'P-V डायग्राम बनाकर प्रक्रिया को समझें, क्षेत्रफल = कार्य'
      }
    },
    optics: {
      keywords: ['प्रकाश', 'लेंस', 'दर्पण', 'अपवर्तन', 'परावर्तन', 'light', 'lens', 'mirror', 'refraction', 'reflection'],
      concepts: {
        'लेंस सूत्र': '1/f = 1/v - 1/u, आवर्धन m = v/u = h₂/h₁',
        'स्नेल नियम': 'n₁sinθ₁ = n₂sinθ₂',
        'युक्ति': 'किरण आरेख बनाएं, चिह्न नियम का सही प्रयोग करें'
      }
    }
  },
  chemistry: {
    organic: {
      keywords: ['कार्बन', 'हाइड्रोकार्बन', 'प्रकार्यात्मक समूह', 'carbon', 'hydrocarbon', 'functional group'],
      concepts: {
        'नामकरण': 'IUPAC नियम: लंबी श्रृंखला चुनें, संख्या कम से कम रखें',
        'अभिक्रियाएं': 'योगात्मक अभिक्रिया (असंतृप्त), प्रतिस्थापन अभिक्रिया (संतृप्त)',
        'युक्ति': 'संरचना सूत्र बनाकर इलेक्ट्रॉन घनत्व देखें'
      }
    },
    inorganic: {
      keywords: ['धातु', 'अधातु', 'आयन', 'बंध', 'metal', 'non-metal', 'ion', 'bond'],
      concepts: {
        'आवर्त सारणी': 'आवर्त में बाएं से दाएं: परमाणु त्रिज्या घटती है, आयनन ऊर्जा बढ़ती है',
        'रासायनिक बंध': 'आयनिक (धातु-अधातु), सहसंयोजक (अधातु-अधातु), धात्विक (धातु-धातु)',
        'युक्ति': 'इलेक्ट्रॉनिक विन्यास लिखकर बंध प्रकार निर्धारित करें'
      }
    }
  },
  mathematics: {
    calculus: {
      keywords: ['अवकलन', 'समाकलन', 'सीमा', 'derivative', 'integration', 'limit'],
      concepts: {
        'अवकलन नियम': 'd/dx(xⁿ) = nxⁿ⁻¹, श्रृंखला नियम: dy/dx = dy/du × du/dx',
        'समाकलन': '∫xⁿdx = xⁿ⁺¹/(n+1) + C, खंडों द्वारा समाकलन: ∫u dv = uv - ∫v du',
        'युक्ति': 'फलन का ग्राफ बनाकर व्यवहार समझें, L\'Hospital नियम का प्रयोग करें'
      }
    },
    algebra: {
      keywords: ['समीकरण', 'आव्यूह', 'निर्धारक', 'equation', 'matrix', 'determinant'],
      concepts: {
        'द्विघात समीकरण': 'ax² + bx + c = 0, विविक्तकर = b² - 4ac',
        'आव्यूह': 'गुणन: (AB)ᵢⱼ = Σ AᵢₖBₖⱼ, व्युत्क्रम: A⁻¹ = adj(A)/|A|',
        'युक्ति': 'मूलों और गुणांकों का संबंध याद रखें, आव्यूह के प्रकार पहचानें'
      }
    }
  }
};

// Pattern matching for intelligent responses
const responsePatterns = [
  {
    pattern: /कैसे हल करें|कैसे करें|how to solve|how to/i,
    response: (topic: string) => `${topic} की समस्याओं को हल करने के लिए:\n1. दिए गए डेटा को लिखें\n2. मांगी गई राशि पहचानें\n3. उपयुक्त सूत्र चुनें\n4. चरणबद्ध गणना करें\n5. उत्तर की जांच करें`
  },
  {
    pattern: /सूत्र|formula/i,
    response: (topic: string) => `यहाँ ${topic} के मुख्य सूत्र हैं:\n[सूत्र की सूची यहाँ होगी]`
  },
  {
    pattern: /युक्ति|टिप्स|trick|tips/i,
    response: (topic: string) => `${topic} के लिए महत्वपूर्ण युक्तियाँ:\n• हमेशा आरेख बनाएं\n• इकाइयों की जांच करें\n• स्मृति सहायक का प्रयोग करें\n• नियमित अभ्यास करें`
  },
  {
    pattern: /कमजोर|weak|कठिन|difficult/i,
    response: (topic: string) => `${topic} में सुधार के लिए:\n1. मूल सिद्धांतों को समझें\n2. आसान समस्याओं से शुरुआत करें\n3. दैनिक अभ्यास करें\n4. संदेह तुरंत पूछें\n5. नियमित समीक्षा करें`
  }
];

export const OfflineAITutor: React.FC<OfflineAITutorProps> = ({ 
  className, 
  studentContext 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'नमस्ते! मैं आपका JEE सहायक हूँ। मैं भौतिकी, रसायन और गणित में आपकी मदद कर सकता हूँ। आपका क्या सवाल है?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "वॉइस रिकॉर्डिंग त्रुटि",
          description: "कृपया फिर से कोशिश करें",
          variant: "destructive"
        });
      };
    }
  }, [toast]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const findRelevantConcepts = (query: string): string[] => {
    const keywords = query.toLowerCase().split(' ');
    const relevantConcepts: string[] = [];
    
    Object.entries(knowledgeBase).forEach(([subject, topics]) => {
      Object.entries(topics).forEach(([topic, data]) => {
        const matchingKeywords = data.keywords.some(keyword => 
          keywords.some(k => k.includes(keyword) || keyword.includes(k))
        );
        
        if (matchingKeywords) {
          Object.entries(data.concepts).forEach(([concept, explanation]) => {
            relevantConcepts.push(`**${concept}**: ${explanation}`);
          });
        }
      });
    });
    
    return relevantConcepts;
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Find matching pattern
    const matchingPattern = responsePatterns.find(pattern => 
      pattern.pattern.test(query)
    );
    
    // Find relevant concepts
    const concepts = findRelevantConcepts(query);
    
    let response = '';
    
    if (matchingPattern) {
      response = matchingPattern.response('विषय');
    } else if (concepts.length > 0) {
      response = `आपके प्रश्न के लिए ये जानकारी उपयोगी हो सकती है:\n\n${concepts.slice(0, 3).join('\n\n')}`;
    } else {
      // Default helpful responses based on context
      if (studentContext?.weakAreas?.length) {
        response = `मैं देख रहा हूँ कि आपके कमजोर क्षेत्र हैं: ${studentContext.weakAreas.join(', ')}। इन विषयों पर विशेष ध्यान दें और नियमित अभ्यास करें।`;
      } else {
        response = 'मैं आपकी मदद करना चाहता हूँ! कृपया अपना प्रश्न और स्पष्ट करें। आप किस विषय (भौतिकी, रसायन, गणित) और किस टॉपिक के बारे में जानना चाहते हैं?';
      }
    }
    
    // Add encouraging phrases
    const encouragement = [
      '\n\nयाद रखें: अभ्यास से ही महारत आती है! 🎯',
      '\n\nआप कर सकते हैं! बस निरंतरता बनाए रखें। 💪',
      '\n\nहर समस्या एक नई सीख का अवसर है। 📚',
      '\n\nधैर्य रखें और अभ्यास करते रहें। सफलता मिलेगी! ⭐'
    ];
    
    response += encouragement[Math.floor(Math.random() * encouragement.length)];
    
    return response;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);
    
    // Simulate processing delay for realistic feel
    setTimeout(() => {
      const response = generateResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "वॉइस सपोर्ट नहीं",
        description: "आपका ब्राउज़र वॉइस रिकॉर्डिंग को सपोर्ट नहीं करता",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Card className={cn("flex flex-col h-[600px]", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI शिक्षक
          <Badge variant="secondary" className="ml-auto">ऑफलाइन</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  {!message.isUser && (
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => speakText(message.text)}
                        disabled={isSpeaking}
                      >
                        {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                      </Button>
                    </div>
                  )}
                </div>
                
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="अपना प्रश्न लिखें..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              className={cn(
                isListening && "bg-destructive text-destructive-foreground animate-pulse"
              )}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isProcessing}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputText('भौतिकी के सूत्र बताएं')}
            >
              <BookOpen className="h-3 w-3 mr-1" />
              सूत्र
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputText('गणित की युक्तियाँ बताएं')}
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              युक्तियाँ
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputText('कमजोर क्षेत्र में सुधार कैसे करें')}
            >
              <Target className="h-3 w-3 mr-1" />
              सुधार
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};