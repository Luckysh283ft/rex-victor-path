import jsPDF from 'jspdf';
import { Question, TestAttempt } from '@/types';

export const generateAnswerKeyPDF = async (questions: Question[], testAttempt: TestAttempt) => {
  const pdf = new jsPDF();
  
  // Title
  pdf.setFontSize(20);
  pdf.text('JEE Advanced Mock Test - Answer Key', 20, 20);
  
  // Test details
  pdf.setFontSize(12);
  pdf.text(`Test Date: ${new Date(testAttempt.startTime).toLocaleDateString('hi-IN')}`, 20, 35);
  pdf.text(`Total Questions: ${questions.length}`, 20, 45);
  
  let yPosition = 60;
  const pageHeight = pdf.internal.pageSize.height;
  
  const getAnswerDisplay = (question: Question, studentAnswer: number | undefined) => {
    if (studentAnswer === undefined) return '-';
    
    if (question.questionType === 'single-correct' || question.questionType === 'multiple-correct') {
      if (Array.isArray(studentAnswer)) {
        return studentAnswer.map(ans => `Option ${String.fromCharCode(65 + ans)}`).join(', ');
      }
      return `Option ${String.fromCharCode(65 + studentAnswer)}`;
    }
    
    return studentAnswer.toString();
  };

  const getCorrectAnswerDisplay = (question: Question) => {
    if (question.questionType === 'single-correct') {
      return `Option ${String.fromCharCode(65 + (question.correctAnswer as number))}`;
    }
    
    if (question.questionType === 'multiple-correct') {
      const answers = question.correctAnswer as number[];
      return answers.map(ans => `Option ${String.fromCharCode(65 + ans)}`).join(', ');
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

  // Group by subjects
  const subjects = ['Physics', 'Chemistry', 'Mathematics'];
  
  subjects.forEach(subject => {
    const subjectQuestions = questions.filter(q => q.subject === subject);
    if (subjectQuestions.length === 0) return;
    
    // Check if we need a new page
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }
    
    // Subject header
    pdf.setFontSize(16);
    const subjectName = subject === 'Physics' ? 'भौतिकी (Physics)' : 
                       subject === 'Chemistry' ? 'रसायन विज्ञान (Chemistry)' : 
                       'गणित (Mathematics)';
    pdf.text(subjectName, 20, yPosition);
    yPosition += 15;
    
    // Table header
    pdf.setFontSize(10);
    pdf.text('Q.No', 20, yPosition);
    pdf.text('Correct Answer', 50, yPosition);
    pdf.text('Your Answer', 100, yPosition);
    pdf.text('Status', 140, yPosition);
    pdf.text('Marks', 170, yPosition);
    yPosition += 10;
    
    // Draw line
    pdf.line(20, yPosition - 5, 190, yPosition - 5);
    
    subjectQuestions.forEach((question, index) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      
      const studentAnswer = testAttempt.answers[question.id];
      const correct = isCorrect(question, studentAnswer);
      const attempted = studentAnswer !== undefined;
      
      pdf.text((index + 1).toString(), 20, yPosition);
      pdf.text(getCorrectAnswerDisplay(question), 50, yPosition);
      pdf.text(getAnswerDisplay(question, studentAnswer), 100, yPosition);
      pdf.text(attempted ? (correct ? 'Correct' : 'Wrong') : 'Not Attempted', 140, yPosition);
      pdf.text(correct ? `+${question.marks}` : attempted ? `-${question.negativeMarks}` : '0', 170, yPosition);
      
      yPosition += 10;
    });
    
    yPosition += 10;
  });
  
  // Save the PDF
  pdf.save(`JEE-Answer-Key-${new Date().toISOString().split('T')[0]}.pdf`);
};