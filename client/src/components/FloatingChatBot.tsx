import { useState, useRef, useEffect } from 'react';
import { X, Send, ShoppingBag, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // رسائل ترحيبية
  const welcomeMessages = {
    ar: {
      welcome: 'أهلاً وسهلاً! أنا مساعدك الذكي في نبض فلسطين 🇵🇸',
      help: 'كيف يمكنني مساعدتك اليوم؟',
      suggestions: [
        'كيف يمكنني التبرع؟',
        'ما هي المنتجات المتاحة؟',
        'كيف تعمل الشفافية؟',
        'معلومات عن المنصة'
      ]
    },
    en: {
      welcome: 'Welcome! I\'m your smart assistant at Palestine Pulse 🇵🇸',
      help: 'How can I help you today?',
      suggestions: [
        'How can I donate?',
        'What products are available?',
        'How does transparency work?',
        'About the platform'
      ]
    }
  };

  // إجابات ذكية
  const smartResponses = {
    ar: {
      donate: 'يمكنك التبرع بسهولة من خلال صفحة التبرع المباشر! نحن نضمن وصول 100% من تبرعك للمستفيدين مع شفافية كاملة. 💝',
      products: 'لدينا مجموعة رائعة من المنتجات التراثية الفلسطينية الأصيلة: الخزفيات المصنوعة يدوياً، التطريز التراثي، والمنتجات الغذائية الطبيعية. 🏺',
      transparency: 'الشفافية هي أساس عملنا! نعرض تتبع مباشر لجميع التبرعات والمشاريع المدعومة مع تقارير مفصلة وصور حقيقية من الميدان. 📊',
      about: 'نبض فلسطين هي منصة مقاومة رقمية تحول كل عملية شراء إلى تبرع شفاف لدعم القضية الفلسطينية. 🏛️',
      support: 'فريق الدعم متاح على مدار الساعة! يمكنك التواصل معنا عبر الإيميل أو الهاتف للحصول على المساعدة. 📞',
      default: 'شكراً لك على سؤالك! دعني أوجهك إلى القسم المناسب أو يمكنك تصفح المنصة لمعرفة المزيد. 🌟'
    },
    en: {
      donate: 'You can donate easily through our direct donation page! We guarantee 100% of your donation reaches beneficiaries with complete transparency. 💝',
      products: 'We have an amazing collection of authentic Palestinian heritage products: handcrafted pottery, traditional embroidery, and natural food products. 🏺',
      transparency: 'Transparency is the foundation of our work! We provide live tracking of all donations and supported projects with detailed reports and real field photos. 📊',
      about: 'Palestine Pulse is a digital resistance platform that converts every purchase into transparent donations supporting the Palestinian cause. 🏛️',
      support: 'Our support team is available 24/7! You can contact us via email or phone for assistance. 📞',
      default: 'Thank you for your question! Let me direct you to the appropriate section or you can browse the platform to learn more. 🌟'
    }
  };

  // تشغيل رسالة ترحيبية عند فتح الشات
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = welcomeMessages[language];
      setTimeout(() => {
        addMessage(welcomeMsg.welcome, 'bot');
        setTimeout(() => {
          addMessage(welcomeMsg.help, 'bot');
        }, 1000);
      }, 500);
    }
  }, [isOpen, language]);

  // التمرير التلقائي للأسفل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // التركيز على حقل الإدخال عند فتح الشات
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getSmartResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    const responses = smartResponses[language];

    if (input.includes('تبرع') || input.includes('donate') || input.includes('تبرعات')) {
      return responses.donate;
    } else if (input.includes('منتج') || input.includes('product') || input.includes('متجر') || input.includes('store')) {
      return responses.products;
    } else if (input.includes('شفافية') || input.includes('transparency') || input.includes('تتبع') || input.includes('track')) {
      return responses.transparency;
    } else if (input.includes('عن') || input.includes('about') || input.includes('معلومات') || input.includes('info')) {
      return responses.about;
    } else if (input.includes('دعم') || input.includes('support') || input.includes('مساعدة') || input.includes('help')) {
      return responses.support;
    } else {
      return responses.default;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, 'user');

    // محاكاة كتابة الروبوت
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const response = getSmartResponse(userMessage);
      addMessage(response, 'bot');
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* أيقونة السلة العائمة */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onToggle}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-palestine-green to-palestine-red text-white shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-palestine-flag opacity-20 animate-flag-wave"></div>
          <ShoppingBag className="h-7 w-7 relative z-10 group-hover:animate-bounce" />
          
          {/* مؤشر الرسائل الجديدة */}
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-palestine-red rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bot className="h-3 w-3 text-white" />
          </motion.div>
        </Button>
      </motion.div>

      {/* نافذة الدردشة الجانبية */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-4 bottom-24 z-40 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className="h-[500px] bg-card/95 backdrop-blur-lg border-palestine-red/20 shadow-2xl">
              {/* رأس الشات */}
              <CardHeader className="p-4 bg-gradient-to-r from-palestine-red to-palestine-green text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Bot className="h-6 w-6" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                      <CardTitle className="text-sm">
                        {language === 'ar' ? 'مساعد نبض فلسطين' : 'Palestine Pulse Assistant'}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                        {language === 'ar' ? 'متصل الآن' : 'Online Now'}
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

              {/* محتوى الشات */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-0 flex flex-col h-[400px]">
                      {/* منطقة الرسائل */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  message.sender === 'user' 
                                    ? 'bg-palestine-red text-white' 
                                    : 'bg-palestine-green text-white'
                                }`}>
                                  {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>
                                
                                <div className={`rounded-lg p-3 ${
                                  message.sender === 'user'
                                    ? 'bg-palestine-red text-white rounded-br-none'
                                    : 'bg-muted rounded-bl-none'
                                }`}>
                                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                  <span className={`text-xs opacity-70 block mt-1 ${
                                    message.sender === 'user' ? 'text-right' : 'text-left'
                                  }`}>
                                    {formatTimestamp(message.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {/* مؤشر الكتابة */}
                          {isTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start"
                            >
                              <div className="flex items-start gap-2">
                                <div className="w-8 h-8 rounded-full bg-palestine-green text-white flex items-center justify-center">
                                  <Bot className="h-4 w-4" />
                                </div>
                                <div className="bg-muted rounded-lg rounded-bl-none p-3">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-palestine-green rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-palestine-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-palestine-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* اقتراحات سريعة */}
                          {messages.length === 2 && !isTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex flex-wrap gap-2 mt-4"
                            >
                              {welcomeMessages[language].suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs border-palestine-green/30 hover:bg-palestine-green/10 hover:border-palestine-green"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </motion.div>
                          )}

                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      {/* حقل الإدخال */}
                      <div className="p-4 border-t">
                        <div className="flex gap-2">
                          <Input
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={
                              language === 'ar' 
                                ? 'اكتب رسالتك هنا...' 
                                : 'Type your message here...'
                            }
                            className={`flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
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
                            className="bg-palestine-green hover:bg-palestine-green-dark text-white"
                          >
                            <Send className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                          </Button>
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
