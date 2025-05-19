
// Simple i18n implementation - in a production app, consider using i18next or similar libraries

interface TranslationMap {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: TranslationMap = {
  // Header & Navigation
  'app.title': {
    en: 'BookBites',
    hi: 'बुकबाइट्स'
  },
  'nav.home': {
    en: 'Home',
    hi: 'होम'
  },
  'nav.browse': {
    en: 'Browse',
    hi: 'ब्राउज़'
  },
  'nav.categories': {
    en: 'Categories',
    hi: 'श्रेणियां'
  },
  'nav.library': {
    en: 'My Library',
    hi: 'मेरी लाइब्रेरी'
  },
  'nav.search': {
    en: 'Search books...',
    hi: 'किताबें खोजें...'
  },
  
  // Hero Section
  'hero.title': {
    en: 'Wisdom in Minutes, Not Hours',
    hi: 'घंटों नहीं, मिनटों में ज्ञान'
  },
  'hero.subtitle': {
    en: 'Read, listen, or watch key insights from the world\'s best books',
    hi: 'दुनिया की सर्वश्रेष्ठ पुस्तकों से प्रमुख अंतर्दृष्टि पढ़ें, सुनें या देखें'
  },
  'hero.cta': {
    en: 'Start Your Journey',
    hi: 'अपनी यात्रा शुरू करें'
  },
  'hero.popular': {
    en: 'Popular Categories',
    hi: 'लोकप्रिय श्रेणियां'
  },
  
  // Book Cards
  'book.read': {
    en: 'Read Summary',
    hi: 'सारांश पढ़ें'
  },
  'book.listen': {
    en: 'Listen',
    hi: 'सुनें'
  },
  'book.watch': {
    en: 'Watch',
    hi: 'देखें'
  },
  'book.addToLibrary': {
    en: 'Add to Library',
    hi: 'लाइब्रेरी में जोड़ें'
  },
  'book.buy': {
    en: 'Buy Now',
    hi: 'अभी खरीदें'
  },
  
  // Sections
  'section.trending': {
    en: 'Trending Now',
    hi: 'अभी ट्रेंडिंग'
  },
  'section.recommended': {
    en: 'Recommended For You',
    hi: 'आपके लिए अनुशंसित'
  },
  'section.newReleases': {
    en: 'New Releases',
    hi: 'नई रिलीज़'
  },
  'section.viewAll': {
    en: 'View All',
    hi: 'सभी देखें'
  },
  
  // User & Account
  'user.login': {
    en: 'Login',
    hi: 'लॉगिन'
  },
  'user.signup': {
    en: 'Sign Up',
    hi: 'साइन अप'
  },
  'user.logout': {
    en: 'Logout',
    hi: 'लॉगआउट'
  },
  'user.profile': {
    en: 'My Profile',
    hi: 'मेरी प्रोफाइल'
  },
  
  // Footer
  'footer.about': {
    en: 'About Us',
    hi: 'हमारे बारे में'
  },
  'footer.contact': {
    en: 'Contact',
    hi: 'संपर्क'
  },
  'footer.terms': {
    en: 'Terms of Service',
    hi: 'सेवा की शर्तें'
  },
  'footer.privacy': {
    en: 'Privacy Policy',
    hi: 'गोपनीयता नीति'
  },
  'footer.copyright': {
    en: '© 2025 BookBites. All rights reserved.',
    hi: '© 2025 बुकबाइट्स. सर्वाधिकार सुरक्षित.'
  }
};

export const getTranslation = (key: string, language: 'en' | 'hi'): string => {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  return translation[language] || key;
};
