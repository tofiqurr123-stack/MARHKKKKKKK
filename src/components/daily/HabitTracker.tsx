import { useEffect, useState } from "react";
import { loadLS, saveLS, todayKey, uid } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Plus, Check, Trash2, Flame, X } from "lucide-react";

interface Habit { id: string; name: string; days: Record<string, boolean>; }

export const HabitTracker = ({ accent }: { accent: string }) => {
  const KEY = "hexa.daily.habits";
  const [habits, setHabits] = useState<Habit[]>(() => loadLS<Habit[]>(KEY, []));
  const [name, setName] = useState("");
  const today = todayKey();

  useEffect(() => saveLS(KEY, habits), [habits]);

  const add = () => {
    if (!name.trim()) return;
    setHabits(h => [...h, { id: uid(), name: name.trim(), days: {} }]);
    setName("");
  };
  const toggle = (id: string) => setHabits(h => h.map(x => x.id === id ? { ...x, days: { ...x.days, [today]: !x.days[today] } } : x));
  const remove = (id: string) => setHabits(h => h.filter(x => x.id !== id));

  const streak = (h: Habit) => {
    let s = 0;
    const d = new Date();
    while (h.days[todayKey(d)]) { s++; d.setDate(d.getDate() - 1); }
    return s;
  };

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return todayKey(d);
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="New habit (e.g. Read 20 pages)"
          className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
        />
        <Button onClick={add} className="gap-1" style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {habits.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No habits yet. Add your first.</p>
      ) : (
        <div className="space-y-3">
          {habits.map(h => (
            <div key={h.id} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between mb-3 gap-3">
                <div>
                  <h3 className="font-semibold">{h.name}</h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Flame className="h-3 w-3" style={{ color: `hsl(${accent})` }} /> {streak(h)} day streak
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={h.days[today] ? "default" : "outline"}
                    onClick={() => toggle(h.id)}
                    style={h.days[today] ? { background: `hsl(${accent})`, color: "hsl(var(--background))" } : {}}
                  >
                    <Check className="h-4 w-4" /> Today
                  </Button>
                  <button onClick={() => remove(h.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-1.5">
                {last7.map(d => (
                  <div
                    key={d}
                    title={d}
                    className="flex-1 h-8 rounded-md flex items-center justify-center"
                    style={{
                      background: h.days[d] ? `hsl(${accent} / 0.7)` : "hsl(var(--muted))",
                      border: `1px solid hsl(${accent} / ${h.days[d] ? 0.6 : 0.15})`,
                    }}
                  >
                    {h.days[d] ? <Check className="h-3 w-3 text-background" /> : <X className="h-3 w-3 text-muted-foreground/50" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
