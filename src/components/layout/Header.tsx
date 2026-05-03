import { Link, NavLink } from "react-router-dom";
import { Hexagon } from "lucide-react";

export const Header = () => (
  <header className="sticky top-0 z-40 glass border-b border-border/60">
    <div className="container flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="relative">
          <Hexagon className="h-8 w-8 text-primary group-hover:text-primary-glow transition-colors" strokeWidth={1.5} />
          <Hexagon className="h-8 w-8 absolute inset-0 text-secondary opacity-50 rotate-30 blur-sm" strokeWidth={1.5} />
        </div>
        <span className="text-xl font-bold tracking-tight">
          Hexa<span className="gradient-text">.ai</span>
        </span>
      </Link>
      <nav className="hidden md:flex items-center gap-1 text-sm">
        {[
          ["Home", "/"],
          ["All Tools", "/tools"],
          ["Learn", "/learn"],
          ["Earn", "/earn"],
          ["Grow", "/grow"],
          ["Build", "/build"],
        ].map(([label, to]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition-colors ${
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  </header>
);
