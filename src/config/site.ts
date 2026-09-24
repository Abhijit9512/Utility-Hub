export const siteConfig = {
  brand: "UtilityHub",
  name: "UtilityHub - Free Online Tools",
  description: "PDF, image, text, calculator, developer and productivity tools — fast, simple and free. No signup required.",
  url: "https://utilityhub.example.com",
  ogImage: "https://utilityhub.example.com/og.png",
  themeColor: "#2563eb",
  contactEmail: "hello@utilityhub.example.com",
  social: {
    twitter: "",
    github: "",
  },
  analytics: {
    // googleAnalyticsId: "G-XXXX",
  },
  adsense: {
    // client: "ca-pub-XXXX",
    enabled: false,
  },
  defaultSeo: {
    title: "UtilityHub - Free Online Tools for Everyday Work",
    description: "Free online tools for PDF, images, text, calculators, QR, developers and more. Fast, private, no signup.",
  }
} as const;

export type SiteConfig = typeof siteConfig;
