import { Hexagon } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border/60 mt-20">
    <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Hexagon className="h-5 w-5 text-primary" />
        <span>Hexa.ai — Universal AI Platform · 200+ tools</span>
      </div>
      <p>© {new Date().getFullYear()} Hexa.ai · Founded by MD Tofiqur Rahman</p>
    </div>
  </footer>
);
