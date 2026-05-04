import { useEffect, useMemo, useState } from "react";
import { loadLS, saveLS, uid } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Expense { id: string; amount: number; category: string; note: string; date: string; }

const CATS = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health", "Other"];

export const ExpenseTracker = ({ accent }: { accent: string }) => {
  const KEY = "hexa.daily.expenses";
  const [items, setItems] = useState<Expense[]>(() => loadLS<Expense[]>(KEY, []));
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATS[0]);
  const [note, setNote] = useState("");

  useEffect(() => saveLS(KEY, items), [items]);

  const add = () => {
    const n = parseFloat(amount);
    if (!n || n <= 0) return;
    setItems(x => [{ id: uid(), amount: n, category, note: note.trim(), date: new Date().toISOString() }, ...x]);
    setAmount(""); setNote("");
  };

  const total = useMemo(() => items.reduce((s, x) => s + x.amount, 0), [items]);
  const byCat = useMemo(() => {
    const m: Record<string, number> = {};
    items.forEach(x => { m[x.category] = (m[x.category] || 0) + x.amount; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
        >
          {CATS.map(c => <option key={c}>{c}</option>)}
        </select>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          className="bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
        />
        <Button onClick={add} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="rounded-xl border border-border/60 p-4 bg-gradient-card">
        <div className="text-sm text-muted-foreground">Total spent</div>
        <div className="text-3xl font-bold" style={{ color: `hsl(${accent})` }}>{total.toFixed(2)}</div>
        {byCat.length > 0 && (
          <div className="mt-4 space-y-2">
            {byCat.map(([c, v]) => (
              <div key={c}>
                <div className="flex justify-between text-xs mb-1"><span>{c}</span><span className="text-muted-foreground">{v.toFixed(2)}</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(v / total) * 100}%`, background: `hsl(${accent})` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {items.map(x => (
          <div key={x.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-2.5">
            <div>
              <div className="text-sm font-medium">{x.category} {x.note && <span className="text-muted-foreground">· {x.note}</span>}</div>
              <div className="text-xs text-muted-foreground">{new Date(x.date).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono">{x.amount.toFixed(2)}</span>
              <button onClick={() => setItems(arr => arr.filter(y => y.id !== x.id))} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-muted-foreground py-8">No expenses yet.</p>}
      </div>
    </div>
  );
};
