import { useState } from 'react';
import { Search, Filter, Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTheme } from '../contexts/ThemeContext';
import { useCart, Product } from '../contexts/CartContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';

interface StorePageProps {
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'news' | 'support' | 'login' | 'register' | 'dashboard' | 'profile' | 'product-detail') => void;
  onProductSelect: (productId: string) => void;
}

export function StorePage({ onNavigate, onProductSelect }: StorePageProps) {
  const { t, language } = useTheme();
  const cartContext = useCart();
  const { addToCart } = cartContext;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Debug log to check if cart context is available
  console.log('Cart context available:', !!cartContext);

  const categories = [
    { id: 'all', name: language === 'ar' ? 'جميع المنتجات' : 'All Products' },
    { id: 'books', name: language === 'ar' ? 'كتب' : 'Books' },
    { id: 'clothing', name: language === 'ar' ? 'ملابس' : 'Clothing' },
    { id: 'accessories', name: language === 'ar' ? 'إكسسوارات' : 'Accessories' },
    { id: 'art', name: language === 'ar' ? 'فن' : 'Art' },
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'كتاب تاريخ فلسطين',
      nameEn: 'History of Palestine Book',
      description: 'كتاب شامل عن تاريخ فلسطين العريق',
      descriptionEn: 'Comprehensive book about Palestinian history',
      price: 25,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGVkdWNhdGlvbiUyMGxlYXJuaW5nfGVufDF8fHx8MTc1NTM0MzQyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'كتب',
      categoryEn: 'books',
      stock: 50,
      isHandmade: false,
      origin: 'رام الله، فلسطين',
      originEn: 'Ramallah, Palestine',
      materials: ['ورق عالي الجودة'],
      materialsEn: ['High-quality paper'],
      careInstructions: ['حفظ في مكان جاف'],
      careInstructionsEn: ['Store in dry place'],
      shippingInfo: 'شحن مجاني للطلبات فوق 50$',
      shippingInfoEn: 'Free shipping for orders over $50',
      donationPercentage: 30,
      isNewArrival: false,
      isBestSeller: true
    },
    {
      id: '2',
      name: 'كوفية فلسطينية أصلية',
      nameEn: 'Authentic Palestinian Keffiyeh',
      description: 'كوفية مصنوعة يدوياً بالطريقة التقليدية',
      descriptionEn: 'Handmade traditional keffiyeh',
      price: 45,
      image: 'https://images.unsplash.com/photo-1657470036063-c7e49da31393?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGVtYnJvaWRlcnklMjB0ZXh0aWxlc3xlbnwxfHx8fDE3NTUzNDI2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'ملابس',
      categoryEn: 'clothing',
      stock: 25,
      isHandmade: true,
      origin: 'الخليل، فلسطين',
      originEn: 'Hebron, Palestine',
      materials: ['قطن طبيعي', 'خيوط ملونة'],
      materialsEn: ['Natural cotton', 'Colored threads'],
      careInstructions: ['غسل بالماء البارد', 'تجفيف طبيعي'],
      careInstructionsEn: ['Wash with cold water', 'Air dry'],
      shippingInfo: 'شحن مجاني للطلبات فوق 50$',
      shippingInfoEn: 'Free shipping for orders over $50',
      donationPercentage: 35,
      isNewArrival: true,
      isBestSeller: false
    },
    {
      id: '3',
      name: 'خريطة فلسطين التاريخية',
      nameEn: 'Historical Palestine Map',
      description: 'خريطة مطبوعة عالية الجودة',
      descriptionEn: 'High-quality printed map',
      price: 20,
      image: 'https://images.unsplash.com/photo-1562236457-bdc2bec633cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMG1hcmtldCUyMGJhemFhcnxlbnwxfHx8fDE3NTUzNDI2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'فن',
      categoryEn: 'art',
      stock: 30,
      isHandmade: false,
      origin: 'القدس، فلسطين',
      originEn: 'Jerusalem, Palestine',
      materials: ['ورق فوتوغرافي'],
      materialsEn: ['Photo paper'],
      careInstructions: ['تجنب أشعة الشمس المباشرة'],
      careInstructionsEn: ['Avoid direct sunlight'],
      shippingInfo: 'شحن مجاني للطلبات فوق 50$',
      shippingInfoEn: 'Free shipping for orders over $50',
      donationPercentage: 25,
      isNewArrival: false,
      isBestSeller: false
    },
    {
      id: '4',
      name: 'مفتاح القدس الرمزي',
      nameEn: 'Symbolic Jerusalem Key',
      description: 'مفتاح رمزي مصنوع من الفضة',
      descriptionEn: 'Symbolic key made of silver',
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
      materials: ['فضة خالصة'],
      materialsEn: ['Pure silver'],
      careInstructions: ['تنظيف بقطعة قماش ناعمة'],
      careInstructionsEn: ['Clean with soft cloth'],
      shippingInfo: 'شحن مجاني للطلبات فوق 50$',
      shippingInfoEn: 'Free shipping for orders over $50',
      donationPercentage: 40,
      isNewArrival: false,
      isBestSeller: false
    },
    {
      id: '5',
      name: 'تطريز فلسطيني يدوي',
      nameEn: 'Handmade Palestinian Embroidery',
      description: 'تطريز تقليدي بخيوط ملونة',
      descriptionEn: 'Traditional embroidery with colorful threads',
      price: 80,
      image: 'https://images.unsplash.com/photo-1699371829505-e9fdde74e869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNyYWZ0cyUyMHBvdHRlcnl8ZW58MXx8fHwxNzU1MzQyNjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'فن',
      categoryEn: 'art',
      stock: 15,
      isHandmade: true,
      origin: 'رام الله، فلسطين',
      originEn: 'Ramallah, Palestine',
      artisan: 'أم محمد',
      artisanEn: 'Um Mohammed',
      materials: ['قماش قطني', 'خيوط حريرية'],
      materialsEn: ['Cotton fabric', 'Silk threads'],
      careInstructions: ['غسل يدوي فقط', 'تجفيف في الظل'],
      careInstructionsEn: ['Hand wash only', 'Dry in shade'],
      shippingInfo: 'شحن مجاني للطلبات فوق 50$',
      shippingInfoEn: 'Free shipping for orders over $50',
      donationPercentage: 45,
      isNewArrival: false,
      isBestSeller: true
    },
    {
      id: '6',
      name: 'قميص نبض فلسطين',
      nameEn: 'Palestine Pulse T-Shirt',
      description: 'قميص قطني عالي الجودة',
      descriptionEn: 'High-quality cotton t-shirt',
      price: 30,
      image: 'https://images.unsplash.com/photo-1573470571028-a0ca7a723959?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBlYXN0ZXJuJTIwZm9vZCUyMGN1aXNpbmV8ZW58MXx8fHwxNzU1MzQyNjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'ملابس',
      categoryEn: 'clothing',
      stock: 40,
      isHandmade: false,
      origin: 'غزة، فلسطين',
      originEn: 'Gaza, Palestine',
      materials: ['قطن 100%'],
      materialsEn: ['100% Cotton'],
      careInstructions: ['غسل في الغسالة', 'مكواة متوسطة الحرارة'],
      careInstructionsEn: ['Machine wash', 'Medium heat iron'],
      shippingInfo: 'شحن مجاني للطلبات فوق 50$',
      shippingInfoEn: 'Free shipping for orders over $50',
      donationPercentage: 20,
      isNewArrival: true,
      isBestSeller: false
    }
  ];

  const productData = products.map(product => ({
    ...product,
    displayName: language === 'ar' ? product.name : product.nameEn,
    displayDescription: language === 'ar' ? product.description : product.descriptionEn,
    displayCategory: language === 'ar' ? product.category : product.categoryEn,
    originalPrice: Math.floor(product.price * 1.3), // Calculate original price for display
    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5
    reviews: Math.floor(Math.random() * 100) + 20, // Random reviews between 20-120
    badge: product.isBestSeller 
      ? (language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller')
      : product.isNewArrival 
      ? (language === 'ar' ? 'جديد' : 'New') 
      : null
  }));

  const filteredProducts = productData.filter((product) => {
    const matchesSearch = product.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.displayDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryEn === selectedCategory;
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'low' && product.price < 30) ||
                        (priceRange === 'medium' && product.price >= 30 && product.price < 60) ||
                        (priceRange === 'high' && product.price >= 60);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleAddToCart = (product: Product) => {
    console.log('handleAddToCart called with:', product.name);
    
    if (!addToCart) {
      console.error('addToCart function is not available');
      toast.error('Cart is not available');
      return;
    }
    try {
      addToCart(product, 1);
      const donationAmount = ((product.price * 1) * product.donationPercentage / 100).toFixed(2);
      toast.success(
        language === 'ar' 
          ? `تم إضافة ${product.name} إلى السلة • سيتم التبرع بـ ${donationAmount}`
          : `Added ${product.nameEn} to cart • ${donationAmount} will be donated`
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(
        language === 'ar' 
          ? 'حدث خطأ في إضافة المنتج للسلة'
          : 'Error adding product to cart'
      );
    }
  };

  const handleViewProduct = (productId: string) => {
    console.log('handleViewProduct called with productId:', productId);
    onProductSelect(productId);
    onNavigate('product-detail');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-palestine-red via-palestine-white to-palestine-green py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-palestine-black">
            {t('storeTitle')}
          </h1>
          <p className="text-xl text-palestine-black max-w-3xl mx-auto">
            {t('storeDescription')}
          </p>
          <Badge className="mt-4 bg-palestine-red text-white px-4 py-2">
            {language === 'ar' ? '100% من الأرباح تذهب للتبرع' : '100% of profits go to donations'}
          </Badge>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-card rounded-lg p-6 mb-8 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={language === 'ar' ? 'ابحث عن المنتجات...' : 'Search products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10'}`}
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'الفئة' : 'Category'} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'السعر' : 'Price'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'ar' ? 'جميع الأسعار' : 'All Prices'}
                </SelectItem>
                <SelectItem value="low">
                  {language === 'ar' ? 'أقل من $30' : 'Under $30'}
                </SelectItem>
                <SelectItem value="medium">
                  {language === 'ar' ? '$30 - $60' : '$30 - $60'}
                </SelectItem>
                <SelectItem value="high">
                  {language === 'ar' ? 'أكثر من $60' : 'Over $60'}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            // Find the original product data for cart operations
            const originalProduct = products.find(p => p.id === product.id);
            if (!originalProduct) return null;
            
            return (
            <Card 
              key={product.id} 
              className="group hover:shadow-lg hover:shadow-palestine-red/20 transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02] hover:border-palestine-red/30 active:scale-[0.98]"
              onClick={() => handleViewProduct(product.id)}
            >
              <div className="relative">
                <div className="aspect-square relative overflow-hidden">
                  <ImageWithFallback 
                    src={product.image}
                    alt={product.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button 
                      className="bg-white text-palestine-red hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProduct(product.id);
                      }}
                    >
                      {t('viewProduct')}
                    </Button>
                  </div>
                </div>
                
                {/* Product Badge */}
                {product.badge && (
                  <Badge className="absolute top-2 left-2 bg-palestine-red text-white">
                    {product.badge}
                  </Badge>
                )}
                
                {/* Donation Badge */}
                <Badge 
                  variant="outline" 
                  className="absolute top-2 right-2 bg-white/90 text-palestine-green border-palestine-green"
                >
                  {product.donationPercentage}% {language === 'ar' ? 'تبرع' : 'donation'}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews})
                  </span>
                </div>

                <h3 className="font-semibold mb-2 group-hover:text-palestine-red transition-colors">
                  {product.displayName}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {product.displayDescription}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-palestine-red">
                      ${product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    size="sm"
                    className="bg-palestine-green hover:bg-palestine-green-dark text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Button clicked for product:', product.displayName);
                      if (originalProduct) {
                        handleAddToCart(originalProduct);
                      } else {
                        console.error('Original product not found for:', product.id);
                        toast.error('Product not found');
                      }
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t('addToCart')}
                  </Button>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {language === 'ar' ? 'لا توجد منتجات' : 'No Products Found'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'حاول تغيير الفلاتر أو البحث بكلمات أخرى'
                : 'Try changing the filters or search terms'
              }
            </p>
          </div>
        )}

        {/* Impact Section */}
        <section className="mt-16 bg-palestine-green-50 dark:bg-palestine-green-dark/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-palestine-green-dark">
            {language === 'ar' ? 'أثر مشترياتك' : 'Your Purchase Impact'}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {language === 'ar' 
              ? 'كل عملية شراء تساهم في دعم العائلات الفلسطينية والمؤسسات التعليمية'
              : 'Every purchase contributes to supporting Palestinian families and educational institutions'
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-palestine-green-dark mb-2">75%</div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'دعم العائلات' : 'Family Support'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-palestine-green-dark mb-2">20%</div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'التعليم' : 'Education'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-palestine-green-dark mb-2">5%</div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'تشغيل المنصة' : 'Platform Operations'}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}