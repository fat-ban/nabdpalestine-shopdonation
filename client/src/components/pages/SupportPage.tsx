import { useState } from 'react';
import { Mail, Phone, MessageCircle, Clock, CheckCircle, AlertCircle, HelpCircle, Send, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useTheme } from '../contexts/ThemeContext';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdate: string;
}

export function SupportPage() {
  const { t, language } = useTheme();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const faqs: FAQ[] = [
    {
      id: 1,
      question: language === 'ar' ? 'كيف أ��وم بإنشاء حساب جديد؟' : 'How do I create a new account?',
      answer: language === 'ar' 
        ? 'يمكنك إنشاء حساب جديد من خلال النقر على زر "تسجيل" في أعلى الصفحة وملء المعلومات المطلوبة.'
        : 'You can create a new account by clicking the "Sign Up" button at the top of the page and filling in the required information.',
      category: 'account'
    },
    {
      id: 2,
      question: language === 'ar' ? 'كيف تضمنون شفافية التبرعات؟' : 'How do you ensure donation transparency?',
      answer: language === 'ar'
        ? 'نستخدم تقنية البلوك تشين لتسجيل جميع التبرعات وتوزيعها، مما يضمن شفافية كاملة وإمكانية تتبع كل تبرع.'
        : 'We use blockchain technology to record all donations and their distribution, ensuring complete transparency and the ability to track every donation.',
      category: 'donations'
    },
    {
      id: 3,
      question: language === 'ar' ? 'ما هي طرق الدفع المقبولة؟' : 'What payment methods are accepted?',
      answer: language === 'ar'
        ? 'نقبل البطاقات الائتمانية (فيزا، ماستركارد)، PayPal، والمحافظ الإلكترونية مثل Apple Pay و Google Pay.'
        : 'We accept credit cards (Visa, Mastercard), PayPal, and digital wallets like Apple Pay and Google Pay.',
      category: 'payment'
    },
    {
      id: 4,
      question: language === 'ar' ? 'كيف يمكنني تتبع أثر تبرعي؟' : 'How can I track my donation impact?',
      answer: language === 'ar'
        ? 'بعد التبرع، ستحصل على رقم تتبع يمكنك استخدامه في قسم "تتبع التبرعات" لمعرفة كيف تم استخدام تبرعك.'
        : 'After donating, you\'ll receive a tracking number that you can use in the "Track Donations" section to see how your donation was used.',
      category: 'tracking'
    },
    {
      id: 5,
      question: language === 'ar' ? 'كيف أقوم بإلغاء طلب أو استرداد أموال؟' : 'How do I cancel an order or request a refund?',
      answer: language === 'ar'
        ? 'يمكنك إلغاء الطلب خلال 24 ساعة من الشراء. للاسترداد، تواصل معنا خلال 7 أيام مع رقم الطلب.'
        : 'You can cancel an order within 24 hours of purchase. For refunds, contact us within 7 days with your order number.',
      category: 'orders'
    },
    {
      id: 6,
      question: language === 'ar' ? 'هل بياناتي الشخصية آمنة؟' : 'Is my personal data safe?',
      answer: language === 'ar'
        ? 'ن��م، نحن نحمي بياناتك بأحدث تقنيات التشفير ولا نشاركها مع أطراف ثالثة دون موافقتك.'
        : 'Yes, we protect your data with the latest encryption technologies and do not share it with third parties without your consent.',
      category: 'privacy'
    }
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 'TKT-001',
      subject: language === 'ar' ? 'مشكلة في عملية الدفع' : 'Payment processing issue',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2024-08-15',
      lastUpdate: '2024-08-16'
    },
    {
      id: 'TKT-002',
      subject: language === 'ar' ? 'استفسار عن التبرع' : 'Donation inquiry',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-08-14',
      lastUpdate: '2024-08-15'
    }
  ];

  const categories = [
    { id: 'general', name: language === 'ar' ? 'عام' : 'General' },
    { id: 'account', name: language === 'ar' ? 'الحساب' : 'Account' },
    { id: 'donations', name: language === 'ar' ? 'التبرعات' : 'Donations' },
    { id: 'payment', name: language === 'ar' ? 'الدفع' : 'Payment' },
    { id: 'technical', name: language === 'ar' ? 'تقني' : 'Technical' },
    { id: 'other', name: language === 'ar' ? 'أخرى' : 'Other' },
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: '',
    });
  };

  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusText = (status: SupportTicket['status']) => {
    const statusMap = {
      'open': language === 'ar' ? 'مفتوح' : 'Open',
      'in-progress': language === 'ar' ? 'قيد المعالجة' : 'In Progress',
      'resolved': language === 'ar' ? 'مُحل' : 'Resolved'
    };
    return statusMap[status];
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const getPriorityText = (priority: SupportTicket['priority']) => {
    const priorityMap = {
      'low': language === 'ar' ? 'منخفض' : 'Low',
      'medium': language === 'ar' ? 'متوسط' : 'Medium',
      'high': language === 'ar' ? 'عالي' : 'High'
    };
    return priorityMap[priority];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-palestine-red to-palestine-green py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('supportTitle')}
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {t('supportDescription')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Help Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {language === 'ar' ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-palestine-green mx-auto mb-4" />
                <CardTitle>{language === 'ar' ? 'دردشة مباشرة' : 'Live Chat'}</CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'تحدث مع فريق الدعم مباشرة'
                    : 'Chat with our support team directly'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-palestine-green hover:bg-palestine-green-dark text-white">
                  {language === 'ar' ? 'ابدأ المحادثة' : 'Start Chat'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <CardHeader>
                <Mail className="h-12 w-12 text-palestine-red mx-auto mb-4" />
                <CardTitle>{language === 'ar' ? 'أرسل رسالة' : 'Send Message'}</CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'أرسل استفسارك وسنرد خلال 24 ساعة'
                    : 'Send your inquiry and we\'ll respond within 24 hours'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-palestine-red text-palestine-red hover:bg-palestine-red hover:text-white">
                  {language === 'ar' ? 'أرسل رسالة' : 'Send Message'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <CardHeader>
                <Phone className="h-12 w-12 text-palestine-black mx-auto mb-4" />
                <CardTitle>{language === 'ar' ? 'اتصل بنا' : 'Call Us'}</CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'متاح من 9 صباحاً إلى 6 مساءً'
                    : 'Available 9 AM to 6 PM'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  +1 (555) 123-4567
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Content Tabs */}
        <Tabs defaultValue="faq" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
            </TabsTrigger>
            <TabsTrigger value="contact">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </TabsTrigger>
            <TabsTrigger value="tickets">
              {language === 'ar' ? 'طلبات الدعم' : 'Support Tickets'}
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={language === 'ar' ? 'ابحث في الأسئلة الشائعة...' : 'Search FAQ...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10'}`}
                  />
                </div>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border border-border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-5 w-5 text-palestine-red flex-shrink-0" />
                        <span className="text-left">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-2 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'ar' 
                      ? 'حاول البحث بكلمات أخرى أو تواصل معنا مباشرة'
                      : 'Try searching with different terms or contact us directly'
                    }
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {language === 'ar' 
                      ? 'أرسل رسالتك وسنرد عليك في أقرب وقت ممكن'
                      : 'Send us a message and we\'ll get back to you as soon as possible'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">
                          {language === 'ar' ? 'الاسم' : 'Name'}
                        </label>
                        <Input
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          placeholder={language === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                          className={language === 'ar' ? 'text-right' : ''}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                        </label>
                        <Input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'Your email address'}
                          className={language === 'ar' ? 'text-right' : ''}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        {language === 'ar' ? 'الموضوع' : 'Subject'}
                      </label>
                      <Input
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        placeholder={language === 'ar' ? 'موضوع رسالتك' : 'Subject of your message'}
                        className={language === 'ar' ? 'text-right' : ''}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        {language === 'ar' ? 'الفئة' : 'Category'}
                      </label>
                      <Select value={contactForm.category} onValueChange={(value) => setContactForm({...contactForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'اختر الفئة' : 'Select category'} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        {language === 'ar' ? 'الرسالة' : 'Message'}
                      </label>
                      <Textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                        className={`min-h-32 ${language === 'ar' ? 'text-right' : ''}`}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-palestine-red hover:bg-palestine-red-dark text-white">
                      <Send className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'أرسل الرسالة' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {language === 'ar' ? 'طلبات الدعم' : 'Support Tickets'}
                </h3>
                <Button className="bg-palestine-green hover:bg-palestine-green-dark text-white">
                  {language === 'ar' ? 'طلب جديد' : 'New Ticket'}
                </Button>
              </div>

              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <Card key={ticket.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">
                            {ticket.id}
                          </Badge>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(ticket.status)}
                            <span className="text-sm font-medium">
                              {getStatusText(ticket.status)}
                            </span>
                          </div>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityText(ticket.priority)}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          {language === 'ar' ? 'عرض' : 'View'}
                        </Button>
                      </div>

                      <h4 className="font-semibold mb-2">{ticket.subject}</h4>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {language === 'ar' ? 'تم الإنشاء:' : 'Created:'} {ticket.createdAt}
                        </span>
                        <span>
                          {language === 'ar' ? 'آخر تحديث:' : 'Last update:'} {ticket.lastUpdate}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {supportTickets.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {language === 'ar' ? 'لا توجد طلبات دعم' : 'No support tickets'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {language === 'ar' 
                      ? 'لم تقم بإنشاء أي طلبات دعم بعد'
                      : 'You haven\'t created any support tickets yet'
                    }
                  </p>
                  <Button className="bg-palestine-green hover:bg-palestine-green-dark text-white">
                    {language === 'ar' ? 'إنشاء طلب جديد' : 'Create New Ticket'}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Information */}
        <section className="mt-16 bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <Mail className="h-8 w-8 text-palestine-red mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </h3>
              <p className="text-muted-foreground">support@palestinepulse.org</p>
            </div>
            
            <div>
              <Phone className="h-8 w-8 text-palestine-green mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                {language === 'ar' ? 'الهاتف' : 'Phone'}
              </h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </div>
            
            <div>
              <Clock className="h-8 w-8 text-palestine-black mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                {language === 'ar' ? 'ساعات العمل' : 'Working Hours'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'ar' ? '9 صباحاً - 6 مساءً (ت.ع.م)' : '9 AM - 6 PM (UTC)'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}