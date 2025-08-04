import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  BookOpen, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Doubt {
  id: string;
  question: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  topic: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Answered' | 'Resolved';
  answer?: string;
  timestamp: Date;
  studentId: string;
}

interface DoubtPortalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const DoubtPortal: React.FC<DoubtPortalProps> = ({
  isOpen,
  onClose,
  className
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('ask');
  const [newDoubt, setNewDoubt] = useState({
    question: '',
    subject: 'Physics' as const,
    topic: '',
    priority: 'Medium' as const
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');

  // Mock doubts data
  const [doubts, setDoubts] = useState<Doubt[]>([
    {
      id: '1',
      question: 'कैलोरीमीटर में उष्मा संतुलन का सिद्धांत कैसे काम करता है?',
      subject: 'Physics',
      topic: 'Thermodynamics',
      priority: 'High',
      status: 'Answered',
      answer: 'कैलोरीमीटर में उष्मा संतुलन का सिद्धांत इस तथ्य पर आधारित है कि जब दो या अधिक वस्तुएं अलग-अलग तापमान पर संपर्क में आती हैं, तो गर्म वस्तु से ठंडी वस्तु में उष्मा का स्थानांतरण होता है जब तक कि दोनों का तापमान समान नहीं हो जाता। इस प्रक्रिया में कुल उष्मा संरक्षित रहती है।',
      timestamp: new Date(),
      studentId: 'student1'
    },
    {
      id: '2',
      question: 'Benzene में electrophilic substitution reaction क्यों होता है?',
      subject: 'Chemistry',
      topic: 'Organic Chemistry',
      priority: 'Medium',
      status: 'Pending',
      timestamp: new Date(),
      studentId: 'student1'
    }
  ]);

  const generateAIAnswer = (question: string, subject: string, topic: string): string => {
    // Mock AI answer generation
    if (language === 'hi') {
      return `आपके प्रश्न "${question}" का उत्तर: यह ${subject} के ${topic} विषय से संबंधित है। मुख्य अवधारणाएं समझने के लिए पहले बुनियादी सिद्धांतों को समझें और फिर चरणबद्ध तरीके से समस्या का समाधान करें। अधिक स्पष्टता के लिए संबंधित सूत्रों और उदाहरणों का अध्ययन करें।`;
    }
    return `Answer to your question "${question}": This relates to ${topic} in ${subject}. To understand the key concepts, first grasp the fundamental principles and then solve the problem step by step. Study related formulas and examples for better clarity.`;
  };

  const handleSubmitDoubt = () => {
    if (!newDoubt.question.trim()) return;

    const doubt: Doubt = {
      id: Date.now().toString(),
      question: newDoubt.question,
      subject: newDoubt.subject,
      topic: newDoubt.topic || 'General',
      priority: newDoubt.priority,
      status: 'Answered', // AI provides instant answer
      answer: generateAIAnswer(newDoubt.question, newDoubt.subject, newDoubt.topic),
      timestamp: new Date(),
      studentId: 'student1'
    };

    setDoubts(prev => [doubt, ...prev]);
    setNewDoubt({ question: '', subject: 'Physics', topic: '', priority: 'Medium' });
    setActiveTab('my-doubts');
  };

  const filteredDoubts = doubts.filter(doubt => {
    const matchesSearch = doubt.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doubt.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'All' || doubt.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Physics':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Chemistry':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Mathematics':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Answered':
        return 'bg-success text-success-foreground';
      case 'Pending':
        return 'bg-warning text-warning-foreground';
      case 'Resolved':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="fixed inset-4 md:inset-8 lg:inset-12">
        <Card className={cn(
          "h-full bg-gradient-card border-border animate-slide-up",
          language === 'hi' && "font-devanagari"
        )}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {t('doubtPortal', 'Doubt Portal', 'संदेह पोर्टल')}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="h-[calc(100%-80px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ask">{t('askDoubt', 'Ask Doubt', 'संदेह पूछें')}</TabsTrigger>
                <TabsTrigger value="my-doubts">{t('myDoubts', 'My Doubts', 'मेरे संदेह')}</TabsTrigger>
                <TabsTrigger value="browse">{t('browse', 'Browse', 'ब्राउज़ करें')}</TabsTrigger>
              </TabsList>

              <TabsContent value="ask" className="mt-6 h-[calc(100%-60px)]">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      {t('askYourDoubt', 'Ask Your Doubt', 'अपना संदेह पूछें')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('doubtDescription', 'Get instant AI-powered answers to your JEE questions', 'अपने JEE प्रश्नों के लिए तुरंत AI-संचालित उत्तर प्राप्त करें')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('subject', 'Subject', 'विषय')}
                      </label>
                      <select
                        value={newDoubt.subject}
                        onChange={(e) => setNewDoubt(prev => ({ ...prev, subject: e.target.value as any }))}
                        className="w-full p-2 border rounded-lg bg-background"
                      >
                        <option value="Physics">{language === 'hi' ? 'भौतिकी' : 'Physics'}</option>
                        <option value="Chemistry">{language === 'hi' ? 'रसायन विज्ञान' : 'Chemistry'}</option>
                        <option value="Mathematics">{language === 'hi' ? 'गणित' : 'Mathematics'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('topic', 'Topic', 'विषय')} ({t('optional', 'Optional', 'वैकल्पिक')})
                      </label>
                      <Input
                        value={newDoubt.topic}
                        onChange={(e) => setNewDoubt(prev => ({ ...prev, topic: e.target.value }))}
                        placeholder={t('topicPlaceholder', 'e.g., Thermodynamics, Organic Chemistry', 'जैसे, ऊष्मागतिकी, कार्बनिक रसायन')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('yourQuestion', 'Your Question', 'आपका प्रश्न')}
                    </label>
                    <Textarea
                      value={newDoubt.question}
                      onChange={(e) => setNewDoubt(prev => ({ ...prev, question: e.target.value }))}
                      placeholder={t('questionPlaceholder', 'Type your doubt here in detail...', 'अपना संदेह यहाँ विस्तार से लिखें...')}
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('priority', 'Priority', 'प्राथमिकता')}
                    </label>
                    <div className="flex gap-2">
                      {['High', 'Medium', 'Low'].map(priority => (
                        <Button
                          key={priority}
                          variant={newDoubt.priority === priority ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewDoubt(prev => ({ ...prev, priority: priority as any }))}
                        >
                          {priority}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmitDoubt}
                    disabled={!newDoubt.question.trim()}
                    className="w-full bg-gradient-primary hover:opacity-90"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {t('submitDoubt', 'Submit Doubt', 'संदेह जमा करें')}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="my-doubts" className="mt-6 h-[calc(100%-60px)]">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('searchDoubts', 'Search doubts...', 'संदेह खोजें...')}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={filterSubject}
                      onChange={(e) => setFilterSubject(e.target.value)}
                      className="p-2 border rounded-lg bg-background"
                    >
                      <option value="All">{t('allSubjects', 'All Subjects', 'सभी विषय')}</option>
                      <option value="Physics">{language === 'hi' ? 'भौतिकी' : 'Physics'}</option>
                      <option value="Chemistry">{language === 'hi' ? 'रसायन विज्ञान' : 'Chemistry'}</option>
                      <option value="Mathematics">{language === 'hi' ? 'गणित' : 'Mathematics'}</option>
                    </select>
                  </div>

                  <ScrollArea className="h-[calc(100%-80px)]">
                    <div className="space-y-4">
                      {filteredDoubts.map((doubt) => (
                        <Card key={doubt.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm mb-2">{doubt.question}</p>
                                <div className="flex flex-wrap gap-2">
                                  <Badge className={cn("text-xs", getSubjectColor(doubt.subject))}>
                                    {language === 'hi' ? 
                                      (doubt.subject === 'Physics' ? 'भौतिकी' : 
                                       doubt.subject === 'Chemistry' ? 'रसायन विज्ञान' : 'गणित')
                                      : doubt.subject
                                    }
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {doubt.topic}
                                  </Badge>
                                  <Badge className={cn("text-xs", getStatusColor(doubt.status))}>
                                    {doubt.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {doubt.timestamp.toLocaleDateString()}
                              </div>
                            </div>

                            {doubt.answer && (
                              <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle className="h-4 w-4 text-success" />
                                  <span className="text-sm font-medium text-success">
                                    {t('aiAnswer', 'AI Answer', 'AI उत्तर')}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{doubt.answer}</p>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="browse" className="mt-6 h-[calc(100%-60px)]">
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {t('browseDoubts', 'Browse Community Doubts', 'समुदायिक संदेह ब्राउज़ करें')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('browseDescription', 'Coming soon - Browse doubts from other students', 'जल्द आ रहा है - अन्य छात्रों के संदेह ब्राउज़ करें')}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};