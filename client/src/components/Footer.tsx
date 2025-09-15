import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTheme } from './contexts/ThemeContext';
import { LinkButton, ExternalLink } from './LinkButton';
import logoImage from 'figma:asset/bb1259a3c4dfb04d8d03c587099db057050bb68a.png';

interface FooterProps {
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'organizations' | 'support' | 'login' | 'register' | 'dashboard' | 'profile' | 'cart') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t, language } = useTheme();

  const footerLinks = [
    {
      title: t('quickLinks'),
      links: [
        { label: t('home'), action: () => onNavigate('home') },
        { label: t('store'), action: () => onNavigate('store') },
        { label: t('donate'), action: () => onNavigate('donate') },
        { label: t('about'), action: () => onNavigate('about') },
        { label: language === 'ar' ? 'الجمعيات' : 'Organizations', action: () => onNavigate('organizations') },
        { label: t('support'), action: () => onNavigate('support') },
      ]
    },
    {
      title: language === 'ar' ? 'الدعم' : 'Support',
      links: [
        { label: language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', action: () => onNavigate('support') },
        { label: language === 'ar' ? 'تواصل معنا' : 'Contact Us', action: () => onNavigate('support') },
        { label: language === 'ar' ? 'الدعم الفني' : 'Technical Support', action: () => onNavigate('support') },
        { label: language === 'ar' ? 'تتبع التبرعات' : 'Track Donations', action: () => {} },
      ]
    },
    {
      title: language === 'ar' ? 'المنصة' : 'Platform',
      links: [
        { label: language === 'ar' ? 'كيف نعمل' : 'How We Work', action: () => onNavigate('about') },
        { label: language === 'ar' ? 'الشفافية' : 'Transparency', action: () => onNavigate('about') },
        { label: language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', action: () => {} },
        { label: language === 'ar' ? 'شروط الاستخدام' : 'Terms of Service', action: () => {} },
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-br from-palestine-green via-palestine-black to-palestine-green text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
      </div>
      
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Heart className="h-7 w-7 text-white animate-heartbeat" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {language === 'ar' ? 'نبض فلسطين' : 'Palestine Pulse'}
                </h3>
                <p className="text-white/70 text-sm">
                  {language === 'ar' ? 'منصة التضامن الرقمية' : 'Digital Solidarity Platform'}
                </p>
              </div>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              {language === 'ar' 
                ? 'نبني جسراً رقمياً يربط قلوب المتضامنين مع فلسطين حول العالم من خلال التجارة الأخلاقية والعمل الخيري الشفاف.'
                : 'Building a digital bridge connecting hearts of Palestine supporters worldwide through ethical commerce and transparent charity work.'
              }
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-red-300" />
                </div>
                <span className="text-white/90">support@palestinepulse.org</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4 text-green-300" />
                </div>
                <span className="text-white/90">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-blue-300" />
                </div>
                <span className="text-white/90">{language === 'ar' ? 'في كل مكان حول العالم' : 'Worldwide'}</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-6 text-white relative">
                {section.title}
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-palestine-red to-palestine-green rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <LinkButton
                      onClick={link.action}
                      className="text-white/70 hover:text-white transition-all duration-200 text-sm hover:translate-x-1 block w-full text-left p-0 h-auto justify-start"
                      variant="ghost"
                      scrollToTop={true}
                      smoothScroll={true}
                    >
                      {link.label}
                    </LinkButton>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h4 className="text-2xl font-bold mb-3 text-white">
                {language === 'ar' ? 'اشترك في النشرة الإخبارية' : 'Subscribe to Newsletter'}
              </h4>
              <p className="text-white/80 mb-6">
                {language === 'ar' 
                  ? 'احصل على آخر الأخبار والتحديثات مباشرة في بريدك الإلكتروني'
                  : 'Get the latest news and updates directly in your email'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input 
                  placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
                  className={`flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 rounded-xl ${language === 'ar' ? 'text-right' : ''}`}
                />
                <Button className="bg-gradient-to-r from-palestine-red to-palestine-green hover:from-palestine-red-dark hover:to-palestine-green-dark text-white h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  {language === 'ar' ? 'اشترك' : 'Subscribe'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h4 className="font-semibold mb-2">{t('followUs')}</h4>
              <div className="flex justify-center md:justify-start gap-4">
                {socialLinks.map((social, index) => (
                  <ExternalLink
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-palestine-red transition-colors duration-200 p-0"
                    variant="ghost"
                    size="icon"
                    aria-label={`${social.label} ${language === 'ar' ? '(يفتح في تبويب جديد)' : '(opens in new tab)'}`}
                  >
                    <social.icon className="h-5 w-5" />
                  </ExternalLink>
                ))}
              </div>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-lg font-bold text-palestine-red">$250K+</div>
                <div className="text-xs text-gray-300">
                  {language === 'ar' ? 'تم جمعه' : 'Raised'}
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-palestine-green">5K+</div>
                <div className="text-xs text-gray-300">
                  {language === 'ar' ? 'متضامن' : 'Supporters'}
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-palestine-white">95%</div>
                <div className="text-xs text-gray-300">
                  {language === 'ar' ? 'شفافية' : 'Transparency'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-white/80">
                © 2024 {language === 'ar' ? 'نبض فلسطين' : 'Palestine Pulse'}. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
              </p>
            </div>
            
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <span className="text-white/60 text-sm">
                {language === 'ar' ? 'صُنع بـ' : 'Made with'} 
              </span>
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5 text-red-400 fill-current animate-heartbeat" />
                <span className="text-white/60 text-sm">
                  {language === 'ar' ? 'لفلسطين' : 'for Palestine'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <LinkButton 
                className="text-white/60 hover:text-white transition-colors text-sm p-0 h-auto"
                variant="ghost"
                onClick={() => {}} // Add privacy policy handler
              >
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </LinkButton>
              <div className="w-px h-4 bg-white/20"></div>
              <LinkButton 
                className="text-white/60 hover:text-white transition-colors text-sm p-0 h-auto"
                variant="ghost"
                onClick={() => {}} // Add terms of service handler
              >
                {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}