import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2, Eye, EyeOff, KeyRound, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import logo from "@/assets/hexa-logo.png";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 chars").max(72),
});

type Mode = "signin" | "signup" | "magic" | "admin";

const Auth = () => {
  const nav = useNavigate();
  const { toast } = useToast();
  const { user, refreshRole } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passkey, setPasskey] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "admin") {
        // Bypass login: passkey only — no email/password required
        if (passkey.length < 4) throw new Error("Enter the admin passkey");
        const { data, error } = await supabase.functions.invoke("admin-bypass-login", { body: { passkey } });
        if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message || "Failed");
        const { email: adminEmail, token_hash } = data as { email: string; token_hash: string };
        const { error: vErr } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash });
        if (vErr) throw vErr;
        await refreshRole();
        toast({ title: "Admin access granted", description: `Signed in as ${adminEmail}` });
        setPasskey("");
        nav("/admin");
        return;
      }

      if (mode === "magic") {
        const parsed = z.string().email().safeParse(email);
        if (!parsed.success) throw new Error("Enter a valid email");
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast({ title: "Magic link sent", description: "Check your inbox to sign in instantly." });
        return;
      }

      const parsed = schema.safeParse({ email, password });
      if (!parsed.success) throw new Error(parsed.error.errors[0].message);

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: name || email.split("@")[0] } },
        });
        if (error) throw error;
        toast({ title: "Welcome to Hexa.ai!", description: "Account created." });
        nav("/");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!" });
        nav("/");
      }
    } catch (err: any) {
      toast({ title: "Auth failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast({ title: "Google sign-in failed", description: String(result.error), variant: "destructive" });
      setLoading(false); return;
    }
    if (result.redirected) return;
    nav("/");
  };

  const forgot = async () => {
    if (!email) { toast({ title: "Enter your email first", variant: "destructive" }); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) { toast({ title: "Couldn't send", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Reset link sent", description: "Check your email." });
  };

  const TabBtn = ({ id, label, icon: Icon }: { id: Mode; label: string; icon: any }) => (
    <button
      type="button"
      onClick={() => setMode(id)}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all ${
        mode === id ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-90 pointer-events-none" />
      <div className="absolute inset-0 hex-grid opacity-[0.04] pointer-events-none" />

      <Link to="/" className="relative flex items-center gap-2 mb-8">
        <img src={logo} alt="Hexa.ai" width={40} height={40} className="drop-shadow-[0_4px_20px_hsl(var(--primary)/0.4)]" />
        <span className="text-2xl font-bold tracking-tight">
          Hexa<span className="gradient-text">.ai</span>
        </span>
      </Link>

      <div className="relative w-full max-w-md glass rounded-2xl p-7 shadow-card-soft">
        <div className="flex gap-1 p-1 bg-muted/60 rounded-xl mb-5">
          <TabBtn id="signin" label="Sign in" icon={Lock} />
          <TabBtn id="signup" label="Sign up" icon={Sparkles} />
          <TabBtn id="magic" label="Magic link" icon={Wand2} />
          <TabBtn id="admin" label="Admin" icon={ShieldCheck} />
        </div>

        <h1 className="text-2xl font-bold mb-1">
          {mode === "signin" && "Welcome back"}
          {mode === "signup" && "Create your account"}
          {mode === "magic" && "Sign in with a magic link"}
          {mode === "admin" && "Admin access"}
        </h1>
        <p className="text-sm text-muted-foreground mb-5">
          {mode === "signin" && "Sign in to access 200+ AI tools"}
          {mode === "signup" && "Join the universal AI platform"}
          {mode === "magic" && "We'll email you a one-tap sign-in link — no password needed."}
          {mode === "admin" && (user ? "Enter the passkey to elevate this account." : "Enter your credentials and the admin passkey.")}
        </p>

        {mode !== "admin" && mode !== "magic" && (
          <>
            <Button onClick={google} disabled={loading} variant="outline" className="w-full mb-3 gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.92h5.27c-.23 1.42-1.7 4.16-5.27 4.16-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.02.77 3.71 1.43l2.53-2.45C16.9 3.95 14.78 3 12.18 3 6.92 3 2.68 7.24 2.68 12.5S6.92 22 12.18 22c7.02 0 9.32-4.92 9.32-7.45 0-.5-.05-.88-.15-1.45z"/></svg>
              Continue with Google
            </Button>
            <div className="relative my-3 text-center">
              <div className="absolute inset-x-0 top-1/2 border-t border-border/60" />
              <span className="relative bg-card px-2 text-xs text-muted-foreground">or</span>
            </div>
          </>
        )}

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
          )}

          {(mode !== "admin" || !user) && (
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" required />
              </div>
            </div>
          )}

          {(mode === "signin" || mode === "signup" || (mode === "admin" && !user)) && (
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === "signin" && (
                  <button type="button" onClick={forgot} className="text-xs text-primary hover:underline">Forgot?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-9 pr-9" required minLength={6} />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === "admin" && (
            <div>
              <Label htmlFor="passkey">Admin Passkey</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="passkey" type="password" value={passkey} onChange={e => setPasskey(e.target.value)} placeholder="••••••••••" className="pl-9 font-mono" required minLength={4} autoComplete="off" />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Restricted. Unauthorized attempts are logged.
              </p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              mode === "signin" ? "Sign in" :
              mode === "signup" ? "Create account" :
              mode === "magic" ? "Email me a magic link" :
              "Verify & enter admin"
            )}
          </Button>
        </form>

        {(mode === "signin" || mode === "signup") && (
          <div className="text-center mt-4 text-sm">
            {mode === "signin" ? (
              <>New here? <button onClick={() => setMode("signup")} className="text-primary hover:underline">Create an account</button></>
            ) : (
              <>Already have an account? <button onClick={() => setMode("signin")} className="text-primary hover:underline">Sign in</button></>
            )}
          </div>
        )}
      </div>

      <p className="relative mt-6 text-xs text-muted-foreground">
        By continuing, you agree to Hexa.ai's Terms & Privacy.
      </p>
    </div>
  );
};

export default Auth;
