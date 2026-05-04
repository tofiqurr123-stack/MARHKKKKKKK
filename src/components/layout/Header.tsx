import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ShieldCheck, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import logo from "@/assets/hexa-logo.png";

const TABS: Array<[string, string]> = [
  ["Home", "/"],
  ["Tools", "/tools"],
  ["Daily", "/daily"],
  ["Slides", "/presentation"],
  ["PDF", "/pdf"],
  ["Assistant", "/assistant"],
  ["About", "/about"],
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60">
      <div className="container flex h-16 items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img src={logo} alt="Hexa.ai logo" width={36} height={36}
               className="drop-shadow-[0_0_18px_hsl(var(--primary)/0.5)] group-hover:scale-105 transition-transform" />
          <span className="text-xl font-bold tracking-tight">
            Hexa<span className="gradient-text">.ai</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {TABS.map(([label, to]) => (
            <NavLink
              key={to} to={to} end={to === "/"}
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
          {isAdmin && (
            <NavLink to="/admin" className={({isActive}) =>
              `px-3 py-2 rounded-md text-sm flex items-center gap-1 ${isActive ? "text-accent bg-accent/10" : "text-accent hover:bg-accent/10"}`
            }>
              <ShieldCheck className="h-3.5 w-3.5" /> Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <NavLink to="/settings" className={({isActive}) =>
            `text-xs px-2 py-2 rounded-md ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
          }>Settings</NavLink>
          {user ? (
            <>
              <span className="hidden xl:inline-flex items-center gap-1 text-xs text-muted-foreground">
                <UserIcon className="h-3 w-3" /> {user.email?.split("@")[0]}
              </span>
              <Button size="sm" variant="ghost" onClick={() => signOut().then(() => nav("/"))}>
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => nav("/auth")} className="bg-gradient-primary">Sign in</Button>
          )}
        </div>

        <button className="lg:hidden p-2 rounded-md hover:bg-muted/40" onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-border/60 bg-card/80 backdrop-blur">
          <div className="container py-2 grid grid-cols-2 gap-1">
            {TABS.map(([label, to]) => (
              <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted/40"}`
                }>
                {label}
              </NavLink>
            ))}
            <NavLink to="/settings" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md text-sm text-muted-foreground">Settings</NavLink>
            {isAdmin && (
              <NavLink to="/admin" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md text-sm text-accent">Admin</NavLink>
            )}
            {user ? (
              <button onClick={() => { signOut(); setOpen(false); nav("/"); }} className="px-3 py-2 rounded-md text-sm text-left text-destructive">Sign out</button>
            ) : (
              <button onClick={() => { setOpen(false); nav("/auth"); }} className="px-3 py-2 rounded-md text-sm text-left text-primary">Sign in</button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
