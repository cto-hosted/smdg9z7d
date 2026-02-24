import { Trend, Location, CreatorContent, TrendCategory } from './types';
import { calculateTrendScore, getTrendLevel } from './trend-algorithm';

export const sampleLocations: Location[] = [
  { id: '1', name: 'Berlin', city: 'Berlin', country: 'Germany', coordinates: { lat: 52.52, lng: 13.405 } },
  { id: '2', name: 'Hamburg', city: 'Hamburg', country: 'Germany', coordinates: { lat: 53.5511, lng: 9.9937 } },
  { id: '3', name: 'München', city: 'Munich', country: 'Germany', coordinates: { lat: 48.1351, lng: 11.582 } },
  { id: '4', name: 'Köln', city: 'Cologne', country: 'Germany', coordinates: { lat: 50.9375, lng: 6.9603 } },
  { id: '5', name: 'Frankfurt', city: 'Frankfurt', country: 'Germany', coordinates: { lat: 50.1109, lng: 8.6821 } },
  { id: '6', name: 'New York', city: 'New York', country: 'USA', coordinates: { lat: 40.7128, lng: -74.006 } },
  { id: '7', name: 'Los Angeles', city: 'Los Angeles', country: 'USA', coordinates: { lat: 34.0522, lng: -118.2437 } },
  { id: '8', name: 'London', city: 'London', country: 'UK', coordinates: { lat: 51.5074, lng: -0.1278 } },
  { id: '9', name: 'Paris', city: 'Paris', country: 'France', coordinates: { lat: 48.8566, lng: 2.3522 } },
  { id: '10', name: 'Tokyo', city: 'Tokyo', country: 'Japan', coordinates: { lat: 35.6762, lng: 139.6503 } },
];

const generateTrends = (location: Location): Trend[] => {
  const trendTemplates = [
    { name: 'Art', category: 'art' as TrendCategory, keywords: ['gallery', 'exhibition', 'contemporary'] },
    { name: 'Sushi-Restaurant', category: 'food' as TrendCategory, keywords: ['omakase', 'izakaya', 'japanese'] },
    { name: 'Rooftop-Bar', category: 'nightlife' as TrendCategory, keywords: ['cocktails', 'skybar', 'views'] },
    { name: 'Vintage-Mode', category: 'fashion' as TrendCategory, keywords: ['thrift', 'retro', 'secondhand'] },
    { name: 'Techno-Club', category: 'music' as TrendCategory, keywords: ['dj', 'electronic', 'underground'] },
    { name: 'Yoga-Event', category: 'wellness' as TrendCategory, keywords: ['meditation', 'soundbath', 'retreat'] },
    { name: 'Food-Truck-Festival', category: 'events' as TrendCategory, keywords: ['streetfood', 'outdoor', 'festival'] },
    { name: 'Kajak-Tour', category: 'travel' as TrendCategory, keywords: ['water', 'adventure', 'nature'] },
    { name: 'Fussball-Match', category: 'sports' as TrendCategory, keywords: ['bundesliga', 'public-viewing', 'live'] },
    { name: 'Tech-Startup-Event', category: 'tech' as TrendCategory, keywords: ['networking', 'innovation', 'pitch'] },
    { name: 'Craft-Beer-Garten', category: 'food' as TrendCategory, keywords: ['brewery', 'local', 'outdoor'] },
    { name: 'Vinyl-Store', category: 'music' as TrendCategory, keywords: ['record', 'vintage', 'collectors'] },
    { name: 'Street-Art-Tour', category: 'art' as TrendCategory, keywords: ['graffiti', 'murals', 'walking'] },
    { name: 'Fitness-Camp', category: 'wellness' as TrendCategory, keywords: ['outdoor', 'bootcamp', 'community'] },
    { name: 'Pop-up-Shop', category: 'fashion' as TrendCategory, keywords: ['limited', 'collaboration', 'exclusive'] },
  ];

  return trendTemplates.map((template, index) => {
    const mentions = Math.floor(Math.random() * 5000) + 500;
    const growthRate = Math.floor(Math.random() * 150) + 10;
    const rawScore = calculateTrendScore(mentions, growthRate);
    const normalizedScore = Math.round(rawScore);

    return {
      id: `${location.id}-${index}`,
      name: `${template.name} in ${location.city}`,
      category: template.category,
      location,
      score: {
        raw: rawScore,
        normalized: normalizedScore,
        level: getTrendLevel(normalizedScore),
        mentions,
        growthRate,
        timeDecay: 1,
      },
      description: `The latest ${template.name.toLowerCase()} trend making waves in ${location.city}. Popular keywords: ${template.keywords.join(', ')}.`,
      keywords: template.keywords,
      peakHours: generatePeakHours(),
      relatedTrends: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};

function generatePeakHours(): number[] {
  const peakTimes = [18, 19, 20, 21, 22, 23];
  const randomPeaks = peakTimes.filter(() => Math.random() > 0.5);
  return randomPeaks.length > 0 ? randomPeaks : [19, 20, 21];
}

export const sampleTrends: Trend[] = sampleLocations.flatMap(generateTrends);

export const sampleCreatorContent: CreatorContent[] = [
  {
    id: '1',
    type: 'hook',
    platform: 'tiktok',
    content: "🔥 Wait till you see what's trending in Berlin right now!",
    trendId: '1-0',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'caption',
    platform: 'instagram',
    content: "Living my best life at the hottest rooftop bar in town 🍸✨ #trending #nightlife #cityvibes",
    trendId: '1-2',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'hashtags',
    platform: 'tiktok',
    content: "#BerlinNights #RooftopVibes #CityLife #NightOut #TrendingNow #MustVisit #WeekendPlans",
    trendId: '1-2',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    type: 'script',
    platform: 'youtube',
    content: "Hey everyone! Today we're exploring the top 5 trends taking over Berlin right now. From food to fashion, this city is buzzing! Let's dive in...",
    trendId: '1-0',
    createdAt: new Date().toISOString(),
  },
];

export function getTrendsByLocation(locationId: string): Trend[] {
  return sampleTrends.filter((trend) => trend.location.id === locationId);
}

export function getTrendById(id: string): Trend | undefined {
  return sampleTrends.find((trend) => trend.id === id);
}

export function getTrendsByCategory(category: TrendCategory): Trend[] {
  return sampleTrends.filter((trend) => trend.category === category);
}

export function getTopTrends(locationId: string, limit: number = 10): Trend[] {
  return getTrendsByLocation(locationId)
    .sort((a, b) => b.score.normalized - a.score.normalized)
    .slice(0, limit);
}

export const categories: { value: TrendCategory; label: string; emoji: string }[] = [
  { value: 'food', label: 'Food & Drinks', emoji: '🍽️' },
  { value: 'fashion', label: 'Fashion', emoji: '👗' },
  { value: 'music', label: 'Music', emoji: '🎵' },
  { value: 'events', label: 'Events', emoji: '🎉' },
  { value: 'nightlife', label: 'Nightlife', emoji: '🌙' },
  { value: 'sports', label: 'Sports', emoji: '⚽' },
  { value: 'tech', label: 'Tech', emoji: '💻' },
  { value: 'travel', label: 'Travel', emoji: '✈️' },
  { value: 'wellness', label: 'Wellness', emoji: '🧘' },
  { value: 'art', label: 'Art & Culture', emoji: '🎨' },
];
