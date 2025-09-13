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
  Minus,
  Edit,
  Trash2
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
import { useGetProductQuery } from '../../../features/products/productApiSlice';
import { 
    useFindAllCommentsQuery, 
    useCreateCommentMutation, 
    useUpdateCommentMutation, 
    useRemoveCommentMutation 
} from '../../../features/comments/commentsApiSlice';
import { 
    useGetProductAverageRatingQuery,
    useFindAllRatingsQuery,
    useGetUserProductRatingQuery,
    useCreateRatingMutation,
    useUpdateRatingMutation,
    useRemoveRatingMutation
} from '../../../features/ratings/ratingsApiSlice';
import { LoadingSpinner } from '../LoadingSpinner';
import { Textarea } from '../ui/textarea';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectCurrentUser } from '../../../features/auth/authSlice';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'news' | 'support' | 'login' | 'register' | 'dashboard' | 'profile' | 'product-detail') => void;
  onBackToStore: () => void;
}

export function ProductDetailPage({ productId, onNavigate, onBackToStore }: ProductDetailPageProps) {
  const { language } = useTheme();
  const { addToCart } = useCart();
  const user = useAppSelector(selectCurrentUser);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [ratingsPage, setRatingsPage] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [userRating, setUserRating] = useState(0);

  const { data: product, isLoading, isError } = useGetProductQuery(productId);
  const { data: commentsData, isLoading: isLoadingComments, isFetching: isFetchingComments } = useFindAllCommentsQuery({ page: commentsPage, limit: 5, product: productId });
  const { data: avgRatingData } = useGetProductAverageRatingQuery(productId);
  const { data: ratingsData, isLoading: isLoadingRatings, isFetching: isFetchingRatings } = useFindAllRatingsQuery({ page: ratingsPage, limit: 5, product: productId });
  const { data: userProductRating } = useGetUserProductRatingQuery({ productId, userId: user?.id }, { skip: !user });

  const [createComment] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [removeComment] = useRemoveCommentMutation();
  const [createRating] = useCreateRatingMutation();
  const [updateRating] = useUpdateRatingMutation();
  const [removeRating] = useRemoveRatingMutation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !product) {
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
    product.image_url,
    product.image_url, // In a real app, these would be different angles/views
    product.image_url
  ];

  const reviews = commentsData?.data || [];
  const ratings = ratingsData?.data || [];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    const donationAmount = ((product.price * quantity) * product.donation_percentage / 100).toFixed(2);
    toast.success(
      language === 'ar' 
        ? `تم إضافة ${quantity} من ${product.name_ar} إلى السلة • سيتم التبرع بـ $${donationAmount}`
        : `Added ${quantity} ${product.name_en} to cart • $${donationAmount} will be donated`
    );
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleLoadMoreComments = () => {
    setCommentsPage(prevPage => prevPage + 1);
  }

  const handleLoadMoreRatings = () => {
    setRatingsPage(prevPage => prevPage + 1);
  }

  const handleCreateComment = async () => {
      if(newComment.trim() !== '') {
          await createComment({ content: newComment, product: productId, user: user.id });
          setNewComment('');
      }
  }

  const handleUpdateComment = async (comment) => {
    if (editingComment && editingComment.id === comment.id) {
        await updateComment({ id: comment.id, content: comment.content });
        setEditingComment(null);
    }
  };

  const handleRemoveComment = async (id) => {
      await removeComment(id);
  }

  const handleCreateRating = async () => {
    if (userRating > 0) {
        await createRating({ rating: userRating, product: productId, user: user.id });
    }
  }

  const handleUpdateRating = async () => {
      if (userProductRating) {
          await updateRating({ id: userProductRating.id, rating: userRating });
      }
  }

  const handleRemoveRating = async (id) => {
      await removeRating(id);
  }

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
                alt={language === 'ar' ? product.name_ar : product.name_en}
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
                {product.is_new_arrival && (
                  <Badge className="bg-palestine-green text-white">
                    {language === 'ar' ? 'وصل حديثاً' : 'New Arrival'}
                  </Badge>
                )}
                {product.is_best_seller && (
                  <Badge className="bg-palestine-red text-white">
                    {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
                  </Badge>
                )}
                {product.is_handmade && (
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
                      alt={`${language === 'ar' ? product.name_ar : product.name_en} ${index + 1}`}
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
                  {language === 'ar' ? product.category.name_ar : product.category.name_en}
                </Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < (avgRatingData?.average_rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">({avgRatingData?.ratings_count || 0} {language === 'ar' ? 'تقييم' : 'reviews'})</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">
                {language === 'ar' ? product.name_ar : product.name_en}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-palestine-green">${product.price}</span>
                <Badge variant="outline" className="text-palestine-red border-palestine-red">
                  {product.donation_percentage}% {language === 'ar' ? 'تبرع' : 'donation'}
                </Badge>
              </div>

              <p className="text-muted-foreground mb-6">
                {language === 'ar' ? product.description_ar : product.description_en}
              </p>

              {/* Artisan Info */}
              {product.artisan && (
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder-artisan.jpg" />
                        <AvatarFallback className="bg-palestine-green text-white">
                          {(language === 'ar' ? product.artisan.name_ar : product.artisan.name_en)?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {language === 'ar' ? 'صُنع بواسطة:' : 'Crafted by:'} {language === 'ar' ? product.artisan.name_ar : product.artisan.name_en}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? product.origin_ar : product.origin_en}
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
                    disabled={quantity >= product.stock_quantity}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <span className="text-sm text-muted-foreground">
                  {product.stock_quantity} {language === 'ar' ? 'متوفر' : 'in stock'}
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
                {language === 'ar' ? 'التقييمات' : 'Reviews'} ({ratings.length})
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
                          {(language === 'ar' ? product.materials_ar : product.materials_en).map((material, index) => (
                            <li key={index}>{material}</li>
                          ))}
                        </ul>
                      </div>
                      {product.dimensions_ar && (
                        <div>
                          <span className="font-medium">{language === 'ar' ? 'الأبعاد:' : 'Dimensions:'}</span>
                          <p className="text-sm text-muted-foreground">{language === 'ar' ? product.dimensions_ar : product.dimensions_en}</p>
                        </div>
                      )}
                      {product.weight_ar && (
                        <div>
                          <span className="font-medium">{language === 'ar' ? 'الوزن:' : 'Weight:'}</span>
                          <p className="text-sm text-muted-foreground">{language === 'ar' ? product.weight_ar : product.weight_en}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">{language === 'ar' ? 'تعليمات العناية:' : 'Care Instructions:'}</span>
                        <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                          {(language === 'ar' ? product.care_instructions_ar : product.care_instructions_en).map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium">{language === 'ar' ? 'المنشأ:' : 'Origin:'}</span>
                        <p className="text-sm text-muted-foreground">{language === 'ar' ? product.origin_ar : product.origin_en}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Ratings & Reviews</CardTitle>
                        <CardDescription>See what other customers think about this product.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user && (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Your Rating</h3>
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`h-6 w-6 cursor-pointer ${i < (userRating || userProductRating?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                                            onClick={() => setUserRating(i + 1)}
                                        />
                                    ))}
                                </div>
                                <Button onClick={userProductRating ? handleUpdateRating : handleCreateRating}>
                                    {userProductRating ? 'Update Rating' : 'Submit Rating'}
                                </Button>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <Textarea 
                                placeholder={language === 'ar' ? 'أضف تعليقك' : 'Add your comment'}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button onClick={handleCreateComment} className="self-end">
                                {language === 'ar' ? 'إرسال' : 'Submit'}
                            </Button>
                        </div>
                        {isLoadingRatings && <p>Loading ratings...</p>}
                        {ratings.map((rating) => (
                            <div key={rating.id} className="border-b border-border pb-4 last:border-b-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{(language === 'ar' ? rating.user.name : rating.user.name).charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{language === 'ar' ? rating.user.name : rating.user.name}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{new Date(rating.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`h-4 w-4 ${i < rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                                    />
                                    ))}
                                </div>
                                {user && user.id === rating.user.id && (
                                    <Button onClick={() => handleRemoveRating(rating.id)} variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                                )}
                            </div>
                        ))}
                        {ratingsData?.hasNextPage && (
                            <Button onClick={handleLoadMoreRatings} disabled={isFetchingRatings}>
                                {isFetchingRatings ? 'Loading...' : 'Load More Ratings'}
                            </Button>
                        )}
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
                    {language === 'ar' ? product.shipping_info_ar : product.shipping_info_en}
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