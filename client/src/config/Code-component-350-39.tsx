// Application Configuration
export const APP_CONFIG = {
  // App Info
  name: 'Palestine Pulse',
  nameAr: 'نبض فلسطين',
  version: '2.0.0',
  description: 'Digital Solidarity Platform for Palestine',
  descriptionAr: 'منصة التضامن الرقمية لفلسطين',
  
  // URLs
  domain: 'palestinepulse.org',
  apiUrl: process.env.REACT_APP_API_URL || 'https://api.palestinepulse.org',
  cdnUrl: process.env.REACT_APP_CDN_URL || 'https://cdn.palestinepulse.org',
  
  // Contact
  contact: {
    email: 'info@palestinepulse.org',
    support: 'support@palestinepulse.org',
    admin: 'admin@palestinepulse.org',
    phone: '+970-2-555-0123',
  },
  
  // Social Media
  social: {
    facebook: 'https://facebook.com/palestinepulse',
    twitter: 'https://twitter.com/palestinepulse',
    instagram: 'https://instagram.com/palestinepulse',
    linkedin: 'https://linkedin.com/company/palestinepulse',
    youtube: 'https://youtube.com/palestinepulse',
    telegram: 'https://t.me/palestinepulse',
  },
  
  // Features
  features: {
    chat: true,
    notifications: true,
    darkMode: true,
    multiLanguage: true,
    analytics: process.env.NODE_ENV === 'production',
    errorReporting: process.env.NODE_ENV === 'production',
    performanceMonitoring: process.env.NODE_ENV === 'development',
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 50,
    productsPerPage: 12,
    newsPerPage: 6,
    organizationsPerPage: 9,
  },
  
  // File Upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword'],
  },
  
  // Cache
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxEntries: 100,
  },
  
  // Animation
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  // Breakpoints (matches Tailwind)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Theme
  theme: {
    defaultTheme: 'light',
    defaultLanguage: 'ar',
    colorScheme: {
      primary: '#E53E3E', // Palestine Red
      secondary: '#38A169', // Palestine Green
      accent: '#1A202C', // Palestine Black
      background: '#FFFFFF',
      surface: '#F7FAFC',
    },
  },
  
  // SEO
  seo: {
    defaultTitle: 'Palestine Pulse | Digital Solidarity Platform',
    defaultTitleAr: 'نبض فلسطين | منصة التضامن الرقمية',
    defaultDescription: 'Join the largest digital platform connecting Palestinians and friends of Palestine worldwide',
    defaultDescriptionAr: 'انضم إلى أكبر منصة رقمية تجمع الفلسطينيين وأصدقاء فلسطين حول العالم',
    keywords: [
      'Palestine',
      'فلسطين',
      'solidarity',
      'تضامن',
      'support',
      'دعم',
      'community',
      'مجتمع',
      'culture',
      'ثقافة',
      'products',
      'منتجات',
      'donations',
      'تبرعات',
    ],
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: process.env.REACT_APP_GA_ID,
    facebookPixelId: process.env.REACT_APP_FB_PIXEL_ID,
  },
  
  // Payment
  payment: {
    currency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'ILS'],
    minDonationAmount: 5,
    maxDonationAmount: 10000,
  },
  
  // Map
  map: {
    defaultCenter: [31.9466, 35.3027], // Jerusalem coordinates
    defaultZoom: 8,
    style: 'mapbox://styles/mapbox/streets-v11',
  },
  
  // Notifications
  notifications: {
    defaultDuration: 5000,
    maxNotifications: 20,
    position: 'top-right',
  },
  
  // Development
  development: {
    enableLogger: process.env.NODE_ENV === 'development',
    enableDevTools: process.env.NODE_ENV === 'development',
    mockApi: process.env.REACT_APP_MOCK_API === 'true',
  },
} as const;

// Environment specific configs
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// Helper functions
export function getApiUrl(endpoint: string): string {
  return `${APP_CONFIG.apiUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
}

export function getCdnUrl(asset: string): string {
  return `${APP_CONFIG.cdnUrl}${asset.startsWith('/') ? '' : '/'}${asset}`;
}

export function getFullUrl(path: string): string {
  return `https://${APP_CONFIG.domain}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Type exports
export type AppConfig = typeof APP_CONFIG;
export type FeatureFlags = typeof APP_CONFIG.features;