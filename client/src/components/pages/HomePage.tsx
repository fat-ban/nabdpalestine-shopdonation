import { useState } from 'react';
import { ArrowLeft, ArrowRight, Play, Users, Globe, Heart, ShoppingBag, Handshake, MessageCircle, ChevronDown, CheckCircle, Star, TrendingUp, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { OrganizationsSection } from '../OrganizationsSection';
import designImage from 'figma:asset/9348bf6f11d07ddafe7fcf9f3df0c8172ec9fdb1.png';

interface HomePageProps {
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'organizations' | 'support' | 'login' | 'register' | 'dashboard' | 'profile' | 'product-detail' | 'admin-dashboard' | 'user-account' | 'cart') => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { language } = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const heroContent = {
    ar: {
      title: 'منصة نبض فلسطين',
      subtitle: 'نبني معاً جسراً رقمياً للتضامن والمقاومة الثقافية',
      description: 'انضم إلى أكبر منصة رقمية تجمع الفلسطينيين وأصدقاء فلسطين حول العالم لدعم القضية من خلال التجارة والثقافة والتواصل',
      primaryButton: 'ابدأ رحلتك',
      secondaryButton: 'تعرف أكثر'
    },
    en: {
      title: 'Palestine Pulse Platform',
      subtitle: 'Building a Digital Bridge for Solidarity and Cultural Resistance',
      description: 'Join the largest digital platform connecting Palestinians and friends of Palestine worldwide to support the cause through commerce, culture, and communication',
      primaryButton: 'Start Your Journey',
      secondaryButton: 'Learn More'
    }
  };

  const features = [
    {
      icon: <ShoppingBag className="h-8 w-8 text-palestine-green" />,
      titleAr: 'المتجر الإلكتروني',
      titleEn: 'E-Commerce Store',
      descriptionAr: 'تسوق منتجات فلسطينية أصيلة وادعم الحرفيين المحليين',
      descriptionEn: 'Shop authentic Palestinian products and support local artisans',
      stats: '500+ منتج',
      statsEn: '500+ Products'
    },
    {
      icon: <Heart className="h-8 w-8 text-palestine-red" />,
      titleAr: 'التبرعات الشفافة',
      titleEn: 'Transparent Donations',
      descriptionAr: 'تبرع بشفافية كاملة وتتبع أثر مساهماتك',
      descriptionEn: 'Donate with full transparency and track your contribution impact',
      stats: '$50K+ تم جمعها',
      statsEn: '$50K+ Raised'
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-500" />,
      titleAr: 'مساعد ذكي',
      titleEn: 'AI Assistant',
      descriptionAr: 'احصل على إجابات فورية حول القضية والخدمات',
      descriptionEn: 'Get instant answers about the cause and services',
      stats: '24/7 متاح',
      statsEn: '24/7 Available'
    },
    {
      icon: <Handshake className="h-8 w-8 text-orange-500" />,
      titleAr: 'الجمعيات الشريكة',
      titleEn: 'Partner Organizations',
      descriptionAr: 'تعاون مع جمعيات فلسطينية موثوقة لضمان وصول تبرعاتك',
      descriptionEn: 'Collaborate with trusted Palestinian organizations to ensure your donations reach those in need',
      stats: '15+ جمعية',
      statsEn: '15+ Organizations'
    }
  ];

  const statistics = [
    {
      numberAr: '10K+',
      numberEn: '10K+',
      labelAr: 'عضو نشط',
      labelEn: 'Active Members',
      icon: <Users className="h-6 w-6 text-palestine-green" />
    },
    {
      numberAr: '25',
      numberEn: '25',
      labelAr: 'دولة',
      labelEn: 'Countries',
      icon: <Globe className="h-6 w-6 text-blue-500" />
    },
    {
      numberAr: '500+',
      numberEn: '500+',
      labelAr: 'منتج أصيل',
      labelEn: 'Authentic Products',
      icon: <ShoppingBag className="h-6 w-6 text-palestine-red" />
    },
    {
      numberAr: '$50K+',
      numberEn: '$50K+',
      labelAr: 'تم التبرع به',
      labelEn: 'Donated',
      icon: <Heart className="h-6 w-6 text-red-500" />
    }
  ];

  const testimonials = [
    {
      nameAr: 'أحمد محمد',
      nameEn: 'Ahmed Mohammed',
      locationAr: 'رام الله، فلسطين',
      locationEn: 'Ramallah, Palestine',
      textAr: 'منصة نبض فلسطين ساعدتني في التواصل مع العالم وبيع منتجاتي التراثية',
      textEn: 'Palestine Pulse platform helped me connect with the world and sell my heritage products',
      rating: 5
    },
    {
      nameAr: 'سارة أحمد',
      nameEn: 'Sarah Ahmed',
      locationAr: 'القاهرة، مصر',
      locationEn: 'Cairo, Egypt',
      textAr: 'أشعر بالفخر للمساهمة في دعم القضية الفلسطينية من خلال هذه المنصة الرائعة',
      textEn: 'I feel proud to contribute to supporting the Palestinian cause through this amazing platform',
      rating: 5
    },
    {
      nameAr: 'محمد علي',
      nameEn: 'Mohammed Ali',
      locationAr: 'دبي، الإمارات',
      locationEn: 'Dubai, UAE',
      textAr: 'التبرعات الشفافة والمتابعة المستمرة تجعلني أثق في كل دولار أتبرع به',
      textEn: 'Transparent donations and continuous tracking make me trust every dollar I donate',
      rating: 5
    }
  ];

  const currentContent = language === 'ar' ? heroContent.ar : heroContent.en;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(56, 161, 105, 0.9) 0%, rgba(229, 62, 62, 0.8) 100%), url(${designImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              {language === 'ar' ? '🇵🇸 منصة التضامن الرقمية' : '🇵🇸 Digital Solidarity Platform'}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up text-shadow-xl">
              {currentContent.title}
            </h1>
            
            <h2 className="text-xl md:text-2xl mb-6 text-white/90 animate-fade-in-up text-shadow-lg">
              {currentContent.subtitle}
            </h2>
            
            <p className="text-lg md:text-xl mb-8 text-white/80 max-w-3xl mx-auto leading-relaxed animate-fade-in-up text-shadow">
              {currentContent.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
              <Button 
                size="lg" 
                onClick={() => onNavigate('store')}
                className="bg-palestine-green hover:bg-palestine-green-dark text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {currentContent.primaryButton}
                <ArrowLeft className={`ml-2 h-5 w-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onNavigate('about')}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                {currentContent.secondaryButton}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-white/70" />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white dark:bg-palestine-black border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-palestine-green mb-2">
                  {language === 'ar' ? stat.numberAr : stat.numberEn}
                </div>
                <div className="text-muted-foreground">
                  {language === 'ar' ? stat.labelAr : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-palestine-green-50 dark:bg-palestine-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'خدماتنا الرئيسية' : 'Our Core Services'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'نوفر مجموعة شاملة من الخدمات لدعم القضية الفلسطينية والتواصل مع المجتمع'
                : 'We provide a comprehensive range of services to support the Palestinian cause and connect with the community'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 shadow-md">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {language === 'ar' ? feature.titleAr : feature.titleEn}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {language === 'ar' ? feature.descriptionAr : feature.descriptionEn}
                  </p>
                  <Badge variant="secondary" className="bg-palestine-green/10 text-palestine-green">
                    {language === 'ar' ? feature.stats : feature.statsEn}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-palestine-black">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-palestine-red/10 text-palestine-red border-palestine-red/20">
                {language === 'ar' ? 'رسالتنا' : 'Our Mission'}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {language === 'ar' 
                  ? 'نبني جسراً رقمياً للمقاومة الثقافية'
                  : 'Building a Digital Bridge for Cultural Resistance'
                }
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {language === 'ar'
                  ? 'نؤمن بقوة التكنولوجيا في خدمة القضايا العادلة. منصتنا تجمع بين التجارة الإلكترونية والعمل الخيري والمحتوى الثقافي لخلق تأثير إيجابي مستدام.'
                  : 'We believe in the power of technology to serve just causes. Our platform combines e-commerce, charity work, and cultural content to create sustainable positive impact.'
                }
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { ar: 'دعم الاقتصاد الفلسطيني', en: 'Supporting Palestinian Economy' },
                  { ar: 'تعزيز الثقافة والتراث', en: 'Promoting Culture and Heritage' },
                  { ar: 'بناء شبكة تضامن عالمية', en: 'Building Global Solidarity Network' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <CheckCircle className="h-5 w-5 text-palestine-green flex-shrink-0" />
                    <span>{language === 'ar' ? item.ar : item.en}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => onNavigate('about')}
                className="bg-palestine-green hover:bg-palestine-green-dark"
              >
                {language === 'ar' ? 'تعرف على قصتنا' : 'Learn Our Story'}
                <ArrowLeft className={`ml-2 h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1639220448675-8c01fdb446fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxlc3RpbmUlMjB0cmFkaXRpb25hbCUyMG9saXZlJTIwdHJlZSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NTc1ODE2NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt={language === 'ar' ? 'المناظر الطبيعية الفلسطينية' : 'Palestinian Landscapes'}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-palestine-green text-white p-4 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-palestine-red text-white p-4 rounded-xl shadow-lg">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black-light dark:to-palestine-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'شهادات أعضائنا' : 'Member Testimonials'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'ar' 
                ? 'اكتشف كيف غيرت المنصة حياة أعضائنا'
                : 'Discover how the platform has changed our members\' lives'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white dark:bg-palestine-black-light border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 italic leading-relaxed">
                    "{language === 'ar' ? testimonial.textAr : testimonial.textEn}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-palestine-green text-white rounded-full flex items-center justify-center mr-3">
                      {(language === 'ar' ? testimonial.nameAr : testimonial.nameEn).charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">
                        {language === 'ar' ? testimonial.nameAr : testimonial.nameEn}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'ar' ? testimonial.locationAr : testimonial.locationEn}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Organizations Section */}
      <OrganizationsSection onNavigate={onNavigate} />

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-palestine-green to-palestine-red">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {language === 'ar' 
                ? 'انضم إلى مجتمع نبض فلسطين اليوم'
                : 'Join Palestine Pulse Community Today'
              }
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {language === 'ar'
                ? 'كن جزءاً من التغيير. ابدأ رحلتك في دعم فلسطين من خلال منصتنا'
                : 'Be part of the change. Start your journey in supporting Palestine through our platform'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => onNavigate('register')}
                className="bg-white text-palestine-green hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Users className="mr-2 h-5 w-5" />
                {language === 'ar' ? 'انضم مجاناً' : 'Join for Free'}
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => onNavigate('store')}
                className="border-white text-white hover:bg-white/10 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}