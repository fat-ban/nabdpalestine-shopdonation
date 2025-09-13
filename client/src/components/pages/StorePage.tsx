import { useState } from 'react';
import { Search, Filter, ShoppingCart, Star, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTheme } from '../contexts/ThemeContext';
import { useCart, Product } from '../contexts/CartContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';
import { useGetProductsQuery } from '@/features/products/productApiSlice';
import { LoadingSpinner } from '../LoadingSpinner';

interface StorePageProps {
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'news' | 'support' | 'login' | 'register' | 'dashboard' | 'profile' | 'product-detail') => void;
  onProductSelect: (productId: string) => void;
}

export function StorePage({ onNavigate, onProductSelect }: StorePageProps) {
  const { t, language } = useTheme();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [page, setPage] = useState(1);

  const { data: productsData, isLoading, isFetching, isError, error } = useGetProductsQuery({ page, limit: 10 });

  const products = productsData?.data || [];
  const hasNextPage = productsData?.hasNextPage || false;

  const categories = [
    { id: 'all', name: language === 'ar' ? 'جميع المنتجات' : 'All Products' },
    { id: 'books', name: language === 'ar' ? 'كتب' : 'Books' },
    { id: 'clothing', name: language === 'ar' ? 'ملابس' : 'Clothing' },
    { id: 'accessories', name: language === 'ar' ? 'إكسسوارات' : 'Accessories' },
    { id: 'art', name: language === 'ar' ? 'فن' : 'Art' },
  ];

  const productData = products
    .filter(product => product.category) // Filter out products without a category
    .map(product => ({
      ...product,
      displayName: language === 'ar' ? product.name_ar : product.name_en,
      displayDescription: language === 'ar' ? product.description_ar : product.description_en,
      displayCategory: language === 'ar' ? product.category.name_ar : product.category.name_en,
      originalPrice: Math.floor(product.price * 1.3),
      rating: product.average_rating || 0,
      reviews: product.ratings_count || 0,
      badge: product.is_best_seller 
        ? (language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller')
        : product.is_new_arrival 
        ? (language === 'ar' ? 'جديد' : 'New') 
        : null
    }));

  const filteredProducts = productData.filter((product) => {
    const matchesSearch = product.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.displayDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.name_en.toLowerCase() === selectedCategory;
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'low' && product.price < 30) ||
                        (priceRange === 'medium' && product.price >= 30 && product.price < 60) ||
                        (priceRange === 'high' && product.price >= 60);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleAddToCart = (product: Product) => {
    if (!addToCart) {
      toast.error(t('cartNotAvailable'));
      return;
    }
    try {
      addToCart(product, 1);
      const donationAmount = ((product.price * 1) * product.donation_percentage / 100).toFixed(2);
      toast.success(
        language === 'ar' 
          ? `تم إضافة ${product.name_ar} إلى السلة • سيتم التبرع بـ ${donationAmount}`
          : `Added ${product.name_en} to cart • ${donationAmount} will be donated`
      );
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(t('addToCartError'));
    }
  };

  const handleViewProduct = (productId: string) => {
    onProductSelect(productId);
    onNavigate('product-detail');
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
        setPage(prevPage => prevPage + 1);
    }
  }

  if (isLoading && page === 1) {
      return <LoadingSpinner />
  }

  if (isError) {
    console.error("Error fetching products:", error);
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('errorFetchingProducts')}</h2>
        <p className="text-muted-foreground mb-4">{t('errorFetchingProductsMessage')}</p>
        <pre className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

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
                placeholder={t('searchProducts')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10'}`}
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('category')} />
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
                <SelectValue placeholder={t('price')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allPrices')}</SelectItem>
                <SelectItem value="low">{t('under30')}</SelectItem>
                <SelectItem value="medium">{t('price30to60')}</SelectItem>
                <SelectItem value="high">{t('over60')}</SelectItem>
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
              {t('clearFilters')}
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
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
                    src={product.image_url}
                    alt={product.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
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
                
                {product.badge && (
                  <Badge className="absolute top-2 left-2 bg-palestine-red text-white">
                    {product.badge}
                  </Badge>
                )}
                
                <Badge 
                  variant="outline" 
                  className="absolute top-2 right-2 bg-white/90 text-palestine-green border-palestine-green"
                >
                  {product.donation_percentage}% {t('donation')}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>

                <h3 className="font-semibold mb-2 group-hover:text-palestine-red transition-colors">
                  {product.displayName}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {product.displayDescription}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-palestine-red">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  
                  <Button 
                    size="sm"
                    className="bg-palestine-green hover:bg-palestine-green-dark text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (originalProduct) {
                        handleAddToCart(originalProduct);
                      } else {
                        toast.error(t('productNotFound'));
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

        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('noProductsFound')}</h3>
            <p className="text-muted-foreground">{t('tryChangingFilters')}</p>
          </div>
        )}

        {hasNextPage && (
            <div className="text-center mt-8">
                <Button onClick={handleLoadMore} disabled={isFetching}>
                    {isFetching ? t('loading') : t('loadMore')}
                </Button>
            </div>
        )}

        {/* Impact Section */}
        <section className="mt-16 bg-palestine-green-50 dark:bg-palestine-green-dark/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-palestine-green-dark">{t('purchaseImpactTitle')}</h2>
          <p className="text-lg text-muted-foreground mb-6">{t('purchaseImpactDescription')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-palestine-green-dark mb-2">75%</div>
              <div className="text-sm text-muted-foreground">{t('familySupport')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-palestine-green-dark mb-2">20%</div>
              <div className="text-sm text-muted-foreground">{t('education')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-palestine-green-dark mb-2">5%</div>
              <div className="text-sm text-muted-foreground">{t('platformOperations')}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}