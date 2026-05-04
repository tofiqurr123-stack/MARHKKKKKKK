import { getAISettings } from "./aiSettings";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hexa-ai`;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

interface DirectGeminiOpts {
  apiKey: string;
  model: string;
  messages: ChatMsg[];
  system?: string;
  onDelta: (chunk: string) => void;
}

// Direct browser-side call to Google Generative Language API when the user
// brings their own Gemini key. We use streaming SSE.
async function streamGeminiDirect({ apiKey, model, messages, system, onDelta }: DirectGeminiOpts) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const body: any = { contents };
  if (system) body.systemInstruction = { parts: [{ text: system }] };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok || !resp.body) {
    const t = await resp.text();
    throw new Error(`Gemini API error: ${resp.status} ${t.slice(0, 200)}`);
  }
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, nl).trimEnd();
      buf = buf.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (!json || json === "[DONE]") continue;
      try {
        const parsed = JSON.parse(json);
        const text = parsed.candidates?.[0]?.content?.parts?.map((p: any) => p.text || "").join("") || "";
        if (text) onDelta(text);
      } catch { /* ignore partial */ }
    }
  }
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

  // Direct Gemini path
  if (settings.provider === "gemini" && settings.geminiKey.trim()) {
    try {
      await streamGeminiDirect({
        apiKey: settings.geminiKey.trim(),
        model: settings.geminiModel || "gemini-2.5-flash",
        messages, system, onDelta,
      });
      onDone();
    } catch (e) {
      onError?.(e instanceof Error ? e.message : "Gemini call failed");
      onDone();
    }
    return;
  }

  // Lovable AI path (edge function, streaming)
  try {
    const resp = await fetch(FN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({ messages, system }),
    });
    if (!resp.ok || !resp.body) {
      const err = await resp.json().catch(() => ({ error: "Request failed" }));
      onError?.(err.error || "Request failed");
      onDone();
      return;
    }
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let done = false;
    while (!done) {
      const { done: d, value } = await reader.read();
      if (d) break;
      buffer += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { done = true; break; }
        try {
          const parsed = JSON.parse(json);
          const c = parsed.choices?.[0]?.delta?.content;
          if (c) onDelta(c);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    onDone();
  } catch (e) {
    onError?.(e instanceof Error ? e.message : "Network error");
    onDone();
  }
}

// Non-streaming convenience for places that need a full text answer (slides, pdf outline)
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
