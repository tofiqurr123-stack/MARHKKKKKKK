import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Hexagon, Mail, Lock, Loader2 } from "lucide-react";
import logo from "@/assets/hexa-logo.png";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 chars").max(72),
});

const Auth = () => {
  const nav = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast({ title: "Check your input", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast({ title: "Welcome to Hexa.ai!", description: "Account created. Redirecting…" });
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
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    nav("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-90 pointer-events-none" />
      <div className="absolute inset-0 hex-grid opacity-[0.05] pointer-events-none" />

      <Link to="/" className="relative flex items-center gap-2 mb-8">
        <img src={logo} alt="Hexa.ai" width={40} height={40} className="drop-shadow-[0_0_20px_hsl(var(--primary)/0.5)]" />
        <span className="text-2xl font-bold tracking-tight">
          Hexa<span className="gradient-text">.ai</span>
        </span>
      </Link>

      <div className="relative w-full max-w-md glass rounded-2xl p-8 shadow-card-soft">
        <h1 className="text-2xl font-bold mb-1">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "signin" ? "Sign in to access 200+ AI tools" : "Join the universal AI platform"}
        </p>

        <Button onClick={google} disabled={loading} variant="outline" className="w-full mb-4 gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.92h5.27c-.23 1.42-1.7 4.16-5.27 4.16-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.02.77 3.71 1.43l2.53-2.45C16.9 3.95 14.78 3 12.18 3 6.92 3 2.68 7.24 2.68 12.5S6.92 22 12.18 22c7.02 0 9.32-4.92 9.32-7.45 0-.5-.05-.88-.15-1.45z"/></svg>
          Continue with Google
        </Button>

        <div className="relative my-4 text-center">
          <div className="absolute inset-x-0 top-1/2 border-t border-border/60" />
          <span className="relative bg-card px-2 text-xs text-muted-foreground">or</span>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" required />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-9" required minLength={6} />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (mode === "signin" ? "Sign in" : "Create account")}
          </Button>
        </form>

        <div className="text-center mt-4 text-sm">
          {mode === "signin" ? (
            <>New here? <button onClick={() => setMode("signup")} className="text-primary hover:underline">Create an account</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode("signin")} className="text-primary hover:underline">Sign in</button></>
          )}
        </div>
      </div>

      <p className="relative mt-6 text-xs text-muted-foreground">
        By continuing, you agree to Hexa.ai's Terms & Privacy.
      </p>
    </div>
  );
};

export default Auth;
