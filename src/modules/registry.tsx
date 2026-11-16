import type React from 'react';
import type { ModuleId } from '../constants/modules';
import * as self from './self/sections';
import * as learning from './learning/sections';
import * as awareness from './awareness/sections';
import * as growth from './growth/sections';
import * as kindness from './kindness/sections';
import * as people from './people/sections';

type Section = { id: string; Component: React.ComponentType };

export const REGISTRY: Record<ModuleId, Section[]> = {
  self: [
    { id: 'today', Component: self.TodaySection }, { id: 'journal', Component: self.JournalSection },
    { id: 'values', Component: self.ValuesSection }, { id: 'strengths', Component: self.StrengthsSection },
    { id: 'goals', Component: self.GoalsSection }, { id: 'history', Component: self.HistorySection },
    { id: 'summary', Component: self.SummarySection },
  ],
  learning: [
    { id: 'today', Component: learning.TodaySection }, { id: 'library', Component: learning.LibrarySection },
    { id: 'favorites', Component: learning.FavoritesSection }, { id: 'history', Component: learning.HistorySection },
    { id: 'quiz', Component: learning.QuizSection },
  ],
  awareness: [
    { id: 'today', Component: awareness.TodaySection }, { id: 'exercises', Component: awareness.ExercisesSection },
    { id: 'gratitude', Component: awareness.GratitudeSection }, { id: 'reflection', Component: awareness.ReflectionSection },
    { id: 'history', Component: awareness.HistorySection },
  ],
  growth: [
    { id: 'today', Component: growth.TodaySection }, { id: 'habits', Component: growth.HabitsSection },
    { id: 'goals', Component: growth.GoalsSection }, { id: 'stats', Component: growth.StatsSection },
  ],
  kindness: [
    { id: 'today', Component: kindness.TodaySection }, { id: 'ideas', Component: kindness.IdeasSection },
    { id: 'history', Component: kindness.HistorySection },
  ],
  people: [
    { id: 'cards', Component: people.CardsSection }, { id: 'scenarios', Component: people.ScenariosSection },
    { id: 'reflection', Component: people.ReflectionSection }, { id: 'quiz', Component: people.QuizSection },
    { id: 'saved', Component: () => learning.FavoritesSection({ prefix: 'p-' }) },
  ],
};
