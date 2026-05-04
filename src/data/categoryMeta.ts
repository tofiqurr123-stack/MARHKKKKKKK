import {
  Brain, GraduationCap, Briefcase, Rocket, Sprout, PenLine,
  Image as ImageIcon, Film, ListChecks, Wrench, LucideIcon
} from "lucide-react";
import { ToolCategory } from "./tools";

export interface CategoryMeta {
  category: ToolCategory;
  slug: string;
  icon: LucideIcon;
  /** main accent color (hsl values, no hsl() wrapper) */
  accent: string;
  accent2: string;
  /** tailwind-friendly gradient using inline styles */
  gradient: string;
  /** ring/glow color */
  glow: string;
  blurb: string;
}

export const CATEGORY_META: Record<ToolCategory, CategoryMeta> = {
  "Core AI": {
    category: "Core AI", slug: "core-ai", icon: Brain,
    accent: "180 100% 55%", accent2: "200 100% 60%",
    gradient: "linear-gradient(135deg, hsl(180 100% 55%) 0%, hsl(220 100% 60%) 100%)",
    glow: "180 100% 55%",
    blurb: "Universal assistants, translators, planners — the brain of Hexa.",
  },
  Education: {
    category: "Education", slug: "education", icon: GraduationCap,
    accent: "210 100% 65%", accent2: "180 90% 60%",
    gradient: "linear-gradient(135deg, hsl(210 100% 60%) 0%, hsl(180 90% 55%) 100%)",
    glow: "210 100% 65%",
    blurb: "Tutors, notes, quizzes, study planners — your personal academy.",
  },
  Career: {
    category: "Career", slug: "career", icon: Briefcase,
    accent: "30 100% 60%", accent2: "10 95% 60%",
    gradient: "linear-gradient(135deg, hsl(30 100% 60%) 0%, hsl(10 95% 60%) 100%)",
    glow: "30 100% 60%",
    blurb: "CVs, jobs, interviews, freelancing — land work faster.",
  },
  Entrepreneur: {
    category: "Entrepreneur", slug: "entrepreneur", icon: Rocket,
    accent: "270 90% 65%", accent2: "320 90% 60%",
    gradient: "linear-gradient(135deg, hsl(270 90% 65%) 0%, hsl(320 90% 60%) 100%)",
    glow: "270 90% 65%",
    blurb: "From idea to launch — startup tools for founders.",
  },
  Agriculture: {
    category: "Agriculture", slug: "agriculture", icon: Sprout,
    accent: "140 70% 50%", accent2: "90 70% 50%",
    gradient: "linear-gradient(135deg, hsl(140 70% 45%) 0%, hsl(90 70% 50%) 100%)",
    glow: "140 70% 50%",
    blurb: "Crop advisory, soil, weather, market prices — modern farming AI.",
  },
  Writing: {
    category: "Writing", slug: "writing", icon: PenLine,
    accent: "340 90% 65%", accent2: "20 95% 65%",
    gradient: "linear-gradient(135deg, hsl(340 90% 65%) 0%, hsl(20 95% 65%) 100%)",
    glow: "340 90% 65%",
    blurb: "Blogs, ads, scripts, emails — words that convert.",
  },
  Image: {
    category: "Image", slug: "image", icon: ImageIcon,
    accent: "290 100% 65%", accent2: "240 100% 70%",
    gradient: "linear-gradient(135deg, hsl(290 100% 65%) 0%, hsl(240 100% 70%) 100%)",
    glow: "290 100% 65%",
    blurb: "Generate, design, ideate visuals with AI.",
  },
  "Video & Audio": {
    category: "Video & Audio", slug: "video-audio", icon: Film,
    accent: "0 90% 60%", accent2: "300 90% 60%",
    gradient: "linear-gradient(135deg, hsl(0 90% 60%) 0%, hsl(300 90% 60%) 100%)",
    glow: "0 90% 60%",
    blurb: "Scripts, captions, podcasts, reels — content at speed.",
  },
  Productivity: {
    category: "Productivity", slug: "productivity", icon: ListChecks,
    accent: "200 90% 55%", accent2: "160 80% 50%",
    gradient: "linear-gradient(135deg, hsl(200 90% 55%) 0%, hsl(160 80% 50%) 100%)",
    glow: "200 90% 55%",
    blurb: "Plan, prioritize, focus — get more done.",
  },
  Utilities: {
    category: "Utilities", slug: "utilities", icon: Wrench,
    accent: "50 100% 60%", accent2: "30 100% 60%",
    gradient: "linear-gradient(135deg, hsl(50 100% 60%) 0%, hsl(30 100% 60%) 100%)",
    glow: "50 100% 60%",
    blurb: "Code, search, analyze — versatile AI utilities.",
  },
};

export const CATEGORY_LIST = Object.values(CATEGORY_META);

export const getCategoryBySlug = (slug: string) =>
  CATEGORY_LIST.find(c => c.slug === slug);
