import type { Metadata } from "next";

import { PortfolioPage } from "@/components/layouts/portfolio-page";

export const metadata: Metadata = {
  title: `Amazing Portfolio — Abdul Sayyed`,
  description: `Modern portfolio with projects, skills, experience, testimonials, and contact.`,
};

export default function Home() {
  return <PortfolioPage />;
}
