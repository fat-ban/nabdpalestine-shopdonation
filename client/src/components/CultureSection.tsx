import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, Music, Utensils, Shirt, Home, BookOpen, ArrowRight } from "lucide-react";

const culturalCategories = [
  {
    icon: <Utensils className="w-6 h-6 text-orange-600" />,
    title: "المأكولات التراثية",
    description: "مسخن، ملوخية، كنافة نابلسية، وأطباق تحكي تاريخ الأرض",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
    items: ["المسخن الأصيل", "الكنافة النابلسية", "الملوخية الفلسطينية", "المقلوبة المقدسية"]
  },
  {
    icon: <Music className="w-6 h-6 text-blue-600" />,
    title: "الموسيقى والدبكة",
    description: "أغاني التراث، الدبكة، والآلات الموسيقية التي تحمل روح فلسطين",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
    items: ["دبكة فلسطينية", "أغاني التراث", "آلة العود", "الأهازيج الشعبية"]
  },
  {
    icon: <Shirt className="w-6 h-6 text-red-600" />,
    title: "الأزياء والتطريز",
    description: "فن التطريز الفلسطيني (التتريز) والأزياء التراثية المميزة",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=300&h=200&fit=crop",
    items: ["ثوب فلسطيني مطرز", "تطريز تقليدي", "حطة فلسطينية", "حلي تراثية"]
  },
  {
    icon: <BookOpen className="w-6 h-6 text-green-600" />,
    title: "الشعر والأدب",
    description: "شعراء فلسطين العظام وأدب المقاومة والأمثال الشعبية",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
    items: ["محمود درويش", "فدوى طوقان", "الأمثال الشعبية", "حكايات التراث"]
  },
  {
    icon: <Home className="w-6 h-6 text-purple-600" />,
    title: "العمارة والآثار",
    description: "البيوت الحجرية، المساجد التاريخية، والآثار التي تثبت عراقة الحضارة",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h-200&fit=crop",
    items: ["المسجد الأقصى", "كنيسة المهد", "البيوت الحجرية", "القرى التراثية"]
  },
  {
    icon: <Heart className="w-6 h-6 text-pink-600" />,
    title: "العادات والتقاليد",
    description: "طقوس الزواج، الأعياد، والمناسبات الاجتماعية الفلسطينية",
    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=300&h=200&fit=crop",
    items: ["الزفة الفلسطينية", "عيد الفطر", "المولد النبوي", "قطف الزيتون"]
  }
];

export function CultureSection() {
  return (
    <section id="culture" className="py-20 bg-white">
      <div className="container mx-auto px-6" dir="rtl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="w-4 h-4" fill="currentColor" />
            الثقافة والتراث
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">التراث الفلسطيني العريق</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            فلسطين كانت وستظل للفلسطينيين منذ آلاف السنين
          </p>
        </div>

        {/* Historical Timeline */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">عراقة الحضارة الفلسطينية</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { period: "قبل ٤٠٠٠ سنة", fact: "الكنعانيون يؤسسون المدن الفلسطينية الأولى" },
              { period: "القرن ١٢ ق.م", fact: "الفلستينيون يستوطنون الساحل الفلسطيني" },
              { period: "القرن ٧ م", fact: "الفتح الإسلامي وازدهار الحضارة العربية" },
              { period: "اليوم", fact: "الشعب الفلسطيني يحافظ على تراثه رغم كل التحديات" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  {index + 1}
                </div>
                <div className="font-semibold text-red-600 mb-2">{item.period}</div>
                <p className="text-sm text-gray-600">{item.fact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {culturalCategories.map((category, index) => (
            <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={category.image}
                  alt={category.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-3">
                  {category.icon}
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 text-right mb-2">{category.title}</h3>
                <p className="text-gray-600 text-right text-sm mb-4">
                  {category.description}
                </p>

                <div className="space-y-2 mb-6">
                  {category.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-end text-sm text-gray-600">
                      <span>{item}</span>
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  استكشف المزيد
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Identity Proof Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mt-16 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">فلسطين للفلسطينيين</h3>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">٤٠٠٠+</div>
              <div className="text-sm text-gray-600">سنة من التاريخ المثبت</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl font-bold text-red-600 mb-2">١٠٠٠+</div>
              <div className="text-sm text-gray-600">موقع أثري فلسطيني</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">٧٠+</div>
              <div className="text-sm text-gray-600">سنة من المقاومة الحديثة</div>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            كل حجر في فلسطين، كل شجرة زيتون، كل بيت حجري يشهد على عراقة الوجود الفلسطيني
          </p>
        </div>
      </div>
    </section>
  );
}