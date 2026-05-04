import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { generateText } from "@/lib/hexaAI";
import { Sparkles, Loader2, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";

const STYLES = [
  { name: "Clean",   font: "helvetica" as const, accent: [37, 99, 235] as [number, number, number] },
  { name: "Classic", font: "times"     as const, accent: [120, 53, 15]  as [number, number, number] },
  { name: "Mono",    font: "courier"   as const, accent: [22, 163, 74]  as [number, number, number] },
];

const PdfBuilder = () => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState(STYLES[0]);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    const sys = "You are a professional document writer. Output well-structured Markdown with clear hierarchy: a single H1 title, H2 sections, short paragraphs, and bullet lists where useful. Aim for ~600-900 words. No code fences, no preamble.";
    const text = await generateText(`Write a ${tone} document about: "${topic.trim()}". Include an introduction, 3-5 main sections, and a conclusion.`, sys);
    setLoading(false);
    if (!text.trim()) { toast.error("Generation failed."); return; }
    setContent(text);
    const m = text.match(/^#\s+(.+)$/m);
    setTitle(m?.[1] || topic);
  };

  const download = () => {
    if (!content.trim()) { toast.error("Generate or paste content first."); return; }
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const W = pdf.internal.pageSize.getWidth();
    const H = pdf.internal.pageSize.getHeight();
    const M = 56;
    const lh = 16;
    let y = M;
    pdf.setFont(style.font, "normal");

    const newPageIfNeeded = (need = lh) => { if (y + need > H - M) { pdf.addPage(); y = M; } };
    const writeWrap = (text: string, size: number, weight: "normal" | "bold" = "normal", color: [number, number, number] = [20, 20, 20]) => {
      pdf.setFont(style.font, weight);
      pdf.setFontSize(size);
      pdf.setTextColor(...color);
      const lines = pdf.splitTextToSize(text, W - M * 2);
      lines.forEach((ln: string) => { newPageIfNeeded(size + 4); pdf.text(ln, M, y); y += size + 4; });
    };

    // header band
    pdf.setFillColor(...style.accent); pdf.rect(0, 0, W, 6, "F");

    content.split(/\n/).forEach(rawLine => {
      const line = rawLine.replace(/\r/g, "");
      if (!line.trim()) { y += lh / 2; return; }
      if (/^#\s+/.test(line))      { y += 8; writeWrap(line.replace(/^#\s+/, ""), 26, "bold", style.accent); y += 6; }
      else if (/^##\s+/.test(line)) { y += 12; writeWrap(line.replace(/^##\s+/, ""), 18, "bold", style.accent); y += 4; }
      else if (/^###\s+/.test(line)){ y += 8; writeWrap(line.replace(/^###\s+/, ""), 14, "bold"); y += 2; }
      else if (/^[-*]\s+/.test(line)) {
        const t = line.replace(/^[-*]\s+/, "");
        pdf.setFont(style.font, "normal"); pdf.setFontSize(11); pdf.setTextColor(20, 20, 20);
        const lines = pdf.splitTextToSize(t, W - M * 2 - 14);
        lines.forEach((ln: string, i: number) => { newPageIfNeeded(lh); if (i === 0) pdf.text("•", M, y); pdf.text(ln, M + 14, y); y += lh; });
      }
      else { writeWrap(line, 11); }
    });

    // footer page numbers
    const total = pdf.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      pdf.setPage(i); pdf.setFontSize(9); pdf.setTextColor(150);
      pdf.text(`${i} / ${total}`, W - M, H - 24);
      pdf.text("Hexa.ai", M, H - 24);
    }
    pdf.save(`${(title || "hexa-document").replace(/[^\w\-]+/g, "-")}.pdf`);
    toast.success("PDF downloaded");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="container py-10 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">PDF Builder</h1>
          </div>
          <p className="text-muted-foreground mb-6">Generate or write content. Preview live. Download as a real PDF document.</p>

          <div className="rounded-xl border border-border/60 bg-gradient-card p-4 space-y-3 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2">
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic (e.g. Renewable energy in Bangladesh)"
                className="bg-input border border-border rounded-lg px-4 py-2.5 text-sm" />
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm">
                {["professional", "casual", "academic", "persuasive", "instructional"].map(t => <option key={t}>{t}</option>)}
              </select>
              <Button onClick={generate} disabled={loading || !topic.trim()} className="bg-gradient-primary gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground">Style:</span>
              {STYLES.map(s => (
                <button key={s.name} onClick={() => setStyle(s)} className="px-3 py-1 rounded-full text-xs border"
                  style={style.name === s.name ? { borderColor: `rgb(${s.accent.join(",")})`, color: `rgb(${s.accent.join(",")})` } : {}}>
                  {s.name}
                </button>
              ))}
              <div className="flex-1" />
              <Button onClick={download} className="bg-gradient-primary gap-2"><Download className="h-4 w-4" /> Download PDF</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Markdown editor</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={24}
                placeholder="# My Document\n\nWrite or paste markdown here…"
                className="w-full bg-input border border-border rounded-lg p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/60" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Live preview</label>
              <div className="rounded-lg border border-border/60 bg-white text-neutral-900 p-6 min-h-[600px] prose prose-sm max-w-none">
                {content ? <ReactMarkdown>{content}</ReactMarkdown> : <p className="text-neutral-400">Your formatted preview appears here.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PdfBuilder;
