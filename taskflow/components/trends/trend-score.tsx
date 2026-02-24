'use client';

import { motion } from 'framer-motion';
import { TrendLevel } from '@/lib/types';
import { getTrendLevelColor } from '@/lib/utils';

interface TrendScoreProps {
  score: number;
  level: TrendLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function TrendScore({ score, level, size = 'md', showLabel = true }: TrendScoreProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  const ringSizes = {
    sm: 40,
    md: 80,
    lg: 120,
  };

  const circumference = 2 * Math.PI * (ringSizes[size] / 2 - 6);
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const levelLabels: Record<TrendLevel, string> = {
    low: 'Low Activity',
    rising: 'Rising Fast',
    viral: 'Going Viral',
    explosive: 'Explosive!',
  };

  const levelGradients: Record<TrendLevel, string> = {
    low: 'from-slate-400 to-slate-500',
    rising: 'from-amber-400 to-orange-500',
    viral: 'from-orange-500 to-rose-500',
    explosive: 'from-rose-500 via-red-500 to-pink-500',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: ringSizes[size], height: ringSizes[size] }}>
        <svg
          className="transform -rotate-90"
          width={ringSizes[size]}
          height={ringSizes[size]}
        >
          <circle
            cx={ringSizes[size] / 2}
            cy={ringSizes[size] / 2}
            r={ringSizes[size] / 2 - 6}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-white/10"
          />
          <motion.circle
            cx={ringSizes[size] / 2}
            cy={ringSizes[size] / 2}
            r={ringSizes[size] / 2 - 6}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={`stop-color-${level === 'explosive' ? 'rose' : level === 'viral' ? 'orange' : level === 'rising' ? 'amber' : 'slate'}-500`} />
              <stop offset="100%" className={`stop-color-${level === 'explosive' ? 'pink' : level === 'viral' ? 'rose' : level === 'rising' ? 'orange' : 'slate'}-500`} />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-bold bg-gradient-to-br bg-clip-text text-transparent ${levelGradients[level]}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            {score}
          </motion.span>
        </div>
      </div>

      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <span className={`text-sm font-semibold ${getTrendLevelColor(level)}`}>
            {levelLabels[level]}
          </span>
        </motion.div>
      )}
    </div>
  );
}
