import {
  Brain, GraduationCap, Briefcase, Rocket, Sprout, PenLine, Image as ImageIcon,
  Film, ListChecks, Wrench, type LucideIcon
} from "lucide-react";
import type { ToolCategory } from "./tools";

const map: Record<ToolCategory, LucideIcon> = {
  "Core AI": Brain,
  Education: GraduationCap,
  Career: Briefcase,
  Entrepreneur: Rocket,
  Agriculture: Sprout,
  Writing: PenLine,
  Image: ImageIcon,
  "Video & Audio": Film,
  Productivity: ListChecks,
  Utilities: Wrench,
};

export const iconForCategory = (c: ToolCategory): LucideIcon => map[c] ?? Brain;
