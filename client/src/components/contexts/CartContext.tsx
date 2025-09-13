import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  image: string;
  description: string;
  descriptionEn: string;
  category: string;
  categoryEn: string;
  stock: number;
  isHandmade: boolean;
  origin: string;
  originEn: string;
  artisan?: string;
  artisanEn?: string;
  materials: string[];
  materialsEn: string[];
  dimensions?: string;
  dimensionsEn?: string;
  weight?: string;
  weightEn?: string;
  careInstructions: string[];
  careInstructionsEn: string[];
  shippingInfo: string;
  shippingInfoEn: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  donationPercentage: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedOptions?: Record<string, string>;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedOptions?: Record<string, string>) => void;
  removeFromCart: (productId: string, selectedOptions?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, selectedOptions?: Record<string, string>) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getTotalDonation: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('palestine-pulse-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem('palestine-pulse-cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('palestine-pulse-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1, selectedOptions: Record<string, string> = {}) => {
    console.log('CartContext addToCart called with:', product.name, 'quantity:', quantity);
    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && 
        JSON.stringify(item.selectedOptions || {}) === JSON.stringify(selectedOptions)
      );
      
      if (existingItem) {
        console.log('Product exists, updating quantity');
        return prev.map(item =>
          item.id === product.id && 
          JSON.stringify(item.selectedOptions || {}) === JSON.stringify(selectedOptions)
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      
      console.log('Adding new product to cart');
      return [...prev, { ...product, quantity: Math.min(quantity, product.stock), selectedOptions }];
    });
  };

  const removeFromCart = (productId: string, selectedOptions?: Record<string, string>) => {
    setCartItems(prev => {
      if (selectedOptions) {
        return prev.filter(item => 
          !(item.id === productId && 
            JSON.stringify(item.selectedOptions || {}) === JSON.stringify(selectedOptions))
        );
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number, selectedOptions?: Record<string, string>) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedOptions);
      return;
    }

    setCartItems(prev =>
      prev.map(item => {
        if (selectedOptions) {
          return item.id === productId && 
                 JSON.stringify(item.selectedOptions || {}) === JSON.stringify(selectedOptions)
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item;
        }
        return item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getTotalDonation = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      return total + (itemTotal * item.donationPercentage / 100);
    }, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getTotalDonation
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

