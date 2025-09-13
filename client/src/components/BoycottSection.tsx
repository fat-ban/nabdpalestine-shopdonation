import { Users, Target, TrendingUp, CheckCircle, ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const boycottTargets = [
  {
    id: 1,
    name: "ماكدونالدز",
    reason: "دعم الاحتلال الإسرائيلي",
    status: "نشط",
    impact: "انخفاض 15% في المبيعات",
    alternatives: ["برجر فوال", "مطاعم محلية", "الطبخ المنزلي"],
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
    participants: 2400000
  },
  {
    id: 2,
    name: "ستاربكس",
    reason: "موقف داعم للكيان الصهيوني",
    status: "نشط",
    impact: "إغلاق 150 فرع عالمياً",
    alternatives: ["قهوة عربية", "مقاهي محلية", "قهوة تركية"],
    logo: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=100&h=100&fit=crop",
    participants: 1800000
  },
  {
    id: 3,
    name: "أمازون",
    reason: "خدمات سحابية للجيش الإسرائيلي",
    status: "مراقب",
    impact: "تحول 8% للمنافسين",
    alternatives: ["متاجر محلية", "AliExpress", "متاجر عربية"],
    logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop",
    participants: 3200000
  }
];

const campaigns = [
  {
    id: 1,
    title: "#فلسطين_حرة",
    description: "حملة عالمية لدعم الحقوق الفلسطينية",
    participants: 5200000,
    hashtags: ["#فلسطين_حرة", "#FreePalestine", "#SaveGaza"],
    status: "ترندينغ",
    country_support: 75
  },
  {
    id: 2,
    title: "أسبوع مقاطعة إسرائيل",
    description: "حملة أسبوعية لمقاطعة المنتجات الداعمة",
    participants: 3100000,
    hashtags: ["#BDSWeek", "#BoycottIsrael", "#أسبوع_المقاطعة"],
    status: "نشط",
    country_support: 68
  },
  {
    id: 3,
    title: "دعم المنتجات الفلسطينية",
    description: "تشجيع شراء المنتجات من فلسطين والداعمين",
    participants: 2800000,
    hashtags: ["#دعم_فلسطيني", "#BuyPalestinian", "#SupportPalestine"],
    status: "نامي",
    country_support: 82
  }
];

const statusColors: Record<string, string> = {
  "نشط": "bg-red-50 text-red-600",
  "مراقب": "bg-yellow-50 text-yellow-600",
  "ترندينغ": "bg-green-50 text-green-600",
  "نامي": "bg-blue-50 text-blue-600"
};

export function BoycottSection() {
  const totalParticipants = boycottTargets.reduce((sum, target) => sum + target.participants, 0);

  return (
    <section id="boycott" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6" dir="rtl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            المقاطعة العالمية
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">قوة المقاطعة الذكية</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            انضم إلى حركة المقاطعة العالمية BDS ودعم الحقوق الفلسطينية من خلال القوة الاقتصادية
          </p>
        </div>

        {/* Boycott Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {(totalParticipants / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">مشارك في المقاطعة</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">٧٥</div>
            <div className="text-sm text-gray-600">دولة مشاركة</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">٤٥٠+</div>
            <div className="text-sm text-gray-600">شركة مستهدفة</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">$٢.٥B</div>
            <div className="text-sm text-gray-600">خسائر اقتصادية</div>
          </div>
        </div>

        {/* Boycott Targets */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">الأهداف الرئيسية للمقاطعة</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boycottTargets.map((target) => (
              <Card key={target.id} className="bg-white border-0 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={target.logo}
                        alt={target.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                      />
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">{target.name}</h4>
                        <p className="text-sm text-gray-600">{target.reason}</p>
                      </div>
                    </div>
                    <Badge className={`${statusColors[target.status]} border-0 font-medium`}>
                      {target.status}
                    </Badge>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-sm text-gray-900">التأثير المحقق:</span>
                    </div>
                    <p className="text-sm text-gray-700">{target.impact}</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm text-gray-900">البدائل المقترحة:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {target.alternatives.map((alt, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-600 border-0">
                          {alt}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {(target.participants / 1000000).toFixed(1)}M مشارك
                    </span>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      انضم للمقاطعة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">الحملات النشطة</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-white border-0 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg text-gray-900">{campaign.title}</h4>
                    <Badge className={`${statusColors[campaign.status]} border-0 font-medium`}>
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 text-right mb-4">
                    {campaign.description}
                  </p>

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {(campaign.participants / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-600">مشارك</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">الهاشتاجات:</div>
                    <div className="flex flex-wrap gap-1">
                      {campaign.hashtags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-200 text-gray-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg text-center mb-4">
                    <div className="text-sm font-medium text-gray-900 mb-1">دعم دولي</div>
                    <div className="text-2xl font-bold text-green-600">
                      {campaign.country_support}%
                    </div>
                  </div>

                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    شارك في الحملة
                    <ExternalLink className="w-4 h-4 mr-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">انضم إلى حركة التغيير</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            صوتك مهم، مقاطعتك فعالة، ودعمك يصنع الفرق. كن جزءاً من حركة المقاطعة العالمية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              ابدأ مقاطعة جديدة
              <Users className="w-5 h-5 mr-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50">
              اقترح هدف جديد
              <Target className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}