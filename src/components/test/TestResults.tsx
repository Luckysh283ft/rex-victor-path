import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  BookOpen,
  ChevronRight,
  BarChart3,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { TestAttempt, Question, TestResult, SubjectAnalysis } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface TestResultsProps {
  testAttempt: TestAttempt;
  questions: Question[];
  onReturnToDashboard: () => void;
  onViewSolutions: () => void;
  onRestartTest: () => void;
}

export const TestResults: React.FC<TestResultsProps> = ({
  testAttempt,
  questions,
  onReturnToDashboard,
  onViewSolutions,
  onRestartTest
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate results
  const calculateResults = (): TestResult => {
    const answers = testAttempt.answers;
    let totalScore = 0;
    let maxScore = 0;
    let questionsCorrect = 0;
    let questionsIncorrect = 0;
    let questionsUnattempted = 0;
    
    const subjectStats: Record<string, SubjectAnalysis> = {
      Physics: { totalQuestions: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0, percentage: 0, timeSpent: 0, accuracy: 0, topicWiseAnalysis: {} },
      Chemistry: { totalQuestions: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0, percentage: 0, timeSpent: 0, accuracy: 0, topicWiseAnalysis: {} },
      Mathematics: { totalQuestions: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0, percentage: 0, timeSpent: 0, accuracy: 0, topicWiseAnalysis: {} }
    };

    questions.forEach(question => {
      const userAnswer = answers[question.id];
      maxScore += question.marks;
      subjectStats[question.subject].totalQuestions++;
      subjectStats[question.subject].maxScore += question.marks;

      if (userAnswer !== undefined) {
        // Check if answer is correct
        let isCorrect = false;
        if (question.questionType === 'single-correct' && typeof question.correctAnswer === 'number') {
          isCorrect = userAnswer === question.correctAnswer;
        } else if (question.questionType === 'multiple-correct' && Array.isArray(question.correctAnswer)) {
          // For multiple-correct, this is simplified - in real scenario you'd check partial marking
          isCorrect = question.correctAnswer.includes(userAnswer);
        } else if (question.questionType === 'integer-answer') {
          isCorrect = userAnswer === question.correctAnswer;
        }

        if (isCorrect) {
          totalScore += question.marks;
          questionsCorrect++;
          subjectStats[question.subject].correct++;
          subjectStats[question.subject].score += question.marks;
        } else {
          totalScore -= question.negativeMarks;
          questionsIncorrect++;
          subjectStats[question.subject].incorrect++;
          subjectStats[question.subject].score -= question.negativeMarks;
        }
      } else {
        questionsUnattempted++;
        subjectStats[question.subject].unattempted++;
      }
    });

    // Calculate percentages and accuracy
    Object.keys(subjectStats).forEach(subject => {
      const stats = subjectStats[subject];
      stats.percentage = stats.maxScore > 0 ? (stats.score / stats.maxScore) * 100 : 0;
      stats.accuracy = (stats.correct + stats.incorrect) > 0 ? (stats.correct / (stats.correct + stats.incorrect)) * 100 : 0;
    });

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const percentile = Math.min(95, Math.max(5, percentage + Math.random() * 10 - 5)); // Mock percentile
    const timeTaken = testAttempt.endTime && testAttempt.startTime 
      ? Math.round((testAttempt.endTime.getTime() - testAttempt.startTime.getTime()) / 60000)
      : 180;

    return {
      id: `result_${testAttempt.id}`,
      testAttemptId: testAttempt.id,
      totalScore,
      maxScore,
      percentage,
      percentile,
      timeTaken,
      questionsCorrect,
      questionsIncorrect,
      questionsUnattempted,
      subjectWiseAnalysis: subjectStats as any,
      strengthTopics: ['Mechanics', 'Organic Chemistry', 'Calculus'],
      weaknessTopics: ['Thermodynamics', 'Coordination Chemistry', 'Probability'],
      timeAnalysis: {
        averageTimePerQuestion: timeTaken * 60 / questions.length,
        fastestQuestion: 30,
        slowestQuestion: 300,
        timeManagement: percentage > 80 ? 'Excellent' : percentage > 60 ? 'Good' : percentage > 40 ? 'Average' : 'Poor'
      },
      recommendations: [
        'Focus more on Thermodynamics concepts',
        'Practice more Coordination Chemistry problems',
        'Improve time management in Probability questions'
      ],
      recommendationsHindi: [
        'ऊष्मागतिकी की अवधारणाओं पर अधिक ध्यान दें',
        'समन्वय रसायन की अधिक समस्याओं का अभ्यास करें',
        'प्रायिकता प्रश्नों में समय प्रबंधन में सुधार करें'
      ]
    };
  };

  const results = calculateResults();

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    if (percentage >= 40) return 'text-primary';
    return 'text-destructive';
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return { text: 'Outstanding', variant: 'default', color: 'bg-gradient-primary' };
    if (percentage >= 80) return { text: 'Excellent', variant: 'default', color: 'bg-success' };
    if (percentage >= 70) return { text: 'Very Good', variant: 'secondary', color: 'bg-primary' };
    if (percentage >= 60) return { text: 'Good', variant: 'secondary', color: 'bg-warning' };
    if (percentage >= 50) return { text: 'Average', variant: 'outline', color: 'bg-muted' };
    return { text: 'Below Average', variant: 'destructive', color: 'bg-destructive' };
  };

  const performanceBadge = getPerformanceBadge(results.percentage);

  return (
    <div className={cn(
      "min-h-screen bg-gradient-hero p-4",
      language === 'hi' && "font-devanagari"
    )}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {t('testCompleted', 'Test Completed!', 'टेस्ट पूर्ण!')}
              </h1>
              <p className="text-muted-foreground">
                {t('resultReady', 'Your detailed results are ready', 'आपके विस्तृत परिणाम तैयार हैं')}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 bg-gradient-card border-border animate-slide-up">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {results.totalScore}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('totalScore', 'Total Score', 'कुल स्कोर')} / {results.maxScore}
                </div>
                <Badge className={cn('mt-2', performanceBadge.color)}>
                  {performanceBadge.text}
                </Badge>
              </div>
              
              <div>
                <div className={cn("text-4xl font-bold mb-2", getPerformanceColor(results.percentage))}>
                  {results.percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('percentage', 'Percentage', 'प्रतिशत')}
                </div>
                <Progress value={results.percentage} className="mt-2" />
              </div>
              
              <div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {results.percentile.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('percentile', 'Percentile', 'पर्सेंटाइल')}
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-xs text-success">Top {(100 - results.percentile).toFixed(0)}%</span>
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold text-warning mb-2">
                  {results.timeTaken}m
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('timeTaken', 'Time Taken', 'लिया गया समय')}
                </div>
                <Badge variant="outline" className="mt-2">
                  {results.timeAnalysis.timeManagement}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t('overview', 'Overview', 'अवलोकन')}</TabsTrigger>
            <TabsTrigger value="subjects">{t('subjects', 'Subjects', 'विषय')}</TabsTrigger>
            <TabsTrigger value="analysis">{t('analysis', 'Analysis', 'विश्लेषण')}</TabsTrigger>
            <TabsTrigger value="recommendations">{t('recommendations', 'Tips', 'सुझाव')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Question Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                  <div className="text-3xl font-bold text-success mb-2">{results.questionsCorrect}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('correct', 'Correct', 'सही')}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <XCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                  <div className="text-3xl font-bold text-destructive mb-2">{results.questionsIncorrect}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('incorrect', 'Incorrect', 'गलत')}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <AlertCircle className="h-12 w-12 text-warning mx-auto mb-3" />
                  <div className="text-3xl font-bold text-warning mb-2">{results.questionsUnattempted}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('unattempted', 'Unattempted', 'अनुत्तरित')}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            {/* Subject-wise Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(results.subjectWiseAnalysis).map(([subject, analysis]) => (
                <Card key={subject}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {language === 'hi' ? 
                        (subject === 'Physics' ? 'भौतिकी' : subject === 'Chemistry' ? 'रसायन विज्ञान' : 'गणित') 
                        : subject
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={cn("text-2xl font-bold", getPerformanceColor(analysis.percentage))}>
                        {analysis.score} / {analysis.maxScore}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {analysis.percentage.toFixed(1)}% ({analysis.accuracy.toFixed(1)}% accuracy)
                      </div>
                      <Progress value={analysis.percentage} className="mt-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-success font-semibold">{analysis.correct}</div>
                        <div className="text-muted-foreground">Correct</div>
                      </div>
                      <div className="text-center">
                        <div className="text-destructive font-semibold">{analysis.incorrect}</div>
                        <div className="text-muted-foreground">Wrong</div>
                      </div>
                      <div className="text-center">
                        <div className="text-warning font-semibold">{analysis.unattempted}</div>
                        <div className="text-muted-foreground">Skipped</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {/* Time Analysis & Strengths/Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {t('timeAnalysis', 'Time Analysis', 'समय विश्लेषण')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. time per question:</span>
                      <span className="font-medium">{Math.round(results.timeAnalysis.averageTimePerQuestion)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Time management:</span>
                      <Badge variant="outline">{results.timeAnalysis.timeManagement}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    {t('topicAnalysis', 'Topic Analysis', 'विषय विश्लेषण')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-success mb-2">Strong Topics:</div>
                    <div className="flex flex-wrap gap-1">
                      {results.strengthTopics.map(topic => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-destructive mb-2">Weak Topics:</div>
                    <div className="flex flex-wrap gap-1">
                      {results.weaknessTopics.map(topic => (
                        <Badge key={topic} variant="destructive" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('personalizedTips', 'Personalized Recommendations', 'व्यक्तिगत सुझाव')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(language === 'hi' ? results.recommendationsHindi : results.recommendations).map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Button onClick={onViewSolutions} className="bg-gradient-primary hover:opacity-90">
            <BookOpen className="h-4 w-4 mr-2" />
            {t('viewSolutions', 'View Solutions', 'समाधान देखें')}
          </Button>
          
          <Button variant="outline" onClick={onRestartTest}>
            <Zap className="h-4 w-4 mr-2" />
            {t('retakeTest', 'Retake Test', 'पुनः टेस्ट लें')}
          </Button>
          
          <Button variant="outline" onClick={onReturnToDashboard}>
            <BarChart3 className="h-4 w-4 mr-2" />
            {t('dashboard', 'Dashboard', 'डैशबोर्ड')}
          </Button>
        </div>
      </div>
    </div>
  );
};