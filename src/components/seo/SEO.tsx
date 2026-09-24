import { useEffect } from "react";
import { siteConfig } from "../../config/site";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function SEO({ title, description, canonical, ogTitle, ogDescription, ogImage, noindex, jsonLd }: SEOProps) {
  const url = canonical ?? (typeof window !== "undefined" ? window.location.href : siteConfig.url);
  const image = ogImage ?? siteConfig.ogImage;

  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${selector}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, selector);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    setMeta("description", description);
    setMeta("og:title", ogTitle || title, "property");
    setMeta("og:description", ogDescription || description, "property");
    setMeta("og:image", image, "property");
    setMeta("og:url", url, "property");
    setMeta("og:type", "website", "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", ogTitle || title);
    setMeta("twitter:description", ogDescription || description);
    setMeta("twitter:image", image);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");

    setLink("canonical", url);

    // JSON-LD
    const existing = document.querySelectorAll('script[data-seo-jsonld="true"]');
    existing.forEach(e => e.remove());
    if (jsonLd) {
      const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      arr.forEach(obj => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.setAttribute("data-seo-jsonld", "true");
        s.textContent = JSON.stringify(obj);
        document.head.appendChild(s);
      });
    }
  }, [title, description, url, image, ogTitle, ogDescription, noindex, jsonLd]);

  return null;
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brand,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
