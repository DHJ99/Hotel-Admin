import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { aiService } from '../services/aiService';
import { logger } from '../utils/logger';
import { chatSchemas } from '../utils/validation';
import { ChatMessage, AIConfig } from '../types';

export class ChatController {
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = chatSchemas.message.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const userId = (req as any).user.id;
      const { message, session_id, config } = value;
      const sessionId = session_id || uuidv4();

      // Get conversation history
      const conversationHistory = await this.getConversationHistory(userId, sessionId);

      // Prepare AI configuration
      const aiConfig: AIConfig = {
        provider: config?.provider || 'openai',
        model: config?.model || 'gpt-4-turbo',
        temperature: config?.temperature || 0.7,
        maxTokens: config?.maxTokens || 2000,
        systemPrompt: config?.systemPrompt || this.getDefaultSystemPrompt()
      };

      // Generate AI response
      const aiResponse = await aiService.generateResponse(
        message,
        conversationHistory,
        aiConfig
      );

      // Create message objects
      const userMessage: ChatMessage = {
        id: uuidv4(),
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      };

      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        text: aiResponse.response,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        confidence: aiResponse.confidence,
        intent: aiResponse.intent,
        entities: aiResponse.entities
      };

      // Update conversation in database
      const updatedMessages = [...conversationHistory, userMessage, assistantMessage];
      await this.saveConversation(userId, sessionId, updatedMessages);

      logger.info('Chat message processed successfully', {
        userId,
        sessionId,
        intent: aiResponse.intent,
        confidence: aiResponse.confidence
      });

      res.json({
        message: assistantMessage,
        session_id: sessionId,
        metadata: {
          intent: aiResponse.intent,
          confidence: aiResponse.confidence,
          entities: aiResponse.entities,
          usage: aiResponse.usage
        }
      });

    } catch (error) {
      logger.error('Chat message error:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  }

  async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { session_id } = req.params;

      const result = await db.query(
        'SELECT messages FROM chat_conversations WHERE user_id = $1 AND session_id = $2',
        [userId, session_id]
      );

      if (result.rows.length === 0) {
        res.json({ messages: [] });
        return;
      }

      res.json({ messages: result.rows[0].messages });

    } catch (error) {
      logger.error('Get conversation error:', error);
      res.status(500).json({ error: 'Failed to retrieve conversation' });
    }
  }

  async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const result = await db.query(
        `SELECT session_id, 
                CASE 
                  WHEN jsonb_array_length(messages) > 0 
                  THEN messages->-1->>'text' 
                  ELSE 'No messages' 
                END as last_message,
                updated_at
         FROM chat_conversations 
         WHERE user_id = $1 
         ORDER BY updated_at DESC 
         LIMIT $2 OFFSET $3`,
        [userId, Number(limit), offset]
      );

      res.json({ conversations: result.rows });

    } catch (error) {
      logger.error('Get conversations error:', error);
      res.status(500).json({ error: 'Failed to retrieve conversations' });
    }
  }

  async deleteConversation(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { session_id } = req.params;

      const result = await db.query(
        'DELETE FROM chat_conversations WHERE user_id = $1 AND session_id = $2 RETURNING id',
        [userId, session_id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Conversation not found' });
        return;
      }

      logger.info('Conversation deleted successfully', { userId, sessionId: session_id });
      res.json({ message: 'Conversation deleted successfully' });

    } catch (error) {
      logger.error('Delete conversation error:', error);
      res.status(500).json({ error: 'Failed to delete conversation' });
    }
  }

  private async getConversationHistory(userId: string, sessionId: string): Promise<ChatMessage[]> {
    try {
      const result = await db.query(
        'SELECT messages FROM chat_conversations WHERE user_id = $1 AND session_id = $2',
        [userId, sessionId]
      );

      if (result.rows.length === 0) {
        return [];
      }

      return result.rows[0].messages || [];
    } catch (error) {
      logger.error('Error getting conversation history:', error);
      return [];
    }
  }

  private async saveConversation(userId: string, sessionId: string, messages: ChatMessage[]): Promise<void> {
    try {
      await db.query(
        `INSERT INTO chat_conversations (user_id, session_id, messages)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, session_id)
         DO UPDATE SET messages = $3, updated_at = NOW()`,
        [userId, sessionId, JSON.stringify(messages)]
      );
    } catch (error) {
      logger.error('Error saving conversation:', error);
      throw error;
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
}

export const chatController = new ChatController();