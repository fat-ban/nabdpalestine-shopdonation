import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Heart, HelpCircle, ShoppingBag, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useTheme } from '../contexts/ThemeContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface QuickAction {
  id: string;
  text: string;
  icon: any;
  response: string;
}

export function ChatBotPage() {
  const { t, language } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: 'about',
      text: language === 'ar' ? 'ما هو نبض فلسطين؟' : 'What is Palestine Pulse?',
      icon: Heart,
      response: language === 'ar' 
        ? 'نبض فلسطين هو منصة رقمية تهدف لدعم فلسطين من خلال التجارة الشفافة والإعلام المقاوم. كل عملية شراء تتحول إلى تبرع لدعم القضية الفلسطينية مع ضمان الشفافية الكاملة باستخدام تقنية البلوك تشين.'
        : 'Palestine Pulse is a digital platform aimed at supporting Palestine through transparent commerce and resistance media. Every purchase converts to donations supporting the Palestinian cause with full transparency guaranteed using blockchain technology.'
    },
    {
      id: 'shopping',
      text: language === 'ar' ? 'كيف أتسوق؟' : 'How do I shop?',
      icon: ShoppingBag,
      response: language === 'ar'
        ? 'يمكنك تصفح المتجر واختيار المنتجات التي تناسبك. عند الشراء، سيتم تحويل المبلغ تلقائياً إلى تبرع للقضية الفلسطينية. يمكنك متابعة أثر تبرعك من خلال نظام التتبع الشفاف.'
        : 'You can browse the store and choose products that suit you. When purchasing, the amount will automatically convert to donations for the Palestinian cause. You can track your donation impact through our transparent tracking system.'
    },
    {
      id: 'donate',
      text: language === 'ar' ? 'كيف أتبرع مباشرة؟' : 'How do I donate directly?',
      icon: DollarSign,
      response: language === 'ar'
        ? 'يمكنك التبرع مباشرة من خلال صفحة التبرع. ا��تر المبلغ والسبب الذي تريد دعمه (التعليم، العائلات، الإسكان، الرعاية الصحية). جميع التبرعات مشفرة وآمنة ويمكن تتبعها بالكامل.'
        : 'You can donate directly through the donation page. Choose the amount and cause you want to support (education, families, housing, healthcare). All donations are encrypted, secure, and fully trackable.'
    },
    {
      id: 'transparency',
      text: language === 'ar' ? 'ما هي ضمانات الشفافية؟' : 'What are the transparency guarantees?',
      icon: HelpCircle,
      response: language === 'ar'
        ? 'نستخدم تقنية البلوك تشين لضمان شفافية كاملة. يمكنك تتبع كل ريال تبرعت به ومعرفة كيف تم استخدامه. 75% يذهب للمساعدات المباشرة، 20% للتعليم والصحة، و5% لتشغيل المنصة.'
        : 'We use blockchain technology to ensure complete transparency. You can track every dollar you donated and know how it was used. 75% goes to direct aid, 20% to education and healthcare, and 5% to platform operations.'
    }
  ];

  const predefinedResponses = {
    greeting: language === 'ar'
      ? 'مرحباً بك في نبض فلسطين! أنا هنا لمساعدتك. كيف يمكنني مساعدتك اليوم؟'
      : 'Welcome to Palestine Pulse! I\'m here to help you. How can I assist you today?',
    
    products: language === 'ar'
      ? 'لدينا مجموعة متنوعة من المنتجات الفلسطينية الأصيلة: كتب تاريخية، كوفيات مصنوعة يدوياً، خرائط تاريخية، مفاتيح القدس الرمزية، تطريزات يدوية، وملابس نبض فلسطين. جميع المنتجات تدعم القضية الفلسطينية.'
      : 'We have a variety of authentic Palestinian products: historical books, handmade keffiyes, historical maps, symbolic Jerusalem keys, hand embroidery, and Palestine Pulse clothing. All products support the Palestinian cause.',
    
    payment: language === 'ar'
      ? 'نقبل الدفع بالبطاقات الائتمانية، PayPal، والمحافظ الإلكترونية. جميع المعاملات آمنة ومشفرة. يمكنك أيضاً اختيار التبرع المباشر.'
      : 'We accept credit cards, PayPal, and mobile wallets. All transactions are secure and encrypted. You can also choose direct donation.',
    
    support: language === 'ar'
      ? 'إذا كنت تحتاج مساعدة إضافية، يمكنك التواصل مع فريق الدعم الفني من خلال صفحة الدعم أو مراسلتنا مباشرة.'
      : 'If you need additional help, you can contact our technical support team through the support page or message us directly.',
    
    default: language === 'ar'
      ? 'شكراً لسؤالك. يمكنني مساعدتك في أي شيء متعلق بالمتجر أو التبرعات أو المنصة. اختر من الأسئلة السريعة أعلاه أو اطرح سؤالك.'
      : 'Thanks for your question. I can help you with anything related to the store, donations, or platform. Choose from the quick questions above or ask your question.'
  };

  useEffect(() => {
    // Add welcome message when component mounts
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        text: predefinedResponses.greeting,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('مرحبا') || message.includes('hello') || message.includes('hi') || message.includes('سلام')) {
      return predefinedResponses.greeting;
    } else if (message.includes('منتج') || message.includes('product') || message.includes('متجر') || message.includes('shop')) {
      return predefinedResponses.products;
    } else if (message.includes('دفع') || message.includes('payment') || message.includes('pay') || message.includes('شراء')) {
      return predefinedResponses.payment;
    } else if (message.includes('مساعدة') || message.includes('help') || message.includes('دعم') || message.includes('support')) {
      return predefinedResponses.support;
    } else if (message.includes('تبرع') || message.includes('donate') || message.includes('donation')) {
      return quickActions.find(action => action.id === 'donate')?.response || predefinedResponses.default;
    } else if (message.includes('شفافية') || message.includes('transparency') || message.includes('track')) {
      return quickActions.find(action => action.id === 'transparency')?.response || predefinedResponses.default;
    } else {
      return predefinedResponses.default;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action: QuickAction) => {
    const userMessage: Message = {
      id: Date.now(),
      text: action.text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: action.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-palestine-green to-palestine-red py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="h-12 w-12 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold">
              {t('chatbotTitle')}
            </h1>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {t('chatbotDescription')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {language === 'ar' ? 'أسئلة سريعة' : 'Quick Questions'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="justify-start h-auto p-4 hover:border-palestine-red hover:text-palestine-red"
                  onClick={() => handleQuickAction(action)}
                >
                  <action.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-left">{action.text}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-palestine-green" />
                {language === 'ar' ? 'محادثة مع المساعد الذكي' : 'Chat with AI Assistant'}
                <Badge variant="secondary" className="ml-auto">
                  {language === 'ar' ? 'متصل' : 'Online'}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Messages Area */}
              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <div className="w-8 h-8 bg-palestine-green rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-palestine-red text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 bg-palestine-red rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-palestine-green rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-muted px-4 py-2 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={t('askQuestion')}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`flex-1 ${language === 'ar' ? 'text-right' : ''}`}
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-palestine-red hover:bg-palestine-red-dark text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {language === 'ar' 
                    ? 'المساعد الذكي متاح 24/7 لمساعدتك في أي استفسار'
                    : 'AI Assistant available 24/7 to help with any inquiry'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-6 border-0 shadow-sm bg-palestine-green-50 dark:bg-palestine-green-dark/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 text-palestine-green-dark">
                {language === 'ar' ? 'كيف يمكنني مساعدتك؟' : 'How can I help you?'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">
                    {language === 'ar' ? 'يمكنني مساعدتك في:' : 'I can help you with:'}
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• {language === 'ar' ? 'تصفح المنتجات والتسوق' : 'Browsing products and shopping'}</li>
                    <li>• {language === 'ar' ? 'التبرع والمساهمة' : 'Donations and contributions'}</li>
                    <li>• {language === 'ar' ? 'تتبع أثر التبرعات' : 'Tracking donation impact'}</li>
                    <li>• {language === 'ar' ? 'معلومات عن المنصة' : 'Platform information'}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    {language === 'ar' ? 'نصائح للمحادثة:' : 'Chat tips:'}
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• {language === 'ar' ? 'اطرح أسئلة واضحة ومحددة' : 'Ask clear and specific questions'}</li>
                    <li>• {language === 'ar' ? 'استخدم الأسئلة السريعة أعلاه' : 'Use quick questions above'}</li>
                    <li>• {language === 'ar' ? 'يمكنك الكتابة بالعربية أو الإنجليزية' : 'You can write in Arabic or English'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}