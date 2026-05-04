import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Users, Sparkles } from "lucide-react";
import { TOOLS } from "@/data/tools";

const AdminPanel = () => {
  const { isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!isAdmin) { nav("/"); return; }
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => setProfiles(data ?? []));
  }, [isAdmin, loading, nav]);

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-10 flex-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Console</h1>
            <p className="text-sm text-muted-foreground">Manage Hexa.ai platform</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-border/60 bg-gradient-card p-5">
            <Users className="h-5 w-5 text-primary mb-2" />
            <div className="text-3xl font-bold">{profiles.length}</div>
            <div className="text-xs text-muted-foreground">Registered users</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-gradient-card p-5">
            <Sparkles className="h-5 w-5 text-secondary mb-2" />
            <div className="text-3xl font-bold">{TOOLS.length}</div>
            <div className="text-xs text-muted-foreground">Live AI tools</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-gradient-card p-5">
            <ShieldCheck className="h-5 w-5 text-accent mb-2" />
            <div className="text-3xl font-bold">Active</div>
            <div className="text-xs text-muted-foreground">Platform status</div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          <div className="p-4 border-b border-border/60">
            <h2 className="font-semibold">Recent users</h2>
          </div>
          <div className="divide-y divide-border/60">
            {profiles.length === 0 && <div className="p-6 text-sm text-muted-foreground">No users yet.</div>}
            {profiles.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{p.display_name ?? "Unnamed"}</div>
                  <div className="text-xs text-muted-foreground font-mono">{p.user_id.slice(0, 8)}…</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(p.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
