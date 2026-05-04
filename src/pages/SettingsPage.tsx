import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Key, ExternalLink, Check, Eye, EyeOff, Plus } from "lucide-react";
import {
  getAISettings,
  setAISettings,
  updateProvider,
  AIProvider,
  PROVIDER_META,
} from "@/lib/aiSettings";
import { generateText } from "@/lib/hexaAI";
import { toast } from "sonner";

const SettingsPage = () => {
  const [s, setS] = useState(getAISettings());
  const [show, setShow] = useState(false);
  const [customModel, setCustomModel] = useState("");
  const [testing, setTesting] = useState(false);

  const refresh = () => setS(getAISettings());

  const selectProvider = (p: AIProvider) => {
    setAISettings({ provider: p });
    refresh();
    setCustomModel("");
  };

  const cur = s.provider;
  const cfg = s.providers[cur];
  const meta = PROVIDER_META[cur];

  const update = (patch: Partial<typeof cfg>) => {
    updateProvider(cur, patch);
    refresh();
  };

  const addCustomModel = () => {
    if (!customModel.trim()) return;
    update({ model: customModel.trim() });
    setCustomModel("");
    toast.success(`Model set to ${customModel.trim()}`);
  };

  const test = async () => {
    setTesting(true);
    try {
      const text = await generateText("Reply with exactly: Hexa connected ✓");
      if (!text.trim()) throw new Error("No response — check key, model, or quota.");
      toast.success(`✓ ${meta.label} works — ${text.trim().slice(0, 80)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Connection failed");
    } finally {
      setTesting(false);
    }
  };

  const allProviders = Object.keys(PROVIDER_META) as AIProvider[];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="container py-10 flex-1">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>

          {/* Provider selection */}
          <div className="rounded-xl border border-border/60 bg-gradient-card p-6 space-y-4">
            <div>
              <h2 className="font-semibold">AI Provider</h2>
              <p className="text-sm text-muted-foreground">
                Pick the AI engine for chats, tools, slides, and PDFs. Bring your own key for any provider.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {allProviders.map((p) => {
                const m = PROVIDER_META[p];
                const active = cur === p;
                return (
                  <button
                    key={p}
                    onClick={() => selectProvider(p)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      active ? "border-primary bg-primary/5" : "border-border/60 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{m.label}</span>
                      {active && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active provider configuration */}
          <div className="rounded-xl border border-border/60 bg-gradient-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">{meta.label} configuration</h2>
            </div>

            {meta.needsKey ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Stored only in your browser (localStorage).{" "}
                  {meta.keyUrl && (
                    <>
                      Get a key at{" "}
                      <a
                        href={meta.keyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {new URL(meta.keyUrl).hostname} <ExternalLink className="h-3 w-3" />
                      </a>
                    </>
                  )}
                </p>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={cfg.apiKey}
                    onChange={(e) => update({ apiKey: e.target.value })}
                    placeholder="API key…"
                    className="w-full bg-input border border-border rounded-lg px-4 py-2.5 pr-12 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/60"
                  />
                  <button
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {cur === "lovable"
                  ? "No API key needed — Lovable handles billing."
                  : "Most local endpoints don't require a key. Add one only if your server enforces it."}
              </p>
            )}

            {/* Optional API key for "custom" */}
            {cur === "custom" && (
              <div className="relative">
                <label className="text-xs text-muted-foreground">API key (optional)</label>
                <input
                  type={show ? "text" : "password"}
                  value={cfg.apiKey}
                  onChange={(e) => update({ apiKey: e.target.value })}
                  placeholder="Optional"
                  className="mt-1 w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm font-mono"
                />
              </div>
            )}

            {/* Base URL for openai-compatible endpoints */}
            {(cur === "openai" || cur === "openrouter" || cur === "groq" || cur === "custom") && (
              <div>
                <label className="text-xs text-muted-foreground">Base URL</label>
                <input
                  type="text"
                  value={cfg.baseUrl || ""}
                  onChange={(e) => update({ baseUrl: e.target.value })}
                  placeholder={meta.baseUrl}
                  className="mt-1 w-full bg-input border border-border rounded-lg px-4 py-2 text-sm font-mono"
                />
              </div>
            )}

            {/* Model selection */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Model</label>
              {meta.models.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {meta.models.map((m) => (
                    <button
                      key={m}
                      onClick={() => update({ model: m })}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-mono ${
                        cfg.model === m
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 hover:bg-muted/30"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
              {meta.supportsCustomModel && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomModel()}
                    placeholder="Or enter any model id…"
                    className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm font-mono"
                  />
                  <Button variant="outline" size="sm" onClick={addCustomModel}>
                    <Plus className="h-4 w-4 mr-1" /> Use
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Active model: <span className="font-mono text-foreground">{cfg.model || "—"}</span>
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={test} disabled={testing}>
                {testing ? "Testing…" : "Test connection"}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-gradient-card p-6 space-y-2">
            <h2 className="font-semibold">About Hexa.ai</h2>
            <p className="text-sm text-muted-foreground">
              200+ AI tools across 10 folders, a daily life toolbox of 25 utilities, presentation generator, PDF
              builder, and a multilingual assistant — powered by the AI provider of your choice.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default SettingsPage;
