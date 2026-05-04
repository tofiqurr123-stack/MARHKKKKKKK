import { Link } from "react-router-dom";
import { Tool } from "@/data/tools";
import { ArrowRight } from "lucide-react";
import { iconForCategory } from "@/data/toolIcons";

interface Props {
  tool: Tool;
  /** optional HSL string to override accent (e.g. "180 100% 55%") */
  accent?: string;
}

export const ToolCard = ({ tool, accent }: Props) => {
  const ringColor = accent ? `hsl(${accent})` : "hsl(var(--primary))";
  const bgColor = accent ? `hsl(${accent} / 0.1)` : "hsl(var(--primary) / 0.1)";
  const borderColor = accent ? `hsl(${accent} / 0.3)` : "hsl(var(--primary) / 0.3)";
  const Icon = iconForCategory(tool.category);
  return (
    <Link
      to={`/tool/${tool.slug}`}
      className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-card p-5 transition-all hover:-translate-y-0.5"
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ringColor; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
    >
      <div
        className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"
        style={{ background: ringColor }}
      />
      <div className="relative flex flex-col h-full gap-3">
        <div className="flex items-start justify-between">
          <div
            className="h-11 w-11 rounded-xl border flex items-center justify-center hex-clip"
            style={{ background: bgColor, borderColor }}
          >
            <Icon className="h-5 w-5" style={{ color: ringColor }} />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded-full border border-border/60">
            {tool.category}
          </span>
        </div>
        <h3 className="font-semibold text-foreground leading-tight">{tool.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{tool.description}</p>
        <div className="flex items-center gap-1 text-xs font-medium" style={{ color: ringColor }}>
          Open tool <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
