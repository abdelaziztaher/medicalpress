'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

// القواميس للترجمة
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'home': 'Home',
    'tech_news': 'Tech News',
    'programming': 'Programming',
    'ai': 'AI',
    'inventions': 'Inventions',
    
    // Hero Section
    'discover_future': 'Discover the Future',
    'of_technology': 'of Technology',
    'explore_articles': 'Explore cutting-edge articles on tech, programming, AI, and revolutionary inventions.',
    'explore_button': 'Explore Articles',
    'ai_insights': 'AI Insights',
    
    // Common Sections
    'latest_articles': 'Latest Articles',
    'explore_categories': 'Explore Categories',
    'categories_desc': 'Dive into our diverse range of topics and find the content that interests you the most.',
    'read_article': 'Read Article',
    'subscribe': 'Subscribe to Our Newsletter',
    'newsletter_desc': 'Stay updated with our latest articles and news, delivered directly to your inbox.',
    'email': 'Your Email',
    'subscribe_button': 'Subscribe',
    'thanks_subscribing': 'Thanks for subscribing!',
    'will_notify': 'We\'ll notify you of the latest updates.',
    
    // Footer
    'footer_desc': 'Exploring the cutting edge of technology, programming, AI, and inventions. Stay ahead with our futuristic insights.',
    'quick_links': 'Quick Links',
    'connect_with_us': 'Connect With Us',
    'copyright': '© 2024 FutureBlog. All rights reserved.',
    
    // Categories
    'tech_news_desc': 'The latest breakthroughs and updates from the tech world.',
    'programming_desc': 'Deep dives into coding languages, frameworks, and best practices.',
    'ai_desc': 'Exploring artificial intelligence, machine learning, and their applications.',
    'inventions_desc': 'Revolutionary innovations that are changing our world.',
    
    // Language Toggle
    'switch_to_arabic': 'العربية',
    'switch_to_english': 'English',
    'translate_article': 'Translate Article',

    // Buttons
    'submit': 'Submit',
    'sending': 'Sending...',
    'send_message': 'Send Message',
  },
  ar: {
    // Header
    'home': 'الرئيسية',
    'tech_news': 'أخبار التكنولوجيا',
    'programming': 'البرمجة',
    'ai': 'الذكاء الاصطناعي',
    'inventions': 'الاختراعات',
    
    // Hero Section
    'discover_future': 'اكتشف مستقبل',
    'of_technology': 'التكنولوجيا',
    'explore_articles': 'استكشف مقالات متطورة حول التكنولوجيا والبرمجة والذكاء الاصطناعي والاختراعات الثورية.',
    'explore_button': 'استكشف المقالات',
    'ai_insights': 'رؤى الذكاء الاصطناعي',
    
    // Common Sections
    'latest_articles': 'أحدث المقالات',
    'explore_categories': 'استكشف الفئات',
    'categories_desc': 'تعمق في مجموعة متنوعة من الموضوعات واعثر على المحتوى الذي يهمك أكثر.',
    'read_article': 'اقرأ المقال',
    'subscribe': 'اشترك في نشرتنا الإخبارية',
    'newsletter_desc': 'ابق على اطلاع بأحدث مقالاتنا وأخبارنا، يتم إرسالها مباشرة إلى بريدك الإلكتروني.',
    'email': 'بريدك الإلكتروني',
    'subscribe_button': 'اشترك',
    'thanks_subscribing': 'شكراً على اشتراكك!',
    'will_notify': 'سنعلمك بآخر التحديثات.',
    
    // Footer
    'footer_desc': 'استكشاف أحدث تطورات التكنولوجيا والبرمجة والذكاء الاصطناعي والاختراعات. ابق في المقدمة مع رؤانا المستقبلية.',
    'quick_links': 'روابط سريعة',
    'connect_with_us': 'تواصل معنا',
    'copyright': '© 2024 فيوتشر بلوج. جميع الحقوق محفوظة.',
    
    // Categories
    'tech_news_desc': 'أحدث الاختراقات والتحديثات من عالم التكنولوجيا.',
    'programming_desc': 'تعمق في لغات البرمجة والأطر وأفضل الممارسات.',
    'ai_desc': 'استكشاف الذكاء الاصطناعي والتعلم الآلي وتطبيقاتهما.',
    'inventions_desc': 'ابتكارات ثورية تغير عالمنا.',
    
    // Language Toggle
    'switch_to_arabic': 'العربية',
    'switch_to_english': 'English',
    'translate_article': 'ترجم المقال',

    // Buttons
    'submit': 'إرسال',
    'sending': 'جاري الإرسال...',
    'send_message': 'إرسال رسالة',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    // استرجاع اللغة المحفوظة في التخزين المحلي إن وجدت
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // حفظ اللغة في التخزين المحلي عند تغييرها
    localStorage.setItem('language', language);
    
    // تعيين اتجاه الصفحة بناءً على اللغة
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      setDir('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      setDir('ltr');
    }
    
    // تغيير الـ class للـ body لتطبيق التنسيقات المناسبة
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  }, [language]);

  // وظيفة لتعيين اللغة
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // وظيفة للترجمة
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook لاستخدام سياق اللغة
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 