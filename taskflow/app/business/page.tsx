'use client';

import { BusinessInsights } from '@/components/business/business-insights';
import { TrendComparison } from '@/components/business/trend-comparison';
import { TrendRankings } from '@/components/trends/trend-rankings';
import { useTrends } from '@/lib/trend-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { useEffect } from 'react';

export default function BusinessPage() {
  const { setUserMode, selectedLocation, trends } = useTrends();

  useEffect(() => {
    setUserMode('business');
  }, [setUserMode]);

  // Calculate additional metrics
  const totalMentions = trends.reduce((sum, t) => sum + t.score.mentions, 0);
  const avgGrowth = trends.length > 0 
    ? trends.reduce((sum, t) => sum + t.score.growthRate, 0) / trends.length 
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-orange-400" />
            Business Insights
          </h1>
          <p className="text-muted-foreground">
            Trend analytics and competitive analysis for {selectedLocation?.city || 'your city'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-white/10">
            <Calendar className="h-4 w-4 mr-2" />
            Last 7 days
          </Button>
          <Button variant="outline" size="sm" className="border-white/10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Quick Metrics */}
      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: 'Total Mentions', value: totalMentions.toLocaleString(), icon: TrendingUp, color: 'text-blue-400' },
          { label: 'Avg Growth Rate', value: `${avgGrowth.toFixed(1)}%`, icon: Target, color: 'text-emerald-400' },
          { label: 'Active Trends', value: trends.length.toString(), icon: BarChart3, color: 'text-orange-400' },
          { label: 'Peak Hours', value: '19:00', icon: Clock, color: 'text-purple-400' },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-white/5 border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                <span className="text-xs text-muted-foreground">{metric.label}</span>
              </div>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Business Insights */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/5 border-white/10 p-6">
              <BusinessInsights />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TrendComparison />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/5 border-white/10 p-4">
              <TrendRankings />
            </Card>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/5 border-white/10 p-4">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-400" />
                Recommendations
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Maximize evening visibility', desc: 'Post between 18:00-21:00 for peak engagement' },
                  { title: 'Leverage viral trends', desc: '2 trends are currently in explosive phase' },
                  { title: 'Food & Nightlife trending', desc: 'Focus content on these categories this week' },
                ].map((rec, index) => (
                  <div key={index} className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                    <p className="text-sm font-medium">{rec.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{rec.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
