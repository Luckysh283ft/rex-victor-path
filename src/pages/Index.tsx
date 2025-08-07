import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MockTestEngine } from '@/components/test/MockTestEngine';
import { ProgressDashboard } from '@/components/dashboard/ProgressDashboard';
import { OfflineAITutor } from '@/components/ai/OfflineAITutor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { jeeAdvancedQuestions, getQuestionsByPaper } from '@/data/jeeAdvancedQuestions';
import { TestResult, Question } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Trophy, BookOpen, Clock, TrendingUp, Star, Zap, Play, Brain, BarChart3, Settings, FileText, Target } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'test' | 'progress' | 'tutor'>('home');
  const [selectedPaper, setSelectedPaper] = useState<number | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const handleStartTest = (paper: number) => {
    const questions = getQuestionsByPaper(paper);
    setTestQuestions(questions);
    setSelectedPaper(paper);
    setCurrentView('test');
    
    toast({
      title: "टेस्ट शुरू किया गया",
      description: `पेपर ${paper} - कुल समय: 180 मिनट`,
    });
  };

  const handleTestComplete = (result: TestResult) => {
    setCurrentView('home');
    setSelectedPaper(null);
    setTestQuestions([]);
    
    toast({
      title: "टेस्ट पूर्ण!",
      description: `आपका स्कोर: ${result.totalScore}/${result.maxScore} (${result.percentage.toFixed(1)}%)`,
    });
  };

  const handleExitTest = () => {
    setCurrentView('home');
    setSelectedPaper(null);
    setTestQuestions([]);
  };

  // Test view
  if (currentView === 'test' && testQuestions.length > 0 && selectedPaper) {
    return (
      <MockTestEngine
        questions={testQuestions}
        testTitle={`JEE Advanced 2024 - Paper ${selectedPaper}`}
        duration={180} // 3 hours
        onTestComplete={handleTestComplete}
        onExit={handleExitTest}
      />
    );
  }

  // Progress view
  if (currentView === 'progress') {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-primary">प्रगति डैशबोर्ड</h1>
            <Button onClick={() => setCurrentView('home')} variant="outline">
              वापस जाएं
            </Button>
          </div>
          <ProgressDashboard />
        </main>
      </div>
    );
  }

  // AI Tutor view
  if (currentView === 'tutor') {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <Brain className="h-8 w-8" />
              AI शिक्षक
            </h1>
            <Button onClick={() => setCurrentView('home')} variant="outline">
              वापस जाएं
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <OfflineAITutor
                studentContext={{
                  weakAreas: ['भौतिकी - यांत्रिकी', 'रसायन - कार्बनिक'],
                  lastTestScore: 85,
                  subjectPreference: 'गणित'
                }}
              />
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">त्वरित सहायता</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      सूत्र संग्रह
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      कमजोर क्षेत्र
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Zap className="h-4 w-4 mr-2" />
                      युक्तियाँ
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      पिछले प्रश्न
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">आज का लक्ष्य</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>भौतिकी अभ्यास</span>
                      <Badge variant="secondary">3/5</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>रसायन सूत्र</span>
                      <Badge variant="secondary">2/3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>गणित समस्याएं</span>
                      <Badge variant="secondary">1/4</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Home view
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                JEE Advanced मॉक टेस्ट
              </h1>
              <p className="text-sm text-muted-foreground">
                संपूर्ण ऑफलाइन JEE तैयारी प्लेटफॉर्म
              </p>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            व्यापक मॉक टेस्ट, तुरंत परिणाम, विस्तृत समाधान और AI शिक्षक के साथ JEE Advanced में सफलता पाएं
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-warning" />
              <span>108 प्रश्न (2 पेपर)</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-success" />
              <span>पूर्ण हिंदी समर्थन</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span>तुरंत परिणाम</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <span>AI शिक्षक</span>
            </div>
          </div>
        </div>

        {/* Quick Access Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => setCurrentView('tutor')}
            className="h-20 flex-col gap-2"
            variant="outline"
          >
            <Brain className="h-6 w-6" />
            <span>AI शिक्षक</span>
          </Button>
          
          <Button
            onClick={() => setCurrentView('progress')}
            className="h-20 flex-col gap-2"
            variant="outline"
          >
            <BarChart3 className="h-6 w-6" />
            <span>प्रगति देखें</span>
          </Button>
          
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <Settings className="h-6 w-6" />
                <span>सेटिंग्स</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>एप्लिकेशन सेटिंग्स</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">थीम सेटिंग्स</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">लाइट मोड</Button>
                    <Button variant="outline" size="sm">डार्क मोड</Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">भाषा प्राथमिकता</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">हिंदी</Button>
                    <Button variant="outline" size="sm">English</Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">टेस्ट सेटिंग्स</h3>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      ऑटो-सेव सक्षम करें
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      आवाज़ सहायता
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      उन्नत एनालिटिक्स
                    </label>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Card className="text-center p-4">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-sm font-medium">ऑफलाइन मोड</div>
            <div className="text-xs text-muted-foreground">सक्रिय</div>
          </Card>
        </div>

        {/* Main Test Papers */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">
              JEE Advanced 2024 Mock Tests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paper 1 */}
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Paper 1</CardTitle>
                    <Badge variant="secondary">180 मिनट</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-blue-600">भौतिकी</div>
                        <div className="text-muted-foreground">18 प्रश्न</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">रसायन</div>
                        <div className="text-muted-foreground">18 प्रश्न</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-red-600">गणित</div>
                        <div className="text-muted-foreground">18 प्रश्न</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div>• Single MCQ: +3/-1</div>
                      <div>• Multiple MCQ: +4/-2</div>
                      <div>• Integer Type: +3/0</div>
                    </div>
                    
                    <Button 
                      onClick={() => handleStartTest(1)}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Paper 1 शुरू करें
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Paper 2 */}
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Paper 2</CardTitle>
                    <Badge variant="secondary">180 मिनट</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-blue-600">भौतिकी</div>
                        <div className="text-muted-foreground">18 प्रश्न</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">रसायन</div>
                        <div className="text-muted-foreground">18 प्रश्न</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-red-600">गणित</div>
                        <div className="text-muted-foreground">18 प्रश्न</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div>• Matrix Match: +3/-1</div>
                      <div>• Comprehension: +3/-1</div>
                      <div>• Numerical: +4/0</div>
                    </div>
                    
                    <Button 
                      onClick={() => handleStartTest(2)}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Paper 2 शुरू करें
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">मुख्य विशेषताएं</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-medium">तुरंत परिणाम</div>
                  <div className="text-sm text-muted-foreground">टेस्ट जमा करते ही</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <FileText className="h-8 w-8 text-success mx-auto mb-2" />
                  <div className="font-medium">विस्तृत समाधान</div>
                  <div className="text-sm text-muted-foreground">चरणबद्ध हल</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <TrendingUp className="h-8 w-8 text-warning mx-auto mb-2" />
                  <div className="font-medium">प्रदर्शन विश्लेषण</div>
                  <div className="text-sm text-muted-foreground">विषयवार रिपोर्ट</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="font-medium">AI शिक्षक</div>
                  <div className="text-sm text-muted-foreground">24/7 सहायता</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">हाल की गतिविधि</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Paper 1 Mock Test</div>
                      <div className="text-sm text-muted-foreground">2 दिन पहले</div>
                    </div>
                    <Badge variant="secondary">Score: 245/288</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">भौतिकी - यांत्रिकी</div>
                      <div className="text-sm text-muted-foreground">5 दिन पहले</div>
                    </div>
                    <Badge variant="secondary">Score: 28/36</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">रसायन - कार्बनिक</div>
                      <div className="text-sm text-muted-foreground">1 सप्ताह पहले</div>
                    </div>
                    <Badge variant="secondary">Score: 31/36</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;