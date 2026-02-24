'use client';

import { useState } from 'react';
import { useTrends } from '@/lib/trend-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Wand2, 
  Zap,
  MessageSquare,
  Hash,
  FileText,
  Type,
  RefreshCw,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ContentType = 'hook' | 'caption' | 'hashtags' | 'script';
type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter';

interface GeneratedContent {
  type: ContentType;
  content: string;
  platform: Platform;
}

const contentTypes: { type: ContentType; label: string; icon: typeof Type }[] = [
  { type: 'hook', label: 'Hook', icon: Zap },
  { type: 'caption', label: 'Caption', icon: MessageSquare },
  { type: 'hashtags', label: 'Hashtags', icon: Hash },
  { type: 'script', label: 'Script', icon: FileText },
];

const platforms: { platform: Platform; label: string }[] = [
  { platform: 'tiktok', label: 'TikTok' },
  { platform: 'instagram', label: 'Instagram' },
  { platform: 'youtube', label: 'YouTube' },
  { platform: 'twitter', label: 'Twitter' },
];

// Simulated AI generation - in production, this would call OpenAI API
const generateContent = async (type: ContentType, platform: Platform, topic: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

  const templates: Record<ContentType, Record<Platform, string[]>> = {
    hook: {
      tiktok: [
        `Wait till you see what's trending in ${topic}! 🔥`,
        `POV: You just discovered the hottest ${topic} trend!`,
        `This ${topic} trend is taking over - here's why!`,
        `Everyone in ${topic} is talking about this!`,
      ],
      instagram: [
        `The ${topic} trend you need to know about 🔥`,
        `Your feed needs this ${topic} content!`,
        `This is the ${topic} moment you've been waiting for`,
      ],
      youtube: [
        `The ${topic} Trend That's Exploding Right Now!`,
        `Why ${topic} Is The Hottest Topic Right Now`,
        `Everything You Need To Know About ${topic}`,
      ],
      twitter: [
        `The ${topic} trend is real and it's happening now`,
        `Let me tell you about this ${topic} thing 👀`,
      ],
    },
    caption: {
      tiktok: [
        `Living for this ${topic} trend! 🤩 Who's with me? #${topic.replace(/\s+/g, '')} #fyp #trending`,
        `The ${topic} trend explained in 60 seconds ⏱️ #${topic.replace(/\s+/g, '')} #viral`,
        `Not me obsessing over ${topic} again 😅 #${topic.replace(/\s+/g, '')} #trend`,
      ],
      instagram: [
        `Living my best life with the ${topic} trend ✨ #${topic.replace(/\s+/g, '')} #trending #lifestyle`,
        `The ${topic} content you didn't know you needed 💫 #${topic.replace(/\s+/g, '')} #vibes`,
        `Embracing the ${topic} wave 🌊 #${topic.replace(/\s+/g, '')} #mood`,
      ],
      youtube: [
        `In today's video, we're diving deep into the ${topic} trend. Let me show you everything you need to know!`,
        `This ${topic} trend is everywhere! Here's my take on it...`,
        `The complete guide to ${topic} - you need to see this!`,
      ],
      twitter: [
        `The ${topic} trend is hitting different 🤔 What's your take?`,
        `Can't stop thinking about this ${topic} thing 💭`,
      ],
    },
    hashtags: {
      tiktok: [
        `#${topic.replace(/\s+/g, '')} #fyp #trending #viral #${topic.replace(/\s+/g, '')}trend #mustwatch`,
        `#${topic.replace(/\s+/g, '')} #viral #trendingnow #foryou #explorepage`,
        `#${topic.replace(/\s+/g, '')} #trend #fyp #viral #newtrend`,
      ],
      instagram: [
        `#${topic.replace(/\s+/g, '')} #trending #viral #instagood #photooftheday #${topic.replace(/\s+/g, '')}`,
        `#${topic.replace(/\s+/g, '')} #trendingnow #viral #explore #reels`,
        `#${topic.replace(/\s+/g, '')} #instadaily #viral #trending #fashion`,
      ],
      youtube: [
        `#${topic.replace(/\s+/g, '')} #trending #viral #youtube #shorts #trendingnow`,
        `#${topic.replace(/\s+/g, '')} #youtubeshorts #viral #trending #fyp`,
        `#${topic.replace(/\s+/g, '')} #trending #viral #video #viralvideo`,
      ],
      twitter: [
        `#${topic.replace(/\s+/g, '')} #trending #viral #twitter #trendingnow #${topic.replace(/\s+/g, '')}`,
        `#${topic.replace(/\s+/g, '')} #trending #viral #trendingnow`,
      ],
    },
    script: {
      tiktok: [
        `[Hook - 3 seconds] Wait till you see this ${topic} trend!\n\n[Body - 45 seconds] So here's the deal with ${topic}...\n\n[CTA] Like and follow for more!`,
        `[Intro] What's up everyone!\n\n[Main Content] Today we're talking about ${topic}...\n\n[Outro] Drop a comment below!`,
      ],
      instagram: [
        `[Reel Structure]\n0-3s: Hook\n3-15s: Value\n15-30s: CTA\n\nTopic: ${topic}\n\nKey points:\n1. Why it's trending\n2. How to participate\n3. Best practices`,
      ],
      youtube: [
        `[Intro - 10s]\nWelcome back! Today we're exploring ${topic}\n\n[Content - 3-5 min]\n- Background on the trend\n- Why it's gaining traction\n- How to leverage it\n\n[Outro - 20s]\nLike, Subscribe, and hit the bell!`,
      ],
      twitter: [
        `[Thread about ${topic}]\n\n1/ The ${topic} trend is taking over.\n\n2/ Here's what you need to know...\n\n3/ Why it matters for you:\n   - Point 1\n   - Point 2\n   - Point 3\n\n4/ Conclusion and CTA`,
      ],
    },
  };

  const options = templates[type][platform];
  return options[Math.floor(Math.random() * options.length)];
};

export function AIGenerator() {
  const { trends, addContent, selectedLocation } = useTrends();
  const [topic, setTopic] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType>('hook');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('tiktok');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic or trend');
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateContent(selectedType, selectedPlatform, topic);
      setGeneratedContent({ type: selectedType, content, platform: selectedPlatform });
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    if (generatedContent) {
      addContent({
        type: generatedContent.type,
        platform: generatedContent.platform,
        content: generatedContent.content,
        trendId: '',
      });
      toast.success('Content saved to library!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            What trend or topic do you want content for?
          </label>
          <Input
            placeholder="e.g., rooftop bars, vintage fashion, techno clubs..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="h-11 bg-white/5 border-white/10 focus:border-orange-500/50"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {contentTypes.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                selectedType === type
                  ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {platforms.map(({ platform, label }) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                selectedPlatform === platform
                  ? 'bg-white/10 border border-orange-500/50 text-orange-400'
                  : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full h-11 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white border-0"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate with AI
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {generatedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium">Generated Content</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {selectedPlatform}
              </Badge>
            </div>

            <Card className="bg-white/5 border-white/10 p-4">
              <p className="text-sm whitespace-pre-wrap">{generatedContent.content}</p>
            </Card>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex-1 border-white/10 hover:bg-white/10"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="flex-1 border-white/10 hover:bg-white/10"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Suggestions */}
      {!generatedContent && trends.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Quick suggestions from trending:</p>
          <div className="flex flex-wrap gap-2">
            {trends.slice(0, 5).map((trend) => (
              <button
                key={trend.id}
                onClick={() => setTopic(trend.name.replace(` in ${selectedLocation?.city || ''}`, ''))}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                {trend.name.split(' in ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
