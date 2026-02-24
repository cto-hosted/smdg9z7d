'use client';

import { useParams } from 'next/navigation';
import { useTrends } from '@/lib/trend-store';
import { TrendScore } from '@/components/trends/trend-score';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Share2, TrendingUp, Users, Clock, MapPin, Lightbulb, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function TrendDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getTrendById, getBusinessInsight, selectedLocation, userMode, setUserMode } = useTrends();
  
  const trend = getTrendById(params.id as string);
  const insight = trend ? getBusinessInsight(trend.id) : undefined;

  if (!trend) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold">Trend not found</h2>
        <p className="text-muted-foreground mt-2">The trend you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feed
        </Button>
      </div>
    );
  }

  const relatedStats = [
    { label: 'Mentions', value: trend.mentions.toLocaleString(), icon: Users },
    { label: 'Growth Rate', value: `+${trend.growthRate}%`, icon: TrendingUp },
    { label: 'Peak Hours', value: trend.peakHours?.join(', ') || 'N/A', icon: Clock },
    { label: 'Location', value: trend.location.name, icon: MapPin },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="border border-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{trend.name}</h2>
          <p className="text-sm text-muted-foreground">
            Detailed analytics and insights
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="border-white/10"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${trend.name} - Trending in ${trend.location.name}`,
                text: `Check out this trending topic: ${trend.name} (Score: ${trend.score})`,
              });
            }
          }}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <TrendScore score={trend.score} level={trend.level} size="lg" />
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      'text-xs font-semibold uppercase',
                      trend.level === 'explosive' && 'bg-rose-500/20 text-rose-400',
                      trend.level === 'viral' && 'bg-orange-500/20 text-orange-400',
                      trend.level === 'rising' && 'bg-amber-500/20 text-amber-400',
                      trend.level === 'low' && 'bg-slate-500/20 text-slate-400'
                    )}
                  >
                    {trend.level}
                  </Badge>
                  <Badge variant="outline" className="border-white/20 capitalize">
                    {trend.category}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{trend.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Trending in {trend.location.name}, {trend.location.country}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {relatedStats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-sm font-medium">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {trend.keywords && trend.keywords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Related Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trend.keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="bg-white/10 text-muted-foreground cursor-pointer hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                  >
                    #{keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {insight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insight.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    <p className="text-sm text-muted-foreground">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3"
      >
        <Button
          onClick={() => {
            setUserMode('creator');
            router.push('/creator');
          }}
          className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
        >
          Generate Content
        </Button>
        <Button
          onClick={() => {
            setUserMode('business');
            router.push('/business');
          }}
          variant="outline"
          className="flex-1 border-white/10"
        >
          View Business Insights
        </Button>
      </motion.div>
    </div>
  );
}
