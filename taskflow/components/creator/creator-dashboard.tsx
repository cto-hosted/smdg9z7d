'use client';

import { useTrends } from '@/lib/trend-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Library, 
  Trash2, 
  Copy, 
  Check, 
  MessageSquare,
  Hash,
  FileText,
  Type,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { CreatorContent } from '@/lib/types';

const typeIcons = {
  hook: Type,
  caption: MessageSquare,
  hashtags: Hash,
  script: FileText,
};

const typeColors = {
  hook: 'text-rose-400 bg-rose-400/10',
  caption: 'text-violet-400 bg-violet-400/10',
  hashtags: 'text-cyan-400 bg-cyan-400/10',
  script: 'text-amber-400 bg-amber-400/10',
};

const platformColors = {
  tiktok: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  instagram: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  youtube: 'bg-red-500/20 text-red-400 border-red-500/30',
  twitter: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export function CreatorDashboard() {
  const { savedContent, deleteContent, userMode } = useTrends();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (content: CreatorContent) => {
    navigator.clipboard.writeText(content.content);
    setCopiedId(content.id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (userMode !== 'creator') return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Library className="h-4 w-4 text-orange-400" />
        <h3 className="text-sm font-semibold">Your Content Library</h3>
        <Badge variant="secondary" className="ml-auto">
          {savedContent.length} items
        </Badge>
      </div>

      {savedContent.length === 0 ? (
        <Card className="bg-white/5 border-white/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No saved content yet. Generate some content to see it here!
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {savedContent.map((content, index) => {
              const Icon = typeIcons[content.type];
              return (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Card className="bg-white/5 border-white/10 p-4 hover:border-orange-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                        typeColors[content.type]
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'text-[10px] px-2 py-0 h-5 border',
                              platformColors[content.platform]
                            )}
                          >
                            {content.platform}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className="text-[10px] px-2 py-0 h-5 bg-white/5"
                          >
                            {content.type}
                          </Badge>
                        </div>
                        <p className="text-sm line-clamp-2 text-muted-foreground">
                          {content.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(parseISO(content.createdAt), 'MMM d, h:mm a')}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/10"
                          onClick={() => handleCopy(content)}
                        >
                          {copiedId === content.id ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/10"
                          onClick={() => {
                            deleteContent(content.id);
                            toast.success('Content deleted');
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-rose-400" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
