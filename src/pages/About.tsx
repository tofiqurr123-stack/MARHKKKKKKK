import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hexagon, Sparkles, Target, Heart } from "lucide-react";
import founderImg from "@/assets/founder.jpg";

const About = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="absolute inset-0 hex-grid opacity-[0.05]" />
        <div className="container relative py-20 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary mb-4">
            <Hexagon className="h-3 w-3" /> About Hexa.ai
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            One <span className="gradient-text">universal</span> AI platform
            <br />for everyone
          </h1>
          <p className="text-lg text-muted-foreground">
            Hexa.ai unifies 200+ AI tools across education, career, business, agriculture, and creativity —
            so anyone, anywhere can access world-class intelligence without barriers.
          </p>
        </div>
      </section>

      <section className="container py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: Target, title: "Our Mission", body: "Democratize AI by giving every person — student, farmer, founder — the same powerful tools used by big tech." },
          { icon: Sparkles, title: "Our Approach", body: "200+ purpose-built tools in one place, zero gatekeeping, multilingual (Bangla + English), and a unified assistant on top." },
          { icon: Heart, title: "Our Promise", body: "No paywalls on essentials, no role restrictions, transparent settings, and bring-your-own-API freedom." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-border/60 bg-gradient-card p-6">
            <Icon className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>

      <section className="container py-16">
        <div className="rounded-3xl border border-border/60 bg-gradient-card overflow-hidden grid md:grid-cols-[280px_1fr] gap-8 p-8 items-center">
          <div className="relative mx-auto">
            <div className="absolute inset-0 bg-gradient-primary blur-2xl opacity-30" />
            <img
              src={founderImg}
              alt="MD Tofiqur Rahman, Founder of Hexa.ai"
              width={240} height={240} loading="lazy"
              className="relative rounded-2xl border border-primary/30 w-60 h-60 object-cover"
            />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-primary mb-2">Founder</div>
            <h2 className="text-3xl font-bold mb-2">MD Tofiqur Rahman</h2>
            <p className="text-muted-foreground mb-4">
              Tofiqur founded Hexa.ai with a single conviction: <span className="text-foreground">AI shouldn't be a privilege</span>.
              From classrooms in Bangladesh to startups across the world, he envisioned a platform where one
              person, one search, one assistant could replace dozens of fragmented tools.
            </p>
            <p className="text-muted-foreground">
              Hexa.ai is the result — a universal AI operating layer designed for everyone, built to scale,
              and obsessed with usefulness.
            </p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
