import { useState } from 'react';
import { Shield, Heart, CheckCircle, Globe, Users, Target, TrendingUp, Award, Link as LinkIcon, ExternalLink, MapPin, Calendar, DollarSign, Zap, Lock, Eye, BarChart3, Handshake } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTheme } from '../contexts/ThemeContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function OrganizationsPage() {
  const { language } = useTheme();
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const partnerOrganizations = [
    {
      id: 'palestine-children',
      name: 'مؤسسة أطفال فلسطين',
      nameEn: 'Palestine Children Foundation',
      description: 'تهتم بدعم وتعليم الأطفال الفلسطينيين في المناطق المحتلة',
      descriptionEn: 'Dedicated to supporting and educating Palestinian children in occupied territories',
      location: 'غزة، فلسطين',
      locationEn: 'Gaza, Palestine',
      established: 2010,
      totalDonations: 245780,
      beneficiaries: 1250,
      projects: 45,
      blockchainAddress: '0x1234...abcd',
      categories: ['التعليم', 'الصحة', 'الغذاء'],
      categoriesEn: ['Education', 'Healthcare', 'Food'],
      impact: {
        schools: 12,
        students: 850,
        meals: 125000,
        medicalAid: 300
      },
      verification: {
        registered: true,
        audited: true,
        blockchainVerified: true,
        transparencyScore: 98
      },
      contact: {
        website: 'palestinechildren.org',
        email: 'info@palestinechildren.org',
        phone: '+970-8-123-4567'
      }
    },
    {
      id: 'rebuild-palestine',
      name: 'مبادرة إعادة بناء فلسطين',
      nameEn: 'Rebuild Palestine Initiative',
      description: 'تركز على إعادة إعمار البنية التحتية والمنازل المدمرة',
      descriptionEn: 'Focuses on rebuilding infrastructure and destroyed homes',
      location: 'الضفة الغربية، فلسطين',
      locationEn: 'West Bank, Palestine',
      established: 2015,
      totalDonations: 567890,
      beneficiaries: 890,
      projects: 28,
      blockchainAddress: '0x5678...efgh',
      categories: ['الإعمار', 'البنية التحتية', 'الإسكان'],
      categoriesEn: ['Reconstruction', 'Infrastructure', 'Housing'],
      impact: {
        homes: 150,
        roads: 25,
        waterSystems: 8,
        electricityLines: 12
      },
      verification: {
        registered: true,
        audited: true,
        blockchainVerified: true,
        transparencyScore: 96
      },
      contact: {
        website: 'rebuildpalestine.org',
        email: 'contact@rebuildpalestine.org',
        phone: '+970-2-987-6543'
      }
    },
    {
      id: 'palestine-health',
      name: 'الرعاية الصحية الفلسطينية',
      nameEn: 'Palestine Healthcare Network',
      description: 'تقدم الخدمات الطبية والدعم الصحي للمجتمعات الفلسطينية',
      descriptionEn: 'Provides medical services and healthcare support to Palestinian communities',
      location: 'القدس، فلسطين',
      locationEn: 'Jerusalem, Palestine',
      established: 2008,
      totalDonations: 789123,
      beneficiaries: 2100,
      projects: 67,
      blockchainAddress: '0x9abc...ijkl',
      categories: ['الصحة', 'الطوارئ', 'الأدوية'],
      categoriesEn: ['Healthcare', 'Emergency', 'Medicine'],
      impact: {
        clinics: 18,
        patients: 15000,
        surgeries: 450,
        vaccinations: 8500
      },
      verification: {
        registered: true,
        audited: true,
        blockchainVerified: true,
        transparencyScore: 99
      },
      contact: {
        website: 'palestinehealth.org',
        email: 'support@palestinehealth.org',
        phone: '+970-2-555-0123'
      }
    },
    {
      id: 'olive-farmers',
      name: 'تعاونية مزارعي الزيتون',
      nameEn: 'Olive Farmers Cooperative',
      description: 'تدعم المزارعين الفلسطينيين وتسوق منتجاتهم الزراعية',
      descriptionEn: 'Supports Palestinian farmers and markets their agricultural products',
      location: 'نابلس، فلسطين',
      locationEn: 'Nablus, Palestine',
      established: 2012,
      totalDonations: 123456,
      beneficiaries: 450,
      projects: 23,
      blockchainAddress: '0xdefg...mnop',
      categories: ['الزراعة', 'التجارة العادلة', 'التنمية الاقتصادية'],
      categoriesEn: ['Agriculture', 'Fair Trade', 'Economic Development'],
      impact: {
        farmers: 300,
        oliveTrees: 50000,
        oilProduced: 12000,
        familiesSupported: 180
      },
      verification: {
        registered: true,
        audited: true,
        blockchainVerified: true,
        transparencyScore: 94
      },
      contact: {
        website: 'olivefarmers.ps',
        email: 'info@olivefarmers.ps',
        phone: '+970-9-234-5678'
      }
    }
  ];

  const blockchainStats = {
    totalTransactions: 15647,
    totalTransparency: 97.5,
    averageSpeed: 2.3,
    zeroFees: true
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-palestine-green via-palestine-white to-palestine-red overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 shadow-lg">
                <Handshake className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-shadow-lg">
              {language === 'ar' ? 'شركاؤنا في التأثير' : 'Our Impact Partners'}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 text-shadow">
              {language === 'ar' 
                ? 'الجمعيات والمؤسسات التي نتعاون معها لتحقيق التأثير الإيجابي - بشفافية كاملة عبر البلوك تشين'
                : 'Organizations and institutions we collaborate with to create positive impact - with full transparency through blockchain'
              }
            </p>
            
            {/* Blockchain Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{blockchainStats.totalTransactions.toLocaleString()}</div>
                <div className="text-white/80 text-sm">{language === 'ar' ? 'معاملة شفافة' : 'Transparent Transactions'}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{blockchainStats.totalTransparency}%</div>
                <div className="text-white/80 text-sm">{language === 'ar' ? 'شفافية تامة' : 'Full Transparency'}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{blockchainStats.averageSpeed}s</div>
                <div className="text-white/80 text-sm">{language === 'ar' ? 'سرعة التحويل' : 'Transfer Speed'}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">0%</div>
                <div className="text-white/80 text-sm">{language === 'ar' ? 'عمولة المنصة' : 'Platform Fees'}</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
              <Shield className="h-6 w-6 text-white" />
              <span className="text-white/90">
                {language === 'ar' ? 'محمي بتقنية البلوك تشين' : 'Secured by Blockchain Technology'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'ar' ? 'كيف يعمل نظام الشفافية' : 'How Our Transparency System Works'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {language === 'ar' 
              ? 'نستخدم تقنية البلوك تشين لضمان وصول 100% من تبرعاتكم ومشترياتكم مباشرة للجمعيات الشريكة دون أي خصومات'
              : 'We use blockchain technology to ensure 100% of your donations and purchases go directly to partner organizations with no deductions'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-white to-palestine-green-50 dark:from-palestine-black-light dark:to-palestine-green/10">
            <CardContent className="p-8">
              <div className="bg-palestine-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-palestine-green" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                {language === 'ar' ? 'تحويل مباشر' : 'Direct Transfer'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'كل دولار تتبرع به أو تدفعه يذهب مباشرة لحساب الجمعية المختارة'
                  : 'Every dollar you donate or pay goes directly to the chosen organization\'s account'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-white to-palestine-red-50 dark:from-palestine-black-light dark:to-palestine-red/10">
            <CardContent className="p-8">
              <div className="bg-palestine-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-palestine-red" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                {language === 'ar' ? 'أمان البلوك تشين' : 'Blockchain Security'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'جميع المعاملات محفوظة ومؤمنة على البلوك تشين ولا يمكن تغييرها'
                  : 'All transactions are secured and recorded on blockchain and cannot be altered'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 dark:from-palestine-black-light dark:to-blue-500/10">
            <CardContent className="p-8">
              <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                {language === 'ar' ? 'شفافية كاملة' : 'Full Transparency'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'يمكنك تتبع كل معاملة ومعرفة كيف تم استخدام أموالك بالضبط'
                  : 'You can track every transaction and know exactly how your money was used'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Organizations List */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'ar' ? 'الجمعيات الشريكة' : 'Partner Organizations'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'ar' ? 'تعرف على الجمعيات التي نتعاون معها' : 'Meet the organizations we work with'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {partnerOrganizations.map((org) => (
              <Card key={org.id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-palestine-green to-palestine-red text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {language === 'ar' ? org.name : org.nameEn}
                      </CardTitle>
                      <p className="text-white/90 text-sm mb-3">
                        {language === 'ar' ? org.description : org.descriptionEn}
                      </p>
                      <div className="flex items-center text-white/80 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {language === 'ar' ? org.location : org.locationEn}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-2">
                        {language === 'ar' ? `${org.established} تأسست` : `Est. ${org.established}`}
                      </Badge>
                      {org.verification.blockchainVerified && (
                        <div className="flex items-center justify-end">
                          <Shield className="h-4 w-4 mr-1" />
                          <span className="text-xs">
                            {language === 'ar' ? 'معتمد' : 'Verified'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-palestine-green">${org.totalDonations.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{language === 'ar' ? 'إجمالي التبرعات' : 'Total Donations'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-palestine-red">{org.beneficiaries.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{language === 'ar' ? 'المستفيدين' : 'Beneficiaries'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{org.projects}</div>
                      <div className="text-xs text-muted-foreground">{language === 'ar' ? 'المشاريع' : 'Projects'}</div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">{language === 'ar' ? 'مجالات العمل:' : 'Areas of Work:'}</h4>
                    <div className="flex flex-wrap gap-2">
                      {(language === 'ar' ? org.categories : org.categoriesEn).map((category, index) => (
                        <Badge key={index} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Transparency Score */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{language === 'ar' ? 'نقاط الشفافية' : 'Transparency Score'}</span>
                      <span className="font-bold text-palestine-green">{org.verification.transparencyScore}%</span>
                    </div>
                    <Progress value={org.verification.transparencyScore} className="h-2" />
                  </div>

                  {/* Blockchain Address */}
                  <div className="mb-6 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{language === 'ar' ? 'عنوان البلوك تشين:' : 'Blockchain Address:'}</div>
                        <div className="text-xs text-muted-foreground font-mono">{org.blockchainAddress}</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 rtl:space-x-reverse">
                    <Button className="flex-1 bg-palestine-green hover:bg-palestine-green-dark">
                      <Heart className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'تبرع الآن' : 'Donate Now'}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedOrg(selectedOrg === org.id ? null : org.id)}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'التفاصيل' : 'Details'}
                    </Button>
                  </div>

                  {/* Detailed Impact (Expandable) */}
                  {selectedOrg === org.id && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <h4 className="font-semibold mb-4">{language === 'ar' ? 'التأثير المحقق:' : 'Impact Achieved:'}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(org.impact).map(([key, value]) => (
                          <div key={key} className="text-center p-3 bg-palestine-green/5 rounded-lg">
                            <div className="text-lg font-bold text-palestine-green">{value.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border">
                        <h5 className="font-medium mb-2">{language === 'ar' ? 'معلومات الاتصال:' : 'Contact Information:'}</h5>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>📧 {org.contact.email}</div>
                          <div>📞 {org.contact.phone}</div>
                          <div className="flex items-center">
                            🌐 
                            <a href={`https://${org.contact.website}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-palestine-green hover:underline">
                              {org.contact.website}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Blockchain Technology Section */}
        <div className="mt-20 bg-gradient-to-r from-palestine-black via-palestine-green to-palestine-red text-white rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-10 w-10" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'تقنية البلوك تشين المتقدمة' : 'Advanced Blockchain Technology'}
            </h2>
            <p className="text-white/90 text-lg max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'نحن أول منصة فلسطينية تستخدم تقنية البلوك تشين لضمان الشفافية الكاملة في التبرعات والمشتريات'
                : 'We are the first Palestinian platform to use blockchain technology to ensure complete transparency in donations and purchases'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white/10 rounded-lg p-4 mb-3">
                <Lock className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-bold mb-2">{language === 'ar' ? 'أمان مطلق' : 'Absolute Security'}</h3>
              <p className="text-white/80 text-sm">
                {language === 'ar' ? 'تشفير متقدم يحمي كل معاملة' : 'Advanced encryption protects every transaction'}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 rounded-lg p-4 mb-3">
                <Eye className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-bold mb-2">{language === 'ar' ? 'شفافية تامة' : 'Full Transparency'}</h3>
              <p className="text-white/80 text-sm">
                {language === 'ar' ? 'تتبع كل دولار في الوقت الفعلي' : 'Track every dollar in real time'}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 rounded-lg p-4 mb-3">
                <Zap className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-bold mb-2">{language === 'ar' ? 'سرعة فائقة' : 'Lightning Fast'}</h3>
              <p className="text-white/80 text-sm">
                {language === 'ar' ? 'معاملات فورية خلال ثوانٍ' : 'Instant transactions within seconds'}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 rounded-lg p-4 mb-3">
                <DollarSign className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-bold mb-2">{language === 'ar' ? 'بدون رسوم' : 'Zero Fees'}</h3>
              <p className="text-white/80 text-sm">
                {language === 'ar' ? '100% من مالك يصل للجمعية' : '100% of your money reaches the organization'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}