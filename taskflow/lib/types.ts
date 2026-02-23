export type TrendCategory = 
  | 'food' 
  | 'fashion' 
  | 'music' 
  | 'events' 
  | 'nightlife' 
  | 'sports' 
  | 'tech' 
  | 'travel'
  | 'wellness'
  | 'art';

export type TrendLevel = 'low' | 'rising' | 'viral' | 'explosive';

export type UserMode = 'creator' | 'business';

export interface Location {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TrendScore {
  raw: number;
  normalized: number;
  level: TrendLevel;
  mentions: number;
  growthRate: number;
  timeDecay: number;
}

export interface Trend {
  id: string;
  name: string;
  category: TrendCategory;
  location: Location;
  score: TrendScore;
  description: string;
  keywords: string[];
  peakHours: number[];
  relatedTrends: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatorContent {
  id: string;
  type: 'hook' | 'caption' | 'hashtags' | 'script';
  platform: 'tiktok' | 'instagram' | 'youtube' | 'twitter';
  content: string;
  trendId: string;
  createdAt: string;
}

export interface BusinessInsight {
  trendId: string;
  comparisonData: {
    name: string;
    score: number;
    growthRate: number;
  }[];
  peakTimes: {
    day: string;
    hour: number;
    value: number;
  }[];
  recommendations: string[];
}

export interface UserPreferences {
  selectedLocation: Location | null;
  userMode: UserMode;
  selectedCategory: TrendCategory | 'all';
  recentSearches: Location[];
  savedTrends: string[];
  savedContent: CreatorContent[];
}
