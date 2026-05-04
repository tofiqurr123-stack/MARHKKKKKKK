import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DAILY_TOOLS } from "@/data/dailyTools";
import { ArrowRight, Calendar } from "lucide-react";

const Daily = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <section className="container py-12 flex-1">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/40 bg-secondary/10 text-xs text-secondary">
          <Calendar className="h-3 w-3" /> Your daily life toolbox
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mt-4">
          Daily life <span className="gradient-text">essentials</span>
        </h1>
        <p className="text-muted-foreground mt-3">
          {DAILY_TOOLS.length} tiny tools that actually work — habits, money, study, focus, and more.
          Everything saves locally on your device.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {DAILY_TOOLS.map(t => {
          const Icon = t.icon;
          return (
            <Link
              key={t.slug}
              to={`/daily/${t.slug}`}
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-card p-5 transition-all hover:-translate-y-0.5"
              style={{ ['--tw-shadow-color' as any]: `hsl(${t.accent})` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `hsl(${t.accent} / 0.6)`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
            >
              <div
                className="absolute -top-12 -right-12 h-28 w-28 rounded-full opacity-0 group-hover:opacity-60 transition-opacity blur-2xl"
                style={{ background: `hsl(${t.accent})` }}
              />
              <div className="relative">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: `hsl(${t.accent} / 0.15)`,
                    border: `1px solid hsl(${t.accent} / 0.4)`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: `hsl(${t.accent})` }} />
                </div>
                <h3 className="font-semibold leading-tight">{t.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                <div className="flex items-center gap-1 text-xs font-medium mt-3" style={{ color: `hsl(${t.accent})` }}>
                  Open <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
    <Footer />
  </div>
);

export default Daily;
