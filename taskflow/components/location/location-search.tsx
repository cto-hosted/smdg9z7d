'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Location } from '@/lib/types';
import { useTrends } from '@/lib/trend-store';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationSearchProps {
  className?: string;
}

export function LocationSearch({ className }: LocationSearchProps) {
  const { locations, selectedLocation, setSelectedLocation, recentSearches, addRecentSearch } = useTrends();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.country.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowRecent(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location: Location) => {
    setSelectedLocation(location);
    addRecentSearch(location.name);
    setSearch('');
    setIsOpen(false);
    setShowRecent(false);
  };

  const handleRecentClick = (cityName: string) => {
    const location = locations.find((l) => l.name === cityName);
    if (location) {
      handleSelect(location);
    }
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            setShowRecent(e.target.value === '');
          }}
          onFocus={() => {
            setIsOpen(true);
            setShowRecent(search === '');
          }}
          className="pl-9 pr-9 bg-white/5 border-white/10 focus:border-rose-500/50 focus:ring-rose-500/20"
        />
        {search && (
          <button
            onClick={() => {
              setSearch('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-popover border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {showRecent && recentSearches.length > 0 ? (
              <div className="p-2">
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Recent searches
                </div>
                {recentSearches.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleRecentClick(city)}
                    className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {city}
                  </button>
                ))}
              </div>
            ) : filteredLocations.length > 0 ? (
              <div className="p-2 max-h-64 overflow-y-auto">
                {filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleSelect(location)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-white/5 rounded-lg transition-colors',
                      selectedLocation?.id === location.id && 'bg-rose-500/10'
                    )}
                  >
                    <MapPin className="h-4 w-4 text-rose-400" />
                    <span>{location.name}</span>
                    <span className="text-muted-foreground text-xs ml-auto">
                      {location.country}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No locations found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
