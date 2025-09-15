import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, ShoppingBag, Bot, User, Minimize2, Maximize2, Sparkles, Brain, Heart, Lightbulb, ArrowRight, ExternalLink, Loader2, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useTheme } from './contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
  type?: 'text' | 'card' | 'quick_replies' | 'suggestion' | 'action';
  confidence?: number;
  data?: any;
  actions?: Array<{
    label: string;
    action: string;
    icon?: any;
  }>;
}

interface ConversationContext {
  userIntent: string | null;
  previousTopics: string[];
  userPreferences: { language: string; interests: string[] };
  sessionStartTime: Date;
  messageCount: number;
  engagementLevel: 'low' | 'medium' | 'high';
  lastActiveTime: Date;
}

interface FloatingChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function FloatingChatBot({ isOpen, onToggle }: FloatingChatBotProps) {
  const { theme, language, t } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [context, setContext] = useState<ConversationContext>({
    userIntent: null,
    previousTopics: [],
    userPreferences: { language, interests: [] },
    sessionStartTime: new Date(),
    messageCount: 0,
    engagementLevel: 'medium',
    lastActiveTime: new Date()
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Advanced AI response system
  const aiKnowledgeBase = {
    ar: {
      greetings: [
        {
          text: '🌟 أهلاً وسهلاً! أنا مساعدك الذكي المدعوم بالذكاء الاصطناعي في نبض فلسطين',
          confidence: 0.95,
          followUp: 'كيف يمكنني مساعدتك في دعم القضية الفلسطينية اليوم؟'
        },
        {
          text: '✨ مرحباً! سعيد برؤيتك مرة أخرى. أنا هنا لأجعل تجربتك مع منصة نبض فلسطين أكثر إثراءً',
          confidence: 0.92,
          followUp: 'ما الذي تود استكشافه معي اليوم؟'
        }
      ],
      intents: {
        donation: {
          patterns: ['تبرع', 'دعم', 'مساعدة', 'تبرعات', 'مال', 'فلوس', 'مساهمة'],
          responses: [
            {
              text: '💝 رائع! التبرع من خلال منصتنا أصبح أكثر ذكاءً وشفافية. يمكنك تتبع كل ريال تبرعت به في الوقت الفعلي',
              confidence: 0.98,
              actions: [
                { label: 'تبرع الآن', action: 'navigate_donate', icon: Heart },
                { label: 'شاهد أثر التبرعات', action: 'view_impact', icon: TrendingUp }
              ]
            }
          ]
        },
        shopping: {
          patterns: ['متجر', 'شراء', 'منتج', 'منتجات', 'تسوق', 'بضائع'],
          responses: [
            {
              text: '🛍️ ممتاز! متجرنا مليء بالمنتجات الفلسطينية الأصيلة. كل عملية شراء تتحول تلقائياً إلى دعم للقضية',
              confidence: 0.96,
              actions: [
                { label: 'استكشف المتجر', action: 'navigate_store', icon: ShoppingBag },
                { label: 'المنتجات الأكثر مبيعاً', action: 'view_bestsellers', icon: TrendingUp }
              ]
            }
          ]
        },
        transparency: {
          patterns: ['شفافية', 'تتبع', 'تقرير', 'بلوك تشين', 'blockchain', 'أمان'],
          responses: [
            {
              text: '🔍 الشفافية قلب منصتنا! نستخدم تقنية البلوك تشين المتقدمة لضمان وصول كل ريال للمستحقين',
              confidence: 0.97,
              actions: [
                { label: 'تتبع التبرعات', action: 'track_donations', icon: CheckCircle },
                { label: 'كيف يعمل البلوك تشين؟', action: 'explain_blockchain', icon: Brain }
              ]
            }
          ]
        },
        help: {
          patterns: ['مساعدة', 'help', 'كيف', 'ماذا', 'أين', 'متى', 'لماذا'],
          responses: [
            {
              text: '🤝 أنا هنا لمساعدتك! يمكنني شرح أي شيء عن المنصة أو توجيهك للقسم المناسب',
              confidence: 0.90,
              actions: [
                { label: 'جولة في المنصة', action: 'platform_tour', icon: Lightbulb },
                { label: 'الأسئلة الشائعة', action: 'view_faq', icon: AlertCircle }
              ]
            }
          ]
        }
      },
      suggestions: {
        firstTime: [
          { text: '🚀 جولة سريعة في المنصة', action: 'platform_tour', intent: 'help' },
          { text: '💖 كيف أتبرع بشفافية؟', action: 'donate_help', intent: 'donation' },
          { text: '🏪 استكشاف المتجر الفلسطيني', action: 'explore_store', intent: 'shopping' }
        ],
        returning: [
          { text: '📊 تابع أثر تبرعاتك السابقة', action: 'track_impact', intent: 'transparency' },
          { text: '🆕 اكتشف المنتجات الجديدة', action: 'new_products', intent: 'shopping' },
          { text: '⭐ قصص نجاح ملهمة', action: 'success_stories', intent: 'stories' }
        ]
      }
    },
    en: {
      greetings: [
        {
          text: '🌟 Welcome! I\'m your AI-powered assistant at Palestine Pulse',
          confidence: 0.95,
          followUp: 'How can I help you support the Palestinian cause today?'
        },
        {
          text: '✨ Hello! Great to see you back. I\'m here to make your Palestine Pulse experience even better',
          confidence: 0.92,
          followUp: 'What would you like to explore with me today?'
        }
      ],
      intents: {
        donation: {
          patterns: ['donate', 'donation', 'support', 'help', 'money', 'contribute', 'fund'],
          responses: [
            {
              text: '💝 Excellent! Donating through our platform is now smarter and more transparent. You can track every dollar in real-time',
              confidence: 0.98,
              actions: [
                { label: 'Donate Now', action: 'navigate_donate', icon: Heart },
                { label: 'View Impact', action: 'view_impact', icon: TrendingUp }
              ]
            }
          ]
        },
        shopping: {
          patterns: ['store', 'shop', 'buy', 'product', 'products', 'purchase', 'goods'],
          responses: [
            {
              text: '🛍️ Perfect! Our store is filled with authentic Palestinian products. Every purchase automatically converts to Palestinian cause support',
              confidence: 0.96,
              actions: [
                { label: 'Explore Store', action: 'navigate_store', icon: ShoppingBag },
                { label: 'View Bestsellers', action: 'view_bestsellers', icon: TrendingUp }
              ]
            }
          ]
        },
        transparency: {
          patterns: ['transparency', 'track', 'report', 'blockchain', 'security', 'trust'],
          responses: [
            {
              text: '🔍 Transparency is our core! We use advanced blockchain technology to ensure every dollar reaches those who need it',
              confidence: 0.97,
              actions: [
                { label: 'Track Donations', action: 'track_donations', icon: CheckCircle },
                { label: 'How Blockchain Works?', action: 'explain_blockchain', icon: Brain }
              ]
            }
          ]
        },
        help: {
          patterns: ['help', 'how', 'what', 'where', 'when', 'why', 'explain'],
          responses: [
            {
              text: '🤝 I\'m here to help! I can explain anything about the platform or guide you to the right section',
              confidence: 0.90,
              actions: [
                { label: 'Platform Tour', action: 'platform_tour', icon: Lightbulb },
                { label: 'View FAQ', action: 'view_faq', icon: AlertCircle }
              ]
            }
          ]
        }
      },
      suggestions: {
        firstTime: [
          { text: '🚀 Quick platform tour', action: 'platform_tour', intent: 'help' },
          { text: '💖 How to donate transparently?', action: 'donate_help', intent: 'donation' },
          { text: '🏪 Explore Palestinian store', action: 'explore_store', intent: 'shopping' }
        ],
        returning: [
          { text: '📊 Track your donation impact', action: 'track_impact', intent: 'transparency' },
          { text: '🆕 Discover new products', action: 'new_products', intent: 'shopping' },
          { text: '⭐ Inspiring success stories', action: 'success_stories', intent: 'stories' }
        ]
      }
    }
  };

  // AI Intent Recognition
  const recognizeIntent = useCallback((userInput: string) => {
    const input = userInput.toLowerCase();
    const knowledge = aiKnowledgeBase[language];
    
    let bestMatch = { intent: 'help', confidence: 0.1 };
    
    for (const [intentName, intentData] of Object.entries(knowledge.intents)) {
      for (const pattern of intentData.patterns) {
        if (input.includes(pattern)) {
          const confidence = 0.8 + (pattern.length / input.length) * 0.2;
          if (confidence > bestMatch.confidence) {
            bestMatch = { intent: intentName, confidence };
          }
        }
      }
    }
    
    return bestMatch;
  }, [language]);

  // Smart Response Generator
  const generateAIResponse = useCallback((userInput: string, conversationContext: ConversationContext) => {
    const knowledge = aiKnowledgeBase[language];
    const { intent, confidence } = recognizeIntent(userInput);
    
    const intentData = knowledge.intents[intent];
    if (intentData && intentData.responses.length > 0) {
      const response = intentData.responses[Math.floor(Math.random() * intentData.responses.length)];
      return {
        ...response,
        confidence: Math.min(confidence, response.confidence),
        intent
      };
    }
    
    return {
      text: language === 'ar' 
        ? '🤔 فهمت سؤالك، دعني أساعدك بطريقة أفضل. يمكنك اختيار من الاقتراحات أدناه أو إعادة صياغة سؤالك'
        : '🤔 I understand your question, let me help you better. You can choose from suggestions below or rephrase your question',
      confidence: 0.6,
      intent: 'clarification',
      actions: []
    };
  }, [language, recognizeIntent]);

  // Enhanced message addition with AI features
  const addMessage = useCallback((text: string, sender: 'user' | 'bot', options: Partial<Message> = {}) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text,
      sender,
      timestamp: new Date(),
      type: 'text',
      confidence: sender === 'bot' ? options.confidence || 0.9 : undefined,
      actions: options.actions || [],
      ...options
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation context
    if (sender === 'user') {
      setContext(prev => ({
        ...prev,
        messageCount: prev.messageCount + 1,
        lastActiveTime: new Date(),
        engagementLevel: prev.messageCount > 5 ? 'high' : prev.messageCount > 2 ? 'medium' : 'low'
      }));
    }
  }, []);

  // Initialize conversation
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const knowledge = aiKnowledgeBase[language];
      const greeting = knowledge.greetings[Math.floor(Math.random() * knowledge.greetings.length)];
      
      setTimeout(() => {
        addMessage(greeting.text, 'bot', { confidence: greeting.confidence });
        setTimeout(() => {
          addMessage(greeting.followUp, 'bot', {
            type: 'quick_replies',
            data: {
              suggestions: context.messageCount === 0 
                ? knowledge.suggestions.firstTime 
                : knowledge.suggestions.returning
            }
          });
        }, 1200);
      }, 600);
    }
  }, [isOpen, language, addMessage, context.messageCount, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  // Handle sending messages with AI processing
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, 'user');

    // Show smart typing indicator
    setIsTyping(true);
    
    // Simulate AI processing time (more realistic)
    const processingTime = 800 + Math.random() * 1200;
    
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = generateAIResponse(userMessage, context);
      
      addMessage(aiResponse.text, 'bot', {
        confidence: aiResponse.confidence,
        actions: aiResponse.actions,
        data: { intent: aiResponse.intent }
      });
      
      // Add follow-up suggestions if confidence is high
      if (aiResponse.confidence > 0.8 && aiResponse.actions && aiResponse.actions.length > 0) {
        setTimeout(() => {
          addMessage('', 'bot', {
            type: 'suggestion',
            text: language === 'ar' ? 'يمكنك أيضاً:' : 'You can also:',
            actions: aiResponse.actions
          });
        }, 500);
      }
    }, processingTime);
  };

  // Handle action clicks
  const handleActionClick = (action: string) => {
    const actionLabels = {
      navigate_donate: language === 'ar' ? 'أريد التبرع الآن' : 'I want to donate now',
      navigate_store: language === 'ar' ? 'أريد استكشاف المتجر' : 'I want to explore the store',
      track_donations: language === 'ar' ? 'أريد تتبع تبرعاتي' : 'I want to track my donations',
      platform_tour: language === 'ar' ? 'أريد جولة في المنصة' : 'I want a platform tour'
    };
    
    const label = actionLabels[action] || action;
    addMessage(label, 'user');
    
    // Simulate action response
    setTimeout(() => {
      const response = language === 'ar' 
        ? `✅ ممتاز! سأوجهك الآن إلى ${action.includes('donate') ? 'صفحة التبرع' : action.includes('store') ? 'المتجر' : 'القسم المطلوب'}`
        : `✅ Perfect! I'll guide you to the ${action.includes('donate') ? 'donation page' : action.includes('store') ? 'store' : 'requested section'}`;
      
      addMessage(response, 'bot', { confidence: 0.95 });
    }, 800);
  };

  // Format timestamp with relative time
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return language === 'ar' ? 'الآن' : 'now';
    if (minutes < 60) return language === 'ar' ? `${minutes} د` : `${minutes}m`;
    
    return timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Enhanced Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onToggle}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-palestine-green via-palestine-red to-palestine-green text-white shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group chat-floating-button"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="h-7 w-7 relative z-10" />
          </motion.div>
          
          {/* Smart AI Indicator */}
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="h-3 w-3 text-white" />
          </motion.div>
        </Button>
      </motion.div>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: '100%', opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-4 bottom-24 z-40 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className="h-[550px] bg-card/98 backdrop-blur-xl border-0 shadow-2xl chatbot-shadow">
              {/* Enhanced Header */}
              <CardHeader className="p-4 bg-gradient-to-r from-palestine-red via-palestine-green to-palestine-red text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                      >
                        <Brain className="h-5 w-5" />
                      </motion.div>
                      <motion.div 
                        className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-sm flex items-center gap-2">
                        {language === 'ar' ? 'مساعد نبض فلسطين الذكي' : 'Palestine Pulse AI Assistant'}
                        <Sparkles className="h-3 w-3" />
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                        {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI-Powered'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggle}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Content */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-0 flex flex-col h-[450px]">
                      {/* Messages Area */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`flex items-start gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <motion.div 
                                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    message.sender === 'user' 
                                      ? 'bg-palestine-red text-white' 
                                      : 'bg-gradient-to-br from-palestine-green to-palestine-red text-white'
                                  }`}
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {message.sender === 'user' ? (
                                    <User className="h-4 w-4" />
                                  ) : (
                                    <Brain className="h-4 w-4" />
                                  )}
                                </motion.div>
                                
                                <div className="space-y-2">
                                  <motion.div 
                                    className={`rounded-2xl p-3 relative ${
                                      message.sender === 'user'
                                        ? 'bg-palestine-red text-white rounded-br-md chat-message-user'
                                        : 'bg-muted rounded-bl-md chat-message-bot'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                  >
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                                    
                                    {/* Confidence indicator for bot messages */}
                                    {message.sender === 'bot' && message.confidence && (
                                      <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                                        <CheckCircle className="h-3 w-3" />
                                        <span>{Math.round(message.confidence * 100)}% confident</span>
                                      </div>
                                    )}
                                    
                                    <div className={`text-xs opacity-70 mt-2 flex items-center gap-1 ${
                                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                                    }`}>
                                      <Clock className="h-3 w-3" />
                                      {formatTimestamp(message.timestamp)}
                                    </div>
                                  </motion.div>
                                  
                                  {/* Action buttons */}
                                  {message.actions && message.actions.length > 0 && (
                                    <motion.div 
                                      className="flex flex-wrap gap-2"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.3 }}
                                    >
                                      {message.actions.map((action, index) => (
                                        <Button
                                          key={index}
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleActionClick(action.action)}
                                          className="text-xs border-palestine-green/40 hover:bg-palestine-green/10 hover:border-palestine-green hover:scale-105 transition-all duration-200"
                                        >
                                          {action.icon && <action.icon className="h-3 w-3 mr-1" />}
                                          {action.label}
                                          <ArrowRight className="h-3 w-3 ml-1" />
                                        </Button>
                                      ))}
                                    </motion.div>
                                  )}
                                  
                                  {/* Quick replies for suggestions */}
                                  {message.type === 'quick_replies' && message.data?.suggestions && (
                                    <motion.div 
                                      className="flex flex-wrap gap-2 mt-2"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.5 }}
                                    >
                                      {message.data.suggestions.map((suggestion, index) => (
                                        <Button
                                          key={index}
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleActionClick(suggestion.action)}
                                          className="text-xs border-palestine-red/40 hover:bg-palestine-red/10 hover:border-palestine-red hover:scale-105 transition-all duration-200"
                                        >
                                          {suggestion.text}
                                        </Button>
                                      ))}
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {/* Enhanced Typing Indicator */}
                          {isTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start"
                            >
                              <div className="flex items-start gap-2">
                                <motion.div 
                                  className="w-8 h-8 rounded-full bg-gradient-to-br from-palestine-green to-palestine-red text-white flex items-center justify-center"
                                  animate={{ rotate: [0, 360] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                  <Brain className="h-4 w-4" />
                                </motion.div>
                                <div className="bg-muted rounded-2xl rounded-bl-md p-4">
                                  <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                      <motion.div 
                                        className="w-2 h-2 bg-palestine-green rounded-full"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                      />
                                      <motion.div 
                                        className="w-2 h-2 bg-palestine-green rounded-full"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                      />
                                      <motion.div 
                                        className="w-2 h-2 bg-palestine-green rounded-full"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {language === 'ar' ? 'يفكر بذكاء...' : 'Thinking intelligently...'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      {/* Enhanced Input Area */}
                      <div className="p-4 border-t border-border/50 bg-background/50">
                        <div className="flex gap-2">
                          <Input
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={
                              language === 'ar' 
                                ? 'اسأل مساعد الذكاء الاصطناعي...' 
                                : 'Ask your AI assistant...'
                            }
                            className={`flex-1 border-0 bg-muted/50 focus:bg-background transition-colors ${language === 'ar' ? 'text-right' : 'text-left'}`}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            disabled={isTyping}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            className="bg-gradient-to-r from-palestine-green to-palestine-red hover:from-palestine-green-dark hover:to-palestine-red-dark text-white px-6"
                          >
                            {isTyping ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            )}
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'Powered by AI'}
                          </span>
                          <span>
                            {language === 'ar' ? `${context.messageCount} رسالة` : `${context.messageCount} messages`}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}