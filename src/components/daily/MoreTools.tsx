import { useEffect, useMemo, useRef, useState } from "react";
import { loadLS, saveLS, todayKey, uid } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Play, Pause, RotateCcw, Sparkles, Loader2 } from "lucide-react";
import { generateText } from "@/lib/hexaAI";
import { toast } from "sonner";

type AP = { accent: string };

/* ----------------- Todo ----------------- */
interface Todo { id: string; text: string; done: boolean; }
export const TodoList = ({ accent }: AP) => {
  const KEY = "hexa.daily.todo";
  const [items, setItems] = useState<Todo[]>(() => loadLS<Todo[]>(KEY, []));
  const [text, setText] = useState("");
  useEffect(() => saveLS(KEY, items), [items]);
  const add = () => { if (!text.trim()) return; setItems(x => [{ id: uid(), text: text.trim(), done: false }, ...x]); setText(""); };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="What needs doing?"
          className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm" />
        <Button onClick={add} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="space-y-2">
        {items.map(t => (
          <label key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-card cursor-pointer">
            <input type="checkbox" checked={t.done} onChange={() => setItems(x => x.map(y => y.id === t.id ? { ...y, done: !y.done } : y))}
              className="h-4 w-4 accent-primary" />
            <span className={`flex-1 text-sm ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.text}</span>
            <button onClick={() => setItems(x => x.filter(y => y.id !== t.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </label>
        ))}
        {items.length === 0 && <p className="text-center text-muted-foreground py-8">No tasks. Enjoy your free time!</p>}
      </div>
    </div>
  );
};

/* ----------------- Pomodoro ----------------- */
export const Pomodoro = ({ accent }: AP) => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (running) {
      ref.current = window.setInterval(() => setSeconds(s => {
        if (s <= 1) { setRunning(false); toast.success(mode === "focus" ? "Focus done — take a break!" : "Break over — let's go!"); return mode === "focus" ? 5 * 60 : 25 * 60; }
        return s - 1;
      }), 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, mode]);
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center gap-2">
        {(["focus", "break"] as const).map(t => (
          <button key={t} onClick={() => { setMode(t); setSeconds(t === "focus" ? 25 * 60 : 5 * 60); setRunning(false); }}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${mode === t ? "" : "border-border/60 text-muted-foreground"}`}
            style={mode === t ? { background: `hsl(${accent})`, color: "hsl(var(--background))", borderColor: `hsl(${accent})` } : {}}>
            {t === "focus" ? "Focus 25" : "Break 5"}
          </button>
        ))}
      </div>
      <div className="font-mono text-8xl font-bold tabular-nums" style={{ color: `hsl(${accent})`, textShadow: `0 0 40px hsl(${accent} / 0.5)` }}>
        {m}:{s}
      </div>
      <div className="flex justify-center gap-3">
        <Button size="lg" onClick={() => setRunning(r => !r)} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}>
          {running ? <><Pause className="h-5 w-5 mr-2" /> Pause</> : <><Play className="h-5 w-5 mr-2" /> Start</>}
        </Button>
        <Button size="lg" variant="outline" onClick={() => { setRunning(false); setSeconds(mode === "focus" ? 25 * 60 : 5 * 60); }}>
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

