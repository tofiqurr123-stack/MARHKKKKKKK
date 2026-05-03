export type ToolCategory =
  | "Core AI"
  | "Education"
  | "Career"
  | "Entrepreneur"
  | "Agriculture"
  | "Writing"
  | "Image"
  | "Video & Audio"
  | "Productivity"
  | "Utilities";

export interface Tool {
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  systemHint?: string;
  mode?: "text" | "image";
}

const mk = (
  category: ToolCategory,
  list: Array<[string, string?, string?]>,
  baseHint: string
): Tool[] =>
  list.map(([name, desc, hint]) => ({
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name,
    category,
    description: desc || `${name} powered by Hexa.ai`,
    systemHint: hint || baseHint,
    inputLabel: "Your input",
    inputPlaceholder: `Describe what you need from ${name}…`,
  }));

export const TOOLS: Tool[] = [
  // 1. CORE AI (10)
  ...mk("Core AI", [
    ["Global AI Chat Assistant", "Open-ended conversation with Hexa AI"],
    ["Bangla AI Translator", "Translate any text to/from Bangla", "Translate the user's input. Detect language and translate Bangla<->English, preserve meaning."],
    ["English AI Translator", "Translate any text to English"],
    ["AI Answer Explainer", "Explain anything in simple terms"],
    ["AI Task Planner", "Break a goal into a clear plan"],
    ["AI Idea Generator", "Generate fresh ideas on any topic"],
    ["AI Summary Tool", "Summarize long text in seconds"],
    ["AI Question Solver", "Get step-by-step solutions"],
    ["AI Recommendation Engine", "Personalized recommendations"],
    ["AI Workflow Builder", "Design a step-by-step workflow"],
  ], "You are Hexa.ai, a precise universal assistant. Respond clearly with markdown."),

  // 2. EDUCATION (25)
  ...mk("Education", [
    ["Notes Generator"], ["Study Planner"], ["Exam Preparation Builder"],
    ["AI Tutor Math"], ["AI Tutor Science"], ["AI Tutor English"], ["AI Tutor Bangla"],
    ["Essay Writer"], ["Paragraph Generator"], ["MCQ Generator"], ["Quiz Maker"],
    ["Flashcard Creator"], ["Homework Helper"], ["Topic Simplifier"],
    ["Concept Map Generator"], ["Book Summary Tool"], ["PDF Explainer"],
    ["Lecture Notes Converter"], ["Study Schedule Generator"], ["Grammar Fixer"],
    ["Writing Checker"], ["Research Helper"], ["Question Generator"],
    ["Learning Path Creator"], ["School Project Builder"],
  ], "You are an expert educator. Give clear, structured, exam-ready output in markdown."),

  // 3. CAREER (25)
  ...mk("Career", [
    ["CV Builder"], ["Resume Optimizer"], ["Cover Letter Generator"],
    ["Job Finder AI"], ["Interview Question Trainer"], ["Interview Answer Coach"],
    ["Freelancing Guide"], ["Skill Roadmap Generator"], ["Career Advisor AI"],
    ["Salary Estimator"], ["LinkedIn Bio Generator"], ["Portfolio Builder"],
    ["Job Description Generator"], ["Skill Tester"], ["Internship Finder"],
    ["Remote Job Finder"], ["Career Switch Guide"], ["Job Application Tracker"],
    ["Motivation Coach AI"], ["Workplace Email Writer"], ["Professional Bio Generator"],
    ["Soft Skill Trainer"], ["Productivity Coach"], ["Career Goal Planner"],
    ["Experience Builder"],
  ], "You are a senior career coach. Be concrete, actionable, and recruiter-friendly."),

  // 4. ENTREPRENEUR (25)
  ...mk("Entrepreneur", [
    ["Business Idea Generator"], ["Market Research Tool"], ["Competitor Analyzer"],
    ["Startup Name Generator"], ["Brand Name Generator"], ["Logo Idea Generator"],
    ["Business Plan Generator"], ["Pitch Deck Builder"], ["Marketing Strategy Planner"],
    ["Budget Planner"], ["Profit Calculator"], ["Expense Tracker"],
    ["Product Idea Validator"], ["Customer Persona Builder"], ["Pricing Strategy Tool"],
    ["Ad Copy Generator"], ["Social Media Plan Maker"], ["Sales Funnel Builder"],
    ["Startup Checklist Tool"], ["Investment Pitch Generator"], ["Risk Analyzer"],
    ["Growth Strategy Planner"], ["Business Model Canvas Tool"], ["Funding Guide AI"],
    ["Startup Mentor AI"],
  ], "You are a YC-grade startup advisor. Output structured, founder-ready guidance."),

  // 5. AGRICULTURE (20)
  ...mk("Agriculture", [
    ["Crop Recommendation AI"], ["Seasonal Crop Planner"], ["Soil Health Advisor"],
    ["Fertilizer Guide"], ["Pest Detection Assistant"], ["Disease Diagnosis Tool"],
    ["Weather Advisory Tool"], ["Market Price Checker"], ["Farming Cost Calculator"],
    ["Irrigation Planner"], ["Harvest Time Predictor"], ["Crop Rotation Planner"],
    ["Livestock Care Assistant"], ["Farm Budget Planner"], ["Agriculture News Summarizer"],
    ["Yield Predictor"], ["Organic Farming Guide"], ["Seed Selection Tool"],
    ["Water Usage Optimizer"], ["Farming Q&A AI"],
  ], "You are an agronomy expert. Tailor advice to the user's region/season when given."),

  // 6. WRITING (20)
  ...mk("Writing", [
    ["Blog Writer"], ["Article Generator"], ["Story Writer"], ["Caption Generator"],
    ["Ad Copy Writer"], ["Email Writer"], ["Script Writer"], ["YouTube Script Generator"],
    ["Product Description Writer"], ["SEO Content Generator"], ["Grammar Pro Fixer"],
    ["Rewriter Tool"], ["Plagiarism-Free Paraphraser"], ["Creative Writing Assistant"],
    ["Poem Generator"], ["Book Writer Assistant"], ["Summary Generator"],
    ["Hook Generator"], ["Headline Generator"], ["Content Planner"],
  ], "You are a professional writer. Match tone, structure, and SEO best practices."),

  // 7. IMAGE (15) - text descriptions/prompts
  ...mk("Image", [
    ["AI Image Generator", "Generate an image from a prompt", "", ],
    ["Logo Generator"], ["Poster Creator"], ["Banner Designer"], ["Thumbnail Maker"],
    ["Social Media Post Designer"], ["Profile Picture Generator"], ["AI Art Generator"],
    ["Background Remover Guide"], ["Image Enhancer Guide"], ["Image Upscaler Guide"],
    ["Sketch to Image Prompt"], ["Product Mockup Generator"], ["Meme Creator"],
    ["UI Design Generator"],
  ], "You craft vivid image-generation prompts and design briefs. Output one polished prompt + variations."),

  // 8. VIDEO & AUDIO (15)
  ...mk("Video & Audio", [
    ["Video Script Generator"], ["AI Video Idea Generator"], ["Subtitle Generator"],
    ["Voice-to-Text Guide"], ["Text-to-Voice Script"], ["Podcast Script Generator"],
    ["Video Caption Maker"], ["Audio Enhancer Guide"], ["Sound Effect Generator"],
    ["Music Idea Generator"], ["Short Video Planner"], ["Reel Script Generator"],
    ["Voice Clarity Tool"], ["Video Summary Tool"], ["Content Repurposer"],
  ], "You are a video/audio content strategist. Deliver scripts with hooks, beats, and CTA."),

  // 9. PRODUCTIVITY (25)
  ...mk("Productivity", [
    ["To-Do List AI"], ["Smart Calendar Planner"], ["Time Management Tool"],
    ["Habit Tracker Plan"], ["Focus Timer Plan"], ["Reminder System Plan"],
    ["Daily Planner"], ["Goal Tracker"], ["Note Organizer"], ["Task Prioritizer"],
    ["Meeting Agenda Generator"], ["Email Organizer"], ["File Summarizer"],
    ["PDF Tool Guide"], ["File Converter Guide"], ["Password Generator Tips"],
    ["Data Organizer"], ["Expense Tracker Plan"], ["Simple Calculator Helper"],
    ["Unit Converter Helper"], ["Idea Notebook"], ["Mind Map Tool"],
    ["Routine Builder"], ["Productivity Analyzer"], ["Life Planner AI"],
  ], "You are a productivity coach. Output crisp, prioritized, actionable plans."),

  // 10. UTILITIES (20)
  ...mk("Utilities", [
    ["AI Search Engine"], ["AI FAQ Bot Builder"], ["Chatbot Creator"],
    ["Code Generator"], ["Code Debugger"], ["Website Generator"],
    ["App Idea Generator"], ["API Tester Helper"], ["Data Analyzer"],
    ["Text Cleaner Tool"], ["Language Detector"], ["Sentiment Analyzer"],
    ["Keyword Generator"], ["Trend Analyzer"], ["AI Assistant Builder"],
    ["Automation Tool"], ["File Organizer AI"], ["Smart Recommendation Engine"],
    ["Knowledge Base Builder"], ["Universal AI Command Center"],
  ], "You are a versatile AI utility. Be precise, technical when needed, with code blocks if helpful."),
];

// Mark image generator as image mode
const imgGen = TOOLS.find(t => t.slug === "ai-image-generator");
if (imgGen) imgGen.mode = "image";

export const CATEGORIES: ToolCategory[] = [
  "Core AI", "Education", "Career", "Entrepreneur", "Agriculture",
  "Writing", "Image", "Video & Audio", "Productivity", "Utilities",
];

export const getToolBySlug = (slug: string) => TOOLS.find(t => t.slug === slug);
