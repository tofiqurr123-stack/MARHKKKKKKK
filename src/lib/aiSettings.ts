// Multi-provider AI settings stored in localStorage.
// Users can plug in their own API keys for any supported provider.
import { loadLS, saveLS } from "./storage";

export type AIProvider =
  | "lovable"
  | "gemini"
  | "openai"
  | "anthropic"
  | "openrouter"
  | "groq"
  | "custom";

export interface ProviderConfig {
  apiKey: string;
  model: string;
  baseUrl?: string; // for "custom" / OpenAI-compatible endpoints
}

export interface AISettings {
  provider: AIProvider;
  providers: Record<AIProvider, ProviderConfig>;
}

const KEY = "hexa.ai.settings.v2";

export const PROVIDER_META: Record<AIProvider, {
  label: string;
  description: string;
  keyUrl?: string;
  defaultModel: string;
  models: string[];
  supportsCustomModel: boolean;
  needsKey: boolean;
  baseUrl?: string;
}> = {
  lovable: {
    label: "Lovable AI (default)",
    description: "Built-in Gemini & GPT access — no key needed.",
    defaultModel: "google/gemini-2.5-flash",
    models: [
      "google/gemini-2.5-flash",
      "google/gemini-2.5-pro",
      "google/gemini-2.5-flash-lite",
      "google/gemini-3-flash-preview",
      "openai/gpt-5",
      "openai/gpt-5-mini",
      "openai/gpt-5-nano",
    ],
    supportsCustomModel: false,
    needsKey: false,
  },
  gemini: {
    label: "Google Gemini",
    description: "Use your own Gemini API key & quota.",
    keyUrl: "https://aistudio.google.com/app/apikey",
    defaultModel: "gemini-2.5-flash",
    models: [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
    ],
    supportsCustomModel: true,
    needsKey: true,
  },
  openai: {
    label: "OpenAI (ChatGPT)",
    description: "GPT-4o, GPT-5, o1 — with your OpenAI key.",
    keyUrl: "https://platform.openai.com/api-keys",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo", "o1-mini", "o1-preview"],
    supportsCustomModel: true,
    needsKey: true,
    baseUrl: "https://api.openai.com/v1",
  },
  anthropic: {
    label: "Anthropic Claude",
    description: "Claude 3.5 Sonnet, Opus, Haiku.",
    keyUrl: "https://console.anthropic.com/settings/keys",
    defaultModel: "claude-3-5-sonnet-latest",
    models: [
      "claude-3-5-sonnet-latest",
      "claude-3-5-haiku-latest",
      "claude-3-opus-latest",
      "claude-sonnet-4-5",
    ],
    supportsCustomModel: true,
    needsKey: true,
    baseUrl: "https://api.anthropic.com/v1",
  },
  openrouter: {
    label: "OpenRouter",
    description: "100+ models behind one key (Llama, Mistral, etc.).",
    keyUrl: "https://openrouter.ai/keys",
    defaultModel: "meta-llama/llama-3.3-70b-instruct",
    models: [
      "meta-llama/llama-3.3-70b-instruct",
      "anthropic/claude-3.5-sonnet",
      "openai/gpt-4o",
      "google/gemini-2.5-flash",
      "mistralai/mistral-large",
      "deepseek/deepseek-chat",
    ],
    supportsCustomModel: true,
    needsKey: true,
    baseUrl: "https://openrouter.ai/api/v1",
  },
  groq: {
    label: "Groq",
    description: "Ultra-fast Llama, Mixtral inference.",
    keyUrl: "https://console.groq.com/keys",
    defaultModel: "llama-3.3-70b-versatile",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it"],
    supportsCustomModel: true,
    needsKey: true,
    baseUrl: "https://api.groq.com/openai/v1",
  },
  custom: {
    label: "Custom (OpenAI-compatible)",
    description: "Any OpenAI-compatible endpoint (Ollama, vLLM, LM Studio…).",
    defaultModel: "",
    models: [],
    supportsCustomModel: true,
    needsKey: false,
    baseUrl: "http://localhost:11434/v1",
  },
};

const DEFAULT: AISettings = {
  provider: "lovable",
  providers: Object.fromEntries(
    (Object.keys(PROVIDER_META) as AIProvider[]).map(p => [p, {
      apiKey: "",
      model: PROVIDER_META[p].defaultModel,
      baseUrl: PROVIDER_META[p].baseUrl,
    }])
  ) as Record<AIProvider, ProviderConfig>,
};

export function getAISettings(): AISettings {
  const raw = loadLS<Partial<AISettings>>(KEY, {});
  const providers = { ...DEFAULT.providers, ...(raw.providers || {}) } as Record<AIProvider, ProviderConfig>;
  // Migrate from v1
  const legacy = loadLS<{ provider?: string; geminiKey?: string; geminiModel?: string }>("hexa.ai.settings", {});
  if (legacy.geminiKey && !providers.gemini.apiKey) {
    providers.gemini.apiKey = legacy.geminiKey;
    if (legacy.geminiModel) providers.gemini.model = legacy.geminiModel;
  }
  return {
    provider: (raw.provider as AIProvider) || (legacy.provider as AIProvider) || DEFAULT.provider,
    providers,
  };
}

export function setAISettings(patch: Partial<AISettings>) {
  const next = { ...getAISettings(), ...patch };
  saveLS(KEY, next);
  return next;
}

export function updateProvider(p: AIProvider, patch: Partial<ProviderConfig>) {
  const cur = getAISettings();
  const next: AISettings = {
    ...cur,
    providers: { ...cur.providers, [p]: { ...cur.providers[p], ...patch } },
  };
  saveLS(KEY, next);
  return next;
}
