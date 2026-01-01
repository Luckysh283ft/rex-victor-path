// Voice Service for Speech Recognition and Text-to-Speech
// Types are defined in src/types/speech.d.ts
import type { SpeechRecognition as SpeechRecognitionType, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '@/types/speech';

export class VoiceService {
  private recognition: SpeechRecognitionType | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;

  constructor() {
    // Safely initialize synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): void {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognitionConstructor = window.webkitSpeechRecognition || window.SpeechRecognition;
    
    if (SpeechRecognitionConstructor) {
      try {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.lang = 'hi-IN';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      } catch (error) {
        console.warn('Speech recognition initialization failed:', error);
        this.recognition = null;
      }
    }
  }

  isSupported(): boolean {
    return !!this.recognition && !!this.synthesis;
  }

  isSpeechSupported(): boolean {
    return !!this.synthesis;
  }

  isRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  async startListening(): Promise<string> {
    if (!this.recognition) {
      throw new Error('वॉइस रिकॉर्डिंग उपलब्ध नहीं है। कृपया अन्य ब्राउज़र का उपयोग करें।');
    }
    
    if (this.isListening) {
      throw new Error('वॉइस रिकॉर्डिंग पहले से चल रही है');
    }

    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        return reject(new Error('Recognition not available'));
      }

      this.isListening = true;
      
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        try {
          const transcript = event.results[0][0].transcript;
          this.isListening = false;
          resolve(transcript);
        } catch (error) {
          this.isListening = false;
          reject(new Error('परिणाम प्राप्त करने में त्रुटि'));
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.isListening = false;
        const errorMessages: Record<string, string> = {
          'no-speech': 'कोई आवाज़ नहीं मिली। कृपया बोलें।',
          'audio-capture': 'माइक्रोफ़ोन उपलब्ध नहीं है।',
          'not-allowed': 'माइक्रोफ़ोन की अनुमति नहीं दी गई।',
          'network': 'नेटवर्क त्रुटि हुई।',
          'aborted': 'रिकॉर्डिंग रद्द हुई।',
          'service-not-allowed': 'सेवा उपलब्ध नहीं है।',
          'bad-grammar': 'व्याकरण त्रुटि।',
          'language-not-supported': 'भाषा समर्थित नहीं है।'
        };
        const message = errorMessages[event.error] || `वॉइस त्रुटि: ${event.error}`;
        reject(new Error(message));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(new Error('रिकॉर्डिंग शुरू करने में त्रुटि'));
      }
    });
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.warn('Error stopping recognition:', error);
      }
      this.isListening = false;
    }
  }

  speak(text: string, lang: string = 'hi-IN'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Text-to-speech उपलब्ध नहीं है'));
        return;
      }

      // Validate input
      if (!text || typeof text !== 'string') {
        reject(new Error('अमान्य टेक्स्ट'));
        return;
      }

      // Limit text length for safety
      const safeText = text.slice(0, 5000);

      // Stop any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(safeText);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      // Find Hindi voice if available
      const voices = this.synthesis.getVoices();
      const hindiVoice = voices.find(voice => 
        voice.lang === 'hi-IN' || voice.lang.startsWith('hi')
      );
      
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        reject(new Error(`TTS त्रुटि: ${event.error}`));
      };

      try {
        this.synthesis.speak(utterance);
      } catch (error) {
        reject(new Error('बोलने में त्रुटि'));
      }
    });
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      try {
        this.synthesis.cancel();
      } catch (error) {
        console.warn('Error stopping speech:', error);
      }
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

// Singleton instance with lazy initialization
let voiceServiceInstance: VoiceService | null = null;

export const getVoiceService = (): VoiceService => {
  if (!voiceServiceInstance) {
    voiceServiceInstance = new VoiceService();
  }
  return voiceServiceInstance;
};

export const voiceService = new VoiceService();