// User settings for AI provider — stored in localStorage so the user can
// toggle between Lovable's built-in Gemini access and their own Google Gemini key.
import { loadLS, saveLS } from "./storage";

export type AIProvider = "lovable" | "gemini";

export interface AISettings {
  provider: AIProvider;
  geminiKey: string;
  geminiModel: string; // e.g. gemini-2.5-flash, gemini-2.5-pro
}

const KEY = "hexa.ai.settings";

const DEFAULT: AISettings = {
  provider: "lovable",
  geminiKey: "",
  geminiModel: "gemini-2.5-flash",
};

export function getAISettings(): AISettings {
  return { ...DEFAULT, ...loadLS<Partial<AISettings>>(KEY, {}) };
}

export function setAISettings(patch: Partial<AISettings>) {
  const next = { ...getAISettings(), ...patch };
  saveLS(KEY, next);
  return next;
}
