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
    'page.library.title': {
      en: 'My Library',
      hi: 'मेरी लाइब्रेरी'
    },
  };

  return translations[key]?.[language] || key;
};
