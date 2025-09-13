import { Heart, Users, Shield, ExternalLink, CheckCircle, Target } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useTheme } from "./contexts/ThemeContext";

interface OrganizationsSectionProps {
  onNavigate: (page: 'organizations' | 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'support' | 'login' | 'register' | 'dashboard' | 'profile' | 'product-detail' | 'admin-dashboard' | 'user-account' | 'cart') => void;
}

export function OrganizationsSection({ onNavigate }: OrganizationsSectionProps) {
  const { language } = useTheme();

  const featuredOrganizations = [
    {
      id: 'palestine-children',
      name: 'مؤسسة أطفال فلسطين',
      nameEn: 'Palestine Children Foundation',
      description: 'تهتم بدعم وتعليم الأطفال الفلسطينيين',
      descriptionEn: 'Dedicated to supporting Palestinian children',
      focus: 'التعليم والصحة',
      focusEn: 'Education & Healthcare',
      beneficiaries: 1250,
      transparency: 98,
      raised: 245780,
      verified: true,
      color: 'from-palestine-green to-green-500'
    },
    {
      id: 'rebuild-palestine',
      name: 'مبادرة إعادة بناء فلسطين',
      nameEn: 'Rebuild Palestine Initiative',
      description: 'تركز على إعادة إعمار البنية التحتية',
      descriptionEn: 'Focuses on rebuilding infrastructure',
      focus: 'الإعمار والبناء',
      focusEn: 'Reconstruction & Building',
      beneficiaries: 890,
      transparency: 96,
      raised: 567890,
      verified: true,
      color: 'from-palestine-red to-red-500'
    },
    {
      id: 'palestine-health',
      name: 'الرعاية الصحية الفلسطينية',
      nameEn: 'Palestine Healthcare Network',
      description: 'تقدم الخدمات الطبية والدعم الصحي',
      descriptionEn: 'Provides medical services and healthcare',
      focus: 'الصحة والطوارئ',
      focusEn: 'Healthcare & Emergency',
      beneficiaries: 2100,
      transparency: 99,
      raised: 789123,
      verified: true,
      color: 'from-blue-500 to-blue-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:via-palestine-black-light dark:to-palestine-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-palestine-green to-palestine-red rounded-full mb-6">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-palestine-green via-palestine-red to-palestine-black bg-clip-text text-transparent">
            {language === 'ar' ? 'شركاؤنا في التأثير' : 'Our Impact Partners'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {language === 'ar' 
              ? 'نتعاون مع الجمعيات الفلسطينية الموثوقة لضمان وصول تبرعاتكم مباشرة للمحتاجين - بشفافية كاملة عبر البلوك تشين'
              : 'We partner with trusted Palestinian organizations to ensure your donations reach those in need directly - with full transparency through blockchain'
            }
          </p>
          
          {/* Blockchain Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <div className="bg-white/60 dark:bg-palestine-black-light/60 backdrop-blur-sm rounded-lg p-4 text-center">
              <Shield className="h-8 w-8 text-palestine-green mx-auto mb-2" />
              <div className="font-bold text-lg">100%</div>
              <div className="text-sm text-muted-foreground">{language === 'ar' ? 'آمان' : 'Secure'}</div>
            </div>
            <div className="bg-white/60 dark:bg-palestine-black-light/60 backdrop-blur-sm rounded-lg p-4 text-center">
              <CheckCircle className="h-8 w-8 text-palestine-red mx-auto mb-2" />
              <div className="font-bold text-lg">0%</div>
              <div className="text-sm text-muted-foreground">{language === 'ar' ? 'رسوم' : 'Fees'}</div>
            </div>
            <div className="bg-white/60 dark:bg-palestine-black-light/60 backdrop-blur-sm rounded-lg p-4 text-center">
              <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="font-bold text-lg">97%</div>
              <div className="text-sm text-muted-foreground">{language === 'ar' ? 'شفافية' : 'Transparency'}</div>
            </div>
            <div className="bg-white/60 dark:bg-palestine-black-light/60 backdrop-blur-sm rounded-lg p-4 text-center">
              <Users className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="font-bold text-lg">4.2K</div>
              <div className="text-sm text-muted-foreground">{language === 'ar' ? 'مستفيد' : 'Beneficiaries'}</div>
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredOrganizations.map((org) => (
            <Card key={org.id} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-palestine-black-light/80 backdrop-blur-sm overflow-hidden">
              {/* Header with gradient */}
              <div className={`h-20 bg-gradient-to-r ${org.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-4 right-4">
                  {org.verified && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 left-4 text-white">
                  <div className="text-xs opacity-80">
                    {language === 'ar' ? org.focus : org.focusEn}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-palestine-green transition-colors">
                    {language === 'ar' ? org.name : org.nameEn}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {language === 'ar' ? org.description : org.descriptionEn}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-palestine-green">${org.raised.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{language === 'ar' ? 'تم جمعه' : 'Raised'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-palestine-red">{org.beneficiaries.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{language === 'ar' ? 'مستفيد' : 'Beneficiaries'}</div>
                  </div>
                </div>

                {/* Transparency Score */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{language === 'ar' ? 'الشفافية' : 'Transparency'}</span>
                    <span className="text-sm font-bold text-palestine-green">{org.transparency}%</span>
                  </div>
                  <Progress value={org.transparency} className="h-2" />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-palestine-green to-palestine-green-dark hover:from-palestine-green-dark hover:to-palestine-green group-hover:shadow-lg transition-all">
                    <Heart className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'تبرع الآن' : 'Donate Now'}
                  </Button>
                  <Button variant="outline" className="w-full hover:bg-muted/50">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'تفاصيل أكثر' : 'View Details'}
                  </Button>
                </div>

                {/* Blockchain verification */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-center text-xs text-muted-foreground">
                    <Shield className="h-3 w-3 mr-1" />
                    {language === 'ar' ? 'معتمد على البلوك تشين' : 'Blockchain Verified'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-palestine-green via-palestine-red to-palestine-black p-8 rounded-2xl text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {language === 'ar' ? 'اكتشف جميع الجمعيات الشريكة' : 'Discover All Partner Organizations'}
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'تعرف على تفاصيل كل جمعية، اطلع على تقارير الشفافية، وتابع التأثير المحقق من تبرعاتك في الوقت الفعلي'
                : 'Learn about each organization, view transparency reports, and track the real-time impact of your donations'
              }
            </p>
            <Button 
              onClick={() => onNavigate('organizations')}
              size="lg" 
              className="bg-white text-foreground hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
            >
              <Users className="h-5 w-5 mr-2" />
              {language === 'ar' ? 'عرض جميع الجمعيات' : 'View All Organizations'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}