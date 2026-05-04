import { useEffect, useMemo, useState } from "react";
import { loadLS, saveLS, todayKey, uid } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Session { id: string; subject: string; minutes: number; date: string; }

export const StudyMonitor = ({ accent }: { accent: string }) => {
  const KEY = "hexa.daily.study";
  const [items, setItems] = useState<Session[]>(() => loadLS<Session[]>(KEY, []));
  const [subject, setSubject] = useState("");
  const [minutes, setMinutes] = useState("");

  useEffect(() => saveLS(KEY, items), [items]);

  const add = () => {
    const m = parseInt(minutes, 10);
    if (!subject.trim() || !m) return;
    setItems(x => [{ id: uid(), subject: subject.trim(), minutes: m, date: todayKey() }, ...x]);
    setMinutes("");
  };

  const today = todayKey();
  const todayMin = useMemo(() => items.filter(x => x.date === today).reduce((s, x) => s + x.minutes, 0), [items, today]);
  const weekMin = useMemo(() => {
    const wk = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return todayKey(d); });
    return items.filter(x => wk.includes(x.date)).reduce((s, x) => s + x.minutes, 0);
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject"
          className="bg-input border border-border rounded-lg px-3 py-2 text-sm" />
        <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="Minutes"
          className="bg-input border border-border rounded-lg px-3 py-2 text-sm" />
        <Button onClick={add} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}>
          <Plus className="h-4 w-4 mr-1" /> Log
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border/60 bg-gradient-card p-4">
          <div className="text-xs text-muted-foreground">Today</div>
          <div className="text-2xl font-bold" style={{ color: `hsl(${accent})` }}>{todayMin} min</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-gradient-card p-4">
          <div className="text-xs text-muted-foreground">Last 7 days</div>
          <div className="text-2xl font-bold" style={{ color: `hsl(${accent})` }}>{weekMin} min</div>
        </div>
      </div>

      <div className="space-y-2">
        {items.map(x => (
          <div key={x.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-2.5">
            <div>
              <div className="text-sm font-medium">{x.subject}</div>
              <div className="text-xs text-muted-foreground">{x.date}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm">{x.minutes} min</span>
              <button onClick={() => setItems(arr => arr.filter(y => y.id !== x.id))} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-muted-foreground py-8">No sessions logged.</p>}
      </div>
    </div>
  );
};
