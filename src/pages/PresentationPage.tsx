import { useRef, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { generateText } from "@/lib/hexaAI";
import { Sparkles, Loader2, Download, ChevronLeft, ChevronRight, Presentation, FileDown } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Slide {
  title: string;
  bullets: string[];
  notes?: string;
}

const THEMES = [
  { name: "Aurora", bg: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)", accent: "#22D3EE", text: "#F8FAFC", muted: "#94A3B8" },
  { name: "Sunset", bg: "linear-gradient(135deg, #1A1209 0%, #4A1D0F 50%, #B45309 100%)", accent: "#FBBF24", text: "#FFF7ED", muted: "#FED7AA" },
  { name: "Forest", bg: "linear-gradient(135deg, #052E16 0%, #14532D 50%, #166534 100%)", accent: "#86EFAC", text: "#F0FDF4", muted: "#BBF7D0" },
  { name: "Mono",   bg: "linear-gradient(135deg, #0A0A0A 0%, #1F1F1F 100%)",                 accent: "#FACC15", text: "#FAFAFA", muted: "#A3A3A3" },
];

const sample: Slide[] = [
  { title: "Click 'Generate' to start", bullets: ["Type any topic above", "AI will draft a full deck", "Edit, present, or download"] },
];

const PresentationPage = () => {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState("8");
  const [slides, setSlides] = useState<Slide[]>(sample);
  const [theme, setTheme] = useState(THEMES[0]);
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    const sys = "You are a presentation expert. Output STRICT JSON only — no markdown, no fences. The JSON must be: { \"title\": string, \"slides\": [{\"title\": string, \"bullets\": string[3-5], \"notes\": string}] }";
    const prompt = `Create a ${count}-slide presentation about: "${topic.trim()}". First slide is the title (bullets = subtitle/agenda). Last slide is the conclusion. Each content slide has 3-5 concise bullets (max 12 words each). Include short presenter notes per slide. Output JSON only.`;
    const raw = await generateText(prompt, sys);
    setLoading(false);
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const m = cleaned.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("no json");
      const parsed = JSON.parse(m[0]);
      const arr: Slide[] = parsed.slides || [];
      if (!arr.length) throw new Error("empty");
      setSlides(arr);
      setIdx(0);
      toast.success(`Generated ${arr.length} slides!`);
    } catch (e) {
      toast.error("AI returned invalid format. Try again or rephrase the topic.");
    }
  };

  const downloadPPTX = async () => {
    const PptxGenJS = (await import("pptxgenjs")).default;
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5

    // theme colors -> hex without #
    const accent = theme.accent.replace("#", "");
    const text = theme.text.replace("#", "");
    const muted = theme.muted.replace("#", "");

    slides.forEach((s, i) => {
      const slide = pptx.addSlide();
      // background gradient (use solid first color from gradient end)
      const m1 = theme.bg.match(/#([0-9A-F]{6})/gi);
      slide.background = { color: (m1?.[m1.length - 1] || "0F172A").replace("#", "") };

      // accent bar
      slide.addShape("rect", { x: 0, y: 0, w: 0.18, h: 7.5, fill: { color: accent } });

      // title slide
      if (i === 0) {
        slide.addText(s.title, {
          x: 0.6, y: 2.5, w: 12, h: 1.5, fontSize: 54, bold: true, color: text, fontFace: "Calibri",
        });
        slide.addText(s.bullets.join(" · "), { x: 0.6, y: 4.2, w: 12, h: 0.8, fontSize: 22, color: muted });
        slide.addText(`Slide 1 / ${slides.length}`, { x: 0.6, y: 6.9, w: 12, fontSize: 11, color: muted });
      } else {
        slide.addText(s.title, { x: 0.6, y: 0.4, w: 12, h: 1, fontSize: 32, bold: true, color: accent, fontFace: "Calibri" });
        slide.addShape("line", { x: 0.6, y: 1.45, w: 1.5, h: 0, line: { color: accent, width: 2 } });
        slide.addText(s.bullets.map(b => ({ text: b, options: { bullet: { code: "25CF" } } })), {
          x: 0.6, y: 1.8, w: 12, h: 5, fontSize: 22, color: text, paraSpaceAfter: 12,
        });
        slide.addText(`${i + 1} / ${slides.length}`, { x: 12, y: 6.9, w: 1, h: 0.4, fontSize: 11, color: muted, align: "right" });
      }
      if (s.notes) slide.addNotes(s.notes);
    });

    await pptx.writeFile({ fileName: `${(slides[0]?.title || "hexa-presentation").replace(/[^\w\-]+/g, "-")}.pptx` });
    toast.success("PPTX downloaded");
  };

  const downloadPDF = async () => {
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1280, 720] });
    for (let i = 0; i < slides.length; i++) {
      setIdx(i);
      await new Promise(r => setTimeout(r, 250));
      if (!slideRef.current) continue;
      const canvas = await html2canvas(slideRef.current, { scale: 1.2, backgroundColor: null, useCORS: true });
      const img = canvas.toDataURL("image/jpeg", 0.92);
      if (i > 0) pdf.addPage([1280, 720], "landscape");
      pdf.addImage(img, "JPEG", 0, 0, 1280, 720);
    }
    pdf.save(`${(slides[0]?.title || "hexa-presentation").replace(/[^\w\-]+/g, "-")}.pdf`);
    toast.success("PDF downloaded");
  };

  const cur = slides[idx];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="container py-10 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Presentation className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Presentation Generator</h1>
          </div>
          <p className="text-muted-foreground mb-6">Type a topic. Get a real, beautiful slide deck. View in-browser, download as <strong>.pptx</strong> or <strong>.pdf</strong>.</p>

          <div className="rounded-xl border border-border/60 bg-gradient-card p-4 space-y-3 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2">
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Introduction to Quantum Computing"
                className="bg-input border border-border rounded-lg px-4 py-2.5 text-sm" />
              <select value={count} onChange={(e) => setCount(e.target.value)} className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm">
                {[5, 6, 8, 10, 12, 15].map(n => <option key={n}>{n}</option>)}
              </select>
              <Button onClick={generate} disabled={loading || !topic.trim()} className="bg-gradient-primary gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground">Theme:</span>
              {THEMES.map(t => (
                <button key={t.name} onClick={() => setTheme(t)} className="px-3 py-1 rounded-full text-xs border transition-all"
                  style={theme.name === t.name ? { borderColor: t.accent, color: t.accent, background: `${t.accent}15` } : {}}>
                  {t.name}
                </button>
              ))}
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={downloadPPTX} disabled={loading} className="gap-1"><FileDown className="h-4 w-4" /> .pptx</Button>
              <Button variant="outline" size="sm" onClick={downloadPDF} disabled={loading} className="gap-1"><Download className="h-4 w-4" /> .pdf</Button>
            </div>
          </div>

          {/* slide viewer */}
          <div className="space-y-3">
            <div
              ref={slideRef}
              className="aspect-video w-full rounded-xl overflow-hidden relative"
              style={{ background: theme.bg, color: theme.text }}
            >
              {/* accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-2" style={{ background: theme.accent }} />
              <div className="absolute inset-0 p-12 flex flex-col">
                {idx === 0 ? (
                  <div className="m-auto text-center">
                    <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: theme.text }}>{cur?.title}</h2>
                    <p className="text-xl" style={{ color: theme.muted }}>{cur?.bullets.join("  ·  ")}</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: theme.accent }}>{cur?.title}</h2>
                    <div className="h-1 w-16 mb-6 rounded" style={{ background: theme.accent }} />
                    <ul className="space-y-3 text-xl md:text-2xl leading-relaxed flex-1">
                      {cur?.bullets.map((b, i) => (
                        <li key={i} className="flex gap-3"><span style={{ color: theme.accent }}>●</span><span>{b}</span></li>
                      ))}
                    </ul>
                  </>
                )}
                <div className="absolute bottom-4 right-6 text-xs" style={{ color: theme.muted }}>
                  {idx + 1} / {slides.length}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <div className="flex gap-1.5 overflow-x-auto py-1 max-w-full flex-1 justify-center">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} className="h-2 w-2 rounded-full transition-all"
                    style={{ background: i === idx ? theme.accent : "hsl(var(--muted))", transform: i === idx ? "scale(1.5)" : "" }} />
                ))}
              </div>
              <Button variant="outline" onClick={() => setIdx(i => Math.min(slides.length - 1, i + 1))} disabled={idx === slides.length - 1}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {cur?.notes && (
              <details className="rounded-lg border border-border/60 bg-card p-3 text-sm">
                <summary className="cursor-pointer text-muted-foreground">Presenter notes</summary>
                <p className="mt-2">{cur.notes}</p>
              </details>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PresentationPage;