/* ----------------- Daily Quote ----------------- */
export const DailyQuote = ({ accent }: AP) => {
  const KEY = "hexa.daily.quote";
  const [data, setData] = useState<{ date: string; quote: string }>(() => loadLS(KEY, { date: "", quote: "" }));
  const [loading, setLoading] = useState(false);
  const today = todayKey();

  const fetchQuote = async () => {
    setLoading(true);
    const text = await generateText("Give me ONE original, motivating quote for today (max 25 words). Output only the quote in quotes, then a dash and the imagined author. Nothing else.");
    setLoading(false);
    if (text) { const next = { date: today, quote: text.trim() }; setData(next); saveLS(KEY, next); }
  };

  useEffect(() => { if (data.date !== today) fetchQuote(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="text-center space-y-5 py-12">
      {loading ? (
        <Loader2 className="h-8 w-8 animate-spin mx-auto" style={{ color: `hsl(${accent})` }} />
      ) : (
        <p className="text-2xl md:text-3xl font-medium leading-snug max-w-2xl mx-auto">{data.quote || "Click the button to get your quote."}</p>
      )}
      <Button onClick={fetchQuote} disabled={loading} variant="outline" className="gap-2"><Sparkles className="h-4 w-4" /> New quote</Button>
    </div>
  );
};

/* ----------------- Water ----------------- */
export const WaterTracker = ({ accent }: AP) => {
  const KEY = "hexa.daily.water";
  const today = todayKey();
  const [data, setData] = useState<Record<string, number>>(() => loadLS(KEY, {}));
  useEffect(() => saveLS(KEY, data), [data]);
  const cups = data[today] || 0;
  const set = (n: number) => setData(d => ({ ...d, [today]: Math.max(0, Math.min(20, n)) }));
  return (
    <div className="space-y-6 py-6">
      <div className="text-center">
        <div className="text-sm text-muted-foreground">Today</div>
        <div className="text-6xl font-bold" style={{ color: `hsl(${accent})` }}>{cups}<span className="text-2xl text-muted-foreground"> / 8</span></div>
      </div>
      <div className="grid grid-cols-8 gap-2 max-w-md mx-auto">
        {Array.from({ length: 8 }, (_, i) => (
          <button key={i} onClick={() => set(i < cups ? i : i + 1)}
            className="aspect-[2/3] rounded-md border-2 transition-all"
            style={{ background: i < cups ? `hsl(${accent} / 0.6)` : "transparent", borderColor: `hsl(${accent} / ${i < cups ? 0.8 : 0.3})` }} />
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={() => set(cups - 1)}>-1</Button>
        <Button onClick={() => set(cups + 1)} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}>+1 cup</Button>
      </div>
    </div>
  );
};

/* ----------------- Workout Log ----------------- */
interface Workout { id: string; exercise: string; sets: number; reps: number; weight: number; date: string; }
export const WorkoutLog = ({ accent }: AP) => {
  const KEY = "hexa.daily.workouts";
  const [items, setItems] = useState<Workout[]>(() => loadLS<Workout[]>(KEY, []));
  const [f, setF] = useState({ exercise: "", sets: "3", reps: "10", weight: "0" });
  useEffect(() => saveLS(KEY, items), [items]);
  const add = () => {
    if (!f.exercise.trim()) return;
    setItems(x => [{ id: uid(), exercise: f.exercise.trim(), sets: +f.sets, reps: +f.reps, weight: +f.weight, date: todayKey() }, ...x]);
    setF({ ...f, exercise: "" });
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <input className="md:col-span-2 bg-input border border-border rounded-lg px-3 py-2 text-sm" placeholder="Exercise" value={f.exercise} onChange={(e) => setF({ ...f, exercise: e.target.value })} />
        <input type="number" className="bg-input border border-border rounded-lg px-3 py-2 text-sm" placeholder="Sets" value={f.sets} onChange={(e) => setF({ ...f, sets: e.target.value })} />
        <input type="number" className="bg-input border border-border rounded-lg px-3 py-2 text-sm" placeholder="Reps" value={f.reps} onChange={(e) => setF({ ...f, reps: e.target.value })} />
        <input type="number" className="bg-input border border-border rounded-lg px-3 py-2 text-sm" placeholder="Wt" value={f.weight} onChange={(e) => setF({ ...f, weight: e.target.value })} />
      </div>
      <Button onClick={add} className="w-full" style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}><Plus className="h-4 w-4 mr-1" /> Log set</Button>
      <div className="space-y-2">
        {items.map(x => (
          <div key={x.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-2.5">
            <div>
              <div className="text-sm font-medium">{x.exercise}</div>
              <div className="text-xs text-muted-foreground">{x.sets}×{x.reps} @ {x.weight} · {x.date}</div>
            </div>
            <button onClick={() => setItems(arr => arr.filter(y => y.id !== x.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-muted-foreground py-8">No workouts logged.</p>}
      </div>
    </div>
  );
};

/* ----------------- Mood ----------------- */
const MOODS = ["😄", "🙂", "😐", "😕", "😢"];
export const MoodJournal = ({ accent }: AP) => {
  const KEY = "hexa.daily.mood";
  const today = todayKey();
  const [log, setLog] = useState<Record<string, { mood: number; note: string }>>(() => loadLS(KEY, {}));
  const [note, setNote] = useState(log[today]?.note || "");
  useEffect(() => saveLS(KEY, log), [log]);
  const setMood = (i: number) => setLog(l => ({ ...l, [today]: { mood: i, note } }));
  const saveNote = () => setLog(l => ({ ...l, [today]: { mood: l[today]?.mood ?? 2, note } }));
  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-3">
        {MOODS.map((m, i) => (
          <button key={i} onClick={() => setMood(i)}
            className="text-4xl p-3 rounded-2xl transition-all hover:scale-110"
            style={log[today]?.mood === i ? { background: `hsl(${accent} / 0.2)`, boxShadow: `0 0 20px hsl(${accent} / 0.4)` } : {}}>
            {m}
          </button>
        ))}
      </div>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} onBlur={saveNote} rows={4}
        placeholder="What's on your mind today?"
        className="w-full bg-input border border-border rounded-lg p-3 text-sm" />
      <div>
        <h3 className="text-sm font-semibold mb-2">Last 14 days</h3>
        <div className="flex gap-1">
          {Array.from({ length: 14 }, (_, i) => {
            const d = new Date(); d.setDate(d.getDate() - (13 - i));
            const k = todayKey(d); const m = log[k];
            return (
              <div key={k} title={k} className="flex-1 aspect-square rounded-md flex items-center justify-center text-xl"
                style={{ background: m ? `hsl(${accent} / ${0.15 + (4 - m.mood) * 0.1})` : "hsl(var(--muted))" }}>
                {m ? MOODS[m.mood] : ""}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ----------------- Sleep ----------------- */
interface Sleep { date: string; hours: number; quality: number; }
export const SleepTracker = ({ accent }: AP) => {
  const KEY = "hexa.daily.sleep";
  const [items, setItems] = useState<Sleep[]>(() => loadLS<Sleep[]>(KEY, []));
  const [hours, setHours] = useState("8");
  const [quality, setQuality] = useState("4");
  useEffect(() => saveLS(KEY, items), [items]);
  const add = () => {
    setItems(x => [{ date: todayKey(), hours: +hours, quality: +quality }, ...x.filter(y => y.date !== todayKey())]);
  };
  const avg = items.length ? (items.slice(0, 7).reduce((s, x) => s + x.hours, 0) / Math.min(items.length, 7)).toFixed(1) : "—";
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2 items-end">
        <label className="text-sm">Hours <input type="number" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full mt-1 bg-input border border-border rounded-lg px-3 py-2" /></label>
        <label className="text-sm">Quality (1-5) <input type="number" min="1" max="5" value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full mt-1 bg-input border border-border rounded-lg px-3 py-2" /></label>
        <Button onClick={add} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}>Log today</Button>
      </div>
      <div className="rounded-xl border border-border/60 bg-gradient-card p-4 text-center">
        <div className="text-sm text-muted-foreground">7-day average</div>
        <div className="text-3xl font-bold" style={{ color: `hsl(${accent})` }}>{avg}h</div>
      </div>
      <div className="space-y-1">
        {items.slice(0, 14).map(x => (
          <div key={x.date} className="flex items-center justify-between text-sm px-3 py-2 rounded-lg border border-border/60 bg-card">
            <span>{x.date}</span>
            <span className="font-mono">{x.hours}h · {"★".repeat(x.quality)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ----------------- Quick Notes ----------------- */
export const QuickNotes = ({ accent }: AP) => {
  const KEY = "hexa.daily.notes";
  const [text, setText] = useState<string>(() => loadLS(KEY, ""));
  useEffect(() => { const t = setTimeout(() => saveLS(KEY, text), 300); return () => clearTimeout(t); }, [text]);
  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={20}
        placeholder="Type anything. Auto-saves."
        className="w-full bg-input border border-border rounded-xl p-4 text-sm font-mono focus:outline-none focus:ring-2"
        style={{ ['--tw-ring-color' as any]: `hsl(${accent} / 0.6)` }} />
      <p className="text-xs text-muted-foreground mt-2">{text.length} characters · saved locally</p>
    </div>
  );
};

/* ----------------- Goals ----------------- */
interface Goal { id: string; name: string; target: number; current: number; }
export const GoalTracker = ({ accent }: AP) => {
  const KEY = "hexa.daily.goals";
  const [items, setItems] = useState<Goal[]>(() => loadLS<Goal[]>(KEY, []));
  const [name, setName] = useState(""); const [target, setTarget] = useState("");
  useEffect(() => saveLS(KEY, items), [items]);
  const add = () => { const t = parseFloat(target); if (!name.trim() || !t) return; setItems(x => [...x, { id: uid(), name: name.trim(), target: t, current: 0 }]); setName(""); setTarget(""); };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2">
        <input className="bg-input border border-border rounded-lg px-3 py-2 text-sm" placeholder="Goal" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" className="bg-input border border-border rounded-lg px-3 py-2 text-sm" placeholder="Target" value={target} onChange={(e) => setTarget(e.target.value)} />
        <Button onClick={add} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      {items.map(g => {
        const pct = Math.min(100, (g.current / g.target) * 100);
        return (
          <div key={g.id} className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex justify-between mb-2"><span className="font-medium">{g.name}</span>
              <button onClick={() => setItems(x => x.filter(y => y.id !== g.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="text-xs font-mono mb-1">{g.current} / {g.target} ({pct.toFixed(0)}%)</div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden mb-3"><div className="h-full" style={{ width: `${pct}%`, background: `hsl(${accent})` }} /></div>
            <div className="flex gap-2">
              {[1, 5, 10].map(n => <button key={n} onClick={() => setItems(x => x.map(y => y.id === g.id ? { ...y, current: y.current + n } : y))}
                className="text-xs px-3 py-1 rounded-md border border-border/60 hover:bg-muted/40">+{n}</button>)}
              <button onClick={() => setItems(x => x.map(y => y.id === g.id ? { ...y, current: 0 } : y))} className="text-xs px-3 py-1 rounded-md border border-border/60 hover:bg-muted/40 ml-auto">Reset</button>
            </div>
          </div>
        );
      })}
      {items.length === 0 && <p className="text-center text-muted-foreground py-8">No goals yet.</p>}
    </div>
  );
};

/* ----------------- Calculator ----------------- */
export const SimpleCalculator = ({ accent }: AP) => {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("");
  const eval2 = () => {
    try {
      // safe-ish eval: only digits, operators, parens, dots, spaces
      if (!/^[\d+\-*/().\s]+$/.test(expr)) throw new Error("invalid");
      // eslint-disable-next-line no-new-func
      const r = Function(`"use strict"; return (${expr})`)();
      setResult(String(r));
    } catch { setResult("Error"); }
  };
  const btns = ["7","8","9","/","4","5","6","*","1","2","3","-","0",".","(",")"];
  return (
    <div className="max-w-sm mx-auto space-y-3">
      <input value={expr} onChange={(e) => setExpr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && eval2()}
        className="w-full bg-input border border-border rounded-lg px-4 py-3 text-right text-2xl font-mono" />
      <div className="text-right text-3xl font-bold" style={{ color: `hsl(${accent})` }}>{result || "—"}</div>
      <div className="grid grid-cols-4 gap-2">
        {btns.map(b => <button key={b} onClick={() => setExpr(e => e + b)} className="aspect-square rounded-lg border border-border/60 bg-card hover:bg-muted/40 text-lg font-mono">{b}</button>)}
        <button onClick={() => setExpr(e => e + "+")} className="aspect-square rounded-lg border border-border/60 bg-card hover:bg-muted/40 text-lg font-mono">+</button>
        <button onClick={() => setExpr("")} className="aspect-square rounded-lg border border-border/60 bg-card hover:bg-muted/40 text-sm">Clr</button>
        <button onClick={() => setExpr(e => e.slice(0, -1))} className="aspect-square rounded-lg border border-border/60 bg-card hover:bg-muted/40 text-sm">⌫</button>
        <button onClick={eval2} className="aspect-square rounded-lg col-span-2 text-lg font-bold" style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}>=</button>
      </div>
    </div>
  );
};

/* ----------------- Unit converter ----------------- */
const UNITS: Record<string, Record<string, number>> = {
  Length: { m: 1, km: 1000, cm: 0.01, mi: 1609.34, ft: 0.3048, in: 0.0254 },
  Weight: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 },
  Volume: { L: 1, mL: 0.001, gal: 3.78541, cup: 0.24 },
};
export const UnitConverter = ({ accent }: AP) => {
  const [cat, setCat] = useState("Length");
  const units = Object.keys(UNITS[cat]);
  const [from, setFrom] = useState(units[0]);
  const [to, setTo] = useState(units[1]);
  const [val, setVal] = useState("1");
  useEffect(() => { const u = Object.keys(UNITS[cat]); setFrom(u[0]); setTo(u[1]); }, [cat]);
  const result = (parseFloat(val) || 0) * UNITS[cat][from] / UNITS[cat][to];
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex gap-2">
        {Object.keys(UNITS).map(c => (
          <button key={c} onClick={() => setCat(c)} className="flex-1 py-2 rounded-lg border text-sm transition-colors"
            style={cat === c ? { background: `hsl(${accent})`, color: "hsl(var(--background))", borderColor: `hsl(${accent})` } : { borderColor: "hsl(var(--border))" }}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
        <input value={val} onChange={(e) => setVal(e.target.value)} className="bg-input border border-border rounded-lg px-3 py-3 text-lg font-mono" />
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="bg-input border border-border rounded-lg px-3 py-3">
          {units.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
      <div className="text-center text-2xl">↓</div>
      <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
        <div className="bg-card border border-border rounded-lg px-3 py-3 text-lg font-mono" style={{ color: `hsl(${accent})` }}>{result.toFixed(4)}</div>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="bg-input border border-border rounded-lg px-3 py-3">
          {units.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
    </div>
  );
};

/* ----------------- Currency (static rates demo) ----------------- */
const RATES: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, BDT: 110, INR: 83, JPY: 150, CAD: 1.36 };
export const CurrencyConverter = ({ accent }: AP) => {
  const [from, setFrom] = useState("USD"); const [to, setTo] = useState("BDT"); const [val, setVal] = useState("1");
  const result = ((parseFloat(val) || 0) / RATES[from]) * RATES[to];
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input value={val} onChange={(e) => setVal(e.target.value)} className="bg-input border border-border rounded-lg px-3 py-3 text-lg font-mono" />
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="bg-input border border-border rounded-lg px-3 py-3">
          {Object.keys(RATES).map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="text-center text-2xl">↓</div>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <div className="bg-card border border-border rounded-lg px-3 py-3 text-lg font-mono" style={{ color: `hsl(${accent})` }}>{result.toFixed(2)}</div>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="bg-input border border-border rounded-lg px-3 py-3">
          {Object.keys(RATES).map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <p className="text-xs text-muted-foreground text-center">Approximate rates for quick conversion.</p>
    </div>
  );
};

/* ----------------- Stopwatch ----------------- */
export const Stopwatch = ({ accent }: AP) => {
  const [ms, setMs] = useState(0); const [running, setRunning] = useState(false); const [laps, setLaps] = useState<number[]>([]);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (running) { const start = Date.now() - ms; ref.current = window.setInterval(() => setMs(Date.now() - start), 50); }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);
  const fmt = (n: number) => `${String(Math.floor(n / 60000)).padStart(2,"0")}:${String(Math.floor(n / 1000) % 60).padStart(2,"0")}.${String(Math.floor(n / 10) % 100).padStart(2,"0")}`;
  return (
    <div className="text-center space-y-6 py-6">
      <div className="font-mono text-7xl font-bold tabular-nums" style={{ color: `hsl(${accent})` }}>{fmt(ms)}</div>
      <div className="flex justify-center gap-3">
        <Button onClick={() => setRunning(r => !r)} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}>{running ? "Pause" : "Start"}</Button>
        <Button variant="outline" onClick={() => setLaps(l => [ms, ...l])} disabled={!running}>Lap</Button>
        <Button variant="outline" onClick={() => { setMs(0); setLaps([]); setRunning(false); }}>Reset</Button>
      </div>
      <div className="space-y-1 text-sm font-mono">
        {laps.map((l, i) => <div key={i} className="flex justify-between max-w-xs mx-auto px-3 py-1.5 rounded border border-border/60"><span>Lap {laps.length - i}</span><span>{fmt(l)}</span></div>)}
      </div>
    </div>
  );
};

/* ----------------- Countdown ----------------- */
export const Countdown = ({ accent }: AP) => {
  const KEY = "hexa.daily.countdown";
  const [target, setTarget] = useState<string>(() => loadLS(KEY, ""));
  const [now, setNow] = useState(Date.now());
  useEffect(() => { saveLS(KEY, target); }, [target]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = target ? new Date(target).getTime() - now : 0;
  const days = Math.max(0, Math.floor(diff / 86400000));
  const hrs = Math.max(0, Math.floor((diff / 3600000) % 24));
  const min = Math.max(0, Math.floor((diff / 60000) % 60));
  const sec = Math.max(0, Math.floor((diff / 1000) % 60));
  return (
    <div className="space-y-6 text-center py-6">
      <input type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)}
        className="bg-input border border-border rounded-lg px-4 py-2.5 text-sm" />
      <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
        {[["Days", days], ["Hours", hrs], ["Min", min], ["Sec", sec]].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-border/60 bg-gradient-card p-4">
            <div className="text-4xl font-bold font-mono" style={{ color: `hsl(${accent})` }}>{v}</div>
            <div className="text-xs text-muted-foreground mt-1">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ----------------- Meditation timer ----------------- */
export const MeditationTimer = ({ accent }: AP) => {
  const [secs, setSecs] = useState(300);
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft(l => { if (l <= 1) { setRunning(false); toast.success("Session complete 🙏"); return 0; } return l - 1; }), 1000);
    return () => clearInterval(t);
  }, [running]);
  const start = () => { setLeft(secs); setRunning(true); };
  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center gap-2">
        {[300, 600, 900, 1200].map(s => (
          <button key={s} onClick={() => setSecs(s)} className="px-3 py-1.5 rounded-full text-sm border"
            style={secs === s ? { background: `hsl(${accent})`, color: "hsl(var(--background))", borderColor: `hsl(${accent})` } : { borderColor: "hsl(var(--border))" }}>
            {s / 60} min
          </button>
        ))}
      </div>
      <div className="relative h-48 w-48 mx-auto">
        <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: `radial-gradient(circle, hsl(${accent} / 0.3), transparent)` }} />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-4xl font-bold" style={{ color: `hsl(${accent})` }}>
          {running ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : `${secs / 60}:00`}
        </div>
      </div>
      <Button onClick={running ? () => setRunning(false) : start} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}>
        {running ? "Stop" : "Begin"}
      </Button>
    </div>
  );
};

/* ----------------- Music mood ----------------- */
const MOODS_M = ["Focus", "Chill", "Hype", "Sad", "Romantic", "Workout", "Sleep"];
export const MusicMood = ({ accent }: AP) => {
  const [mood, setMood] = useState("Focus");
  const [out, setOut] = useState(""); const [loading, setLoading] = useState(false);
  const go = async () => {
    setLoading(true);
    const r = await generateText(`Suggest 5 songs perfect for a "${mood}" mood. Format as a numbered list with "Artist — Song". Keep it under 80 words.`);
    setOut(r); setLoading(false);
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {MOODS_M.map(m => (
          <button key={m} onClick={() => setMood(m)} className="px-3 py-1.5 rounded-full text-sm border"
            style={mood === m ? { background: `hsl(${accent})`, color: "hsl(var(--background))", borderColor: `hsl(${accent})` } : { borderColor: "hsl(var(--border))" }}>{m}</button>
        ))}
      </div>
      <Button onClick={go} disabled={loading} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4 mr-2" /> Suggest</>}
      </Button>
      {out && <div className="rounded-xl border border-border/60 bg-card p-4 whitespace-pre-wrap text-sm">{out}</div>}
    </div>
  );
};

/* ----------------- Idea jar ----------------- */
interface Idea { id: string; text: string; date: string; }
export const IdeaJar = ({ accent }: AP) => {
  const KEY = "hexa.daily.ideas";
  const [items, setItems] = useState<Idea[]>(() => loadLS<Idea[]>(KEY, []));
  const [text, setText] = useState("");
  useEffect(() => saveLS(KEY, items), [items]);
  const add = () => { if (!text.trim()) return; setItems(x => [{ id: uid(), text: text.trim(), date: todayKey() }, ...x]); setText(""); };
  const random = () => items.length && toast.info(items[Math.floor(Math.random() * items.length)].text);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Drop an idea…"
          className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm" />
        <Button onClick={add} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}><Plus className="h-4 w-4" /></Button>
        <Button variant="outline" onClick={random} disabled={!items.length}>🎲</Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {items.map(i => (
          <div key={i.id} className="rounded-lg border border-border/60 bg-card p-3 text-sm relative group">
            <p>{i.text}</p>
            <div className="text-xs text-muted-foreground mt-1">{i.date}</div>
            <button onClick={() => setItems(x => x.filter(y => y.id !== i.id))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-muted-foreground py-6 col-span-full">Your jar is empty.</p>}
      </div>
    </div>
  );
};

/* ----------------- Checklist ----------------- */
interface CheckItem { id: string; text: string; done: boolean; }
interface Checklist { id: string; title: string; items: CheckItem[]; }
export const ChecklistBuilder = ({ accent }: AP) => {
  const KEY = "hexa.daily.checklists";
  const [lists, setLists] = useState<Checklist[]>(() => loadLS<Checklist[]>(KEY, []));
  const [title, setTitle] = useState("");
  useEffect(() => saveLS(KEY, lists), [lists]);
  const addList = () => { if (!title.trim()) return; setLists(l => [...l, { id: uid(), title: title.trim(), items: [] }]); setTitle(""); };
  const addItem = (lid: string, text: string) => setLists(l => l.map(x => x.id === lid ? { ...x, items: [...x.items, { id: uid(), text, done: false }] } : x));
  const toggle = (lid: string, iid: string) => setLists(l => l.map(x => x.id === lid ? { ...x, items: x.items.map(i => i.id === iid ? { ...i, done: !i.done } : i) } : x));
  const reset = (lid: string) => setLists(l => l.map(x => x.id === lid ? { ...x, items: x.items.map(i => ({ ...i, done: false })) } : x));
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addList()} placeholder="New checklist (e.g. Morning routine)"
          className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm" />
        <Button onClick={addList} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}><Plus className="h-4 w-4" /></Button>
      </div>
      {lists.map(l => <ChecklistCard key={l.id} list={l} accent={accent} onAdd={addItem} onToggle={toggle} onReset={reset} onDelete={() => setLists(x => x.filter(y => y.id !== l.id))} />)}
    </div>
  );
};
const ChecklistCard = ({ list, accent, onAdd, onToggle, onReset, onDelete }: any) => {
  const [t, setT] = useState("");
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
      <div className="flex justify-between"><h3 className="font-semibold">{list.title}</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onReset(list.id)}>Reset</Button>
          <button onClick={onDelete} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      {list.items.map((i: CheckItem) => (
        <label key={i.id} className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={i.done} onChange={() => onToggle(list.id, i.id)} className="accent-primary" />
          <span className={i.done ? "line-through text-muted-foreground" : ""}>{i.text}</span>
        </label>
      ))}
      <div className="flex gap-2 pt-2">
        <input value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && t.trim()) { onAdd(list.id, t.trim()); setT(""); } }}
          placeholder="Add item…" className="flex-1 bg-input border border-border rounded-lg px-3 py-1.5 text-sm" />
        <Button size="sm" onClick={() => { if (t.trim()) { onAdd(list.id, t.trim()); setT(""); } }} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}>Add</Button>
      </div>
    </div>
  );
};

/* ----------------- Word counter ----------------- */
export const WordCounter = ({ accent }: AP) => {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Paste or type your text…"
        className="w-full bg-input border border-border rounded-lg p-3 text-sm" />
      <div className="grid grid-cols-4 gap-3">
        {[["Words", words], ["Chars", chars], ["Sentences", sentences], ["Reading", `${minutes}m`]].map(([l, v]) => (
          <div key={l as string} className="rounded-xl border border-border/60 bg-gradient-card p-3 text-center">
            <div className="text-2xl font-bold font-mono" style={{ color: `hsl(${accent})` }}>{v}</div>
            <div className="text-xs text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ----------------- Tip calculator ----------------- */
export const TipCalculator = ({ accent }: AP) => {
  const [bill, setBill] = useState("100"); const [tip, setTip] = useState("15"); const [people, setPeople] = useState("2");
  const b = +bill || 0, tp = +tip || 0, p = Math.max(1, +people || 1);
  const tipAmt = b * tp / 100; const total = b + tipAmt; const each = total / p;
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <label className="block text-sm">Bill <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} className="mt-1 w-full bg-input border border-border rounded-lg px-3 py-2" /></label>
      <label className="block text-sm">Tip % <input type="number" value={tip} onChange={(e) => setTip(e.target.value)} className="mt-1 w-full bg-input border border-border rounded-lg px-3 py-2" /></label>
      <label className="block text-sm">People <input type="number" value={people} onChange={(e) => setPeople(e.target.value)} className="mt-1 w-full bg-input border border-border rounded-lg px-3 py-2" /></label>
      <div className="rounded-xl border border-border/60 bg-gradient-card p-4 grid grid-cols-3 gap-3 text-center">
        {[["Tip", tipAmt.toFixed(2)], ["Total", total.toFixed(2)], ["Each", each.toFixed(2)]].map(([l, v]) => (
          <div key={l}><div className="text-2xl font-bold font-mono" style={{ color: `hsl(${accent})` }}>{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>
        ))}
      </div>
    </div>
  );
};

/* ----------------- Activity log ----------------- */
interface Activity { id: string; text: string; time: string; }
export const ActivityLog = ({ accent }: AP) => {
  const KEY = "hexa.daily.activity";
  const [items, setItems] = useState<Activity[]>(() => loadLS<Activity[]>(KEY, []));
  const [text, setText] = useState("");
  useEffect(() => saveLS(KEY, items), [items]);
  const add = () => { if (!text.trim()) return; setItems(x => [{ id: uid(), text: text.trim(), time: new Date().toISOString() }, ...x]); setText(""); };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="What are you doing now?"
          className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm" />
        <Button onClick={add} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="space-y-2">
        {items.map(x => (
          <div key={x.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-2.5">
            <div>
              <div className="text-sm">{x.text}</div>
              <div className="text-xs text-muted-foreground font-mono">{new Date(x.time).toLocaleString()}</div>
            </div>
            <button onClick={() => setItems(arr => arr.filter(y => y.id !== x.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-muted-foreground py-8">Nothing logged yet.</p>}
      </div>
    </div>
  );
};
