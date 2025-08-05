// OpenAI Service for IIT-JEE Mock Test AI Tutor
import OpenAI from 'openai';

interface AIServiceConfig {
  apiKey: string;
  searchResults?: string[];
}

export class AIService {
  private openai: OpenAI | null = null;
  private apiKey: string = '';

  constructor(config?: AIServiceConfig) {
    if (config?.apiKey) {
      this.setApiKey(config.apiKey);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  isConfigured(): boolean {
    return !!this.openai && !!this.apiKey;
  }

  async sendMessage(message: string, searchContext?: string[]): Promise<string> {
    if (!this.openai) {
      throw new Error('AI सेवा कॉन्फ़िगर नहीं है। कृपया सेटिंग्स में API key डालें।');
    }

    const systemPrompt = `आप एक मैत्रीपूर्ण IIT-JEE मेंटर हैं। आपको निम्नलिखित नियमों का पालन करना है:

1. हमेशा स्पष्ट हिंदी में step-by-step समझाएं
2. कभी भी "स्वयं पढ़ लें" या "खुद से करें" न कहें
3. गणितीय सूत्र और scientific symbols standard notation में लिखें
4. Common mistakes और traps highlight करें
5. Alternative methods भी बताएं जहाँ संभव हो
6. Encouraging और supportive रहें
7. Direct answer देने से बचें, समझाने पर focus करें

${searchContext && searchContext.length > 0 ? `\nSंदर्भ जानकारी:\n${searchContext.join('\n\n')}` : ''}`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0]?.message?.content || 'कोई उत्तर नहीं मिला।';
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      if (error.code === 'invalid_api_key') {
        throw new Error('अवैध API key। कृपया सेटिंग्स में सही key डालें।');
      }
      throw new Error('AI सेवा में त्रुटि। कृपया पुनः प्रयास करें।');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.sendMessage('Test message');
      return true;
    } catch {
      return false;
    }
  }
}

export const aiService = new AIService();