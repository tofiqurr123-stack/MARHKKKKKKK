import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TOOLS, CATEGORIES, ToolCategory } from "@/data/tools";
import { ToolCard } from "@/components/ToolCard";
import { Search } from "lucide-react";

const Tools = () => {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const cat = (params.get("cat") as ToolCategory | null) || null;

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return TOOLS.filter(t => {
      if (cat && t.category !== cat) return false;
      if (!ql) return true;
      return t.name.toLowerCase().includes(ql) || t.description.toLowerCase().includes(ql) || t.category.toLowerCase().includes(ql);
    });
  }, [q, cat]);

  const setCat = (c: ToolCategory | null) => {
    const np = new URLSearchParams(params);
    if (c) np.set("cat", c); else np.delete("cat");
    setParams(np, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="container py-12 flex-1">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">All tools</h1>
          <p className="text-muted-foreground">Search across {TOOLS.length} AI tools. No gates, no roles.</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools…"
              className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setCat(null)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              !cat ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/60"
            }`}
          >All</button>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c === cat ? null : c)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/60"
              }`}
            >{c}</button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} tools</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(t => <ToolCard key={t.slug} tool={t} />)}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No tools match. Try another search.</p>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Tools;
