import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TrendLevel } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
