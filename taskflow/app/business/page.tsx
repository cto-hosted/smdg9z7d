'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessInsights } from '@/components/business/business-insights';
import { useTrends } from '@/lib/trend-store';
import { TrendFeed } from '@/components/trends/trend-feed';
import { TrendingUp, BarChart3, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BusinessPage() {
  const { selectedLocation, getFilteredTrends } = useTrends();
  const trends = getFilteredTrends();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Business Insights</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Analytics and trend analysis for {selectedLocation?.name || 'your city'}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <BusinessInsights />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-rose-400" />
          Trending Topics for Business
        </h3>
        <TrendFeed />
      </div>
    </div>
  );
}
