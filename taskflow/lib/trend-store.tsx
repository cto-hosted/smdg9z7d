'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  Trend, 
  Location, 
  UserMode, 
  CreatorContent, 
  TrendCategory,
  UserPreferences 
} from './types';
import { 
  sampleTrends, 
  sampleLocations, 
  sampleCreatorContent,
  getTrendsByLocation,
  getTopTrends,
  getTrendsByCategory 
} from './mock-data';

interface TrendContextValue {
  // Trends
  trends: Trend[];
  filteredTrends: Trend[];
  topTrends: Trend[];
  
  // Location
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  locations: Location[];
  
  // User Mode
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  
  // Categories
  selectedCategory: TrendCategory | 'all';
  setSelectedCategory: (category: TrendCategory | 'all') => void;
  
  // Creator Content
  savedContent: CreatorContent[];
  addContent: (content: Omit<CreatorContent, 'id' | 'createdAt'>) => void;
  deleteContent: (id: string) => void;
  
  // Saved Trends
  savedTrendIds: string[];
  toggleSaveTrend: (trendId: string) => void;
  isTrendSaved: (trendId: string) => boolean;
  
  // Recent Searches
  recentSearches: Location[];
  addRecentSearch: (location: Location) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Loading state
  isLoaded: boolean;
}

const TrendContext = createContext<TrendContextValue | null>(null);

const DEFAULT_PREFERENCES: UserPreferences = {
  selectedLocation: sampleLocations[0],
  userMode: 'creator',
  selectedCategory: 'all',
  recentSearches: [],
  savedTrends: [],
  savedContent: [],
};

export function TrendProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'localtrend-preferences',
    DEFAULT_PREFERENCES
  );
  
  const [searchQuery, setSearchQuery] = React.useState('');

  const locations = useMemo(() => sampleLocations, []);
  
  const trends = useMemo(() => {
    if (!preferences.selectedLocation) return [];
    return getTrendsByLocation(preferences.selectedLocation.id);
  }, [preferences.selectedLocation]);
  
  const filteredTrends = useMemo(() => {
    let filtered = trends;
    
    // Filter by category
    if (preferences.selectedCategory && preferences.selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === preferences.selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.keywords.some(k => k.toLowerCase().includes(query)) ||
        t.category.toLowerCase().includes(query)
      );
    }
    
    // Sort by score
    return filtered.sort((a, b) => b.score.normalized - a.score.normalized);
  }, [trends, preferences.selectedCategory, searchQuery]);
  
  const topTrends = useMemo(() => {
    if (!preferences.selectedLocation) return [];
    return getTopTrends(preferences.selectedLocation.id, 10);
  }, [preferences.selectedLocation]);

  const setSelectedLocation = useCallback((location: Location | null) => {
    setPreferences(prev => ({ ...prev, selectedLocation: location }));
  }, [setPreferences]);

  const setUserMode = useCallback((mode: UserMode) => {
    setPreferences(prev => ({ ...prev, userMode: mode }));
  }, [setPreferences]);

  const setSelectedCategory = useCallback((category: TrendCategory | 'all') => {
    setPreferences(prev => ({ ...prev, selectedCategory: category }));
  }, [setPreferences]);

  const addRecentSearch = useCallback((location: Location) => {
    setPreferences(prev => {
      const filtered = prev.recentSearches.filter(l => l.id !== location.id);
      return {
        ...prev,
        recentSearches: [location, ...filtered].slice(0, 5)
      };
    });
  }, [setPreferences]);

  const addContent = useCallback((content: Omit<CreatorContent, 'id' | 'createdAt'>) => {
    const newContent: CreatorContent = {
      ...content,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setPreferences(prev => ({
      ...prev,
      savedContent: [newContent, ...prev.savedContent],
    }));
  }, [setPreferences]);

  const deleteContent = useCallback((id: string) => {
    setPreferences(prev => ({
      ...prev,
      savedContent: prev.savedContent.filter(c => c.id !== id),
    }));
  }, [setPreferences]);

  const toggleSaveTrend = useCallback((trendId: string) => {
    setPreferences(prev => {
      const isSaved = prev.savedTrends.includes(trendId);
      return {
        ...prev,
        savedTrends: isSaved 
          ? prev.savedTrends.filter(id => id !== trendId)
          : [...prev.savedTrends, trendId],
      };
    });
  }, [setPreferences]);

  const isTrendSaved = useCallback((trendId: string) => {
    return preferences.savedTrends.includes(trendId);
  }, [preferences.savedTrends]);

  return (
    <TrendContext.Provider
      value={{
        trends,
        filteredTrends,
        topTrends,
        selectedLocation: preferences.selectedLocation,
        setSelectedLocation,
        locations,
        userMode: preferences.userMode,
        setUserMode,
        selectedCategory: preferences.selectedCategory || 'all',
        setSelectedCategory,
        savedContent: preferences.savedContent,
        addContent,
        deleteContent,
        savedTrendIds: preferences.savedTrends,
        toggleSaveTrend,
        isTrendSaved,
        recentSearches: preferences.recentSearches,
        addRecentSearch,
        searchQuery,
        setSearchQuery,
        isLoaded: true,
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
