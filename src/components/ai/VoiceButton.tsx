import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { voiceService } from '@/services/voiceService';
import { useToast } from '@/hooks/use-toast';

interface VoiceButtonProps {
  onVoiceInput: (text: string) => void;
  onSpeak: (text: string) => void;
  isListening: boolean;
  isSpeaking: boolean;
  setIsListening: (listening: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onVoiceInput,
  onSpeak,
  isListening,
  isSpeaking,
  setIsListening,
  setIsSpeaking
}) => {
  const { toast } = useToast();

  const handleVoiceInput = async () => {
    if (!voiceService.isSupported()) {
      toast({
        title: "वॉइस सपोर्ट नहीं",
        description: "आपका ब्राउज़र वॉइस रिकॉर्डिंग को सपोर्ट नहीं करता।",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }

    try {
      setIsListening(true);
      const transcript = await voiceService.startListening();
      onVoiceInput(transcript);
      setIsListening(false);
    } catch (error: any) {
      setIsListening(false);
      toast({
        title: "वॉइस इनपुट त्रुटि",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleStopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  };

  if (isSpeaking) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleStopSpeaking}
        className="text-destructive hover:text-destructive/80"
      >
        <VolumeX className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleVoiceInput}
      className={isListening ? "text-destructive animate-pulse" : "text-muted-foreground"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};