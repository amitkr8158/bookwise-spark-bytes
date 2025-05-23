
import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";

// Array of taglines that will rotate
const taglines = [
  'hero.title',
  'Get key insights in just 15 minutes',
  'Transform your thinking, one summary at a time',
  'Read less, learn more'
];

const HeroSection = () => {
  const { t } = useTranslation();
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  
  // Rotate through taglines every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
        setFadeIn(true);
      }, 500); // Wait for fade out before changing text
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentTagline = taglines[currentTaglineIndex];
  
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-90" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-5 rounded-full animate-float" style={{ animationDuration: '15s' }} />
        <div className="absolute bottom-12 -right-24 w-64 h-64 bg-white opacity-5 rounded-full animate-float" style={{ animationDuration: '20s', animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white opacity-5 rounded-full animate-float" style={{ animationDuration: '12s', animationDelay: '1s' }} />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-24 md:h-32 flex items-center justify-center">
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
            >
              {currentTaglineIndex === 0 ? t(currentTagline) : currentTagline}
            </h1>
          </div>
          
          <p className="mt-6 text-xl text-white/90">
            {t('hero.subtitle')}
          </p>
          
          {/* Search Box - Fixed size to maintain consistent height */}
          <div className="relative mt-8 max-w-md mx-auto">
            <div className="flex h-12">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('nav.search')}
                  className="w-full h-full pl-10 pr-4 rounded-l-lg border-0 focus:ring-2 focus:ring-book-700"
                />
              </div>
              <Button className="rounded-l-none h-full px-4">
                {t('nav.search')}
              </Button>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-book-700 hover:bg-white/90">
              {t('hero.cta')}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              {t('hero.popular')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
