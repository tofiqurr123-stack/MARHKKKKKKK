import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CATEGORY_LIST } from "@/data/categoryMeta";
import { TOOLS } from "@/data/tools";
import { ArrowRight, Search, Folder } from "lucide-react";
import { useMemo, useState } from "react";
import { ToolCard } from "@/components/ToolCard";

const Tools = () => {
  const [q, setQ] = useState("");

  const matches = useMemo(() => {
    const ql = q.toLowerCase().trim();
    if (!ql) return [];
    return TOOLS.filter(
      t =>
        t.name.toLowerCase().includes(ql) ||
        t.description.toLowerCase().includes(ql) ||
        t.category.toLowerCase().includes(ql)
    ).slice(0, 24);
  }, [q]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="container py-12 flex-1">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary">
            <Folder className="h-3 w-3" /> 10 folders · 200+ tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Tool <span className="gradient-text">folders</span>
          </h1>
          <p className="text-muted-foreground">
            Each folder is a curated workspace. Open one to see its tools — every folder has its own look and feel.
          </p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search across all 200+ tools…"
              className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
        </div>

        {matches.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">{matches.length} matching tools</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {matches.map(t => <ToolCard key={t.slug} tool={t} />)}
            </div>
          </>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORY_LIST.map(cat => {
              const Icon = cat.icon;
              const count = TOOLS.filter(t => t.category === cat.category).length;
              return (
                <Link
                  key={cat.slug}
                  to={`/folder/${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 p-6 hover:-translate-y-1 transition-all"
                  style={{
                    background: `linear-gradient(135deg, hsl(${cat.accent} / 0.08), hsl(${cat.accent2} / 0.04))`,
                    boxShadow: `0 0 0 1px hsl(${cat.glow} / 0.15)`,
                  }}
                >
                  {/* glow */}
                  <div
                    className="absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-30 group-hover:opacity-60 transition-opacity blur-2xl"
                    style={{ background: cat.gradient }}
                  />
                  {/* hex pattern */}
                  <div className="absolute inset-0 hex-grid opacity-[0.05] pointer-events-none" />

                  <div className="relative flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div
                        className="h-14 w-14 rounded-xl flex items-center justify-center hex-clip"
                        style={{ background: cat.gradient }}
                      >
                        <Icon className="h-7 w-7 text-background" strokeWidth={2.2} />
                      </div>
                      <span
                        className="text-[11px] font-mono px-2 py-1 rounded-full border"
                        style={{
                          color: `hsl(${cat.accent})`,
                          borderColor: `hsl(${cat.accent} / 0.4)`,
                          background: `hsl(${cat.accent} / 0.08)`,
                        }}
                      >
                        {count} tools
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{cat.category}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{cat.blurb}</p>
                    </div>
                    <div
                      className="inline-flex items-center gap-1 text-sm font-medium mt-2"
                      style={{ color: `hsl(${cat.accent})` }}
                    >
                      Open folder <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Tools;
