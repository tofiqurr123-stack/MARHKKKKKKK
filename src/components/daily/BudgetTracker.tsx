import { useEffect, useMemo, useState } from "react";
import { loadLS, saveLS, uid } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Budget { id: string; name: string; limit: number; spent: number; }

export const BudgetTracker = ({ accent }: { accent: string }) => {
  const KEY = "hexa.daily.budgets";
  const [items, setItems] = useState<Budget[]>(() => loadLS<Budget[]>(KEY, []));
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");

  useEffect(() => saveLS(KEY, items), [items]);

  const add = () => {
    const l = parseFloat(limit);
    if (!name.trim() || !l) return;
    setItems(x => [...x, { id: uid(), name: name.trim(), limit: l, spent: 0 }]);
    setName(""); setLimit("");
  };
  const log = (id: string, amount: number) =>
    setItems(x => x.map(b => b.id === id ? { ...b, spent: Math.max(0, b.spent + amount) } : b));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category"
          className="bg-input border border-border rounded-lg px-3 py-2 text-sm" />
        <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="Monthly limit"
          className="bg-input border border-border rounded-lg px-3 py-2 text-sm" />
        <Button onClick={add} style={{ background: `hsl(${accent})`, color: "hsl(var(--background))" }}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-3">
        {items.map(b => {
          const pct = Math.min(100, (b.spent / b.limit) * 100);
          const over = b.spent > b.limit;
          return (
            <div key={b.id} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{b.name}</div>
                <button onClick={() => setItems(x => x.filter(y => y.id !== b.id))} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span style={{ color: over ? "hsl(var(--destructive))" : `hsl(${accent})` }}>{b.spent.toFixed(2)}</span>
                <span className="text-muted-foreground">/ {b.limit.toFixed(2)}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: over ? "hsl(var(--destructive))" : `hsl(${accent})` }} />
              </div>
              <div className="flex gap-2 mt-3">
                {[5, 10, 25, 50, 100].map(v => (
                  <button key={v} onClick={() => log(b.id, v)} className="text-xs px-2 py-1 rounded-md border border-border/60 hover:bg-muted/40">+{v}</button>
                ))}
                <button onClick={() => log(b.id, -10)} className="text-xs px-2 py-1 rounded-md border border-border/60 hover:bg-muted/40 ml-auto">-10</button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-center text-muted-foreground py-8">No budgets yet.</p>}
      </div>
    </div>
  );
};
