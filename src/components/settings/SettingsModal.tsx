import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, CheckCircle, XCircle, Loader2, Key, Search, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/services/openai';
import { googleSearchService } from '@/services/googleSearch';

interface SettingsData {
  openaiApiKey: string;
  googleApiKey: string;
  googleSearchEngineId: string;
  darkMode: boolean;
}

export const SettingsModal = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    openaiApiKey: '',
    googleApiKey: '',
    googleSearchEngineId: '',
    darkMode: true
  });
  const [testing, setTesting] = useState({
    openai: false,
    google: false
  });
  const [status, setStatus] = useState({
    openai: false,
    google: false
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('jee-app-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      
      // Configure services
      if (parsed.openaiApiKey) {
        aiService.setApiKey(parsed.openaiApiKey);
        setStatus(prev => ({ ...prev, openai: true }));
      }
      if (parsed.googleApiKey && parsed.googleSearchEngineId) {
        googleSearchService.setConfig({
          apiKey: parsed.googleApiKey,
          searchEngineId: parsed.googleSearchEngineId
        });
        setStatus(prev => ({ ...prev, google: true }));
      }
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('jee-app-settings', JSON.stringify(settings));
    
    // Configure services
    if (settings.openaiApiKey) {
      aiService.setApiKey(settings.openaiApiKey);
    }
    if (settings.googleApiKey && settings.googleSearchEngineId) {
      googleSearchService.setConfig({
        apiKey: settings.googleApiKey,
        searchEngineId: settings.googleSearchEngineId
      });
    }

    toast({
      title: "सेटिंग्स सहेजी गई",
      description: "आपकी सेटिंग्स सफलतापूर्वक सहेजी गई हैं।",
    });
  };

  const testOpenAI = async () => {
    setTesting(prev => ({ ...prev, openai: true }));
    try {
      aiService.setApiKey(settings.openaiApiKey);
      await aiService.testConnection();
      setStatus(prev => ({ ...prev, openai: true }));
      toast({
        title: "OpenAI कनेक्शन सफल",
        description: "AI सेवा सही तरीके से काम कर रही है।",
      });
    } catch (error: any) {
      setStatus(prev => ({ ...prev, openai: false }));
      toast({
        title: "OpenAI कनेक्शन विफल",
        description: error.message || "कनेक्शन में त्रुटि।",
        variant: "destructive"
      });
    } finally {
      setTesting(prev => ({ ...prev, openai: false }));
    }
  };

  const testGoogle = async () => {
    setTesting(prev => ({ ...prev, google: true }));
    try {
      googleSearchService.setConfig({
        apiKey: settings.googleApiKey,
        searchEngineId: settings.googleSearchEngineId
      });
      await googleSearchService.testConnection();
      setStatus(prev => ({ ...prev, google: true }));
      toast({
        title: "Google Search कनेक्शन सफल",
        description: "खोज सेवा सही तरीके से काम कर रही है।",
      });
    } catch (error: any) {
      setStatus(prev => ({ ...prev, google: false }));
      toast({
        title: "Google Search कनेक्शन विफल",
        description: error.message || "कनेक्शन में त्रुटि।",
        variant: "destructive"
      });
    } finally {
      setTesting(prev => ({ ...prev, google: false }));
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !settings.darkMode;
    setSettings(prev => ({ ...prev, darkMode: newDarkMode }));
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-accent">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            <Settings className="h-6 w-6 inline mr-2" />
            सेटिंग्स
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* OpenAI Configuration */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                OpenAI API कॉन्फ़िगरेशन
                <Badge variant={status.openai ? "default" : "secondary"}>
                  {status.openai ? 
                    <><CheckCircle className="h-3 w-3 mr-1" />कनेक्टेड</> : 
                    <><XCircle className="h-3 w-3 mr-1" />डिस्कनेक्टेड</>
                  }
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  value={settings.openaiApiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  OpenAI से प्राप्त करें: <span className="text-primary">platform.openai.com</span>
                </p>
              </div>
              <Button 
                onClick={testOpenAI} 
                disabled={!settings.openaiApiKey || testing.openai}
                className="w-full"
              >
                {testing.openai ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />टेस्ट हो रहा है...</>
                ) : (
                  'कनेक्शन टेस्ट करें'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Google Search Configuration */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Google Custom Search कॉन्फ़िगरेशन
                <Badge variant={status.google ? "default" : "secondary"}>
                  {status.google ? 
                    <><CheckCircle className="h-3 w-3 mr-1" />कनेक्टेड</> : 
                    <><XCircle className="h-3 w-3 mr-1" />डिस्कनेक्टेड</>
                  }
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="google-key">Google API Key</Label>
                <Input
                  id="google-key"
                  type="password"
                  placeholder="AIza..."
                  value={settings.googleApiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, googleApiKey: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="search-engine-id">Search Engine ID</Label>
                <Input
                  id="search-engine-id"
                  placeholder="Custom Search Engine ID"
                  value={settings.googleSearchEngineId}
                  onChange={(e) => setSettings(prev => ({ ...prev, googleSearchEngineId: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Google से प्राप्त करें: <span className="text-primary">programmablesearchengine.google.com</span>
                </p>
              </div>
              <Button 
                onClick={testGoogle} 
                disabled={!settings.googleApiKey || !settings.googleSearchEngineId || testing.google}
                className="w-full"
              >
                {testing.google ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />टेस्ट हो रहा है...</>
                ) : (
                  'कनेक्शन टेस्ट करें'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>ऐप सेटिंग्स</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <Label>डार्क मोड</Label>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-2">
            <Button onClick={saveSettings} className="flex-1">
              सेटिंग्स सहेजें
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              बंद करें
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};