import OpenAI from 'openai';
import { logger } from '../utils/logger';
import { AIConfig, ChatMessage } from '../types';

class AIService {
  private openai: OpenAI;
  private azureOpenAI?: OpenAI;

  constructor() {
    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        organization: process.env.OPENAI_ORG_ID
      });
    }

    // Initialize Azure OpenAI
    if (process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
      this.azureOpenAI = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
        defaultQuery: { 'api-version': '2024-02-15-preview' },
        defaultHeaders: {
          'api-key': process.env.AZURE_OPENAI_API_KEY,
        }
      });
    }
  }

  async generateResponse(
    message: string,
    conversationHistory: ChatMessage[],
    config: AIConfig
  ): Promise<{
    response: string;
    confidence: number;
    intent: string;
    entities: any[];
    usage?: any;
  }> {
    try {
      const client = config.provider === 'azure' ? this.azureOpenAI : this.openai;
      
      if (!client) {
        throw new Error(`${config.provider} client not configured`);
      }

      // Build conversation context
      const messages = [
        {
          role: 'system' as const,
          content: config.systemPrompt || this.getDefaultSystemPrompt()
        },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text
        })),
        {
          role: 'user' as const,
          content: message
        }
      ];

      const completion = await client.chat.completions.create({
        model: config.model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
      
      // Simple intent classification (in production, use a proper NLU service)
      const intent = this.classifyIntent(message);
      const entities = this.extractEntities(message);
      const confidence = this.calculateConfidence(response, intent);

      logger.info('AI response generated', {
        model: config.model,
        provider: config.provider,
        intent,
        confidence,
        usage: completion.usage
      });

      return {
        response,
        confidence,
        intent,
        entities,
        usage: completion.usage
      };

    } catch (error) {
      logger.error('AI service error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  private getDefaultSystemPrompt(): string {
    return `You are an advanced AI assistant for LuxeStay Hotels, a luxury hotel chain. You have access to comprehensive hotel information and can help with:

1. Hotel services, amenities, and policies
2. Booking assistance and room information
3. Local recommendations and concierge services
4. Business analytics and operational insights
5. Customer service and problem resolution

Key Information:
- Check-in: 3:00 PM, Check-out: 11:00 AM
- Locations: New York, London, Tokyo, Dubai
- Room types: Standard, Deluxe, Suite, Presidential Suite, Family Room
- Amenities: Spa, Restaurant, Gym, Pool, Business Center, Concierge
- Pet policy: Allowed with $50 fee
- Cancellation: 24 hours before arrival

Provide professional, helpful, and contextually relevant responses. Always maintain a luxury service standard in your communication.`;
  }

  private classifyIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
      return 'booking_request';
    } else if (lowerMessage.includes('cancel')) {
      return 'cancellation';
    } else if (lowerMessage.includes('room') || lowerMessage.includes('suite')) {
      return 'room_inquiry';
    } else if (lowerMessage.includes('analytics') || lowerMessage.includes('data') || lowerMessage.includes('report')) {
      return 'analytics_request';
    } else if (lowerMessage.includes('amenities') || lowerMessage.includes('facilities')) {
      return 'amenities_inquiry';
    } else if (lowerMessage.includes('restaurant') || lowerMessage.includes('dining')) {
      return 'dining_inquiry';
    } else if (lowerMessage.includes('spa') || lowerMessage.includes('wellness')) {
      return 'spa_inquiry';
    } else if (lowerMessage.includes('location') || lowerMessage.includes('address')) {
      return 'location_inquiry';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      return 'pricing_inquiry';
    } else {
      return 'general_inquiry';
    }
  }

  private extractEntities(message: string): any[] {
    const entities: any[] = [];
    const lowerMessage = message.toLowerCase();

    // Extract dates (simple regex - in production use proper NER)
    const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/g;
    const dates = message.match(dateRegex);
    if (dates) {
      dates.forEach(date => {
        entities.push({ type: 'date', value: date });
      });
    }

    // Extract room types
    const roomTypes = ['standard', 'deluxe', 'suite', 'presidential', 'family'];
    roomTypes.forEach(type => {
      if (lowerMessage.includes(type)) {
        entities.push({ type: 'room_type', value: type });
      }
    });

    // Extract numbers (potential guest count, room numbers, etc.)
    const numberRegex = /\b\d+\b/g;
    const numbers = message.match(numberRegex);
    if (numbers) {
      numbers.forEach(num => {
        entities.push({ type: 'number', value: parseInt(num) });
      });
    }

    return entities;
  }

  private calculateConfidence(response: string, intent: string): number {
    // Simple confidence calculation based on response length and intent match
    let confidence = 0.7; // Base confidence

    if (response.length > 50) confidence += 0.1;
    if (response.length > 100) confidence += 0.1;
    if (intent !== 'general_inquiry') confidence += 0.1;
    if (response.includes('LuxeStay') || response.includes('hotel')) confidence += 0.05;

    return Math.min(confidence, 0.98);
  }
}

export const aiService = new AIService();