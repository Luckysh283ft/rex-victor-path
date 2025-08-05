import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Download, BookOpen, Clock, Target, Award } from 'lucide-react';

interface AttemptData {
  id: string;
  date: string;
  score: number;
  percentage: number;
  physics: number;
  chemistry: number;
  mathematics: number;
  timeTaken: number;
}

interface WeakArea {
  topic: string;
  subject: string;
  accuracy: number;
  questionsAttempted: number;
}

export const ProgressDashboard = () => {
  const [attempts, setAttempts] = useState<AttemptData[]>([]);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);

  useEffect(() => {
    // Load data from localStorage or generate mock data
    const mockAttempts: AttemptData[] = [
      {
        id: '1',
        date: '2024-01-01',
        score: 120,
        percentage: 66.7,
        physics: 40,
        chemistry: 42,
        mathematics: 38,
        timeTaken: 165
      },
      {
        id: '2',
        date: '2024-01-03',
        score: 135,
        percentage: 75.0,
        physics: 45,
        chemistry: 48,
        mathematics: 42,
        timeTaken: 158
      },
      {
        id: '3',
        date: '2024-01-05',
        score: 142,
        percentage: 78.9,
        physics: 48,
        chemistry: 46,
        mathematics: 48,
        timeTaken: 152
      },
      {
        id: '4',
        date: '2024-01-07',
        score: 155,
        percentage: 86.1,
        physics: 52,
        chemistry: 51,
        mathematics: 52,
        timeTaken: 145
      },
      {
        id: '5',
        date: '2024-01-09',
        score: 148,
        percentage: 82.2,
        physics: 49,
        chemistry: 50,
        mathematics: 49,
        timeTaken: 150
      },
    ];

    const mockWeakAreas: WeakArea[] = [
      { topic: 'विद्युत धारा', subject: 'Physics', accuracy: 45, questionsAttempted: 12 },
      { topic: 'कार्बनिक रसायन', subject: 'Chemistry', accuracy: 52, questionsAttempted: 15 },
      { topic: 'समाकलन', subject: 'Mathematics', accuracy: 58, questionsAttempted: 18 },
      { topic: 'प्रकाशिकी', subject: 'Physics', accuracy: 62, questionsAttempted: 10 },
      { topic: 'अम्ल-क्षार', subject: 'Chemistry', accuracy: 48, questionsAttempted: 14 },
    ];

    setAttempts(mockAttempts);
    setWeakAreas(mockWeakAreas);
  }, []);

  const chartData = attempts.map((attempt, index) => ({
    test: `टेस्ट ${index + 1}`,
    score: attempt.percentage,
    physics: (attempt.physics / 54) * 100,
    chemistry: (attempt.chemistry / 54) * 100,
    mathematics: (attempt.mathematics / 54) * 100,
  }));

  const downloadReport = () => {
    const csvData = [
      ['Test', 'Date', 'Score', 'Percentage', 'Physics', 'Chemistry', 'Mathematics', 'Time (min)'],
      ...attempts.map((attempt, index) => [
        `Test ${index + 1}`,
        attempt.date,
        attempt.score,
        `${attempt.percentage}%`,
        attempt.physics,
        attempt.chemistry,
        attempt.mathematics,
        attempt.timeTaken
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jee-progress-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const latestScore = attempts.length > 0 ? attempts[attempts.length - 1].percentage : 0;
  const averageScore = attempts.length > 0 
    ? attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length 
    : 0;
  const improvement = attempts.length > 1 
    ? attempts[attempts.length - 1].percentage - attempts[0].percentage 
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">कुल टेस्ट</p>
                <p className="text-2xl font-bold text-primary">{attempts.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">नवीनतम स्कोर</p>
                <p className="text-2xl font-bold text-success">{latestScore.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">औसत स्कोर</p>
                <p className="text-2xl font-bold text-warning">{averageScore.toFixed(1)}%</p>
              </div>
              <Award className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">सुधार</p>
                <p className={`text-2xl font-bold ${improvement >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className={`h-8 w-8 ${improvement >= 0 ? 'text-success' : 'text-destructive'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-primary">प्रगति विश्लेषण</CardTitle>
          <Button onClick={downloadReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            रिपोर्ट डाउनलोड करें
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="test" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value: any) => [`${value.toFixed(1)}%`, '']}
                labelFormatter={(label) => `${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                name="कुल स्कोर"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject-wise Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">विषयवार प्रदर्शन</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="test" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, '']} />
              <Bar dataKey="physics" fill="hsl(var(--success))" name="भौतिकी" />
              <Bar dataKey="chemistry" fill="hsl(var(--warning))" name="रसायन विज्ञान" />
              <Bar dataKey="mathematics" fill="hsl(var(--destructive))" name="गणित" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weak Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">कमजोर क्षेत्र</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weakAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{area.topic}</h4>
                    <Badge variant="outline">
                      {area.subject === 'Physics' ? 'भौतिकी' : 
                       area.subject === 'Chemistry' ? 'रसायन' : 'गणित'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>सटीकता</span>
                        <span>{area.accuracy}%</span>
                      </div>
                      <Progress value={area.accuracy} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {area.questionsAttempted} प्रश्न
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-4">
                  अभ्यास करें
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};