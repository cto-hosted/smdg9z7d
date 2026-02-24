export type TrendCategory = 
  | 'food' 
  | 'events' 
  | 'music' 
  | 'fashion' 
  | 'tech' 
  | 'sports' 
  | 'nightlife' 
  | 'lifestyle';

export type TrendLevel = 'low' | 'rising' | 'viral' | 'explosive';

export type UserMode = 'creator' | 'business';

export interface Location {
  id: string;
  name: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Trend {
  id: string;
  name: string;
  category: TrendCategory;
  location: Location;
  mentions: number;
  growthRate: number;
  timeDecay: number;
  score: number;
  level: TrendLevel;
  keywords: string[];
  relatedTrends?: string[];
  peakHours?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface TrendFilters {
  search: string;
  category: TrendCategory | 'all';
  level: TrendLevel | 'all';
  sortBy: 'score' | 'mentions' | 'growth' | 'recent';
}

export interface TrendStats {
  totalTrends: number;
  viralTrends: number;
  risingTrends: number;
  avgScore: number;
}

export interface CreatorContent {
  id: string;
  trendId: string;
  type: 'hook' | 'caption' | 'hashtags' | 'script';
  content: string;
  platform: 'tiktok' | 'instagram' | 'youtube';
  createdAt: string;
}

export interface BusinessInsight {
  id: string;
  trendId: string;
  locationId: string;
  peakTimes: PeakTimeData[];
  competitorTrends: TrendComparison[];
  recommendations: string[];
  generatedAt: string;
}

export interface PeakTimeData {
  day: string;
  hour: number;
  value: number;
}

export interface TrendComparison {
  trendId: string;
  trendName: string;
  score: number;
  growthRate: number;
}

export interface AIContentRequest {
  trend: string;
  type: 'hook' | 'caption' | 'hashtags' | 'script';
  platform: 'tiktok' | 'instagram' | 'youtube';
  tone?: 'fun' | 'professional' | 'casual' | 'exciting';
}

export interface AIContentResponse {
  content: string;
  quality: number;
}
