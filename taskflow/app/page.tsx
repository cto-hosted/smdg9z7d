'use client';

import { useTrends } from '@/lib/trend-store';
import { TrendFeed } from '@/components/trends/trend-feed';
import { TrendRankings } from '@/components/trends/trend-rankings';
import { LocationSearch } from '@/components/location/location-search';
import { BusinessInsights } from '@/components/business/business-insights';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { selectedLocation, userMode, isLoaded, trends } = useTrends();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl border border-orange-500/20 p-6 md:p-8 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-rose-500/5" />
        
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                  <Zap className="h-3 w-3 text-orange-400" />
                  <span className="text-xs font-medium text-orange-400">AI-Powered</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {selectedLocation ? `Trending in ${selectedLocation.city}` : 'Discover Local Trends'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time trend analysis for {selectedLocation?.city || 'your city'}
              </p>
            </div>
            <LocationSearch />
          </div>

          {/* Quick Stats */}
          {isLoaded && trends.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-2xl font-bold text-orange-400">{trends.length}</p>
                <p className="text-xs text-muted-foreground">Active Trends</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-2xl font-bold text-rose-400">
                  {trends.filter(t => t.score.level === 'viral' || t.score.level === 'explosive').length}
                </p>
                <p className="text-xs text-muted-foreground">Viral Now</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-2xl font-bold text-emerald-400">
                  +{Math.round(trends.reduce((sum, t) => sum + t.score.growthRate, 0) / trends.length)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Growth</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-2xl font-bold text-amber-400">
                  {new Set(trends.map(t => t.category)).size}
                </p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-400" />
              Live Trends
            </h2>
            <Link href="/trends">
              <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <TrendFeed />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rankings */}
          <div className="glass-card rounded-xl border border-white/10 p-4">
            <TrendRankings />
          </div>

          {/* Business Mode Only */}
          <BusinessInsights />

          {/* Quick Links */}
          <div className="glass-card rounded-xl border border-white/10 p-4 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-400" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link href="/creator" className="block">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-white/10 hover:bg-white/10"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-orange-400" />
                  Generate Content
                </Button>
              </Link>
              <Link href="/business" className="block">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-white/10 hover:bg-white/10"
                >
                  <TrendingUp className="h-4 w-4 mr-2 text-rose-400" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
