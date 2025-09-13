import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Language = 'ar' | 'en';

interface ThemeContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const translations = {
  ar: {
    // Header
    home: 'الرئيسية',
    store: 'المتجر',
    donate: 'التبرع',
    about: 'من نحن',
    news: 'الأخبار',
    support: 'الدعم الفني',
    
    // Hero Section
    heroTitle: 'نبض فلسطين',
    heroSubtitle: 'منصة إعلام مقاومة رقمية ومحور تضامن ذكي',
    heroDescription: 'كل عملية شراء هي تبرع لدعم فلسطين',
    startShopping: 'ابدأ التسوق',
    donateNow: 'تبرع الآن',
    
    // Features
    transparentDonations: 'تبرعات شفافة',
    transparentDonationsDesc: 'تتبع تبرعاتك بالذكاء الاصطناعي والبلوكشين',
    culturalHeritage: 'التراث الثقافي',
    culturalHeritageDesc: 'اكتشف وادعم الثقافة الفلسطينية الأصيلة',
    educationalCourses: 'دورات تعليمية',
    educationalCoursesDesc: 'تعلم مجاناً عن التاريخ والثقافة الفلسطينية',
    
    // Store
    storeTitle: 'متجر نبض فلسطين',
    storeDescription: 'كل مشترياتك تتحول إلى تبرعات لدعم القضية الفلسطينية',
    viewProduct: 'عرض المنتج',
    addToCart: 'أضف للسلة',
    searchProducts: 'ابحث عن المنتجات...',
    category: 'الفئة',
    price: 'السعر',
    allPrices: 'جميع الأسعار',
    under30: 'أقل من 30 دولار',
    price30to60: '30 - 60 دولار',
    over60: 'أكثر من 60 دولار',
    clearFilters: 'مسح الفلاتر',
    noProductsFound: 'لم يتم العثور على منتجات',
    tryChangingFilters: 'حاول تغيير الفلاتر أو مصطلحات البحث',
    errorFetchingProducts: 'خطأ في جلب المنتجات',
    errorFetchingProductsMessage: 'حدث خطأ ما أثناء جلب المنتجات. الرجاء المحاولة مرة أخرى في وقت لاحق.',
    productNotFound: 'المنتج غير موجود',
    cartNotAvailable: 'السلة غير متوفرة',
    addToCartError: 'خطأ في إضافة المنتج إلى السلة',
    donation: 'تبرع',
    loading: 'جار التحميل...',
    loadMore: 'تحميل المزيد',
    purchaseImpactTitle: 'أثر مشترياتك',
    purchaseImpactDescription: 'كل عملية شراء تساهم في دعم العائلات الفلسطينية والمؤسسات التعليمية.',
    familySupport: 'دعم العائلات',
    education: 'التعليم',
    platformOperations: 'عمليات المنصة',

    // Donate
    donateTitle: 'التبرع المباشر',
    donateDescription: 'ادعم القضية الفلسطينية بتبرع مباشر وشفاف',
    donateAmount: 'مبلغ التبرع',
    donateButton: 'تبرع الآن',
    
    // About
    aboutTitle: 'من نحن',
    aboutDescription: 'نحن منصة رقمية تهدف لدعم فلسطين من خلال التجارة الشفافة والإعلام المقاوم',
    
    // News
    newsTitle: 'الأخبار',
    newsDescription: 'آخر الأخبار والتحديثات حول فلسطين والقضية الفلسطينية',
    
    // Support
    supportTitle: 'الدعم الفني',
    supportDescription: 'نحن هنا لمساعدتك، تواصل معنا لأي استفسار',
    
    // Footer
    footerDescription: 'منصة نبض فلسطين - كل عملية شراء هي تبرع لدعم فلسطين',
    quickLinks: 'روابط سريعة',
    contactUs: 'اتصل بنا',
    followUs: 'تابعنا',
    
    // Chatbot
    chatbotTitle: 'المساعد الذكي',
    chatbotDescription: 'اسأل المساعد الذكي عن أي شيء متعلق بالمنصة',
    askQuestion: 'اطرح سؤالك...',
    send: 'إرسال',
    
    // Authentication
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
    dashboard: 'لوحة التحكم',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم',
    welcomeBack: 'مرحباً بك مرة أخرى',
    createAccount: 'إنشاء حساب جديد',
  },
  en: {
    // Header
    home: 'Home',
    store: 'Store',
    donate: 'Donate',
    about: 'About',
    news: 'News',
    support: 'Support',
    
    // Hero Section
    heroTitle: 'Palestine Pulse',
    heroSubtitle: 'Digital Resistance Media Platform & Smart Solidarity Hub',
    heroDescription: 'Every purchase is a donation to support Palestine',
    startShopping: 'Start Shopping',
    donateNow: 'Donate Now',
    
    // Features
    transparentDonations: 'Transparent Donations',
    transparentDonationsDesc: 'Track your donations with AI and blockchain technology',
    culturalHeritage: 'Cultural Heritage',
    culturalHeritageDesc: 'Discover and support authentic Palestinian culture',
    educationalCourses: 'Educational Courses',
    educationalCoursesDesc: 'Learn about Palestinian history and culture for free',
    
    // Store
    storeTitle: 'Palestine Pulse Store',
    storeDescription: 'All your purchases convert to donations supporting the Palestinian cause',
    viewProduct: 'View Product',
    addToCart: 'Add to Cart',
    searchProducts: 'Search products...',
    category: 'Category',
    price: 'Price',
    allPrices: 'All Prices',
    under30: 'Under $30',
    price30to60: '$30 - $60',
    over60: 'Over $60',
    clearFilters: 'Clear Filters',
    noProductsFound: 'No Products Found',
    tryChangingFilters: 'Try changing the filters or search terms',
    errorFetchingProducts: 'Error Fetching Products',
    errorFetchingProductsMessage: 'An error occurred while fetching products. Please try again later.',
    productNotFound: 'Product not found',
    cartNotAvailable: 'Cart is not available',
    addToCartError: 'Error adding product to cart',
    donation: 'donation',
    loading: 'Loading...',
    loadMore: 'Load More',
    purchaseImpactTitle: 'Your Purchase Impact',
    purchaseImpactDescription: 'Every purchase contributes to supporting Palestinian families and educational institutions.',
    familySupport: 'Family Support',
    education: 'Education',
    platformOperations: 'Platform Operations',

    // Donate
    donateTitle: 'Direct Donation',
    donateDescription: 'Support the Palestinian cause with direct and transparent donations',
    donateAmount: 'Donation Amount',
    donateButton: 'Donate Now',
    
    // About
    aboutTitle: 'About Us',
    aboutDescription: 'We are a digital platform aimed at supporting Palestine through transparent commerce and resistance media',
    
    // News
    newsTitle: 'News',
    newsDescription: 'Latest news and updates about Palestine and the Palestinian cause',
    
    // Support
    supportTitle: 'Technical Support',
    supportDescription: 'We are here to help you, contact us for any inquiry',
    
    // Footer
    footerDescription: 'Palestine Pulse Platform - Every purchase is a donation to support Palestine',
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    followUs: 'Follow Us',
    
    // Chatbot
    chatbotTitle: 'Smart Assistant',
    chatbotDescription: 'Ask the smart assistant about anything related to the platform',
    askQuestion: 'Ask your question...',
    send: 'Send',
    
    // Authentication
    login: 'Login',
    register: 'Sign Up',
    logout: 'Logout',
    profile: 'Profile',
    dashboard: 'Dashboard',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    welcomeBack: 'Welcome back',
    createAccount: 'Create new account',
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLanguage = localStorage.getItem('language') as Language;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Set RTL for Arabic
    if (language === 'ar') {
      root.dir = 'rtl';
      root.lang = 'ar';
    } else {
      root.dir = 'ltr';
      root.lang = 'en';
    }
    
    localStorage.setItem('theme', theme);
    localStorage.setItem('language', language);
  }, [theme, language]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <ThemeContext.Provider value={{ theme, language, toggleTheme, toggleLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
