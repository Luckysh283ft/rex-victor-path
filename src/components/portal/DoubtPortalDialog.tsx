import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ComprehensiveAITutor } from '@/components/ai/ComprehensiveAITutor';
import { Bot } from 'lucide-react';

interface DoubtPortalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentContext?: {
    lastTestScore?: number;
    subjectPreference?: string;
    weakAreas?: string[];
    recentMistakes?: string[];
  };
}

export const DoubtPortalDialog: React.FC<DoubtPortalDialogProps> = ({
  open,
  onOpenChange,
  studentContext
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-devanagari flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            JEE Advanced AI गुरु - Doubt Portal
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-0 h-[700px]">
          <ComprehensiveAITutor 
            className="h-full"
            studentContext={studentContext}
            onDoubtResolved={(topic) => {
              console.log(`Doubt resolved for topic: ${topic}`);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};