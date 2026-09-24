import type { ComponentType } from "react";

export type ToolCategory =
  | "pdf"
  | "image"
  | "text"
  | "calculators"
  | "time"
  | "qr"
  | "developer"
  | "security"
  | "student"
  | "career";

export interface ToolFAQ {
  q: string;
  a: string;
}

export interface ToolDefinition {
  id: string;
  slug: string; // e.g. "merge-pdf"
  name: string;
  category: ToolCategory;
  description: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
  component: ComponentType;
  relatedTools?: string[]; // ids
  faq?: ToolFAQ[];
  howTo?: string[];
  indexable: boolean;
  featured?: boolean;
  icon?: string;
  supportedFormats?: string[];
}
