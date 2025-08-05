// Voice Service for Speech Recognition and Text-to-Speech
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export class VoiceService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.lang = 'hi-IN';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      this.recognition.lang = 'hi-IN';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  isSupported(): boolean {
    return !!this.recognition && !!this.synthesis;
  }

  async startListening(): Promise<string> {
    if (!this.recognition || this.isListening) {
      throw new Error('वॉइस रिकॉर्डिंग उपलब्ध नहीं है');
    }

    return new Promise((resolve, reject) => {
      if (!this.recognition) return reject('Recognition not available');

      this.isListening = true;
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        resolve(transcript);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        reject(`वॉइस रिकॉर्डिंग त्रुटि: ${event.error}`);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string, lang: string = 'hi-IN'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject('Text-to-speech उपलब्ध नहीं है');
        return;
      }

      // Stop any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
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
      utterance.onerror = (event) => reject(`TTS त्रुटि: ${event.error}`);

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceService = new VoiceService();