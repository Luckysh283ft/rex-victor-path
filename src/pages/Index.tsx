import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { TestCard } from '@/components/dashboard/TestCard';
import { TestInterface } from '@/components/test/TestInterface';
import { ProgressDashboard } from '@/components/dashboard/ProgressDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { testConfigurations } from '@/data/testConfigurations';
import { questionsDatabase, getRandomQuestions } from '@/data/questions';
import { TestConfiguration } from '@/types';
import { useTest } from '@/contexts/TestContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, BookOpen, Clock, TrendingUp, Star, Zap } from 'lucide-react';

const Index = () => {
  const { isTestActive, startTest } = useTest();
  const { language, t } = useLanguage();
  const [showProgress, setShowProgress] = useState(false);

  const handleStartTest = (config: TestConfiguration) => {
    const testQuestions = getRandomQuestions(config.totalQuestions, {
      subjects: config.subjects,
    });
    startTest(config, testQuestions);
  };

  if (isTestActive) {
    return <TestInterface />;
  }

  if (showProgress) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-primary">प्रगति डैशबोर्ड</h1>
            <Button onClick={() => setShowProgress(false)} variant="outline">
              वापस जाएं
            </Button>
          </div>
          <ProgressDashboard />
        </main>
      </div>
    );
  }

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
                Rex JEE Mock Tests
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('subtitle', 'Ultimate JEE Preparation Platform', 'परम JEE तैयारी मंच')}
              </p>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('heroText', 'Master JEE with comprehensive mock tests, detailed solutions, and real-time analytics', 
              'व्यापक मॉक टेस्ट, विस्तृत समाधान और रियल-टाइम एनालिटिक्स के साथ JEE में महारत हासिल करें')}
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-warning" />
              <span>1500+ {t('questions', 'Questions', 'प्रश्न')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-success" />
              <span>{t('bilingual', 'Hindi + English', 'हिंदी + अंग्रेजी')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span>{t('detailed', 'Detailed Analytics', 'विस्तृत विश्लेषण')}</span>
            </div>
          </div>
          
          <Button onClick={() => setShowProgress(true)} className="mt-4">
            प्रगति देखें
          </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">{t('available', 'Available', 'उपलब्ध')}</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-success">1500+</div>
              <div className="text-sm text-muted-foreground">{t('questions', 'Questions', 'प्रश्न')}</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold text-warning">95%</div>
              <div className="text-sm text-muted-foreground">{t('accuracy', 'Accuracy', 'सटीकता')}</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-destructive mx-auto mb-2" />
              <div className="text-2xl font-bold text-destructive">100K+</div>
              <div className="text-sm text-muted-foreground">{t('students', 'Students', 'छात्र')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Test Categories */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">
              {t('fullTests', 'Full Length Tests', 'पूर्ण लंबाई टेस्ट')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testConfigurations
                .filter(config => config.type === 'Full Test')
                .map(config => (
                  <TestCard
                    key={config.id}
                    config={config}
                    onStartTest={handleStartTest}
                    difficulty="Hard"
                    attempts={Math.floor(Math.random() * 50)}
                    averageScore={Math.floor(Math.random() * 40) + 60}
                  />
                ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">
              {t('subjectTests', 'Subject Wise Tests', 'विषयवार टेस्ट')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testConfigurations
                .filter(config => config.type === 'Subject Test')
                .map(config => (
                  <TestCard
                    key={config.id}
                    config={config}
                    onStartTest={handleStartTest}
                    difficulty="Medium"
                    attempts={Math.floor(Math.random() * 30)}
                    lastAttemptScore={Math.floor(Math.random() * 40) + 50}
                  />
                ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">
              {t('practiceTests', 'Practice & Topic Tests', 'अभ्यास और टॉपिक टेस्ट')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testConfigurations
                .filter(config => config.type === 'Topic Test' || config.type === 'Custom')
                .map(config => (
                  <TestCard
                    key={config.id}
                    config={config}
                    onStartTest={handleStartTest}
                    difficulty="Easy"
                    attempts={Math.floor(Math.random() * 20)}
                  />
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
