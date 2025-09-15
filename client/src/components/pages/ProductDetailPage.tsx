import { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  ShoppingCart, 
  Truck, 
  Shield, 
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { useTheme } from '../contexts/ThemeContext';
import { useCart, Product } from '../contexts/CartContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'news' | 'support' | 'login' | 'register' | 'dashboard' | 'profile' | 'product-detail') => void;
  onBackToStore: () => void;
}

export function ProductDetailPage({ productId, onNavigate, onBackToStore }: ProductDetailPageProps) {
  const { language } = useTheme();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  console.log('ProductDetailPage rendered with productId:', productId);

  // Mock product database - in real app this would come from API/context
  const products: Product[] = [
    {
      id: '1',
      name: 'كتاب تاريخ فلسطين',
      nameEn: 'History of Palestine Book',
      description: 'كتاب شامل عن تاريخ فلسطين العريق والتراث الثقافي الغني',
      descriptionEn: 'Comprehensive book about Palestinian history and rich cultural heritage',
      price: 25,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGVkdWNhdGlvbiUyMGxlYXJuaW5nfGVufDF8fHx8MTc1NTM0MzQyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'كتب',
      categoryEn: 'books',
      stock: 50,
      isHandmade: false,
      origin: 'رام الله، فلسطين',
      originEn: 'Ramallah, Palestine',
      materials: ['ورق عالي الجودة', 'غلاف مقوى'],
      materialsEn: ['High-quality paper', 'Hardcover'],
      careInstructions: ['حفظ في مكان جاف', 'تجنب أشعة الشمس المباشرة'],
      careInstructionsEn: ['Store in dry place', 'Avoid direct sunlight'],
      shippingInfo: 'شحن مجاني للطلبات فوق 50$',
      shippingInfoEn: 'Free shipping for orders over $50',
      donationPercentage: 30,
      isNewArrival: false,
      isBestSeller: true,
      dimensions: '24 × 17 سم',
      dimensionsEn: '24 × 17 cm',
      weight: '0.5 كيلوغرام',
      weightEn: '0.5 kg'
    },
    {
      id: '2',
      name: 'كوفية فلسطينية أصلية',
      nameEn: 'Authentic Palestinian Keffiyeh',
      description: 'كوفية مصنوعة يدوياً بالطريقة التقليدية من قبل حرفيين فلسطينيين',
      descriptionEn: 'Handmade traditional keffiyeh crafted by Palestinian artisans',
      price: 45,
      image: 'https://images.unsplash.com/photo-1657470036063-c7e49da31393?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGVtYnJvaWRlcnklMjB0ZXh0aWxlc3xlbnwxfHx8fDE3NTUzNDI2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'ملابس',
      categoryEn: 'clothing',
      stock: 25,
      isHandmade: true,
      origin: 'الخليل، فلسطين',
      originEn: 'Hebron, Palestine',
      artisan: 'أحمد أبو عيسى',
      artisanEn: 'Ahmed Abu Issa',
      materials: ['قطن طبيعي 100%', 'خيوط ملونة'],
      materialsEn: ['100% Natural cotton', 'Colored threads'],
      careInstructions: ['غسل بالماء البارد', 'تجفيف طبيعي', 'مكواة خفيفة'],
      careInstructionsEn: ['Wash with cold water', 'Air dry', 'Light iron'],
      shippingInfo: 'شحن مجاني للطلبات فوق 50$',
      shippingInfoEn: 'Free shipping for orders over $50',
      donationPercentage: 35,
      isNewArrival: true,
      isBestSeller: false,
      dimensions: '110 × 110 سم',
      dimensionsEn: '110 × 110 cm',
      weight: '0.2 كيلوغرام',
      weightEn: '0.2 kg'
    },
    {
      id: '3',
      name: 'خريطة فلسطين التاريخية',
      nameEn: 'Historical Palestine Map',
      description: 'خريطة مطبوعة عالية الجودة تظهر فلسطين التاريخية بتفاصيلها الجغرافية',
      descriptionEn: 'High-quality printed map showing historical Palestine with geographical details',
      price: 20,
      image: 'https://images.unsplash.com/photo-1562236457-bdc2bec633cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMG1hcmtldCUyMGJhemFhcnxlbnwxfHx8fDE3NTUzNDI2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'فن',
      categoryEn: 'art',
      stock: 30,
      isHandmade: false,
      origin: 'القدس، فلسطين',
      originEn: 'Jerusalem, Palestine',
      materials: ['ورق فوتوغرافي مقاوم للماء'],
      materialsEn: ['Water-resistant photo paper'],
      careInstructions: ['تجنب أشعة الشمس المباشرة', 'تنظيف بقطعة قماش جافة'],
      careInstructionsEn: ['Avoid direct sunlight', 'Clean with dry cloth'],
      shippingInfo: 'شحن مجاني للطلبات فوق 50$',
      shippingInfoEn: 'Free shipping for orders over $50',
      donationPercentage: 25,
      isNewArrival: false,
      isBestSeller: false,
      dimensions: '60 × 40 سم',
      dimensionsEn: '60 × 40 cm',
      weight: '0.1 كيلوغرام',
      weightEn: '0.1 kg'
    },
    {
      id: '4',
      name: 'مفتاح القدس الرمزي',
      nameEn: 'Symbolic Jerusalem Key',
      description: 'مفتاح رمزي مصنوع من الفضة الخالصة يحمل رمزية عودة اللاجئين',
      descriptionEn: 'Symbolic key made of pure silver representing the return of refugees',
      price: 55,
      image: 'https://images.unsplash.com/photo-1655682604613-5c59a1ddd45e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGpld2VscnklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NTUzNDMyMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'إكسسوارات',
      categoryEn: 'accessories',
      stock: 10,
      isHandmade: true,
      origin: 'القدس، فلسطين',
      originEn: 'Jerusalem, Palestine',
      artisan: 'يوسف النجار',
      artisanEn: 'Youssef Al-Najjar',
      materials: ['فضة خالصة 925'],
      materialsEn: ['Pure 925 Silver'],
      careInstructions: ['تنظيف بقطعة قماش ناعمة', 'تجنب المواد الكيميائية'],
      careInstructionsEn: ['Clean with soft cloth', 'Avoid chemicals'],
      shippingInfo: 'شحن مجاني للطلبات فوق 50$',
      shippingInfoEn: 'Free shipping for orders over $50',
      donationPercentage: 40,
      isNewArrival: false,
      isBestSeller: false,
      dimensions: '8 × 3 سم',
      dimensionsEn: '8 × 3 cm',
      weight: '0.05 كيلوغرام',
      weightEn: '0.05 kg'
    },
    {
      id: '5',
      name: 'تطريز فلسطيني يدوي',
      nameEn: 'Handmade Palestinian Embroidery',
      description: 'تطريز تقليدي بخيوط حريرية ملونة يحمل تراث الأمهات والجدات الفلسطينيات',
      descriptionEn: 'Traditional embroidery with colorful silk threads carrying the heritage of Palestinian mothers and grandmothers',
      price: 80,
      image: 'https://images.unsplash.com/photo-1699371829505-e9fdde74e869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNyYWZ0cyUyMHBvdHRlcnl8ZW58MXx8fHwxNzU1MzQyNjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'فن',
      categoryEn: 'art',
      stock: 15,
      isHandmade: true,
      origin: 'رام الله، فلسطين',
      originEn: 'Ramallah, Palestine',
      artisan: 'أم محمد الخليل',
      artisanEn: 'Um Mohammed Al-Khalil',
      materials: ['قماش قطني طبيعي', 'خيوط حريرية', 'خرز ملون'],
      materialsEn: ['Natural cotton fabric', 'Silk threads', 'Colored beads'],
      careInstructions: ['غسل يدوي فقط', 'تجفيف في الظل', 'مكواة من الخلف'],
      careInstructionsEn: ['Hand wash only', 'Dry in shade', 'Iron from back'],
      shippingInfo: 'شحن مجاني للطلبات فوق 50$',
      shippingInfoEn: 'Free shipping for orders over $50',
      donationPercentage: 45,
      isNewArrival: false,
      isBestSeller: true,
      dimensions: '40 × 30 سم',
      dimensionsEn: '40 × 30 cm',
      weight: '0.3 كيلوغرام',
      weightEn: '0.3 kg'
    },
    {
      id: '6',
      name: 'قميص نبض فلسطين',
      nameEn: 'Palestine Pulse T-Shirt',
      description: 'قميص قطني عالي الجودة بتصميم عصري يحمل شعار نبض فلسطين',
      descriptionEn: 'High-quality cotton t-shirt with modern design carrying Palestine Pulse logo',
      price: 30,
      image: 'https://images.unsplash.com/photo-1573470571028-a0ca7a723959?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBlYXN0ZXJuJTIwZm9vZCUyMGN1aXNpbmV8ZW58MXx8fHwxNzU1MzQyNjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'ملابس',
      categoryEn: 'clothing',
      stock: 40,
      isHandmade: false,
      origin: 'غزة، فلسطين',
      originEn: 'Gaza, Palestine',
      materials: ['قطن 100%', 'أحبار صديقة للبيئة'],
      materialsEn: ['100% Cotton', 'Eco-friendly inks'],
      careInstructions: ['غسل في الغسالة بماء بارد', 'مكواة متوسطة الحرارة', 'تجفيف طبيعي'],
      careInstructionsEn: ['Machine wash cold', 'Medium heat iron', 'Air dry'],
      shippingInfo: 'شحن مجاني للطلبات فوق 50$',
      shippingInfoEn: 'Free shipping for orders over $50',
      donationPercentage: 20,
      isNewArrival: true,
      isBestSeller: false,
      dimensions: 'متوفر بجميع المقاسات',
      dimensionsEn: 'Available in all sizes',
      weight: '0.2 كيلوغرام',
      weightEn: '0.2 kg'
    }
  ];

  // Find the product by ID
  const product: Product | undefined = products.find(p => p.id === productId);

  // If product not found, show error page
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'ar' ? 'عذراً، لم نتمكن من العثور على المنتج المطلوب' : 'Sorry, we could not find the requested product'}
          </p>
          <Button onClick={onBackToStore}>
            {language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
          </Button>
        </div>
      </div>
    );
  }

  const productImages = [
    product.image,
    product.image, // In a real app, these would be different angles/views
    product.image
  ];

  const reviews = [
    {
      id: 1,
      name: 'أحمد محمد',
      nameEn: 'Ahmed Mohammed',
      rating: 5,
      comment: language === 'ar' ? 'منتج رائع وجودة عالية جداً. وصل بحالة ممتازة.' : 'Excellent product with very high quality. Arrived in perfect condition.',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      name: 'فاطمة أحمد',
      nameEn: 'Fatima Ahmed',
      rating: 5,
      comment: language === 'ar' ? 'حرفية مذهلة وتصميم جميل. أنصح بشدة!' : 'Amazing craftsmanship and beautiful design. Highly recommend!',
      date: '2024-01-10',
      verified: true
    }
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    const donationAmount = ((product.price * quantity) * product.donationPercentage / 100).toFixed(2);
    toast.success(
      language === 'ar' 
        ? `تم إضافة ${quantity} من ${product.name} إلى السلة • سيتم التبرع بـ $${donationAmount}`
        : `Added ${quantity} ${product.nameEn} to cart • $${donationAmount} will be donated`
    );
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBackToStore}
              className="flex items-center gap-2"
            >
              <ArrowLeft className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
              {language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className={isFavorite ? 'text-palestine-red' : ''}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
              <ImageWithFallback
                src={productImages[currentImageIndex]}
                alt={language === 'ar' ? product.name : product.nameEn}
                className="w-full h-full object-cover"
              />
              
              {productImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNewArrival && (
                  <Badge className="bg-palestine-green text-white">
                    {language === 'ar' ? 'وصل حديثاً' : 'New Arrival'}
                  </Badge>
                )}
                {product.isBestSeller && (
                  <Badge className="bg-palestine-red text-white">
                    {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
                  </Badge>
                )}
                {product.isHandmade && (
                  <Badge variant="outline" className="bg-white/90">
                    {language === 'ar' ? 'صناعة يدوية' : 'Handmade'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index 
                        ? 'border-palestine-red' 
                        : 'border-transparent hover:border-muted-foreground/50'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${language === 'ar' ? product.name : product.nameEn} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="mb-2">
                  {language === 'ar' ? product.category : product.categoryEn}
                </Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">(24 {language === 'ar' ? 'تقييم' : 'reviews'})</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">
                {language === 'ar' ? product.name : product.nameEn}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-palestine-green">${product.price}</span>
                <Badge variant="outline" className="text-palestine-red border-palestine-red">
                  {product.donationPercentage}% {language === 'ar' ? 'تبرع' : 'donation'}
                </Badge>
              </div>

              <p className="text-muted-foreground mb-6">
                {language === 'ar' ? product.description : product.descriptionEn}
              </p>

              {/* Artisan Info */}
              {product.artisan && (
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder-artisan.jpg" />
                        <AvatarFallback className="bg-palestine-green text-white">
                          {(language === 'ar' ? product.artisan : product.artisanEn)?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {language === 'ar' ? 'صُنع بواسطة:' : 'Crafted by:'} {language === 'ar' ? product.artisan : product.artisanEn}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? product.origin : product.originEn}
                        </p>
                      </div>
                      <Award className="h-5 w-5 text-yellow-500 ml-auto" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <span className="text-sm text-muted-foreground">
                  {product.stock} {language === 'ar' ? 'متوفر' : 'in stock'}
                </span>
              </div>

              <div className="flex gap-3 mb-6">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-palestine-green hover:bg-palestine-green-dark"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-palestine-red text-palestine-red hover:bg-palestine-red hover:text-white"
                >
                  {language === 'ar' ? 'اشتر الآن' : 'Buy Now'}
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-lg">
                  <Truck className="h-5 w-5 text-palestine-green mb-2" />
                  <span className="text-xs">{language === 'ar' ? 'شحن سريع' : 'Fast Shipping'}</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-lg">
                  <Shield className="h-5 w-5 text-palestine-red mb-2" />
                  <span className="text-xs">{language === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee'}</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-lg">
                  <Users className="h-5 w-5 text-palestine-black mb-2" />
                  <span className="text-xs">{language === 'ar' ? 'دعم الحرفيين' : 'Support Artisans'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">
                {language === 'ar' ? 'التفاصيل' : 'Details'}
              </TabsTrigger>
              <TabsTrigger value="reviews">
                {language === 'ar' ? 'التقييمات' : 'Reviews'} (24)
              </TabsTrigger>
              <TabsTrigger value="shipping">
                {language === 'ar' ? 'الشحن' : 'Shipping'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">{language === 'ar' ? 'المواد:' : 'Materials:'}</span>
                        <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                          {(language === 'ar' ? product.materials : product.materialsEn).map((material, index) => (
                            <li key={index}>{material}</li>
                          ))}
                        </ul>
                      </div>
                      {product.dimensions && (
                        <div>
                          <span className="font-medium">{language === 'ar' ? 'الأبعاد:' : 'Dimensions:'}</span>
                          <p className="text-sm text-muted-foreground">{language === 'ar' ? product.dimensions : product.dimensionsEn}</p>
                        </div>
                      )}
                      {product.weight && (
                        <div>
                          <span className="font-medium">{language === 'ar' ? 'الوزن:' : 'Weight:'}</span>
                          <p className="text-sm text-muted-foreground">{language === 'ar' ? product.weight : product.weightEn}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">{language === 'ar' ? 'تعليمات العناية:' : 'Care Instructions:'}</span>
                        <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                          {(language === 'ar' ? product.careInstructions : product.careInstructionsEn).map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium">{language === 'ar' ? 'المنشأ:' : 'Origin:'}</span>
                        <p className="text-sm text-muted-foreground">{language === 'ar' ? product.origin : product.originEn}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'تقييمات العملاء' : 'Customer Reviews'}</CardTitle>
                  <CardDescription>
                    {language === 'ar' ? 'آراء عملائنا حول هذا المنتج' : 'What our customers say about this product'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{(language === 'ar' ? review.name : review.nameEn).charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{language === 'ar' ? review.name : review.nameEn}</span>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs">
                              {language === 'ar' ? 'مشتري موثق' : 'Verified Purchase'}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'معلومات الشحن' : 'Shipping Information'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {language === 'ar' ? product.shippingInfo : product.shippingInfoEn}
                  </p>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">{language === 'ar' ? 'أوقات التسليم:' : 'Delivery Times:'}</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>{language === 'ar' ? 'داخل فلسطين: 2-3 أيام عمل' : 'Within Palestine: 2-3 business days'}</li>
                      <li>{language === 'ar' ? 'الدول العربية: 5-7 أيام عمل' : 'Arab countries: 5-7 business days'}</li>
                      <li>{language === 'ar' ? 'دولياً: 10-14 يوم عمل' : 'International: 10-14 business days'}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}