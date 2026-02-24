'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AIGenerator } from '@/components/creator/ai-generator';
import { useTrends } from '@/lib/trend-store';
import { Wand2, Library, Star, Trash2, Download, Copy, Check, Instagram, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

const platformIcons = {
  tiktok: <span>🎵</span>,
  instagram: <Instagram className="h-3.5 w-3.5" />,
  youtube: <Youtube className="h-3.5 w-3.5" />,
};

export default function CreatorPage() {
  const { creatorContent, deleteCreatorContent, selectedLocation } = useTrends();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const savedContent = creatorContent;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Creator Studio</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI-powered content generation for trending topics in {selectedLocation?.name || 'your city'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AIGenerator />
        </div>

        <div className="space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Library className="h-4 w-4 text-rose-400" />
                Saved Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedContent.length === 0 ? (
                <div className="text-center py-6">
                  <Wand2 className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No saved content yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate and save content to see it here
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
                  {savedContent.map((content, i) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-rose-500/20 text-rose-400 text-[10px]">
                            {platformIcons[content.platform]}
                            <span className="ml-1 capitalize">{content.platform}</span>
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-[10px] capitalize">
                            {content.type}
                          </Badge>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopy(content.content, content.id)}
                          >
                            {copiedId === content.id ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              deleteCreatorContent(content.id);
                              toast.success('Content deleted');
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-rose-400" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {content.content}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-rose-500">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pro Tips</p>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                    <li>• Use specific location names for better results</li>
                    <li>• Include relevant hashtags to boost visibility</li>
                    <li>• Save your best content for later use</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
