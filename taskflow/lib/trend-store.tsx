'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { Trend, TrendFilters, TrendStats, Location, UserMode, CreatorContent, BusinessInsight, TrendCategory, TrendLevel } from './types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { sampleTrends, sampleCreatorContent, sampleBusinessInsights, sampleLocations } from './mock-data';
import { calculateTrendScore, getTrendLevel } from './trend-algorithm';

interface TrendContextValue {
  trends: Trend[];
  filters: TrendFilters;
  selectedLocation: Location | null;
  userMode: UserMode;
  creatorContent: CreatorContent[];
  businessInsights: BusinessInsight[];
  locations: Location[];
  recentSearches: string[];
  isLoaded: boolean;
  setFilters: (filters: TrendFilters) => void;
  setSelectedLocation: (location: Location | null) => void;
  setUserMode: (mode: UserMode) => void;
  addCreatorContent: (content: Omit<CreatorContent, 'id' | 'createdAt'>) => void;
  deleteCreatorContent: (id: string) => void;
  addRecentSearch: (search: string) => void;
  getFilteredTrends: () => Trend[];
  getTrendStats: () => TrendStats;
  getTrendById: (id: string) => Trend | undefined;
  getBusinessInsight: (trendId: string) => BusinessInsight | undefined;
  getTrendsByCategory: (category: TrendCategory) => Trend[];
  getTrendsByLevel: (level: TrendLevel) => Trend[];
}

const TrendContext = createContext<TrendContextValue | null>(null);

const DEFAULT_FILTERS: TrendFilters = {
  search: '',
  category: 'all',
  level: 'all',
  sortBy: 'score',
};

const DEFAULT_LOCATION: Location = sampleLocations[0];

export function TrendProvider({ children }: { children: React.ReactNode }) {
  const [trends, setTrends] = useLocalStorage<Trend[]>('localtrend-trends', sampleTrends);
  const [filters, setFilters] = useLocalStorage<TrendFilters>('localtrend-filters', DEFAULT_FILTERS);
  const [selectedLocation, setSelectedLocation] = useLocalStorage<Location | null>('localtrend-location', DEFAULT_LOCATION);
  const [userMode, setUserMode] = useLocalStorage<UserMode>('localtrend-mode', 'creator');
  const [creatorContent, setCreatorContent] = useLocalStorage<CreatorContent[]>('localtrend-content', sampleCreatorContent);
  const [businessInsights, setBusinessInsights] = useLocalStorage<BusinessInsight[]>('localtrend-insights', sampleBusinessInsights);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('localtrend-recent', []);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const addCreatorContent = useCallback(
    (contentData: Omit<CreatorContent, 'id' | 'createdAt'>) => {
      const newContent: CreatorContent = {
        ...contentData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setCreatorContent((prev) => [newContent, ...prev]);
    },
    [setCreatorContent]
  );

  const deleteCreatorContent = useCallback(
    (id: string) => {
      setCreatorContent((prev) => prev.filter((content) => content.id !== id));
    },
    [setCreatorContent]
  );

  const addRecentSearch = useCallback(
    (search: string) => {
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== search);
        return [search, ...filtered].slice(0, 5);
      });
    },
    [setRecentSearches]
  );

  const getFilteredTrends = useCallback((): Trend[] => {
    let filtered = trends.filter((trend) => {
      if (selectedLocation && trend.location.id !== selectedLocation.id) {
        return false;
      }
      
      if (filters.search) {
        const query = filters.search.toLowerCase();
        if (
          !trend.name.toLowerCase().includes(query) &&
          !trend.keywords.some((k) => k.toLowerCase().includes(query))
        ) {
          return false;
        }
      }

      if (filters.category !== 'all' && trend.category !== filters.category) return false;
      if (filters.level !== 'all' && trend.level !== filters.level) return false;
      return true;
    });

    switch (filters.sortBy) {
      case 'score':
        filtered.sort((a, b) => b.score - a.score);
        break;
      case 'mentions':
        filtered.sort((a, b) => b.mentions - a.mentions);
        break;
      case 'growth':
        filtered.sort((a, b) => b.growthRate - a.growthRate);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }

    return filtered;
  }, [trends, filters, selectedLocation]);

  const getTrendStats = useCallback((): TrendStats => {
    const filteredTrends = getFilteredTrends();
    const viralTrends = filteredTrends.filter((t) => t.level === 'viral' || t.level === 'explosive').length;
    const risingTrends = filteredTrends.filter((t) => t.level === 'rising').length;
    const avgScore = filteredTrends.length > 0
      ? Math.round(filteredTrends.reduce((sum, t) => sum + t.score, 0) / filteredTrends.length)
      : 0;

    return {
      totalTrends: filteredTrends.length,
      viralTrends,
      risingTrends,
      avgScore,
    };
  }, [getFilteredTrends]);

  const getTrendById = useCallback(
    (id: string): Trend | undefined => {
      return trends.find((trend) => trend.id === id);
    },
    [trends]
  );

  const getBusinessInsight = useCallback(
    (trendId: string): BusinessInsight | undefined => {
      return businessInsights.find((insight) => insight.trendId === trendId);
    },
    [businessInsights]
  );

  const getTrendsByCategory = useCallback(
    (category: TrendCategory): Trend[] => {
      return trends.filter((trend) => trend.category === category && trend.location.id === selectedLocation?.id);
    },
    [trends, selectedLocation]
  );

  const getTrendsByLevel = useCallback(
    (level: TrendLevel): Trend[] => {
      return trends.filter((trend) => trend.level === level && trend.location.id === selectedLocation?.id);
    },
    [trends, selectedLocation]
  );

  return (
    <TrendContext.Provider
      value={{
        trends,
        filters,
        selectedLocation,
        userMode,
        creatorContent,
        businessInsights,
        locations: sampleLocations,
        recentSearches,
        isLoaded,
        setFilters,
        setSelectedLocation,
        setUserMode,
        addCreatorContent,
        deleteCreatorContent,
        addRecentSearch,
        getFilteredTrends,
        getTrendStats,
        getTrendById,
        getBusinessInsight,
        getTrendsByCategory,
        getTrendsByLevel,
      }}
    >
      {children}
    </TrendContext.Provider>
  );
}

export function useTrends() {
  const context = useContext(TrendContext);
  if (!context) throw new Error('useTrends must be used within TrendProvider');
  return context;
}
