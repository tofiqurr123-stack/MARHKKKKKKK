const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hexa-ai`;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

export async function streamHexa({
  messages,
  system,
  onDelta,
  onDone,
  onError,
}: {
  messages: ChatMsg[];
  system?: string;
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError?: (msg: string) => void;
}) {
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
