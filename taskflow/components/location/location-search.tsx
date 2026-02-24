'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrends } from '@/lib/trend-store';
import { Location } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function LocationSearch() {
  const { locations, selectedLocation, setSelectedLocation, recentSearches, addRecentSearch } = useTrends();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredLocations = query
    ? locations.filter(
        (loc) =>
          loc.city.toLowerCase().includes(query.toLowerCase()) ||
          loc.name.toLowerCase().includes(query.toLowerCase()) ||
          loc.country.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const displayLocations = query ? filteredLocations : recentSearches.length > 0 ? recentSearches : locations.slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location: Location) => {
    setSelectedLocation(location);
    addRecentSearch(location);
    setQuery('');
    setIsOpen(false);
  };

  const handleUseCurrentLocation = () => {
    // In a real app, this would use geolocation API
    // For demo, we'll just select the first location
    if (locations.length > 0) {
      handleSelect(locations[0]);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          className="pl-9 pr-20 h-11 bg-white/5 border-white/10 focus:border-orange-500/50 focus:ring-orange-500/20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {selectedLocation && (
            <span className="text-xs text-orange-400 hidden sm:inline">
              {selectedLocation.city}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-white/10"
            onClick={handleUseCurrentLocation}
          >
            <Navigation className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {!query && recentSearches.length > 0 && (
              <div className="p-2 border-b border-white/10">
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Recent searches
                </div>
              </div>
            )}
            
            {query && filteredLocations.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No locations found for "{query}"
              </div>
            )}

            <div className="max-h-64 overflow-y-auto">
              {displayLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelect(location)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors',
                    selectedLocation?.id === location.id && 'bg-orange-500/10'
                  )}
                >
                  <MapPin className={cn(
                    'h-4 w-4',
                    selectedLocation?.id === location.id ? 'text-orange-400' : 'text-muted-foreground'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium truncate',
                      selectedLocation?.id === location.id ? 'text-orange-400' : 'text-foreground'
                    )}>
                      {location.city}
                    </p>
                    <p className="text-xs text-muted-foreground">{location.country}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
