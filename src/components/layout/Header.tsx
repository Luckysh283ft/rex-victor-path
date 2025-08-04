import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BookOpen, 
  Trophy, 
  User, 
  Settings, 
  MessageSquare,
  HelpCircle,
  Volume2,
  Globe,
  LogOut
} from 'lucide-react';
import { DoubtPortal } from '@/components/portal/DoubtPortal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const { language, t } = useLanguage();
  const [showDoubtPortal, setShowDoubtPortal] = useState(false);

  return (
    <>
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
              
              {/* Doubt Portal Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={() => setShowDoubtPortal(true)}
              >
                <MessageSquare className="h-4 w-4" />
                {t('doubts', 'Doubts', 'संदेह')}
              </Button>

              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    {t('settings', 'Settings', 'सेटिंग्स')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {t('settings', 'Settings', 'सेटिंग्स')}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem>
                    <Globe className="mr-2 h-4 w-4" />
                    <span>{t('language', 'Language', 'भाषा')}</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <Volume2 className="mr-2 h-4 w-4" />
                    <span>{t('sound', 'Sound Effects', 'ध्वनि प्रभाव')}</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>{t('help', 'Help & Support', 'सहायता और समर्थन')}</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout', 'Logout', 'लॉगआउट')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              
              {/* Mobile Menu Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowDoubtPortal(true)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t('doubts', 'Doubts', 'संदेह')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    {t('settings', 'Settings', 'सेटिंग्स')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Doubt Portal */}
      <DoubtPortal
        isOpen={showDoubtPortal}
        onClose={() => setShowDoubtPortal(false)}
      />
    </>
  );
};