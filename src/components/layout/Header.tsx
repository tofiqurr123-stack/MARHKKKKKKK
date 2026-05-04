import { Link, NavLink } from "react-router-dom";
import { Hexagon, Menu, X } from "lucide-react";
import { useState } from "react";

const TABS: Array<[string, string]> = [
  ["Home", "/"],
  ["Tools", "/tools"],
  ["Daily", "/daily"],
  ["Slides", "/presentation"],
  ["PDF", "/pdf"],
  ["Assistant", "/assistant"],
  ["Settings", "/settings"],
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60">
      <div className="container flex h-16 items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative">
            <Hexagon className="h-8 w-8 text-primary group-hover:text-primary-glow transition-colors" strokeWidth={1.5} />
            <Hexagon className="h-8 w-8 absolute inset-0 text-secondary opacity-50 rotate-45 blur-sm" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Hexa<span className="gradient-text">.ai</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {TABS.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10 ring-1 ring-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          className="lg:hidden p-2 rounded-md hover:bg-muted/40"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-border/60 bg-card/80 backdrop-blur">
          <div className="container py-2 grid grid-cols-2 gap-1">
            {TABS.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm ${
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted/40"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
