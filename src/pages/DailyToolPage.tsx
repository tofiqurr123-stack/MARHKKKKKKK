import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getDailyToolBySlug } from "@/data/dailyTools";
import { ArrowLeft } from "lucide-react";
import * as Tools from "@/components/daily";

const COMPONENTS: Record<string, React.ComponentType<any>> = {
  "habit-tracker": Tools.HabitTracker,
  "expense-tracker": Tools.ExpenseTracker,
  "budget-tracker": Tools.BudgetTracker,
  "study-monitor": Tools.StudyMonitor,
  "todo": Tools.TodoList,
  "pomodoro": Tools.Pomodoro,
  "daily-quote": Tools.DailyQuote,
  "water-tracker": Tools.WaterTracker,
  "workout-log": Tools.WorkoutLog,
  "mood-journal": Tools.MoodJournal,
  "sleep-tracker": Tools.SleepTracker,
  "notes": Tools.QuickNotes,
  "goals": Tools.GoalTracker,
  "calculator": Tools.SimpleCalculator,
  "unit-converter": Tools.UnitConverter,
  "currency": Tools.CurrencyConverter,
  "stopwatch": Tools.Stopwatch,
  "countdown": Tools.Countdown,
  "meditation": Tools.MeditationTimer,
  "music-mood": Tools.MusicMood,
  "idea-jar": Tools.IdeaJar,
  "checklist": Tools.ChecklistBuilder,
  "word-counter": Tools.WordCounter,
  "tip-calculator": Tools.TipCalculator,
  "activity-log": Tools.ActivityLog,
};

const DailyToolPage = () => {
  const { slug } = useParams();
  const tool = slug ? getDailyToolBySlug(slug) : null;
  const Comp = slug ? COMPONENTS[slug] : null;

  if (!tool || !Comp) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container py-20 text-center flex-1">
          <h1 className="text-3xl font-bold mb-4">Tool not found</h1>
          <Link to="/daily" className="text-primary hover:underline">All daily tools</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = tool.icon;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section
        className="border-b border-border/60"
        style={{ background: `linear-gradient(135deg, hsl(${tool.accent} / 0.15), transparent 70%)` }}
      >
        <div className="container py-8">
          <Link to="/daily" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> All daily tools
          </Link>
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-xl flex items-center justify-center"
              style={{ background: `hsl(${tool.accent} / 0.15)`, border: `1px solid hsl(${tool.accent} / 0.4)` }}
            >
              <Icon className="h-7 w-7" style={{ color: `hsl(${tool.accent})` }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{tool.name}</h1>
              <p className="text-muted-foreground text-sm">{tool.description}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-8 flex-1">
        <div className="max-w-3xl mx-auto">
          <Comp accent={tool.accent} />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default DailyToolPage;
