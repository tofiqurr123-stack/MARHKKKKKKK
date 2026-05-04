import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { TOOLS } from "@/data/tools";
import { CATEGORY_LIST } from "@/data/categoryMeta";
import { ToolCard } from "@/components/ToolCard";
import { useAuth } from "@/hooks/useAuth";
import {
  Hexagon, Sparkles, ArrowRight, Search, Zap, Shield, Globe, Wand2,
  MessageSquare, FileText, Presentation, ListChecks, Brain
} from "lucide-react";
import logo from "@/assets/hexa-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

const FEATURES = [
  { icon: Brain, title: "200+ AI Tools", body: "Every domain covered — education, career, business, agriculture, creativity." },
  { icon: Zap, title: "Lightning Fast", body: "Powered by Gemini, GPT, Claude — switch models in one click." },
  { icon: Globe, title: "Bangla + English", body: "Truly multilingual. Speak the language you think in." },
  { icon: Shield, title: "Bring Your Own Key", body: "Use Lovable AI, your Gemini, or any OpenAI-compatible endpoint." },
  { icon: Wand2, title: "Real Outputs", body: "Generate slides (.pptx), PDFs, docs — not just text." },
  { icon: Sparkles, title: "Daily Toolbox", body: "Habit tracker, expense tracker, pomodoro, mood — built in." },
];

const PILLARS = [
  { icon: MessageSquare, label: "Universal Assistant", to: "/assistant" },
  { icon: Presentation, label: "Slide Generator", to: "/presentation" },
  { icon: FileText, label: "PDF Builder", to: "/pdf" },
  { icon: ListChecks, label: "Daily Toolbox", to: "/daily" },
];

const Index = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const featured = TOOLS.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img src={heroBg} alt="" width={1920} height={1080}
             className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background pointer-events-none" />
        <div className="absolute inset-0 hex-grid opacity-[0.06] pointer-events-none" />

        <div className="container relative pt-20 pb-20 md:pt-28 md:pb-28">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary backdrop-blur">
              <Hexagon className="h-3 w-3 animate-pulse" /> 200+ AI tools · One universal platform
            </div>

            <img src={logo} alt="Hexa.ai" width={96} height={96}
                 className="mx-auto drop-shadow-[0_0_40px_hsl(var(--primary)/0.6)]" />

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              The universal{" "}
              <span className="gradient-text glow-text">AI operating</span>
              <br />platform for everyone
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hexa.ai unifies 200+ AI tools, daily life utilities, slide & PDF generators,
              and a multilingual assistant — all in one beautiful workspace.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); nav(`/tools?q=${encodeURIComponent(q)}`); }}
                  className="relative max-w-2xl mx-auto mt-8">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="What do you want to do today?"
                className="w-full bg-card/80 backdrop-blur border border-border rounded-2xl pl-14 pr-32 py-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/60 shadow-card-soft"
              />
              <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-primary hover:opacity-90">
                Explore <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {!user && (
                <Button size="lg" onClick={() => nav("/auth")} className="bg-gradient-primary">
                  Get started free
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={() => nav("/tools")} className="border-border/60">
                Browse all tools
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live</span>
              <span>· Powered by Gemini · GPT · Claude</span>
              <span>· No credit card</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE PILLARS */}
      <section className="container py-12 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PILLARS.map(({ icon: Icon, label, to }) => (
            <button key={label} onClick={() => nav(to)}
              className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur p-5 text-left hover:border-primary/60 transition-all hover:-translate-y-0.5">
              <Icon className="h-6 w-6 text-primary mb-3 group-hover:text-primary-glow transition-colors" />
              <div className="font-semibold text-sm">{label}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                Open <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-widest text-primary mb-2">Why Hexa.ai</div>
          <h2 className="text-4xl font-bold">Built like the AI platforms you love.<br/>Open like the web should be.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border/60 bg-gradient-card p-6 hover:border-primary/40 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED TOOLS */}
      <section className="container py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary mb-2">Tools</div>
            <h2 className="text-3xl font-bold">Featured AI tools</h2>
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
        <div className="text-xs uppercase tracking-widest text-primary mb-2">Categories</div>
        <h2 className="text-3xl font-bold mb-6">Browse by folder</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORY_LIST.map(cat => {
            const count = TOOLS.filter(t => t.category === cat.category).length;
            const Icon = cat.icon;
            return (
              <button key={cat.slug} onClick={() => nav(`/folder/${cat.slug}`)}
                className="group text-left rounded-xl border border-border/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40"
                style={{ background: `linear-gradient(135deg, hsl(${cat.accent} / 0.1), transparent)` }}>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-2 hex-clip"
                     style={{ background: `hsl(${cat.accent} / 0.2)` }}>
                  <Icon className="h-5 w-5" style={{ color: `hsl(${cat.accent})` }} />
                </div>
                <div className="text-sm font-semibold">{cat.category}</div>
                <div className="text-xs text-muted-foreground mt-1">{count} tools</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FOUNDER STRIP */}
      <section className="container py-20">
        <div className="rounded-3xl border border-border/60 bg-gradient-card p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/20 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="text-xs uppercase tracking-widest text-primary mb-2">About</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built by <span className="gradient-text">MD Tofiqur Rahman</span>,
              for everyone who deserves access to AI.
            </h2>
            <p className="text-muted-foreground mb-6">
              Hexa.ai began with one belief — AI shouldn't be a privilege. It's the universal layer
              that turns 200+ scattered tools into one beautiful, useful platform.
            </p>
            <Button onClick={() => nav("/about")} variant="outline" className="gap-2">
              Read our story <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="rounded-3xl bg-gradient-primary p-10 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Start building with AI today.</h2>
          <p className="opacity-90 mb-6">Free forever · No credit card · 200+ tools unlocked</p>
          <Button size="lg" onClick={() => nav(user ? "/tools" : "/auth")} variant="secondary">
            {user ? "Open the platform" : "Create your free account"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
