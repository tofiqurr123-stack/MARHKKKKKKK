import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { streamHexa, ChatMsg } from "@/lib/hexaAI";
import { toast } from "sonner";

interface Props {
  system?: string;
  placeholder?: string;
  starter?: string;
  compact?: boolean;
  initialPrompt?: string;
}

export const ChatPanel = ({ system, placeholder, starter, compact, initialPrompt }: Props) => {
  const [messages, setMessages] = useState<ChatMsg[]>(
    starter ? [{ role: "assistant", content: starter }] : []
  );
  const [input, setInput] = useState(initialPrompt || "");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    let acc = "";
    setMessages(m => [...m, { role: "assistant", content: "" }]);
    await streamHexa({
      messages: next,
      system,
      onDelta: (chunk) => {
        acc += chunk;
        setMessages(m => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      },
      onDone: () => setLoading(false),
      onError: (msg) => toast.error(msg),
    });
  };

  return (
    <div className={`flex flex-col ${compact ? "h-[500px]" : "h-[600px]"} rounded-xl border border-border/60 bg-gradient-card overflow-hidden`}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <p className="text-sm max-w-sm">Ask anything. Hexa.ai understands Bangla and English.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
              m.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 border border-border/60"
            }`}>
              {m.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-headings:my-2">
                  <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.content === "" && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="border-t border-border/60 p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder || "Ask Hexa anything…"}
          className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
        />
        <Button type="submit" disabled={loading || !input.trim()} size="icon" className="bg-gradient-primary hover:opacity-90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};
