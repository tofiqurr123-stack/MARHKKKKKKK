import {
  Activity, BookOpen, Calculator, CalendarCheck, ClipboardList, Clock, Coins,
  CreditCard, Droplets, Dumbbell, FileText, Hash, Heart, Lightbulb, ListTodo,
  Moon, Music, NotebookPen, Quote, Repeat, Ruler, Smile, Target,
  Timer, Wallet, type LucideIcon
} from "lucide-react";

export interface DailyTool {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  /** hsl values without hsl() wrapper */
  accent: string;
}

export const DAILY_TOOLS: DailyTool[] = [
  { slug: "habit-tracker",   name: "Habit Tracker",      description: "Build streaks for daily habits.",         icon: Repeat,        accent: "180 100% 55%" },
  { slug: "expense-tracker", name: "Expense Tracker",    description: "Log every expense, see totals.",          icon: CreditCard,    accent: "10 95% 60%" },
  { slug: "budget-tracker",  name: "Budget Tracker",     description: "Set monthly budgets, watch progress.",    icon: Wallet,        accent: "30 100% 60%" },
  { slug: "study-monitor",   name: "Study Monitor",      description: "Track minutes studied per subject.",      icon: BookOpen,      accent: "210 100% 65%" },
  { slug: "todo",            name: "To-Do List",         description: "Capture tasks. Check them off.",          icon: ListTodo,      accent: "200 90% 55%" },
  { slug: "pomodoro",        name: "Pomodoro Timer",     description: "Focus 25 / break 5. Repeat.",             icon: Timer,         accent: "0 90% 60%" },
  { slug: "daily-quote",     name: "Daily Quote",        description: "An AI-generated quote, every day.",       icon: Quote,         accent: "270 90% 65%" },
  { slug: "water-tracker",   name: "Water Tracker",      description: "Drink your 8 glasses.",                   icon: Droplets,      accent: "200 100% 60%" },
  { slug: "workout-log",     name: "Workout Log",        description: "Log sets, reps, weights.",                icon: Dumbbell,      accent: "0 90% 50%" },
  { slug: "mood-journal",    name: "Mood Journal",       description: "Track how you feel each day.",            icon: Smile,         accent: "50 100% 60%" },
  { slug: "sleep-tracker",   name: "Sleep Tracker",      description: "Hours slept, quality 1–5.",               icon: Moon,          accent: "240 60% 65%" },
  { slug: "notes",           name: "Quick Notes",        description: "Jot ideas in seconds.",                   icon: NotebookPen,   accent: "160 80% 50%" },
  { slug: "goals",           name: "Goal Tracker",       description: "Long-term goals with % progress.",        icon: Target,        accent: "320 90% 60%" },
  { slug: "calculator",      name: "Calculator",         description: "Quick math, no friction.",                icon: Calculator,    accent: "200 30% 60%" },
  { slug: "unit-converter",  name: "Unit Converter",     description: "Length, weight, temperature.",            icon: Ruler,         accent: "140 70% 50%" },
  { slug: "currency",        name: "Currency Converter", description: "Convert with mid-market rates.",          icon: Coins,         accent: "45 100% 55%" },
  { slug: "stopwatch",       name: "Stopwatch",          description: "Start, lap, reset.",                      icon: Clock,         accent: "180 80% 55%" },
  { slug: "countdown",       name: "Countdown",          description: "Count down to any date.",                 icon: CalendarCheck, accent: "300 90% 60%" },
  { slug: "meditation",      name: "Meditation Timer",   description: "Breathe in, breathe out.",                icon: Heart,         accent: "340 90% 65%" },
  { slug: "music-mood",      name: "Music Mood Picker",  description: "AI suggests music for your mood.",        icon: Music,         accent: "280 80% 60%" },
  { slug: "idea-jar",        name: "Idea Jar",           description: "Save sparks. Revisit later.",             icon: Lightbulb,     accent: "55 100% 55%" },
  { slug: "checklist",       name: "Checklist Builder",  description: "Reusable checklists for routines.",       icon: ClipboardList, accent: "180 70% 55%" },
  { slug: "word-counter",    name: "Word Counter",       description: "Count words, characters, reading time.",  icon: FileText,      accent: "30 80% 55%" },
  { slug: "tip-calculator",  name: "Tip Calculator",     description: "Split bills with tip.",                   icon: Hash,          accent: "150 70% 50%" },
  { slug: "activity-log",    name: "Activity Log",       description: "Time-stamped log of your day.",           icon: Activity,      accent: "190 90% 55%" },
];

export const getDailyToolBySlug = (slug: string) =>
  DAILY_TOOLS.find(t => t.slug === slug);
