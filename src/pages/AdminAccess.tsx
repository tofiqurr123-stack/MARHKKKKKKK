import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, KeyRound, Loader2 } from "lucide-react";

const AdminAccess = () => {
  const nav = useNavigate();
  const { toast } = useToast();
  const { user, refreshRole, loading: authLoading } = useAuth();
  const [passkey, setPasskey] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Sign in first", description: "You must be signed in to elevate.", variant: "destructive" });
      nav("/auth");
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin-passkey", {
        body: { passkey },
      });
      if (error || (data as any)?.error) {
        throw new Error((data as any)?.error || error?.message || "Failed");
      }
      await refreshRole();
      toast({ title: "Admin access granted", description: "Welcome, admin." });
      nav("/admin");
    } catch (err: any) {
      toast({ title: "Access denied", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
      setPasskey("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-90 pointer-events-none" />
      <div className="absolute inset-0 hex-grid opacity-[0.05] pointer-events-none" />

      <div className="relative w-full max-w-md glass rounded-2xl p-8">
        <div className="flex items-center justify-center mb-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">Admin Access</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Restricted area. Enter the admin passkey to elevate your account.
        </p>

        {!user && !authLoading && (
          <div className="mb-4 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-sm text-destructive">
            You must <button onClick={() => nav("/auth")} className="underline">sign in</button> first.
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          <Label htmlFor="passkey">Admin Passkey</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="passkey"
              type="password"
              value={passkey}
              onChange={e => setPasskey(e.target.value)}
              placeholder="••••••••••"
              className="pl-9 font-mono"
              required
              minLength={4}
              autoComplete="off"
            />
          </div>
          <Button type="submit" disabled={busy || !user} className="w-full bg-gradient-primary">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Enter"}
          </Button>
        </form>

        <p className="mt-6 text-[11px] text-muted-foreground text-center">
          Unauthorized attempts are logged. This passkey is not available to regular users.
        </p>
      </div>
    </div>
  );
};

export default AdminAccess;
