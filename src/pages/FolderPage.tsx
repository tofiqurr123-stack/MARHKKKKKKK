import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCategoryBySlug, CATEGORY_LIST } from "@/data/categoryMeta";
import { TOOLS } from "@/data/tools";
import { ToolCard } from "@/components/ToolCard";
import { ArrowLeft, Search } from "lucide-react";
import { useMemo, useState } from "react";

const FolderPage = () => {
  const { slug } = useParams();
  const cat = slug ? getCategoryBySlug(slug) : null;
  const [q, setQ] = useState("");

  if (!cat) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container py-20 text-center flex-1">
          <h1 className="text-3xl font-bold mb-4">Folder not found</h1>
          <Link to="/tools" className="text-primary hover:underline">All folders</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = cat.icon;
  const tools = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return TOOLS.filter(t => t.category === cat.category)
      .filter(t => !ql || t.name.toLowerCase().includes(ql) || t.description.toLowerCase().includes(ql));
  }, [cat, q]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* HERO — unique per folder */}
      <section
        className="relative overflow-hidden border-b border-border/60"
        style={{ background: `linear-gradient(135deg, hsl(${cat.accent} / 0.18), hsl(${cat.accent2} / 0.08))` }}
      >
        <div className="absolute inset-0 hex-grid opacity-[0.07]" />
        <div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-40"
          style={{ background: cat.gradient }}
        />
        <div
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-30"
          style={{ background: cat.gradient }}
        />
        <div className="container relative py-16">
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> All folders
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div
              className="h-24 w-24 hex-clip flex items-center justify-center shrink-0"
              style={{ background: cat.gradient, boxShadow: `0 0 50px hsl(${cat.glow} / 0.6)` }}
            >
              <Icon className="h-12 w-12 text-background" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div
                className="inline-block text-[11px] font-mono uppercase tracking-widest mb-2 px-2 py-0.5 rounded-full border"
                style={{
                  color: `hsl(${cat.accent})`,
                  borderColor: `hsl(${cat.accent} / 0.4)`,
                  background: `hsl(${cat.accent} / 0.08)`,
                }}
              >
                Folder
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">{cat.category}</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">{cat.blurb}</p>
              <p className="text-sm mt-3">
                <span style={{ color: `hsl(${cat.accent})` }} className="font-semibold">
                  {tools.length}
                </span>{" "}
                <span className="text-muted-foreground">tools available</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* search + tool grid */}
      <section className="container py-10 flex-1">
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${cat.category}…`}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{ ['--tw-ring-color' as any]: `hsl(${cat.accent} / 0.6)` }}
          />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map(t => <ToolCard key={t.slug} tool={t} accent={cat.accent} />)}
        </div>
        {tools.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No matching tools.</p>
        )}
      </section>

      {/* other folders */}
      <section className="container pb-16">
        <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">Jump to another folder</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_LIST.filter(c => c.slug !== cat.slug).map(c => (
            <Link
              key={c.slug}
              to={`/folder/${c.slug}`}
              className="text-xs px-3 py-1.5 rounded-full border hover:bg-muted/40 transition-colors"
              style={{ borderColor: `hsl(${c.accent} / 0.4)`, color: `hsl(${c.accent})` }}
            >
              {c.category}
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FolderPage;
