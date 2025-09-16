import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft, CreditCard, Truck, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CartPageProps {
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'organizations' | 'support' | 'login' | 'register' | 'dashboard' | 'profile' | 'product-detail' | 'admin-dashboard' | 'user-account' | 'cart') => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const { language } = useTheme();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cartItems !== undefined) {
      setIsLoading(false);
    }
  }, [cartItems]);

  const handleCheckout = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(language === 'ar' ? 'تم الطلب بنجاح!' : 'Order placed successfully!');
    clearCart();
    onNavigate('store');
    setIsProcessing(false);
  };

  const cartTotal = getCartTotal ? getCartTotal() : 0;
  const shippingCost = cartTotal > 100 ? 0 : 10;
  const totalWithShipping = cartTotal + shippingCost;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-palestine-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => onNavigate('store')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
            </Button>
            <h1 className="text-3xl font-bold text-palestine-green">
              {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
            </h1>
            <div></div>
          </div>
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {language === 'ar' 
                ? 'اكتشف منتجاتنا الفلسطينية الأصيلة وأضفها إلى سلة التسوق'
                : 'Discover our authentic Palestinian products and add them to your cart'
              }
            </p>
            <Button 
              onClick={() => onNavigate('store')}
              className="bg-palestine-green hover:bg-palestine-green-dark"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('store')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
          </Button>
          <h1 className="text-3xl font-bold text-palestine-green">
            {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
          </h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {cartItems.length} {language === 'ar' ? 'منتج' : 'items'}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={`${item.id}-${JSON.stringify(item.selectedOptions)}`} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={language === 'ar' ? item.nameAr : item.nameEn}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">
                        {language === 'ar' ? item.nameAr : item.nameEn}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                      </p>
                      
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {Object.entries(item.selectedOptions).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedOptions)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedOptions)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="text-right">
                            <div className="font-bold text-lg text-palestine-green">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-xs text-muted-foreground">
                                ${item.price.toFixed(2)} {language === 'ar' ? 'لكل قطعة' : 'each'}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id, item.selectedOptions)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 sticky top-8">
              <CardHeader className="bg-gradient-to-r from-palestine-green to-palestine-red text-white">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CreditCard className="h-5 w-5" />
                  <span>{language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'الشحن:' : 'Shipping:'}</span>
                    <span className={`font-medium ${shippingCost === 0 ? 'text-palestine-green' : ''}`}>
                      {shippingCost === 0 ? (language === 'ar' ? 'مجاني' : 'Free') : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {shippingCost > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' 
                        ? `أضف ${(100 - cartTotal).toFixed(2)}$ أخرى للحصول على شحن مجاني`
                        : `Add ${(100 - cartTotal).toFixed(2)} more for free shipping`
                      }
                    </p>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>{language === 'ar' ? 'المجموع:' : 'Total:'}</span>
                    <span className="text-palestine-green">${totalWithShipping.toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-palestine-green" />
                      <span>{language === 'ar' ? 'دفع آمن 100%' : '100% Secure Payment'}</span>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                      <Truck className="h-4 w-4 text-palestine-green" />
                      <span>{language === 'ar' ? 'شحن سريع' : 'Fast Shipping'}</span>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                      <Heart className="h-4 w-4 text-palestine-red" />
                      <span>{language === 'ar' ? 'دعم القضية' : 'Support the Cause'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full bg-palestine-green hover:bg-palestine-green-dark"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          {language === 'ar' ? 'إتمام الطلب' : 'Checkout'}
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => onNavigate('store')}
                      className="w-full"
                    >
                      {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}