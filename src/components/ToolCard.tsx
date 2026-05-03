import { Link } from "react-router-dom";
import { Tool } from "@/data/tools";
import { ArrowRight, Sparkles } from "lucide-react";

export const ToolCard = ({ tool }: { tool: Tool }) => (
  <Link
    to={`/tool/${tool.slug}`}
    className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-card p-5 transition-all hover:border-primary/60 hover:shadow-glow hover:-translate-y-0.5"
  >
    <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative flex flex-col h-full gap-3">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded-full border border-border/60">
          {tool.category}
        </span>
      </div>
      <h3 className="font-semibold text-foreground leading-tight">{tool.name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{tool.description}</p>
      <div className="flex items-center gap-1 text-xs text-primary font-medium">
        Open tool <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Link>
);
