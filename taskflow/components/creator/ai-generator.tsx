'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Sparkles, Copy, Check, RefreshCw, Zap, Instagram, Youtube, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrends } from '@/lib/trend-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ContentType = 'hook' | 'caption' | 'hashtags' | 'script';
type Platform = 'tiktok' | 'instagram' | 'youtube';

interface GeneratedContent {
  type: ContentType;
  content: string;
  platform: Platform;
}

const contentTypes: { value: ContentType; label: string; icon: string }[] = [
  { value: 'hook', label: 'Hook', icon: '⚡' },
  { value: 'caption', label: 'Caption', icon: '✍️' },
  { value: 'hashtags', label: 'Hashtags', icon: '#️⃣' },
  { value: 'script', label: 'Script', icon: '🎬' },
];

const platformIcons: Record<Platform, React.ReactNode> = {
  tiktok: <span className="text-xs">🎵</span>,
  instagram: <Instagram className="h-3.5 w-3.5" />,
  youtube: <Youtube className="h-3.5 w-3.5" />,
};

const fallbackContent: Record<ContentType, string[]> = {
  hook: [
    "🔥 {trend} is EXPLODING in {location}! Are you ready for this?",
    "Wait till you see what's trending in {location} right now... 🤯",
    "POV: You just discovered {trend} before everyone else 💫",
    "Everyone in {location} is talking about {trend} - here's why 👇",
  ],
  caption: [
    "Just experienced {trend} and I'm obsessed! ✨ What's your favorite? #Trending #{location}",
    "If you know, you know 🙌 {trend} #LocalTrend #{location}",
    "The vibe at {trend} is unmatched 💯 #MustTry #TrendingNow",
  ],
  hashtags: [
    "#{trend} #{location}Trending #Viral #{location} #{trending} #MustWatch #TrendingNow",
    "#{trend} #{location} #LocalTrends #What'sTrending #ViralContent #Explore",
  ],
  script: [
    "[INTRO - Eye-catching visual of {trend}] \nHey! Today we're talking about {trend} in {location}...\n\n[MAIN CONTENT] \nHere's why everyone's excited:\n1. It's unique\n2. Everyone's sharing it\n3. The experience is incredible\n\n[OUTRO] \nLike and follow for more {location} trends!",
  ],
};

export function AIGenerator() {
  const [trend, setTrend] = useState('');
  const [location, setLocation] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType>('hook');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('tiktok');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { addCreatorContent, selectedLocation } = useTrends();

  const generateContent = async () => {
    if (!trend) {
      toast.error('Please enter a trend or topic');
      return;
    }

    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const variations = fallbackContent[selectedType];
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    const content = randomVariation
      .replace(/{trend}/g, trend)
      .replace(/{location}/g, location || selectedLocation?.name || 'your city');

    const newContent: GeneratedContent = {
      type: selectedType,
      content,
      platform: selectedPlatform,
    };

    setGeneratedContent((prev) => [newContent, ...prev.slice(0, 2)]);
    setIsGenerating(false);

    toast.success('Content generated successfully!');
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = (content: GeneratedContent) => {
    addCreatorContent({
      trendId: 'manual',
      type: content.type,
      content: content.content,
      platform: content.platform,
    });
    toast.success('Content saved to library!');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wand2 className="h-5 w-5 text-rose-400" />
            AI Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Trend / Topic</label>
              <Input
                placeholder="e.g., Street Food Festival"
                value={trend}
                onChange={(e) => setTrend(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-rose-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Location (optional)</label>
              <Input
                placeholder={selectedLocation?.name || 'Berlin'}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-rose-500/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Content Type</label>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all',
                    selectedType === type.value
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                  )}
                >
                  <span>{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Platform</label>
            <div className="flex gap-2">
              {(['tiktok', 'instagram', 'youtube'] as Platform[]).map((platform) => (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all capitalize',
                    selectedPlatform === platform
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                  )}
                >
                  {platformIcons[platform]}
                  {platform}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={generateContent}
            disabled={isGenerating || !trend}
            className="w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:via-orange-600 hover:to-amber-600 border-0 gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {generatedContent.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Generated Content
            </h3>
            
            {generatedContent.map((item, i) => (
              <motion.div
                key={`${item.type}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 hover:border-rose-500/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-rose-500/20 text-rose-400">
                          {platformIcons[item.platform]}
                          <span className="ml-1 capitalize">{item.platform}</span>
                        </Badge>
                        <Badge variant="outline" className="border-white/20 text-muted-foreground capitalize">
                          {item.type}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleCopy(item.content, `${i}`)}
                        >
                          {copiedId === `${i}` ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleSave(item)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{item.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
