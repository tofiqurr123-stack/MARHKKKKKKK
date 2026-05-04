import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { TOOLS } from "@/data/tools";
import { CATEGORY_LIST } from "@/data/categoryMeta";
import { ToolCard } from "@/components/ToolCard";
import { ChatPanel } from "@/components/ChatPanel";
import { Hexagon, Sparkles, GraduationCap, Briefcase, Sprout, Rocket, ArrowRight, Search } from "lucide-react";

const sectionIcons = [
  { icon: GraduationCap, label: "Learn", to: "/learn", color: "text-primary" },
  { icon: Briefcase, label: "Earn", to: "/earn", color: "text-secondary" },
  { icon: Sprout, label: "Grow", to: "/grow", color: "text-accent" },
  { icon: Rocket, label: "Build", to: "/build", color: "text-primary-glow" },
];

const Index = () => {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const featured = TOOLS.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90 pointer-events-none" />
        <div className="absolute inset-0 hex-grid opacity-[0.06] pointer-events-none" />
        <div className="container relative pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary">
              <Hexagon className="h-3 w-3" /> 200+ AI tools, one universal platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Your universal{" "}
              <span className="gradient-text glow-text">AI operating</span>
              <br /> platform
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hexa.ai gives everyone access to 200+ AI tools across education, career, business,
              agriculture and beyond. No roles. No gates. Just open access.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                nav(`/tools?q=${encodeURIComponent(q)}`);
              }}
              className="relative max-w-2xl mx-auto mt-8"
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What do you want to do today?"
                className="w-full bg-card/80 backdrop-blur border border-border rounded-2xl pl-14 pr-32 py-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/60 shadow-card-soft"
              />
              <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-primary hover:opacity-90">
                Explore <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {sectionIcons.map(({ icon: Icon, label, to, color }) => (
                <Button key={label} variant="outline" onClick={() => nav(to)} className="gap-2 border-border/60 hover:border-primary/60 hover:bg-primary/5">
                  <Icon className={`h-4 w-4 ${color}`} /> {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL ASSISTANT */}
      <section className="container py-16">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" /> Global Assistant
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Ask anything. In Bangla or English.</h2>
            <p className="text-muted-foreground">
              The Hexa assistant understands intent, recommends the right tool, and gives
              step-by-step guidance for any goal — finding a job, starting a business, learning a topic.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>· "Help me find a remote frontend job"</li>
              <li>· "Start a tea business in Sylhet"</li>
              <li>· "Explain quantum entanglement simply"</li>
            </ul>
          </div>
          <ChatPanel
            system="You are Hexa.ai, a multilingual (Bangla + English) universal AI assistant. Detect the user's language and respond in it. When relevant, recommend specific tools from Hexa.ai (e.g. CV Builder, Business Idea Generator, AI Tutor). Use markdown."
            placeholder="Try: Help me find a job"
            starter="👋 I'm Hexa. Ask me anything — career, business, study, agriculture. বাংলা বা ইংরেজিতে লিখুন।"
          />
        </div>
      </section>

      {/* FEATURED TOOLS */}
      <section className="container py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Featured tools</h2>
            <p className="text-muted-foreground mt-1">A taste of the 200+ tools waiting for you.</p>
          </div>
          <Button variant="outline" onClick={() => nav("/tools")} className="gap-2">
            All tools <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map(t => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* FOLDERS */}
      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-6">Browse by folder</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORY_LIST.map(cat => {
            const count = TOOLS.filter(t => t.category === cat.category).length;
            const Icon = cat.icon;
            return (
              <button
                key={cat.slug}
                onClick={() => nav(`/folder/${cat.slug}`)}
                className="text-left rounded-xl border border-border/60 p-4 transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, hsl(${cat.accent} / 0.1), transparent)` }}
              >
                <Icon className="h-5 w-5 mb-2" style={{ color: `hsl(${cat.accent})` }} />
                <div className="text-sm font-semibold">{cat.category}</div>
                <div className="text-xs text-muted-foreground mt-1">{count} tools</div>
              </button>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
