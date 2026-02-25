import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, `Please enter your name.`).max(80, `Name is too long.`),
  email: z
    .string()
    .min(1, `Please enter your email.`)
    .email(`Please enter a valid email address.`),
  message: z
    .string()
    .min(10, `Please add a bit more detail (at least 10 characters).`)
    .max(2000, `Message is too long.`),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

export type SkillItem = {
  title: string;
  description: string;
};

export type TimelineItem = {
  title: string;
  period: string;
  description: string;
};

export type TestimonialItem = {
  name: string;
  role: string;
  quote: string;
};

export const projects: PortfolioProject[] = [
  {
    id: `p1`,
    title: `Project One — Product Redesign`,
    description: `Improved onboarding and reduced drop-off with a streamlined flow and clearer information hierarchy.`,
    tags: [`UX`, `UI`, `Research`, `Design`],
  },
  {
    id: `p2`,
    title: `Project Two — Analytics Dashboard`,
    description: `Designed and built a responsive dashboard with reusable components and accessible data visualizations.`,
    tags: [`React`, `Data Viz`, `Accessibility`, `Design System`],
  },
  {
    id: `p3`,
    title: `Project Three — Marketing Site`,
    description: `High-converting landing page with performance-first implementation and SEO-friendly structure.`,
    tags: [`Next.js`, `Performance`, `SEO`, `Landing`],
  },
  {
    id: `p4`,
    title: `Project Four — Design System`,
    description: `Created tokens, components, and guidelines to unify UI across teams and speed up delivery.`,
    tags: [`Tokens`, `Components`, `Documentation`, `A11y`],
  },
  {
    id: `p5`,
    title: `Project Five — Mobile UI Concept`,
    description: `End-to-end concept from research to prototype, focusing on clarity and micro-interactions.`,
    tags: [`Prototype`, `Mobile`, `Motion`, `Interaction`],
  },
  {
    id: `p6`,
    title: `Project Six — Developer Tooling`,
    description: `Built internal tooling to automate workflows and improve developer experience.`,
    tags: [`Tooling`, `DX`, `Automation`, `TypeScript`],
  },
];

export const skills: SkillItem[] = [
  {
    title: `Design`,
    description: `UX research, wireframing, prototyping, UI design, design systems, accessibility`,
  },
  {
    title: `Development`,
    description: `Frontend architecture, component libraries, performance, responsive UI, testing`,
  },
  {
    title: `Tools`,
    description: `Figma, Git, CI/CD, analytics, documentation`,
  },
  {
    title: `Collaboration`,
    description: `Stakeholder alignment, workshops, iterative delivery, clear communication`,
  },
];

export const timeline: TimelineItem[] = [
  {
    title: `Role Title — Company`,
    period: `2024 — Present`,
    description: `Led initiatives, shipped features, improved metrics (add dates and measurable results).`,
  },
  {
    title: `Role Title — Company`,
    period: `2022 — 2024`,
    description: `Collaborated cross-functionally, built reusable components, improved UX consistency.`,
  },
  {
    title: `Role Title — Company`,
    period: `2020 — 2022`,
    description: `Delivered projects end-to-end, from discovery to launch and iteration.`,
  },
];

export const testimonials: TestimonialItem[] = [
  {
    name: `Client / Manager Name`,
    role: `Product Lead`,
    quote: `“Clear communicator, strong craft, and consistently delivers high-quality work.”`,
  },
  {
    name: `Client / Manager Name`,
    role: `Engineering Manager`,
    quote: `“Great attention to detail and a strong sense of product thinking.”`,
  },
  {
    name: `Client / Manager Name`,
    role: `Design Director`,
    quote: `“Helped us move faster with a solid design system and clean implementation.”`,
  },
];
