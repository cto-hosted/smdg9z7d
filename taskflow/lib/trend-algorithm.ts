import { TrendLevel } from './types';

export function calculateTrendScore(
  mentions: number,
  growthRate: number,
  timeDecay: number
): number {
  const rawScore = (mentions * growthRate) / Math.max(timeDecay, 1);
  return normalizeScore(rawScore);
}

export function normalizeScore(rawScore: number): number {
  const minScore = 0;
  const maxScore = 100;
  
  if (rawScore <= minScore) return minScore;
  if (rawScore >= maxScore) return maxScore;
  
  return Math.round(rawScore);
}

export function getTrendLevel(score: number): TrendLevel {
  if (score < 25) return 'low';
  if (score < 50) return 'rising';
  if (score < 75) return 'viral';
  return 'explosive';
}

export function getTrendLevelColor(level: TrendLevel): string {
  switch (level) {
    case 'low':
      return 'text-muted-foreground';
    case 'rising':
      return 'text-amber-400';
    case 'viral':
      return 'text-orange-500';
    case 'explosive':
      return 'text-rose-500';
  }
}

export function getTrendLevelBgColor(level: TrendLevel): string {
  switch (level) {
    case 'low':
      return 'bg-muted';
    case 'rising':
      return 'bg-amber-500/20';
    case 'viral':
      return 'bg-orange-500/20';
    case 'explosive':
      return 'bg-rose-500/20';
  }
}

export function calculateGrowthIndicator(
  current: number,
  previous: number
): { value: number; direction: 'up' | 'down' | 'stable' } {
  if (previous === 0) return { value: 100, direction: 'up' };
  
  const change = ((current - previous) / previous) * 100;
  
  return {
    value: Math.abs(Math.round(change)),
    direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
  };
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    food: '🍔',
    events: '🎉',
    music: '🎵',
    fashion: '👗',
    tech: '💻',
    sports: '⚽',
    nightlife: '🌙',
    lifestyle: '✨',
  };
  return icons[category] || '📈';
}

export function sortTrendsByScore(trends: { score: number }[]): { score: number }[] {
  return [...trends].sort((a, b) => b.score - a.score);
}

export function filterTrendsByCategory<T extends { category: string }>(
  trends: T[],
  category: string | 'all'
): T[] {
  if (category === 'all') return trends;
  return trends.filter((trend) => trend.category === category);
}

export function filterTrendsByLevel<T extends { level: TrendLevel }>(
  trends: T[],
  level: TrendLevel | 'all'
): T[] {
  if (level === 'all') return trends;
  return trends.filter((trend) => trend.level === level);
}
