import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  User, 
  Lightbulb, 
  BookOpen, 
  Target,
  MessageCircle,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Question } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: 'hint' | 'concept' | 'guidance' | 'general';
}

interface AIAssistantProps {
  currentQuestion?: Question;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  currentQuestion,
  isOpen,
  onToggle,
  className
}) => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: language === 'hi' 
        ? 'नमस्ते! मैं आपका AI सहायक हूं। मैं आपके संदेह दूर करने, संकेत देने और अवधारणाओं को समझाने में मदद कर सकता हूं। आप मुझसे कुछ भी पूछ सकते हैं!'
        : 'Hello! I\'m your AI assistant. I can help clarify doubts, provide hints, and explain concepts. Feel free to ask me anything!',
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string, question?: Question): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let category: 'hint' | 'concept' | 'guidance' | 'general' = 'general';

    // Hindi responses
    if (language === 'hi') {
      if (lowerMessage.includes('हिंट') || lowerMessage.includes('संकेत') || lowerMessage.includes('hint')) {
        category = 'hint';
        if (question) {
          response = `इस प्रश्न के लिए संकेत: ${question.subject} में ${question.topic} से संबंधित है। पहले मूल अवधारणाओं को समझें और फिर चरणबद्ध तरीके से हल करने का प्रयास करें। सूत्रों को ध्यान से लगाएं।`;
        } else {
          response = 'कृपया अपना प्रश्न बताएं ताकि मैं आपको उचित संकेत दे सकूं।';
        }
      } else if (lowerMessage.includes('समझाएं') || lowerMessage.includes('अवधारणा') || lowerMessage.includes('concept')) {
        category = 'concept';
        response = 'मैं आपको अवधारणा समझाने में खुशी से मदद करूंगा। कृपया बताएं कि आप किस विषय या टॉपिक के बारे में जानना चाहते हैं?';
      } else if (lowerMessage.includes('कैसे हल') || lowerMessage.includes('तरीका') || lowerMessage.includes('step')) {
        category = 'guidance';
        response = 'प्रश्न हल करने के लिए: 1) पहले दिए गए डेटा को समझें 2) आवश्यक सूत्र पहचानें 3) चरणबद्ध तरीके से हल करें 4) उत्तर की जांच करें। क्या आप चाहते हैं कि मैं किसी विशेष प्रश्न के लिए विस्तृत मार्गदर्शन दूं?';
      } else {
        response = 'मैं समझ गया हूं। क्या आप चाहते हैं कि मैं: 1) संकेत दूं 2) अवधारणा समझाऊं 3) हल करने की विधि बताऊं? कृपया स्पष्ट करें।';
      }
    } else {
      // English responses
      if (lowerMessage.includes('hint') || lowerMessage.includes('clue')) {
        category = 'hint';
        if (question) {
          response = `Hint for this question: This relates to ${question.topic} in ${question.subject}. Start by understanding the fundamental concepts and try to solve step by step. Pay attention to the formulas involved.`;
        } else {
          response = 'Please share your question so I can provide an appropriate hint.';
        }
      } else if (lowerMessage.includes('explain') || lowerMessage.includes('concept')) {
        category = 'concept';
        response = 'I\'d be happy to explain the concept. Please let me know which topic or subject you\'d like me to clarify.';
      } else if (lowerMessage.includes('how to solve') || lowerMessage.includes('method') || lowerMessage.includes('approach')) {
        category = 'guidance';
        response = 'To solve questions effectively: 1) Understand the given data 2) Identify required formulas 3) Solve step by step 4) Verify your answer. Would you like detailed guidance for a specific question?';
      } else {
        response = 'I understand. Would you like me to: 1) Give a hint 2) Explain a concept 3) Guide you through the solution method? Please clarify.';
      }
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      category
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, currentQuestion);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = language === 'hi' ? [
    'इस प्रश्न के लिए हिंट दें',
    'अवधारणा समझाएं',
    'हल करने का तरीका बताएं',
    'सामान्य गलतियां क्या हैं?'
  ] : [
    'Give me a hint for this question',
    'Explain the concept',
    'How to approach this problem?',
    'What are common mistakes?'
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg',
          'bg-gradient-primary hover:opacity-90 animate-bounce',
          className
        )}
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      'fixed bottom-6 right-6 z-50 w-96 shadow-xl border-primary/20',
      'bg-gradient-card animate-slide-up',
      isMinimized && 'h-16',
      !isMinimized && 'h-[500px]',
      language === 'hi' && 'font-devanagari',
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm">
              {t('aiAssistant', 'AI Assistant', 'AI सहायक')}
            </span>
            <Badge variant="outline" className="text-xs">
              {t('online', 'Online', 'ऑनलाइन')}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-4 pt-2 flex flex-col h-[420px]">
          {/* Messages */}
          <ScrollArea className="flex-1 mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn(
                  'flex gap-3',
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}>
                  {message.type === 'ai' && (
                    <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                  
                  <div className={cn(
                    'max-w-[80%] rounded-lg p-3 text-sm',
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  )}>
                    {message.category && message.type === 'ai' && (
                      <div className="flex items-center gap-1 mb-2">
                        {message.category === 'hint' && <Lightbulb className="h-3 w-3 text-warning" />}
                        {message.category === 'concept' && <BookOpen className="h-3 w-3 text-primary" />}
                        {message.category === 'guidance' && <Target className="h-3 w-3 text-success" />}
                        <span className="text-xs text-muted-foreground capitalize">
                          {message.category}
                        </span>
                      </div>
                    )}
                    {message.content}
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-2">
                {t('suggestedQuestions', 'Suggested questions:', 'सुझाए गए प्रश्न:')}
              </div>
              <div className="flex flex-wrap gap-1">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => setInputMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('typeMessage', 'Type your question...', 'अपना प्रश्न टाइप करें...')}
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};