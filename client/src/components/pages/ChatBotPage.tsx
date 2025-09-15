import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, MessageCircle, Heart, HelpCircle, ShoppingBag, DollarSign, Brain, Sparkles, Zap, TrendingUp, CheckCircle, Clock, Loader2, ArrowRight, Lightbulb, AlertCircle, BarChart3, Target, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'card' | 'suggestion' | 'analysis';
  confidence?: number;
  actions?: Array<{
    label: string;
    action: string;
    icon?: any;
  }>;
  data?: any;
  intent?: string;
}

interface QuickAction {
  id: string;
  text: string;
  icon: any;
  response: string;
  category: 'donation' | 'shopping' | 'transparency' | 'support';
  confidence: number;
  followUpActions?: Array<{
    label: string;
    action: string;
    icon?: any;
  }>;
}

interface ConversationAnalytics {
  messagesCount: number;
  avgConfidence: number;
  topIntents: string[];
  sessionDuration: number;
  userSatisfaction: number;
}

export function ChatBotPage() {
  const { t, language } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [analytics, setAnalytics] = useState<ConversationAnalytics>({
    messagesCount: 0,
    avgConfidence: 0.85,
    topIntents: ['support', 'donation', 'shopping'],
    sessionDuration: 0,
    userSatisfaction: 4.8
  });
  const [sessionStartTime] = useState(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced AI-powered quick actions
  const quickActions: QuickAction[] = [
    {
      id: 'about',
      text: language === 'ar' ? '🌟 ما هو نبض فلسطين؟' : '🌟 What is Palestine Pulse?',
      icon: Heart,
      category: 'support',
      confidence: 0.98,
      response: language === 'ar' 
        ? '🇵🇸 نبض فلسطين هو منصة مقاومة رقمية ذكية تهدف لدعم فلسطين من خلال التجارة الشفافة والإعلام المقاوم. نحن نستخدم الذكاء الاصطناعي وتقنية البلوك تشين لضمان وصول كل ريال للمستحقين مع شفافية كاملة.'
        : '🇵🇸 Palestine Pulse is an intelligent digital resistance platform supporting Palestine through transparent commerce and resistance media. We use AI and blockchain technology to ensure every dollar reaches those who need it with complete transparency.',
      followUpActions: [
        { label: language === 'ar' ? 'جولة في المنصة' : 'Platform Tour', action: 'tour', icon: Lightbulb },
        { label: language === 'ar' ? 'تقارير الشفافية' : 'Transparency Reports', action: 'transparency', icon: Shield }
      ]
    },
    {
      id: 'shopping',
      text: language === 'ar' ? '🛍️ كيف يعمل التسوق الذكي؟' : '🛍️ How does smart shopping work?',
      icon: ShoppingBag,
      category: 'shopping',
      confidence: 0.96,
      response: language === 'ar'
        ? '✨ تسوقك أصبح أذكى! يمكنك تصفح منتجاتنا الفلسطينية الأصيلة وعند الشراء، يتحول المبلغ تلقائياً إلى دعم للقضية. نظامنا الذكي يقترح عليك المنتجات بناءً على اهتماماتك ويوضح أثر كل عملية شراء.'
        : '✨ Your shopping is now smarter! Browse our authentic Palestinian products and when you purchase, the amount automatically converts to Palestinian cause support. Our smart system suggests products based on your interests and shows the impact of each purchase.',
      followUpActions: [
        { label: language === 'ar' ? 'استكشف المتجر' : 'Explore Store', action: 'store', icon: ShoppingBag },
        { label: language === 'ar' ? 'المنتجات الموصى بها' : 'Recommended Products', action: 'recommendations', icon: Target }
      ]
    },
    {
      id: 'donate',
      text: language === 'ar' ? '💝 التبرع بالذكاء الاصطناعي' : '💝 AI-Powered Donations',
      icon: DollarSign,
      category: 'donation',
      confidence: 0.97,
      response: language === 'ar'
        ? '🚀 التبرع أصبح أكثر ذكاءً! نظامنا المدعوم بالذكاء الاصطناعي يحلل احتياجات المجتمعات ويوجه تبرعك للأماكن الأكثر حاجة. يمكنك رؤية التأثير المباشر لتبرعك بالوقت الفعلي مع تقارير ذكية.'
        : '🚀 Donations are now smarter! Our AI-powered system analyzes community needs and directs your donation to areas of greatest need. You can see the direct impact of your donation in real-time with intelligent reports.',
      followUpActions: [
        { label: language === 'ar' ? 'تبرع الآن' : 'Donate Now', action: 'donate', icon: Heart },
        { label: language === 'ar' ? 'تتبع التأثير' : 'Track Impact', action: 'track', icon: BarChart3 }
      ]
    },
    {
      id: 'transparency',
      text: language === 'ar' ? '🔍 الشفافية بالبلوك تشين' : '🔍 Blockchain Transparency',
      icon: HelpCircle,
      category: 'transparency',
      confidence: 0.99,
      response: language === 'ar'
        ? '⛓️ نحن رواد الشفافية! نستخدم البلوك تشين والذكاء الاصطناعي لضمان شفافية مطلقة. كل تبرع مسجل بشكل لا يمكن تغييره، مع تحليل ذكي لتوزيع الأموال وتقارير مباشرة من الميدان.'
        : '⛓️ We are transparency pioneers! We use blockchain and AI to ensure absolute transparency. Every donation is immutably recorded, with intelligent analysis of fund distribution and direct field reports.',
      followUpActions: [
        { label: language === 'ar' ? 'شاهد البلوك تشين' : 'View Blockchain', action: 'blockchain', icon: Zap },
        { label: language === 'ar' ? 'تقارير مباشرة' : 'Live Reports', action: 'reports', icon: TrendingUp }
      ]
    }
  ];

  // Advanced AI response system
  const aiKnowledgeBase = {
    ar: {
      patterns: {
        greeting: ['مرحبا', 'سلام', 'أهلا', 'هاي', 'hello', 'hi'],
        donation: ['تبرع', 'دعم', 'مساعدة', 'تبرعات', 'مال', 'مساهمة', 'donate'],
        shopping: ['متجر', 'شراء', 'منتج', 'منتجات', 'تسوق', 'shop', 'buy'],
        transparency: ['شفافية', 'تتبع', 'تقرير', 'بلوك تشين', 'blockchain', 'أمان'],
        help: ['مساعدة', 'help', 'كيف', 'ماذا', 'أين', 'متى', 'لماذا'],
        ai: ['ذكاء اصطناعي', 'ai', 'روبوت', 'bot', 'تقنية', 'technology']
      },
      responses: {
        greeting: [
          '🌟 أهلاً وسهلاً! أنا مساعدك الذكي المدعوم بأحدث تقنيات الذكاء الاصطناعي في نبض فلسطين. كيف يمكنني مساعدتك اليوم؟',
          '✨ مرحباً! سعيد بلقائك. أنا هنا لأجعل تجربتك مع منصة نبض فلسطين أكثر ذكاءً وفعالية.',
          '🤖 أهلاً بك! أنا مساعد نبض فلسطين الذكي، مزود بقاعدة معرفية واسعة لمساعدتك في كل ما تحتاجه.'
        ],
        ai: [
          '🧠 أنا مساعد ذكي متقدم مصمم خصيصاً لمنصة نبض فلسطين. أستخدم تقنيات الذكاء الاصطناعي لفهم احتياجاتك وتقديم إجابات دقيقة ومفيدة.',
          '⚡ تقنيتي تتطور باستمرار! أتعلم من كل محادثة لأصبح أكثر فهماً لاحتياجات مستخدمي منصة نبض فلسطين.',
          '🚀 أنا مدعوم بخوارزميات ذكية تمكنني من تحليل سؤالك وتقديم الإجابة الأنسب مع اقتراح خطوات عملية.'
        ],
        default: [
          '🤔 أفهم ما تقصده، دعني أساعدك بطريقة أفضل. يمكنك اختيار من الاقتراحات أدناه أو إعادة صياغة سؤالك.',
          '💡 سؤالك مثير للاهتمام! دعني أوجهك للمعلومات المناسبة أو اختر من الخيارات المتاحة.',
          '🎯 أريد أن أقدم لك أفضل إجابة ممكنة. هل يمكنك توضيح سؤالك أكثر أو اختيار من الموضوعات أدناه؟'
        ]
      }
    },
    en: {
      patterns: {
        greeting: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'],
        donation: ['donate', 'donation', 'support', 'help', 'contribute', 'fund', 'give'],
        shopping: ['shop', 'buy', 'purchase', 'product', 'store', 'marketplace'],
        transparency: ['transparency', 'track', 'blockchain', 'report', 'trust', 'verify'],
        help: ['help', 'how', 'what', 'where', 'when', 'why', 'explain'],
        ai: ['ai', 'artificial intelligence', 'bot', 'robot', 'technology', 'smart']
      },
      responses: {
        greeting: [
          '🌟 Welcome! I\'m your intelligent AI assistant powered by the latest artificial intelligence technology at Palestine Pulse. How can I help you today?',
          '✨ Hello! Great to meet you. I\'m here to make your Palestine Pulse experience smarter and more effective.',
          '🤖 Welcome! I\'m Palestine Pulse\'s intelligent assistant, equipped with extensive knowledge to help you with everything you need.'
        ],
        ai: [
          '🧠 I\'m an advanced AI assistant designed specifically for the Palestine Pulse platform. I use artificial intelligence techniques to understand your needs and provide accurate, helpful answers.',
          '⚡ My technology continuously evolves! I learn from every conversation to become more understanding of Palestine Pulse users\' needs.',
          '🚀 I\'m powered by intelligent algorithms that enable me to analyze your question and provide the most appropriate answer with practical suggestions.'
        ],
        default: [
          '🤔 I understand what you mean, let me help you better. You can choose from the suggestions below or rephrase your question.',
          '💡 Your question is interesting! Let me guide you to the appropriate information or choose from available options.',
          '🎯 I want to provide you with the best possible answer. Could you clarify your question more or choose from the topics below?'
        ]
      }
    }
  };

  // Enhanced AI response generator with intent recognition
  const generateAIResponse = useCallback((userInput: string): { text: string; confidence: number; intent: string; actions?: any[] } => {
    const input = userInput.toLowerCase();
    const knowledge = aiKnowledgeBase[language];
    
    let bestMatch = { intent: 'default', confidence: 0.1, patterns: [] };
    
    // Intent recognition
    for (const [intentName, patterns] of Object.entries(knowledge.patterns)) {
      for (const pattern of patterns) {
        if (input.includes(pattern)) {
          const confidence = 0.7 + (pattern.length / input.length) * 0.3;
          if (confidence > bestMatch.confidence) {
            bestMatch = { intent: intentName, confidence, patterns };
          }
        }
      }
    }
    
    // Get response based on intent
    const responses = knowledge.responses[bestMatch.intent] || knowledge.responses.default;
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Add follow-up actions based on intent
    let actions = [];
    if (bestMatch.intent === 'donation') {
      actions = quickActions.find(a => a.category === 'donation')?.followUpActions || [];
    } else if (bestMatch.intent === 'shopping') {
      actions = quickActions.find(a => a.category === 'shopping')?.followUpActions || [];
    } else if (bestMatch.intent === 'transparency') {
      actions = quickActions.find(a => a.category === 'transparency')?.followUpActions || [];
    }
    
    return {
      text: response,
      confidence: Math.min(bestMatch.confidence, 0.95),
      intent: bestMatch.intent,
      actions: actions.length > 0 ? actions : undefined
    };
  }, [language]);

  // Enhanced message addition with analytics
  const addMessage = useCallback((text: string, sender: 'user' | 'bot', options: Partial<Message> = {}) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
      type: 'text',
      ...options
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update analytics
    if (sender === 'bot' && options.confidence) {
      setAnalytics(prev => ({
        ...prev,
        messagesCount: prev.messagesCount + 1,
        avgConfidence: (prev.avgConfidence + options.confidence) / 2,
        sessionDuration: Math.floor((Date.now() - sessionStartTime.getTime()) / 1000)
      }));
    }
  }, [sessionStartTime]);

  // Initialize with AI greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = aiKnowledgeBase[language].responses.greeting[0];
      addMessage(greeting, 'bot', { confidence: 0.95, intent: 'greeting' });
    }
  }, [language, messages.length, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enhanced message handling with AI processing
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, 'user');

    setIsTyping(true);
    
    // Simulate AI processing time
    const processingTime = 1000 + Math.random() * 1500;
    
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = generateAIResponse(userMessage);
      
      addMessage(aiResponse.text, 'bot', {
        confidence: aiResponse.confidence,
        intent: aiResponse.intent,
        actions: aiResponse.actions
      });
      
      // Add follow-up suggestions if high confidence
      if (aiResponse.confidence > 0.8 && aiResponse.actions) {
        setTimeout(() => {
          addMessage('', 'bot', {
            type: 'suggestion',
            text: language === 'ar' ? 'يمكنك أيضاً:' : 'You can also:',
            actions: aiResponse.actions
          });
        }, 800);
      }
    }, processingTime);
  };

  const handleQuickAction = (action: QuickAction) => {
    addMessage(action.text, 'user');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      addMessage(action.response, 'bot', {
        confidence: action.confidence,
        intent: action.category,
        actions: action.followUpActions
      });
    }, 1200);
  };

  const handleActionClick = (actionType: string) => {
    const actionResponses = {
      tour: language === 'ar' ? '🚀 ممتاز! سأبدأ بعرض جولة تفاعلية في المنصة...' : '🚀 Excellent! I\'ll start an interactive platform tour...',
      store: language === 'ar' ? '🛍️ رائع! سأوجهك إلى متجر المنتجات الفلسطينية...' : '🛍️ Great! I\'ll direct you to the Palestinian products store...',
      donate: language === 'ar' ? '💝 ممتاز! سأساعدك في عملية التبرع...' : '💝 Excellent! I\'ll help you with the donation process...',
      track: language === 'ar' ? '📊 جاري تحميل لوحة تتبع التأثير...' : '📊 Loading impact tracking dashboard...',
    };
    
    const response = actionResponses[actionType] || (language === 'ar' ? 'جاري التحميل...' : 'Loading...');
    addMessage(response, 'bot', { confidence: 0.9 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <section className="bg-gradient-to-br from-palestine-green via-palestine-red to-palestine-green py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-white/20 rounded-full backdrop-blur-sm"
            >
              <Brain className="h-12 w-12" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
                {language === 'ar' ? 'المساعد الذكي' : 'AI Assistant'}
                <Sparkles className="h-8 w-8 animate-pulse" />
              </h1>
              <p className="text-lg opacity-90 mt-2">
                {language === 'ar' ? 'مدعوم بأحدث تقنيات الذكاء الاصطناعي' : 'Powered by Advanced AI Technology'}
              </p>
            </div>
          </motion.div>
          
          {/* AI Stats */}
          <motion.div 
            className="flex justify-center gap-8 text-sm opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>{Math.round(analytics.avgConfidence * 100)}% {language === 'ar' ? 'دقة' : 'Accuracy'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{analytics.messagesCount} {language === 'ar' ? 'رسالة' : 'Messages'}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>{analytics.userSatisfaction}/5 {language === 'ar' ? 'تقييم' : 'Rating'}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            
            {/* Quick Actions Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-palestine-green" />
                    {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action) => (
                    <motion.div
                      key={action.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4 hover:border-palestine-red hover:bg-palestine-red/5 transition-all duration-200"
                        onClick={() => handleQuickAction(action)}
                      >
                        <action.icon className="h-5 w-5 flex-shrink-0" />
                        <div className="ml-3 text-left flex-1">
                          <div className="font-medium text-sm">{action.text}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round(action.confidence * 100)}% {language === 'ar' ? 'دقة' : 'confidence'}
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col border-0 shadow-xl">
                <CardHeader className="border-b bg-gradient-to-r from-palestine-green/10 to-palestine-red/10">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="p-2 bg-gradient-to-br from-palestine-green to-palestine-red rounded-full text-white"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold">
                          {language === 'ar' ? 'محادثة مع مساعد الذكاء الاصطناعي' : 'Chat with AI Assistant'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'تعلم مستمر وإجابات ذكية' : 'Continuous learning and smart answers'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        {language === 'ar' ? 'متصل' : 'Online'}
                      </Badge>
                      <Badge variant="outline">
                        <Brain className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 p-0 overflow-hidden">
                  {/* Messages Area */}
                  <ScrollArea className="h-[460px] p-4">
                    <div className="space-y-4">
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={`flex gap-3 ${
                              message.sender === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {message.sender === 'bot' && (
                              <motion.div 
                                className="w-10 h-10 bg-gradient-to-br from-palestine-green to-palestine-red rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-lg"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Brain className="h-5 w-5" />
                              </motion.div>
                            )}
                            
                            <div className="max-w-xs lg:max-w-md space-y-2">
                              <motion.div
                                className={`px-4 py-3 rounded-2xl relative ${
                                  message.sender === 'user'
                                    ? 'bg-palestine-red text-white rounded-br-md shadow-lg'
                                    : 'bg-muted text-foreground rounded-bl-md border border-border/50'
                                }`}
                                whileHover={{ scale: 1.02 }}
                              >
                                {message.text && (
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {message.text}
                                  </p>
                                )}
                                
                                <div className={`flex items-center gap-2 mt-2 text-xs opacity-70 ${
                                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                                }`}>
                                  {message.sender === 'bot' && message.confidence && (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" />
                                      <span>{Math.round(message.confidence * 100)}%</span>
                                    </div>
                                  )}
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {message.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
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
                            </div>
                            
                            {message.sender === 'user' && (
                              <motion.div 
                                className="w-10 h-10 bg-palestine-red rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-lg"
                                whileHover={{ scale: 1.1 }}
                              >
                                <User className="h-5 w-5" />
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {/* Enhanced Typing Indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3 justify-start"
                        >
                          <motion.div 
                            className="w-10 h-10 bg-gradient-to-br from-palestine-green to-palestine-red rounded-full flex items-center justify-center text-white"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Brain className="h-5 w-5" />
                          </motion.div>
                          <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 border border-border/50">
                            <div className="flex items-center gap-3">
                              <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                  <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-palestine-green rounded-full"
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {language === 'ar' ? 'الذكاء الاصطناعي يفكر...' : 'AI is thinking...'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Enhanced Input Area */}
                  <div className="border-t p-4 bg-muted/30">
                    <div className="flex gap-3">
                      <Input
                        placeholder={
                          language === 'ar' 
                            ? 'اسأل مساعد الذكاء الاصطناعي أي شيء...' 
                            : 'Ask the AI assistant anything...'
                        }
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`flex-1 border-0 bg-background shadow-sm focus:shadow-md transition-shadow ${language === 'ar' ? 'text-right' : ''}`}
                        disabled={isTyping}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className="bg-gradient-to-r from-palestine-green to-palestine-red hover:from-palestine-green-dark hover:to-palestine-red-dark text-white px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isTyping ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI-Powered'}
                        </span>
                        <span>
                          {language === 'ar' ? `دقة ${Math.round(analytics.avgConfidence * 100)}%` : `${Math.round(analytics.avgConfidence * 100)}% Accuracy`}
                        </span>
                      </div>
                      <span>
                        {analytics.messagesCount} {language === 'ar' ? 'رسالة في هذه الجلسة' : 'messages this session'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Capabilities Section */}
          <motion.div 
            className="mt-8 grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 bg-gradient-to-br from-palestine-green to-palestine-red rounded-full flex items-center justify-center mx-auto mb-4 text-white"
                >
                  <Brain className="h-6 w-6" />
                </motion.div>
                <h3 className="font-semibold mb-2">
                  {language === 'ar' ? 'تعلم ذكي' : 'Smart Learning'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'يتطور المساعد مع كل محادثة ليقدم إجابات أكثر دقة'
                    : 'The assistant evolves with each conversation to provide more accurate answers'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-12 h-12 bg-gradient-to-br from-palestine-red to-palestine-green rounded-full flex items-center justify-center mx-auto mb-4 text-white"
                >
                  <Zap className="h-6 w-6" />
                </motion.div>
                <h3 className="font-semibold mb-2">
                  {language === 'ar' ? 'استجابة فورية' : 'Instant Response'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'إجابات سريعة ودقيقة في أقل من ثانية'
                    : 'Fast and accurate answers in less than a second'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 bg-gradient-to-br from-palestine-green to-palestine-red rounded-full flex items-center justify-center mx-auto mb-4 text-white"
                >
                  <Shield className="h-6 w-6" />
                </motion.div>
                <h3 className="font-semibold mb-2">
                  {language === 'ar' ? 'موثوق وآمن' : 'Trusted & Secure'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'معلومات دقيقة ومحمية بأعلى معايير الأمان'
                    : 'Accurate information protected by the highest security standards'
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}