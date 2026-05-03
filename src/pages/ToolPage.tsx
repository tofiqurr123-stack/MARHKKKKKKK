import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getToolBySlug } from "@/data/tools";
import { ChatPanel } from "@/components/ChatPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Wand2, Download } from "lucide-react";
import { generateHexaImage } from "@/lib/hexaAI";
import { toast } from "sonner";

const ToolPage = () => {
  const { slug } = useParams();
  const tool = slug ? getToolBySlug(slug) : null;

  const [imgPrompt, setImgPrompt] = useState("");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(false);

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container py-20 text-center flex-1">
          <h1 className="text-3xl font-bold mb-4">Tool not found</h1>
          <Link to="/tools" className="text-primary hover:underline">Browse all tools</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const generate = async () => {
    if (!imgPrompt.trim()) return;
    setImgLoading(true);
    setImgUrl(null);
    const { imageUrl, error } = await generateHexaImage(imgPrompt);
    setImgLoading(false);
    if (error) toast.error(error);
    else if (imageUrl) setImgUrl(imageUrl);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="container py-10 flex-1">
        <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> All tools
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider text-primary px-2 py-0.5 rounded-full border border-primary/40 bg-primary/5">
              {tool.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{tool.name}</h1>
          <p className="text-muted-foreground mb-8">{tool.description}</p>

          {tool.mode === "image" ? (
            <div className="rounded-xl border border-border/60 bg-gradient-card p-6 space-y-4">
              <label className="text-sm font-medium">Describe the image you want</label>
              <textarea
                value={imgPrompt}
                onChange={(e) => setImgPrompt(e.target.value)}
                placeholder="A cyberpunk hexagonal city at sunset, neon lights…"
                rows={3}
                className="w-full bg-input border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
              <Button onClick={generate} disabled={imgLoading || !imgPrompt.trim()} className="bg-gradient-primary hover:opacity-90 gap-2">
                {imgLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                Generate image
              </Button>
              {imgUrl && (
                <div className="space-y-3">
                  <img src={imgUrl} alt="Generated" className="w-full rounded-lg border border-border/60" />
                  <a href={imgUrl} download="hexa-ai.png">
                    <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Download</Button>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <ChatPanel
              system={`${tool.systemHint}\n\nTool context: ${tool.name} — ${tool.description}.`}
              placeholder={tool.inputPlaceholder}
              starter={`Welcome to **${tool.name}**. Tell me what you need and I'll help right away.`}
            />
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ToolPage;
