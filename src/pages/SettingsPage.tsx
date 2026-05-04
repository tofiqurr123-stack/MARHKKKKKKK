import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Key, ExternalLink, Check, Eye, EyeOff } from "lucide-react";
import { getAISettings, setAISettings, AIProvider } from "@/lib/aiSettings";
import { toast } from "sonner";

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
];

const SettingsPage = () => {
  const [s, setS] = useState(getAISettings());
  const [show, setShow] = useState(false);

  const update = (patch: Partial<typeof s>) => {
    const next = setAISettings(patch);
    setS(next);
  };

  const test = async () => {
    if (!s.geminiKey.trim()) return toast.error("Add a Gemini API key first.");
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${s.geminiModel}:generateContent?key=${s.geminiKey.trim()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Say 'Hexa connected' in 3 words." }] }] }),
      });
      if (!r.ok) { const t = await r.text(); throw new Error(`${r.status}: ${t.slice(0, 120)}`); }
      const j = await r.json();
      const text = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
      toast.success(`✓ Gemini works — ${text.trim().slice(0, 60)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Connection failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="container py-10 flex-1">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>

          {/* Provider toggle */}
          <div className="rounded-xl border border-border/60 bg-gradient-card p-6 space-y-4">
            <div>
              <h2 className="font-semibold">AI Provider</h2>
              <p className="text-sm text-muted-foreground">Choose which AI powers your chats and tools.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(["lovable", "gemini"] as AIProvider[]).map(p => (
                <button key={p} onClick={() => update({ provider: p })}
                  className={`text-left p-4 rounded-xl border transition-all ${s.provider === p ? "border-primary bg-primary/5" : "border-border/60 hover:bg-muted/30"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{p === "lovable" ? "Lovable AI (default)" : "My Google Gemini"}</span>
                    {s.provider === p && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {p === "lovable" ? "Built-in Gemini access — no setup." : "Use your own Gemini API key & quota."}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Gemini key */}
          <div className="rounded-xl border border-border/60 bg-gradient-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Google Gemini API Key</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Stored only in your browser (localStorage). Get one free at{" "}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Google AI Studio <ExternalLink className="h-3 w-3" />
              </a>
            </p>
            <div className="relative">
              <input type={show ? "text" : "password"} value={s.geminiKey}
                onChange={(e) => update({ geminiKey: e.target.value })}
                placeholder="AIza…"
                className="w-full bg-input border border-border rounded-lg px-4 py-2.5 pr-12 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/60" />
              <button onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-xs text-muted-foreground">Model:</label>
              <select value={s.geminiModel} onChange={(e) => update({ geminiModel: e.target.value })}
                className="bg-input border border-border rounded-lg px-3 py-1.5 text-sm">
                {MODELS.map(m => <option key={m}>{m}</option>)}
              </select>
              <div className="flex-1" />
              <Button variant="outline" onClick={test}>Test connection</Button>
            </div>
            {s.provider === "gemini" && !s.geminiKey.trim() && (
              <p className="text-xs text-destructive">⚠ Provider is set to Gemini but no key is saved. Chats will fail.</p>
            )}
          </div>

          <div className="rounded-xl border border-border/60 bg-gradient-card p-6 space-y-2">
            <h2 className="font-semibold">About Hexa.ai</h2>
            <p className="text-sm text-muted-foreground">
              200+ AI tools across 10 folders, a daily life toolbox of 25 utilities, presentation generator, PDF builder,
              and a multilingual assistant — all in one app.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default SettingsPage;
