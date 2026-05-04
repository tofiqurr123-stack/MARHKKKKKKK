import { getAISettings, PROVIDER_META, AIProvider } from "./aiSettings";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hexa-ai`;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

// ---------- Gemini native (streaming SSE) ----------
async function streamGemini(apiKey: string, model: string, messages: ChatMsg[], system: string | undefined, onDelta: (s: string) => void) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const body: any = { contents };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  const resp = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!resp.ok || !resp.body) throw new Error(`Gemini ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
  await readSSE(resp.body, (json) => {
    const text = json.candidates?.[0]?.content?.parts?.map((p: any) => p.text || "").join("") || "";
    if (text) onDelta(text);
  });
}

// ---------- Anthropic streaming ----------
async function streamAnthropic(apiKey: string, model: string, messages: ChatMsg[], system: string | undefined, onDelta: (s: string) => void) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      stream: true,
      system,
      messages: messages.filter(m => m.role !== "system").map(m => ({ role: m.role, content: m.content })),
    }),
  });
  if (!resp.ok || !resp.body) throw new Error(`Claude ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
  await readSSE(resp.body, (json) => {
    if (json.type === "content_block_delta" && json.delta?.text) onDelta(json.delta.text);
  });
}

// ---------- OpenAI-compatible streaming (OpenAI, OpenRouter, Groq, custom) ----------
async function streamOpenAICompat(baseUrl: string, apiKey: string, model: string, messages: ChatMsg[], system: string | undefined, onDelta: (s: string) => void) {
  const msgs: ChatMsg[] = system ? [{ role: "system", content: system }, ...messages] : messages;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  const resp = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages: msgs, stream: true }),
  });
  if (!resp.ok || !resp.body) throw new Error(`API ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
  await readSSE(resp.body, (json) => {
    const c = json.choices?.[0]?.delta?.content;
    if (c) onDelta(c);
  });
}

// ---------- Generic SSE reader ----------
async function readSSE(body: ReadableStream<Uint8Array>, onJson: (j: any) => void) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (!json || json === "[DONE]") continue;
      try { onJson(JSON.parse(json)); } catch { /* partial */ }
    }
  }
}

// ---------- Lovable AI (edge function) ----------
async function streamLovable(messages: ChatMsg[], system: string | undefined, model: string | undefined, onDelta: (s: string) => void) {
  const resp = await fetch(FN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ messages, system, model }),
  });
  if (!resp.ok || !resp.body) {
    const err = await resp.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `Edge ${resp.status}`);
  }
  await readSSE(resp.body, (j) => {
    const c = j.choices?.[0]?.delta?.content;
    if (c) onDelta(c);
  });
}

export async function streamHexa({
  messages, system, onDelta, onDone, onError,
}: {
  messages: ChatMsg[];
  system?: string;
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError?: (msg: string) => void;
}) {
  const settings = getAISettings();
  const provider = settings.provider;
  const cfg = settings.providers[provider];
  const meta = PROVIDER_META[provider];

  try {
    if (provider === "lovable") {
      await streamLovable(messages, system, cfg.model, onDelta);
    } else if (provider === "gemini") {
      if (!cfg.apiKey.trim()) throw new Error("Add your Gemini API key in Settings.");
      await streamGemini(cfg.apiKey.trim(), cfg.model || "gemini-2.5-flash", messages, system, onDelta);
    } else if (provider === "anthropic") {
      if (!cfg.apiKey.trim()) throw new Error("Add your Anthropic API key in Settings.");
      await streamAnthropic(cfg.apiKey.trim(), cfg.model, messages, system, onDelta);
    } else {
      // openai, openrouter, groq, custom
      const baseUrl = cfg.baseUrl || meta.baseUrl || "";
      if (!baseUrl) throw new Error("Set a base URL in Settings.");
      if (meta.needsKey && !cfg.apiKey.trim()) throw new Error(`Add your ${meta.label} API key in Settings.`);
      if (!cfg.model.trim()) throw new Error("Set a model name in Settings.");
      await streamOpenAICompat(baseUrl, cfg.apiKey.trim(), cfg.model, messages, system, onDelta);
    }
    onDone();
  } catch (e) {
    onError?.(e instanceof Error ? e.message : "AI call failed");
    onDone();
  }
}

export async function generateText(prompt: string, system?: string): Promise<string> {
  let acc = "";
  await new Promise<void>((resolve) => {
    streamHexa({
      messages: [{ role: "user", content: prompt }],
      system,
      onDelta: (c) => { acc += c; },
      onDone: () => resolve(),
      onError: () => resolve(),
    });
  });
  return acc;
}

export async function generateHexaImage(prompt: string): Promise<{ imageUrl?: string; error?: string }> {
  const resp = await fetch(FN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      mode: "image",
      system: "Generate a high-quality image based on the user's description.",
    }),
  });
  const data = await resp.json();
  if (!resp.ok) return { error: data.error || "Failed" };
  return { imageUrl: data.imageUrl };
}

export { PROVIDER_META };
export type { AIProvider };
