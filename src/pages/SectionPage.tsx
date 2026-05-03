import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TOOLS, ToolCategory } from "@/data/tools";
import { ToolCard } from "@/components/ToolCard";
import { LucideIcon } from "lucide-react";

interface SectionConfig {
  title: string;
  tagline: string;
  Icon: LucideIcon;
  categories: ToolCategory[];
  accent: string;
}

export const SectionPage = ({ config }: { config: SectionConfig }) => {
  const tools = TOOLS.filter(t => config.categories.includes(t.category));
  const { Icon } = config;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-70" />
        <div className="container relative py-16 text-center">
          <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-card border border-border/60 mb-6 ${config.accent}`}>
            <Icon className="h-8 w-8" />
          </div>
          <h1 className="text-5xl font-bold gradient-text glow-text">{config.title}</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{config.tagline}</p>
          <p className="text-xs text-muted-foreground mt-4">
            Navigation only — every tool is open to everyone.{" "}
            <Link to="/tools" className="text-primary hover:underline">Browse all</Link>
          </p>
        </div>
      </section>
      <section className="container py-10 flex-1">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map(t => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>
      <Footer />
    </div>
  );
};
