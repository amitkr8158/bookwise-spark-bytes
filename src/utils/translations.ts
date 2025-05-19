
export const getTranslation = (key: string, language: 'en' | 'hi'): string => {
  const translations: Record<string, Record<'en' | 'hi', string>> = {
    'hero.title': {
      en: 'Wisdom in Minutes, Not Hours',
      hi: 'मिनटों में ज्ञान, घंटों में नहीं'
    },
    'hero.subtitle': {
      en: 'Read, listen, or watch key insights from the world\'s best books.',
      hi: 'दुनिया की बेहतरीन किताबों से मुख्य बातें पढ़ें, सुनें या देखें।'
    },
    'hero.cta': {
      en: 'Start Learning Now',
      hi: 'अभी सीखना शुरू करें'
    },
    'section.trending': {
      en: 'Trending Summaries',
      hi: 'ट्रेंडिंग सारांश'
    },
    'section.categories': {
      en: 'Explore Categories',
      hi: 'श्रेणियाँ एक्सप्लोर करें'
    },
    'section.newReleases': {
      en: 'New Releases',
      hi: 'नए रिलीज़'
    },
    'section.freeBooks': {
      en: 'Free Summaries',
      hi: 'मुफ्त सारांश'
    },
    'section.viewAll': {
      en: 'View All',
      hi: 'सभी देखें'
    },
    'footer.copyright': {
      en: '© 2024 BookBites. All rights reserved.',
      hi: '© 2024 BookBites. सर्वाधिकार सुरक्षित।'
    },
    'footer.terms': {
      en: 'Terms of Service',
      hi: 'सेवा की शर्तें'
    },
    'footer.privacy': {
      en: 'Privacy Policy',
      hi: 'गोपनीयता नीति'
    },
    'footer.about': {
      en: 'About Us',
      hi: 'हमारे बारे में'
    },
    'footer.contact': {
      en: 'Contact Us',
      hi: 'संपर्क करें'
    },
    'page.library.title': {
      en: 'My Library',
      hi: 'मेरी लाइब्रेरी'
    },
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
      hi: 'श्रेणियाँ'
    },
    'nav.library': {
      en: 'Library',
      hi: 'लाइब्रेरी'
    },
    'nav.search': {
      en: 'Search books...',
      hi: 'किताबें खोजें...'
    },
    'user.login': {
      en: 'Login',
      hi: 'लॉगिन'
    },
    'user.loggingIn': {
      en: 'Logging in...',
      hi: 'लॉग इन हो रहा है...'
    },
    'user.signup': {
      en: 'Sign Up',
      hi: 'साइन अप'
    },
    'user.profile': {
      en: 'My Profile',
      hi: 'मेरी प्रोफाइल'
    },
    'user.logout': {
      en: 'Logout',
      hi: 'लॉगआउट'
    },
    'user.email': {
      en: 'Email',
      hi: 'ईमेल'
    },
    'user.password': {
      en: 'Password',
      hi: 'पासवर्ड'
    },
    'user.forgotPassword': {
      en: 'Forgot Password?',
      hi: 'पासवर्ड भूल गए?'
    },
    'user.rememberMe': {
      en: 'Remember me',
      hi: 'मुझे याद रखें'
    },
    'user.noAccount': {
      en: 'Don\'t have an account?',
      hi: 'खाता नहीं है?'
    },
    'user.haveAccount': {
      en: 'Already have an account?',
      hi: 'पहले से खाता है?'
    },
    'user.createAccount': {
      en: 'Create Account',
      hi: 'खाता बनाएं'
    },
    'user.creating': {
      en: 'Creating account...',
      hi: 'खाता बना रहा है...'
    },
    'user.loginDescription': {
      en: 'Welcome back! Log in to access your book summaries.',
      hi: 'वापसी पर स्वागत है! अपने पुस्तक सारांश देखने के लिए लॉगिन करें।'
    },
    'user.signupDescription': {
      en: 'Create an account to start your book summary journey.',
      hi: 'अपनी पुस्तक सारांश यात्रा शुरू करने के लिए खाता बनाएं।'
    },
    'user.fullName': {
      en: 'Full Name',
      hi: 'पूरा नाम'
    },
    'user.confirmPassword': {
      en: 'Confirm Password',
      hi: 'पासवर्ड की पुष्टि करें'
    },
    'book.addToLibrary': {
      en: 'Add',
      hi: 'जोड़ें'
    },
    'book.buy': {
      en: 'Buy',
      hi: 'खरीदें'
    }
  };

  return translations[key]?.[language] || key;
};
