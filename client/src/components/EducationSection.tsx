import { BookOpen, Code, Heart, Globe, User, Clock, Users, Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const courses = [
  {
    id: 1,
    title: "تطوير المواقع الإلكترونية",
    description: "تعلم HTML, CSS, JavaScript من الصفر",
    instructor: "أحمد محمد - مهندس من تركيا",
    students: 1240,
    duration: "8 أسابيع",
    level: "مبتدئ",
    rating: 4.9,
    category: "البرمجة",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    flag: "🇹🇷"
  },
  {
    id: 2,
    title: "اللغة الإنجليزية للمبتدئين",
    description: "كورس شامل لتعلم اللغة الإنجليزية",
    instructor: "سارة جونسون - أستاذة من كندا",
    students: 2100,
    duration: "12 أسبوع",
    level: "مبتدئ",
    rating: 4.8,
    category: "اللغات",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
    flag: "🇨🇦"
  },
  {
    id: 3,
    title: "أساسيات الطب والإسعافات الأولية",
    description: "معرفة طبية أساسية يحتاجها الجميع",
    instructor: "د. فاطمة علي - طبيبة من الأردن",
    students: 890,
    duration: "6 أسابيع",
    level: "مبتدئ",
    rating: 4.9,
    category: "الطب",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
    flag: "🇯🇴"
  },
  {
    id: 4,
    title: "التصميم الجرافيكي باستخدام Photoshop",
    description: "احتراف التصميم للمقاومة الإعلامية",
    instructor: "مريم حسن - مصممة من مصر",
    students: 1560,
    duration: "10 أسابيع",
    level: "متوسط",
    rating: 4.7,
    category: "التصميم",
    image: "https://images.unsplash.com/photo-1541753236788-b0ac1fc5009d?w=400&h=250&fit=crop",
    flag: "🇪🇬"
  },
  {
    id: 5,
    title: "إدارة الأعمال والريادة",
    description: "كيفية إنشاء مشروع ناجح",
    instructor: "عمر السيد - رائد أعمال من الإمارات",
    students: 780,
    duration: "8 أسابيع",
    level: "متقدم",
    rating: 4.8,
    category: "الأعمال",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=250&fit=crop",
    flag: "🇦🇪"
  },
  {
    id: 6,
    title: "الأمن السيبراني للمبتدئين",
    description: "حماية البيانات والخصوصية الرقمية",
    instructor: "محمد العلي - خبير أمن من السعودية",
    students: 920,
    duration: "6 أسابيع",
    level: "مبتدئ",
    rating: 4.6,
    category: "التكنولوجيا",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
    flag: "🇸🇦"
  }
];

const successStories = [
  {
    name: "رامي أبو زيد",
    age: 24,
    city: "غزة",
    story: "تعلمت البرمجة من خلال المنصة وأصبحت مطور مستقل",
    achievement: "راتب 2000$ شهرياً",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "ليلى حمدان",
    age: 28,
    city: "الضفة الغربية",
    story: "أتقنت اللغة الإنجليزية وأصبحت مترجمة معتمدة",
    achievement: "عمل مع منظمات دولية",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "أحمد الشريف",
    age: 22,
    city: "القدس",
    story: "تعلمت التصميم وأصبحت أعمل لحساب شركات عربية",
    achievement: "مشاريع بقيمة 10,000$",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  }
];

const categoryColors: Record<string, string> = {
  "البرمجة": "bg-blue-50 text-blue-600",
  "اللغات": "bg-green-50 text-green-600",
  "الطب": "bg-red-50 text-red-600",
  "التصميم": "bg-purple-50 text-purple-600",
  "الأعمال": "bg-orange-50 text-orange-600",
  "التكنولوجيا": "bg-gray-50 text-gray-600"
};

export function EducationSection() {
  return (
    <section id="education" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6" dir="rtl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            التعليم المجاني
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">تعليم مجاني للجميع</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            دورات مجانية في التقنية، اللغات، البرمجة، والطب مع مدرسين متطوعين من مختلف أنحاء العالم
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">٥٠+</div>
            <div className="text-sm text-gray-600">دورة مجانية</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">١٠٠+</div>
            <div className="text-sm text-gray-600">مدرس متطوع</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600 mb-2">٨٠٠٠+</div>
            <div className="text-sm text-gray-600">طالب مسجل</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">٧٥+</div>
            <div className="text-sm text-gray-600">دولة داعمة</div>
          </div>
        </div>

        {/* Courses */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {courses.map((course) => (
            <Card key={course.id} className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className={`absolute top-3 right-3 ${categoryColors[course.category]} border-0 font-medium`}>
                  {course.category}
                </Badge>
                <div className="absolute bottom-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  مجاني 100%
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 text-right mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-right text-sm mb-4">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                  <span className="text-gray-600">{course.instructor.split(' - ')[0]} {course.flag}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <Badge variant="secondary" className="mb-4 bg-gray-100 text-gray-600">
                  {course.level}
                </Badge>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  انضم للدورة مجاناً
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Stories */}
        <div className="bg-white rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">قصص نجاح ملهمة</h3>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {successStories.map((story, index) => (
              <div key={index} className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <ImageWithFallback
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback>{story.name[0]}</AvatarFallback>
                </Avatar>
                
                <h4 className="font-semibold text-lg text-gray-900">{story.name}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {story.age} سنة، {story.city}
                </p>
                
                <p className="text-sm text-gray-700 text-center mb-3">"{story.story}"</p>
                
                <Badge className="bg-green-50 text-green-600 border-0">
                  {story.achievement}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              شارك قصة نجاحك
              <Heart className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}