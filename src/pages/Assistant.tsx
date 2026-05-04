import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatPanel } from "@/components/ChatPanel";
import { Sparkles } from "lucide-react";

const Assistant = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <section className="container py-10 flex-1">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Hexa Assistant</h1>
        </div>
        <p className="text-muted-foreground mb-6">Your universal AI — Bangla & English. Ask anything.</p>
        <ChatPanel
          system="You are Hexa.ai, a multilingual (Bangla + English) universal AI assistant. Detect the user's language and respond in it. Be concrete, structured, and helpful. Use markdown."
          placeholder="Ask Hexa anything…"
          starter="👋 I'm Hexa. বাংলা বা ইংরেজিতে যেকোনো প্রশ্ন করো — career, business, study, agriculture, code, ideas।"
        />
      </div>
    </section>
    <Footer />
  </div>
);
export default Assistant;
