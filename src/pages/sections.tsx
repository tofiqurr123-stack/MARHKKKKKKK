import { GraduationCap, Briefcase, Sprout, Rocket } from "lucide-react";
import { SectionPage } from "./SectionPage";

export const Learn = () => <SectionPage config={{
  title: "Learn",
  tagline: "AI tutors, study planners, notes, quizzes — your personal academy.",
  Icon: GraduationCap, accent: "text-primary",
  categories: ["Education"],
}} />;

export const Earn = () => <SectionPage config={{
  title: "Earn",
  tagline: "CV builders, job finders, freelancing guides — land work faster.",
  Icon: Briefcase, accent: "text-secondary",
  categories: ["Career"],
}} />;

export const Grow = () => <SectionPage config={{
  title: "Grow",
  tagline: "Crop advisory, soil health, market prices — modern farming AI.",
  Icon: Sprout, accent: "text-accent",
  categories: ["Agriculture"],
}} />;

export const Build = () => <SectionPage config={{
  title: "Build",
  tagline: "From idea to launch — startup tools for founders.",
  Icon: Rocket, accent: "text-primary-glow",
  categories: ["Entrepreneur"],
}} />;
