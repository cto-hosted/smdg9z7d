'use client';

import { AIGenerator } from '@/components/creator/ai-generator';
import { CreatorDashboard } from '@/components/creator/creator-dashboard';
import { useTrends } from '@/lib/trend-store';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  Lightbulb, 
  Target,
  Zap,
  MessageSquare,
  Hash,
  FileText,
  Type
} from 'lucide-react';
import { useEffect } from 'react';

export default function CreatorPage() {
  const { setUserMode } = useTrends();

  useEffect(() => {
    setUserMode('creator');
  }, [setUserMode]);

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Generate hooks, captions, and scripts in seconds',
    },
    {
      icon: Target,
      title: 'Trend-Based',
      description: 'Content optimized for current trending topics',
    },
    {
      icon: Lightbulb,
      title: 'Multi-Platform',
      description: 'Tailored for TikTok, Instagram, YouTube & more',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-500/20">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Creator Studio</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Generate engaging content powered by AI, optimized for trending topics in your city
        </p>
      </motion.div>

      {/* Features */}
      <div className="grid gap-3 md:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 p-4 text-center hover:border-orange-500/30 transition-colors">
              <div className="flex justify-center mb-2">
                <feature.icon className="h-5 w-5 text-orange-400" />
              </div>
              <h3 className="font-medium text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Wand2 className="h-5 w-5 text-orange-400" />
              <h2 className="text-lg font-semibold">AI Content Generator</h2>
            </div>
            <AIGenerator />
          </Card>
        </motion.div>

        {/* Content Library */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/5 border-white/10 p-6 h-full">
            <CreatorDashboard />
          </Card>
        </motion.div>
      </div>

      {/* Content Type Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/5 border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-orange-400" />
            Content Types Guide
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Type, title: 'Hooks', desc: 'Attention-grabbing opening lines (3-5 seconds)' },
              { icon: MessageSquare, title: 'Captions', desc: 'Engaging descriptions for posts (150-300 chars)' },
              { icon: Hash, title: 'Hashtags', desc: 'Strategic tags for maximum discoverability' },
              { icon: FileText, title: 'Scripts', desc: 'Full video scripts with structure' },
            ].map((item) => (
              <div key={item.title} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <item.icon className="h-4 w-4 text-orange-400 mb-2" />
                <h3 className="font-medium text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
