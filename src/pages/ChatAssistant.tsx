import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, RefreshCw, Sparkles, Settings, Shield, Zap, Brain, Database, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  confidence?: number;
  intent?: string;
  entities?: any[];
}

interface AIConfig {
  provider: 'openai' | 'anthropic' | 'azure' | 'custom';
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

const EnterpriseChatBot: React.FC = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Enterprise AI Assistant powered by advanced language models. I can help you with complex queries, provide detailed analysis, and learn from our conversation. What would you like to explore today?',
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      confidence: 0.98,
      intent: 'greeting'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    provider: 'openai',
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'You are a helpful enterprise AI assistant for LuxeStay Hotels. Provide accurate, professional, and contextual responses.'
  });
  const [conversationContext, setConversationContext] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate session ID on component mount
  useEffect(() => {
    setSessionId(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate AI response for demo purposes
      const demoResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText),
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        confidence: 0.85,
        intent: classifyIntent(inputText)
      };
      setMessages(prev => [...prev, demoResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback response
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm experiencing some technical difficulties. Please try again later.",
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        confidence: 0.5,
        intent: 'error'
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Chat cleared. How can I assist you today?',
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        confidence: 0.98,
        intent: 'greeting'
      }
    ]);
    setConversationContext([]);
  };

  const classifyIntent = (message: string): string => {
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
    } else {
      return 'general_inquiry';
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const intent = classifyIntent(userMessage);
    
    switch (intent) {
      case 'booking_request':
        return "I'd be happy to help you with booking information! Our available room types include Standard, Deluxe, Suite, Presidential Suite, and Family Room. Check-in is at 3:00 PM and check-out is at 11:00 AM. Would you like me to check availability for specific dates?";
      
      case 'room_inquiry':
        return "Our hotel offers several room types: Standard rooms with city views, Deluxe rooms with premium amenities, Suites with separate living areas, Presidential Suites with luxury furnishings, and Family Rooms perfect for larger groups. All rooms include complimentary Wi-Fi, room service, and access to our spa and fitness center.";
      
      case 'analytics_request':
        return "I can help you with analytics! Our current occupancy rate is around 75%, with total revenue trending upward. The most popular room type is Deluxe, and our customer satisfaction scores average 4.5/5. Would you like me to provide more specific metrics or generate a detailed report?";
      
      case 'amenities_inquiry':
        return "LuxeStay Hotels offers premium amenities including: a full-service spa, state-of-the-art fitness center, rooftop pool, fine dining restaurant, 24/7 room service, business center, concierge services, and complimentary Wi-Fi throughout the property. We also welcome pets with a $50 fee.";
      
      case 'cancellation':
        return "I can assist with cancellations. Our policy allows free cancellation up to 24 hours before your scheduled arrival. For cancellations within 24 hours, a one-night charge may apply. Would you like me to help you cancel a specific reservation?";
      
      default:
        return `Thank you for your message: "${userMessage}". I'm your AI assistant for LuxeStay Hotels. I can help with bookings, room information, amenities, analytics, and general hotel operations. How can I assist you today?`;
    }
  };
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2 transition-colors duration-300">
              <span>Enterprise AI Assistant</span>
              <Zap className="h-5 w-5 text-yellow-400" />
            </h1>
            <p className="text-gray-600 dark:text-purple-300 transition-colors duration-300">Powered by Advanced Language Models</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-500/20 px-3 py-1 rounded-full transition-colors duration-300">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-700 dark:text-green-400 text-sm transition-colors duration-300">AI Online</span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all text-gray-600 dark:text-gray-300"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={clearChat}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all text-gray-600 dark:text-gray-300"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* AI Configuration Panel */}
      {showSettings && (
        <div className="p-4 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">AI Provider</label>
              <select 
                value={aiConfig.provider} 
                onChange={(e) => setAiConfig({...aiConfig, provider: e.target.value as any})}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white transition-all duration-300"
              >
                <option value="openai">OpenAI GPT</option>
                <option value="anthropic">Anthropic Claude</option>
                <option value="azure">Azure OpenAI</option>
                <option value="custom">Custom Model</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Model</label>
              <select 
                value={aiConfig.model} 
                onChange={(e) => setAiConfig({...aiConfig, model: e.target.value})}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white transition-all duration-300"
              >
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Temperature</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={aiConfig.temperature}
                onChange={(e) => setAiConfig({...aiConfig, temperature: parseFloat(e.target.value)})}
                className="w-full"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">{aiConfig.temperature}</span>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Max Tokens</label>
              <input 
                type="number" 
                value={aiConfig.maxTokens}
                onChange={(e) => setAiConfig({...aiConfig, maxTokens: parseInt(e.target.value)})}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white transition-all duration-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`rounded-2xl p-4 shadow-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white transition-all duration-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {message.sender === 'user' ? (
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
                    
                    {/* AI Metadata */}
                    {message.sender === 'assistant' && message.confidence && (
                      <div className="mt-3 flex items-center space-x-4 text-xs opacity-70">
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">
                            {(message.confidence * 100).toFixed(1)}% confidence
                          </span>
                        </div>
                        {message.intent && (
                          <div className="flex items-center space-x-1">
                            <Database className="h-3 w-3 text-blue-400" />
                            <span className="text-blue-400">Intent: {message.intent}</span>
                          </div>
                        )}
                        {message.entities && message.entities.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Globe className="h-3 w-3 text-purple-400" />
                            <span className="text-purple-400">
                              {message.entities.length} entities detected
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs mt-2 opacity-50">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-4 max-w-[80%] shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white animate-pulse" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-gray-900 dark:text-white transition-colors duration-300">AI is thinking</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg transition-all duration-300">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about our services, analytics, or get AI-powered insights..."
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        {/* Context Indicator */}
        {conversationContext.length > 0 && (
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
            💡 AI remembers {conversationContext.length} previous messages for context
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterpriseChatBot;