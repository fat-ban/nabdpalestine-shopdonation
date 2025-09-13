import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useTheme } from "../contexts/ThemeContext";
import { Heart, Shield, Users, Target, Eye, Globe, Award, Handshake, User } from 'lucide-react';

export function AboutPage() {
  const { t, language } = useTheme();

  const values = [
    {
      icon: Heart,
      title: language === 'ar' ? 'الشفافية' : 'Transparency',
      description: language === 'ar' 
        ? 'نضمن شفافية كاملة في كل تبرع من خلال تقنية البلوك تشين'
        : 'We ensure complete transparency in every donation through blockchain technology',
      color: 'bg-palestine-red-50 text-palestine-red-dark',
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'الأمان' : 'Security',
      description: language === 'ar'
        ? 'نحمي بياناتك وتبرعاتك بأحدث تقنيات الأمان'
        : 'We protect your data and donations with the latest security technologies',
      color: 'bg-palestine-green-50 text-palestine-green-dark',
    },
    {
      icon: Users,
      title: language === 'ar' ? 'التضامن' : 'Solidarity',
      description: language === 'ar'
        ? 'نؤمن بقوة التضامن الجماعي لدعم القضية الفلسطينية'
        : 'We believe in the power of collective solidarity to support the Palestinian cause',
      color: 'bg-palestine-black-50 text-palestine-black',
    },
    {
      icon: Target,
      title: language === 'ar' ? 'الهدف' : 'Purpose',
      description: language === 'ar'
        ? 'هدفنا واضح: دعم فلسطين من خلال التجارة والإعلام المقاوم'
        : 'Our goal is clear: support Palestine through commerce and resistance media',
      color: 'bg-blue-50 text-blue-600',
    },
  ];

  const achievements = [
    {
      number: '$250K+',
      label: language === 'ar' ? 'تم جمعه للتبرعات' : 'Raised in donations',
      progress: 75,
    },
    {
      number: '5K+',
      label: language === 'ar' ? 'متضامن حول العالم' : 'Supporters worldwide',
      progress: 85,
    },
    {
      number: '15+',
      label: language === 'ar' ? 'مشروع نشط' : 'Active projects',
      progress: 60,
    },
    {
      number: '95%',
      label: language === 'ar' ? 'معدل الشفافية' : 'Transparency rate',
      progress: 95,
    },
  ];

  const team = [
    {
      name: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
      role: language === 'ar' ? 'المؤسس والرئيس التنفيذي' : 'Founder & CEO',
      description: language === 'ar' 
        ? 'خبير في التكنولوجيا والتجارة الإلكترونية مع خلفية في العمل الخيري'
        : 'Expert in technology and e-commerce with a background in charitable work',
    },
    {
      name: language === 'ar' ? 'فاطمة أحمد' : 'Fatima Ahmed',
      role: language === 'ar' ? 'مديرة التطوير' : 'Development Manager',
      description: language === 'ar'
        ? 'متخصصة في تطوير المنصات الرقمية والذكاء الاصطناعي'
        : 'Specialist in digital platform development and artificial intelligence',
    },
    {
      name: language === 'ar' ? 'عمر حسن' : 'Omar Hassan',
      role: language === 'ar' ? 'مدير الشفافية' : 'Transparency Manager',
      description: language === 'ar'
        ? 'خبير في تقنية البلوك تشين وأنظمة التتبع الشفاف'
        : 'Expert in blockchain technology and transparent tracking systems',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-palestine-red via-palestine-white to-palestine-green py-20 overflow-hidden">
        <div className="absolute inset-0 bg-palestine-flag opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-palestine-red text-white px-4 py-2">
              <Heart className="h-4 w-4 mr-2 animate-heartbeat" />
              {language === 'ar' ? 'من نحن' : 'About Us'}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-palestine-black">
              {t('aboutTitle')}
            </h1>
            
            <p className="text-xl text-palestine-black mb-8 max-w-3xl mx-auto">
              {t('aboutDescription')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <Eye className="h-12 w-12 text-palestine-red mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-palestine-black mb-2">
                  {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                </h3>
                <p className="text-palestine-black/80 text-sm">
                  {language === 'ar' 
                    ? 'عالم يقف مع فلسطين بكل شفافية وفعالية'
                    : 'A world that stands with Palestine with full transparency and effectiveness'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <Target className="h-12 w-12 text-palestine-green mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-palestine-black mb-2">
                  {language === 'ar' ? 'مهمتنا' : 'Our Mission'}
                </h3>
                <p className="text-palestine-black/80 text-sm">
                  {language === 'ar' 
                    ? 'تحويل كل عملية شراء إلى دعم حقيقي للقضية الفلسطينية'
                    : 'Converting every purchase into real support for the Palestinian cause'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <Globe className="h-12 w-12 text-palestine-black mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-palestine-black mb-2">
                  {language === 'ar' ? 'أثرنا' : 'Our Impact'}
                </h3>
                <p className="text-palestine-black/80 text-sm">
                  {language === 'ar' 
                    ? 'شبكة عالمية من المتضامنين مع فلسطين'
                    : 'A global network of Palestine supporters'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Our Story Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              {language === 'ar' ? 'قصتنا' : 'Our Story'}
            </h2>
            
            <div className="prose prose-lg max-w-none text-center">
              <p className="text-lg text-muted-foreground mb-6">
                {language === 'ar' 
                  ? 'وُلدت فكرة نبض فلسطين من إيمان عميق بأن التضامن الحقيقي يتطلب أكثر من الكلمات. أردنا إنشاء منصة تحول كل عملية شراء، كل تفاعل، كل نقرة إلى دعم ملموس للشعب الفلسطيني.'
                  : 'The idea of Palestine Pulse was born from a deep belief that true solidarity requires more than words. We wanted to create a platform that turns every purchase, every interaction, every click into tangible support for the Palestinian people.'
                }
              </p>
              
              <p className="text-lg text-muted-foreground mb-6">
                {language === 'ar' 
                  ? 'ما يميزنا هو التزامنا بالشفافية الكاملة. نستخدم أحدث تقنيات البلوك تشين لضمان وصول كل ريال إ��ى مستحقيه، مع إمكانية التتبع الكامل لأثر تبرعاتكم.'
                  : 'What sets us apart is our commitment to complete transparency. We use the latest blockchain technologies to ensure every dollar reaches its recipients, with full tracking of your donation impact.'
                }
              </p>
              
              <p className="text-lg text-muted-foreground">
                {language === 'ar' 
                  ? 'نؤمن أن التجارة يمكن أن تكون قوة للخير، وأن الإعلام المقاوم ضروري لمحاربة التضليل. لذلك، نجمع بين التسوق الهادف والإعلام الشفاف لخدمة القضية الفلسطينية.'
                  : 'We believe commerce can be a force for good, and that resistance media is essential to combat misinformation. Therefore, we combine purposeful shopping with transparent media to serve the Palestinian cause.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {language === 'ar' ? 'قيمنا' : 'Our Values'}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full ${value.color} mx-auto mb-4 flex items-center justify-center`}>
                    <value.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="mb-16 bg-muted/30 rounded-lg p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {language === 'ar' ? 'إنجازاتنا' : 'Our Achievements'}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-palestine-red mb-2">
                  {achievement.number}
                </div>
                <div className="text-muted-foreground mb-3">
                  {achievement.label}
                </div>
                <Progress value={achievement.progress} className="h-2" />
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {language === 'ar' ? 'فريقنا' : 'Our Team'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-palestine-red to-palestine-green rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-palestine-red font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-palestine-red text-white rounded-lg p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-palestine-flag opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'ar' ? 'انضم إلى مهمتنا' : 'Join Our Mission'}
            </h2>
            <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'كن جزءاً من التغيير. كل عملية شراء، كل تبرع، كل مشاركة تساهم في دعم فلسطين'
                : 'Be part of the change. Every purchase, every donation, every share contributes to supporting Palestine'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="secondary" className="bg-white text-palestine-red px-4 py-2">
                <Handshake className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'معاً لفلسطين' : 'Together for Palestine'}
              </Badge>
              <Badge variant="secondary" className="bg-palestine-green text-white px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'شفافية 100%' : '100% Transparency'}
              </Badge>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}