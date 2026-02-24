import { TrendScore, TrendLevel } from './types';

export function calculateTrendScore(
  mentions: number,
  growthRate: number,
  timeDecay: number = 1
): number {
  // Algorithm: (Mentions × Growth Rate) / Time Decay
  // Normalized to 0-100 scale
  const rawScore = (mentions * growthRate * (1 / timeDecay)) / 100;
  return Math.min(100, Math.max(0, rawScore));
}

export function normalizeScore(rawScore: number): number {
  // Normalize to 0-100 scale
  return Math.round(Math.min(100, Math.max(0, rawScore)));
}

export function getTrendLevel(score: number): TrendLevel {
  if (score >= 80) return 'explosive';
  if (score >= 60) return 'viral';
  if (score >= 30) return 'rising';
  return 'low';
}

export function getTrendLevelColor(level: TrendLevel): string {
  switch (level) {
    case 'explosive':
      return 'text-rose-500';
    case 'viral':
      return 'text-orange-500';
    case 'rising':
      return 'text-amber-500';
    default:
      return 'text-muted-foreground';
  }
}

export function getTrendLevelBgColor(level: TrendLevel): string {
  switch (level) {
    case 'explosive':
      return 'bg-rose-500/20 border-rose-500/30';
    case 'viral':
      return 'bg-orange-500/20 border-orange-500/30';
    case 'rising':
      return 'bg-amber-500/20 border-amber-500/30';
    default:
      return 'bg-muted/20 border-muted/30';
  }
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function getTimeDecay(hoursOld: number): number {
  // Time decay factor - trends lose relevance over time
  // After 24 hours, decay is 2x, after 48 hours 4x, etc.
  return Math.pow(2, hoursOld / 24);
}

export function formatTrendScore(score: number): string {
  return score.toFixed(1);
}

export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    food: '🍽️',
    fashion: '👗',
    music: '🎵',
    events: '🎉',
    nightlife: '🌙',
    sports: '⚽',
    tech: '💻',
    travel: '✈️',
    wellness: '🧘',
    art: '🎨',
  };
  return emojis[category] || '📈';
}
