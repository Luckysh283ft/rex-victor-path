import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Question, TestAttempt } from '@/types';
import { generateAnswerKeyPDF } from '@/utils/pdfGenerator';

interface AnswerKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: Question[];
  testAttempt: TestAttempt;
  onViewSolution: (questionId: string) => void;
}

export const AnswerKeyModal: React.FC<AnswerKeyModalProps> = ({
  open,
  onOpenChange,
  questions,
  testAttempt,
  onViewSolution
}) => {
  const handleExportPDF = async () => {
    try {
      await generateAnswerKeyPDF(questions, testAttempt);
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  const getAnswerDisplay = (question: Question, studentAnswer: number | undefined) => {
    if (studentAnswer === undefined) return '-';
    
    if (question.questionType === 'single-correct' || question.questionType === 'multiple-correct') {
      if (Array.isArray(studentAnswer)) {
        return studentAnswer.map(ans => `विकल्प ${String.fromCharCode(65 + ans)}`).join(', ');
      }
      return `विकल्प ${String.fromCharCode(65 + studentAnswer)}`;
    }
    
    return studentAnswer.toString();
  };

  const getCorrectAnswerDisplay = (question: Question) => {
    if (question.questionType === 'single-correct') {
      return `विकल्प ${String.fromCharCode(65 + (question.correctAnswer as number))}`;
    }
    
    if (question.questionType === 'multiple-correct') {
      const answers = question.correctAnswer as number[];
      return answers.map(ans => `विकल्प ${String.fromCharCode(65 + ans)}`).join(', ');
    }
    
    if (question.questionType === 'integer-answer') {
      return question.correctAnswer?.toString() || '-';
    }
    
    if (question.questionType === 'matrix-match') {
      return 'मैट्रिक्स मिलान';
    }
    
    return question.correctAnswer?.toString() || '-';
  };

  const isCorrect = (question: Question, studentAnswer: number | undefined) => {
    if (studentAnswer === undefined) return false;
    
    if (question.questionType === 'multiple-correct') {
      const correct = question.correctAnswer as number[];
      const student = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer];
      return correct.length === student.length && 
             correct.every(ans => student.includes(ans));
    }
    
    return question.correctAnswer === studentAnswer;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Eye className="h-6 w-6" />
            उत्तर कुंजी (Answer Key)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Button */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">प्रश्न-वार विश्लेषण</h3>
              <p className="text-muted-foreground">कुल प्रश्न: {questions.length}</p>
            </div>
            <Button onClick={handleExportPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              PDF डाउनलोड करें
            </Button>
          </div>

          {/* Subject-wise tables */}
          {['Physics', 'Chemistry', 'Mathematics'].map(subject => {
            const subjectQuestions = questions.filter(q => q.subject === subject);
            if (subjectQuestions.length === 0) return null;

            return (
              <Card key={subject}>
                <CardHeader>
                  <CardTitle className="text-primary">
                    {subject === 'Physics' ? 'भौतिकी' : 
                     subject === 'Chemistry' ? 'रसायन विज्ञान' : 'गणित'}
                    <Badge className="ml-2">{subjectQuestions.length} प्रश्न</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">प्रश्न</TableHead>
                        <TableHead>प्रकार</TableHead>
                        <TableHead>सही उत्तर</TableHead>
                        <TableHead>आपका उत्तर</TableHead>
                        <TableHead className="text-center">स्थिति</TableHead>
                        <TableHead>अंक</TableHead>
                        <TableHead className="text-center">समाधान</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjectQuestions.map((question, index) => {
                        const studentAnswer = testAttempt.answers[question.id];
                        const correct = isCorrect(question, studentAnswer);
                        const attempted = studentAnswer !== undefined;
                        
                        return (
                          <TableRow key={question.id}>
                            <TableCell className="font-semibold">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {question.questionTypeHindi}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {getCorrectAnswerDisplay(question)}
                            </TableCell>
                            <TableCell>
                              <span className={attempted ? (correct ? 'text-success' : 'text-destructive') : 'text-muted-foreground'}>
                                {getAnswerDisplay(question, studentAnswer)}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {!attempted ? (
                                <Badge variant="secondary">अनुत्तरित</Badge>
                              ) : correct ? (
                                <CheckCircle className="h-5 w-5 text-success mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-destructive mx-auto" />
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={correct ? "default" : attempted ? "destructive" : "secondary"}>
                                {correct ? `+${question.marks}` : 
                                 attempted ? `-${question.negativeMarks}` : '0'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewSolution(question.id)}
                                className="hover:bg-primary/10"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};