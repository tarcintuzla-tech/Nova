import { Compass, BookOpen, Eye, Sprout, HeartHandshake, Users } from 'lucide-react-native';

export const MODULES = [
  { id: 'self', Icon: Compass },
  { id: 'learning', Icon: BookOpen },
  { id: 'awareness', Icon: Eye },
  { id: 'growth', Icon: Sprout },
  { id: 'kindness', Icon: HeartHandshake },
  { id: 'people', Icon: Users },
] as const;
export type ModuleId = (typeof MODULES)[number]['id'];
export const INTERESTS = ['psychology', 'science', 'history', 'philosophy', 'technology', 'nature'] as const;
export const GOALS = ['focus', 'habits', 'selfKnow', 'learning', 'kindness', 'communication'] as const;
