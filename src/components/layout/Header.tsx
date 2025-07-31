import React from 'react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Trophy, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      language === 'hi' && "font-devanagari"
    )}>
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-primary leading-none">
                  Rex JEE
                </h1>
                <span className="text-xs text-muted-foreground leading-none">
                  {t('mockTest', 'Mock Test', 'मॉक टेस्ट')}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="gap-2">
              <BookOpen className="h-4 w-4" />
              {t('dashboard', 'Dashboard', 'डैशबोर्ड')}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Trophy className="h-4 w-4" />
              {t('results', 'Results', 'परिणाम')}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              {t('profile', 'Profile', 'प्रोफाइल')}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              {t('settings', 'Settings', 'सेटिंग्स')}
            </Button>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            
            {/* Mobile Menu Button */}
            <Button variant="outline" size="sm" className="md:hidden">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};