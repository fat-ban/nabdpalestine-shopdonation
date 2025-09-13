import { Store, Heart, Shield, ShoppingCart, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const products = [
  {
    id: 1,
    name: "تبرع لدعم طفل في غزة",
    description: "تبرع بـ 50$ لتوفير الطعام والدواء لطفل في غزة لمدة شهر",
    price: 50,
    category: "تبرع مباشر",
    image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop",
    impact: "يساعد طفل واحد",
    supporters: 2340
  },
  {
    id: 2,
    name: "كتاب 'ذاكرة للنسيان' - محمود درويش",
    description: "نسخة أصلية من ديوان محمود درويش الشهير",
    price: 25,
    category: "كتب تراثية",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    impact: "يدعم الثقافة الفلسطينية",
    supporters: 156
  },
  {
    id: 3,
    name: "ثوب فلسطيني مطرز يدوياً",
    description: "ثوب تراثي مطرز بخيوط حريرية من صنع نساء فلسطينيات",
    price: 200,
    originalPrice: 300,
    category: "منتجات يدوية",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop",
    impact: "يدعم الحرفيات الفلسطينيات",
    supporters: 89
  },
  {
    id: 4,
    name: "علم فلسطين الرسمي",
    description: "علم فلسطين عالي الجودة مع شهادة أصالة",
    price: 15,
    category: "رمزية وطنية",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    impact: "يعبر عن الهوية الوطنية",
    supporters: 567
  },
  {
    id: 5,
    name: "كُتيب توثيقي: جرائم الاحتلال 2024",
    description: "تقرير مصور موثق للانتهاكات والجرائم المرتكبة",
    price: 10,
    category: "توثيق",
    image: "https://images.unsplash.com/photo-1504711331083-9c895941bf81?w=400&h=300&fit=crop",
    impact: "ينشر الوعي عالمياً",
    supporters: 890
  },
  {
    id: 6,
    name: "زيت زيتون فلسطيني أصلي",
    description: "زيت زيتون عضوي من أشجار فلسطين المعمرة",
    price: 35,
    originalPrice: 45,
    category: "منتجات طبيعية",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
    impact: "يدعم المزارعين الفلسطينيين",
    supporters: 234
  }
];

const categoryColors: Record<string, string> = {
  "تبرع مباشر": "bg-red-50 text-red-600",
  "كتب تراثية": "bg-blue-50 text-blue-600",
  "منتجات يدوية": "bg-purple-50 text-purple-600",
  "رمزية وطنية": "bg-green-50 text-green-600",
  "توثيق": "bg-orange-50 text-orange-600",
  "منتجات طبيعية": "bg-emerald-50 text-emerald-600"
};

export function StoreSection() {
  const totalDonations = products
    .filter(p => p.category === "تبرع مباشر")
    .reduce((sum, p) => sum + (p.price * p.supporters), 0);

  return (
    <section id="store" className="py-20 bg-white">
      <div className="container mx-auto px-6" dir="rtl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Store className="w-4 h-4" />
            المتجر الفلسطيني
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">ادعم القضية الفلسطينية</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            منتجات أصلية وتبرعات مباشرة مع نظام شفاف مدعوم بتقنية البلوكشين
          </p>
        </div>

        {/* Donation Stats */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">إحصائيات الشفافية</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-2">
                ${totalDonations.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">إجمالي التبرعات</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">٥٦٧٨</div>
              <div className="text-sm text-gray-600">متبرع نشط</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">١٢٣٤</div>
              <div className="text-sm text-gray-600">أطفال مدعومين</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">٩٨.٥٪</div>
              <div className="text-sm text-gray-600">شفافية التوزيع</div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">مدعوم بتقنية البلوكشين للشفافية الكاملة</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product) => (
            <Card key={product.id} className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className={`absolute top-3 right-3 ${categoryColors[product.category]} border-0 font-medium`}>
                  {product.category}
                </Badge>
                {product.originalPrice && (
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    خصم {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 text-right mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-right text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${product.price}
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                    <span className="text-sm font-medium">{product.supporters}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg text-xs text-center mb-4">
                  <Heart className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <span className="text-gray-700">{product.impact}</span>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  {product.category === "تبرع مباشر" ? "تبرع الآن" : "اشتري الآن"}
                  <ShoppingCart className="w-4 h-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">كن جزءاً من التغيير</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            كل تبرع، كل مشتريات، كل دعم يصنع فرقاً حقيقياً في حياة الفلسطينيين
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            تصفح المزيد من المنتجات
            <ArrowRight className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}