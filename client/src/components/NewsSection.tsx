import { Calendar, Eye, Share2, MessageCircle, Shield, Play } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const newsItems = [
  {
    id: 1,
    title: "فضح الشائعات: الحقيقة وراء الأحداث الأخيرة في غزة",
    description: "تقرير شامل يفند الادعاءات المغلوطة ويقدم الأدلة البصرية",
    type: "فضح شائعات",
    date: "اليوم",
    views: 15420,
    image: "https://images.unsplash.com/photo-1504711331083-9c895941bf81?w=400&h=250&fit=crop",
    isVideo: false,
    creator: "فريق التحقق"
  },
  {
    id: 2,
    title: "مسيرة التضامن العالمية: من لندن إلى طوكيو",
    description: "توثيق مرئي للتظاهرات التضامنية حول العالم",
    type: "تغطية مباشرة",
    date: "أمس",
    views: 28950,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    isVideo: true,
    creator: "شبكة المراسلين"
  },
  {
    id: 3,
    title: "يوتيوبر فلسطيني يكسر حاجز المليون مشاهدة",
    description: "قصة نجاح صانع محتوى فلسطيني في مواجهة الخوارزميات",
    type: "دعم المبدعين",
    date: "منذ يومين",
    views: 8750,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop",
    isVideo: false,
    creator: "قسم الإعلام الرقمي"
  },
  {
    id: 4,
    title: "الحياة اليومية في غزة: صور لا يريدونك أن تراها",
    description: "لقطات حصرية تظهر الواقع الحقيقي للحياة في غزة",
    type: "تقرير خاص",
    date: "منذ ٣ أيام",
    views: 42100,
    image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=250&fit=crop",
    isVideo: true,
    creator: "مراسلو الميدان"
  },
  {
    id: 5,
    title: "التراث الفلسطيني: أدلة تاريخية تفند الأكاذيب",
    description: "وثائق وصور تثبت عراقة الوجود الفلسطيني",
    type: "تراث وهوية",
    date: "منذ أسبوع",
    views: 19800,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
    isVideo: false,
    creator: "أرشيف فلسطين"
  },
  {
    id: 6,
    title: "مقاطعة عالمية: حملات المقاطعة تحقق انتصارات جديدة",
    description: "تقرير عن نجاحات حركة BDS والتأثير الاقتصادي",
    type: "مقاطعة",
    date: "منذ أسبوع",
    views: 31200,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop",
    isVideo: true,
    creator: "شبكة المقاطعة"
  }
];

const typeColors: Record<string, string> = {
  "فضح شائعات": "bg-red-50 text-red-600",
  "تغطية مباشرة": "bg-blue-50 text-blue-600",
  "دعم المبدعين": "bg-green-50 text-green-600",
  "تقرير خاص": "bg-purple-50 text-purple-600",
  "تراث وهوية": "bg-orange-50 text-orange-600",
  "مقاطعة": "bg-gray-50 text-gray-600"
};

export function NewsSection() {
  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6" dir="rtl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            الأخبار المصورة
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">توثيق الواقع الفلسطيني</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            فضح الشائعات ودعم صناع المحتوى الفلسطيني في مواجهة التضليل الإعلامي
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <Card key={item.id} className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-red-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                )}
                <Badge className={`absolute top-3 right-3 ${typeColors[item.type]} border-0 font-medium`}>
                  {item.type}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 text-right mb-2 line-clamp-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-right text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{item.creator}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{item.views.toLocaleString('ar')}</span>
                    </div>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    قراءة المزيد
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50">
            عرض المزيد من الأخبار
          </Button>
        </div>
      </div>
    </section>
  );
}