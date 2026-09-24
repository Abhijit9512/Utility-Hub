import React from "react";

type IconConfig = { from: string; to: string; };

const colorMap: Record<string, IconConfig> = {
  "merge-pdf": { from: "#E30613", to: "#FF6B6B" },
  "split-pdf": { from: "#FF7A00", to: "#FFB547" },
  "pdf-to-images": { from: "#EC4899", to: "#F9A8D4" },
  "images-to-pdf": { from: "#0891B2", to: "#22D3EE" },
  "rotate-pdf": { from: "#0284C7", to: "#38BDF8" },
  "pdf-info": { from: "#334155", to: "#94A3B8" },
  "pdf-text-extract": { from: "#EA580C", to: "#FB923C" },
  "watermark-pdf": { from: "#475569", to: "#94A3B8" },
  "page-numbers-pdf": { from: "#4338CA", to: "#818CF8" },
  "compress-pdf": { from: "#0EA5E9", to: "#06B6D4" },
  "pdf-to-word": { from: "#2563EB", to: "#60A5FA" },
  "pdf-to-excel": { from: "#16A34A", to: "#4ADE80" },
  "pdf-to-powerpoint": { from: "#EA580C", to: "#F59E0B" },
  "word-to-pdf": { from: "#1E40AF", to: "#3B82F6" },
  "excel-to-pdf": { from: "#15803D", to: "#22C55E" },
  "powerpoint-to-pdf": { from: "#9A3412", to: "#F97316" },
  "pdf-editor": { from: "#7C3AED", to: "#A78BFA" },
  "sign-pdf": { from: "#B45309", to: "#FBBF24" },
  "fill-pdf-form": { from: "#4F46E5", to: "#8B5CF6" },
  "pdf-to-jpg": { from: "#BE185D", to: "#F43F5E" },
  "jpg-to-pdf": { from: "#0E7490", to: "#22D3EE" },
  "html-to-pdf": { from: "#52525B", to: "#F97316" },
  "organize-pdf": { from: "#6D28D9", to: "#A78BFA" },
  "protect-pdf": { from: "#7F1D1D", to: "#EF4444" },
  "unlock-pdf": { from: "#A16207", to: "#FACC15" },
  "compare-pdf": { from: "#0F766E", to: "#2DD4BF" },
  "redact-pdf": { from: "#111827", to: "#4B5563" },
  "crop-pdf": { from: "#047857", to: "#10B981" },
  "pdf-to-pdfa": { from: "#92400E", to: "#F59E0B" },
  "repair-pdf": { from: "#65A30D", to: "#A3E635" },
  "scan-to-pdf": { from: "#9F1239", to: "#FB7185" },
  "pdf-to-markdown": { from: "#1E293B", to: "#64748B" },
  "compress-image": { from: "#059669", to: "#34D399" },
  "resize-image": { from: "#0284C7", to: "#7DD3FC" },
  "crop-image": { from: "#047857", to: "#6EE7B7" },
  "jpg-to-png": { from: "#DB2777", to: "#F9A8D4" },
  "png-to-jpg": { from: "#D97706", to: "#FDE68A" },
  "webp-to-jpg": { from: "#7C3AED", to: "#C4B5FD" },
  "jpg-to-webp": { from: "#0891B2", to: "#67E8F9" },
  "png-to-webp": { from: "#0F766E", to: "#5EEAD4" },
  "rotate-image": { from: "#2563EB", to: "#7DD3FC" },
  "flip-image": { from: "#6D28D9", to: "#DDD6FE" },
  "grayscale-image": { from: "#52525B", to: "#A1A1AA" },
  "image-dimensions": { from: "#0F172A", to: "#475569" },
  "exif-remover": { from: "#991B1B", to: "#FCA5A5" },
  "word-counter": { from: "#7C3AED", to: "#C4B5FD" },
  "case-converter": { from: "#2563EB", to: "#93C5FD" },
  "text-cleaner": { from: "#059669", to: "#6EE7B7" },
  "text-diff": { from: "#C2410C", to: "#FDBA74" },
  "slug-generator": { from: "#65A30D", to: "#BEF264" },
  "lorem-ipsum": { from: "#9333EA", to: "#E9D5FF" },
  "age-calculator": { from: "#2563EB", to: "#60A5FA" },
  "percentage-calculator": { from: "#0891B2", to: "#22D3EE" },
  "gst-calculator": { from: "#059669", to: "#34D399" },
  "emi-calculator": { from: "#B45309", to: "#FBBF24" },
  "sip-calculator": { from: "#7C3AED", to: "#A78BFA" },
  "fd-calculator": { from: "#DC2626", to: "#F87171" },
  "unit-converter": { from: "#0EA5E9", to: "#7DD3FC" },
  "date-difference": { from: "#475569", to: "#94A3B8" },
  "discount-calculator": { from: "#16A34A", to: "#86EFAC" },
  "online-timer": { from: "#2563EB", to: "#60A5FA" },
  "stopwatch": { from: "#DC2626", to: "#FCA5A5" },
  "pomodoro-timer": { from: "#EA580C", to: "#FED7AA" },
  "world-clock": { from: "#059669", to: "#6EE7B7" },
  "date-countdown": { from: "#7C3AED", to: "#DDD6FE" },
  "birthday-countdown": { from: "#EC4899", to: "#F9A8D4" },
  "exam-countdown": { from: "#0EA5E9", to: "#67E8F9" },
  "qr-code-generator": { from: "#111827", to: "#4B5563" },
  "wifi-qr": { from: "#1E40AF", to: "#60A5FA" },
  "json-formatter": { from: "#F59E0B", to: "#FDE68A" },
  "json-validator": { from: "#10B981", to: "#6EE7B7" },
  "json-minifier": { from: "#6366F1", to: "#A5B4FC" },
  "xml-formatter": { from: "#EC4899", to: "#FBCFE8" },
  "base64-encoder": { from: "#0EA5E9", to: "#7DD3FC" },
  "base64-decoder": { from: "#0284C7", to: "#38BDF8" },
  "url-encoder": { from: "#7C3AED", to: "#DDD6FE" },
  "url-decoder": { from: "#6D28D9", to: "#C4B5FD" },
  "jwt-decoder": { from: "#059669", to: "#A7F3D0" },
  "uuid-generator": { from: "#475569", to: "#CBD5E1" },
  "regex-tester": { from: "#DC2626", to: "#FECACA" },
  "timestamp-converter": { from: "#2563EB", to: "#93C5FD" },
  "hex-to-rgb": { from: "#EA580C", to: "#FED7AA" },
  "rgb-to-hex": { from: "#9333EA", to: "#E9D5FF" },
  "gradient-generator": { from: "#8B5CF6", to: "#EC4899" },
  "hash-generator": { from: "#111827", to: "#9CA3AF" },
  "password-generator": { from: "#059669", to: "#34D399" },
  "password-strength-checker": { from: "#D97706", to: "#FCD34D" },
  "random-number-generator": { from: "#7C3AED", to: "#A78BFA" },
  "random-string-generator": { from: "#2563EB", to: "#60A5FA" },
  "attendance-calculator": { from: "#2563EB", to: "#93C5FD" },
  "cgpa-calculator": { from: "#16A34A", to: "#86EFAC" },
  "gpa-calculator": { from: "#7C3AED", to: "#C4B5FD" },
  "percentage-calculator-student": { from: "#EC4899", to: "#F9A8D4" },
  "resume-analyzer": { from: "#0EA5E9", to: "#7DD3FC" },
  "keyword-extractor": { from: "#059669", to: "#6EE7B7" },
  "keyword-density": { from: "#7C3AED", to: "#E9D5FF" },
  "email-template-generator": { from: "#EA580C", to: "#FDBA74" },
  "cover-letter-template": { from: "#1E293B", to: "#64748B" },
};

function hashHue(slug: string): number {
  let h = 0;
  for (let i=0;i<slug.length;i++) h = (h*31 + slug.charCodeAt(i)) % 360;
  return h;
}
function fallbackColors(slug: string): IconConfig {
  const h = hashHue(slug);
  return { from: `hsl(${h} 75% 52%)`, to: `hsl(${(h+24)%360} 82% 62%)` };
}
function getColors(slug: string): IconConfig {
  return colorMap[slug] || fallbackColors(slug);
}

// Per-tool SVG icon paths - 3D white on gradient
function ToolSvg({ slug }: { slug: string }) {
  const s = slug;
  // PDF tools with custom 3D illustrations
  if (s === "merge-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="3" y="7" width="9" height="10" rx="1.2" fill="white" opacity="0.95"/><rect x="9" y="4.5" width="9" height="10" rx="1.2" fill="none" stroke="white" stroke-width="1.6"/><path d="M6 10.5h2M6 13h2M11.2 9l1.8 1.8 3.5-4.5" stroke="#E30613" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15h4" stroke="white" stroke-width="1.2" stroke-linecap="round"/></g>`}} />;
  if (s === "split-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="5" y="4" width="8" height="12" rx="1.2" fill="white" opacity="0.95"/><rect x="11" y="8" width="8" height="12" rx="1.2" fill="none" stroke="white" stroke-width="1.6"/><path d="M9 16l4-4M13 16l-4-4" stroke="#FF7A00" stroke-width="1.4" stroke-linecap="round"/><circle cx="9" cy="8" r="1.1" fill="#FF7A00"/><circle cx="13" cy="8" r="1.1" fill="#FF7A00"/></g>`}} />;
  if (s === "compress-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="6" y="3" width="12" height="14" rx="1.4" fill="white" opacity="0.96"/><path d="M9 7h6M9 10h6M9 13h4" stroke="#0EA5E9" stroke-width="1.2" stroke-linecap="round"/><g stroke="white" stroke-width="1.6" stroke-linecap="round"><path d="M8 18l3 3 3-3"/><path d="M11 18v-4"/></g></g>`}} />;
  if (s === "pdf-to-word") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="4" y="3" width="11" height="14" rx="1.4" fill="white" opacity="0.96"/><text x="6.5" y="13" font-size="7" font-weight="900" fill="#2563EB" font-family="Inter,sans-serif">W</text><path d="M15 7l3 3-3 3" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><rect x="14.5" y="9.5" width="5" height="1.6" rx="0.8" fill="white"/></g>`}} />;
  if (s === "pdf-to-excel") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="4" y="3" width="11" height="14" rx="1.4" fill="white" opacity="0.96"/><g stroke="#16A34A" stroke-width="1"><path d="M6.5 6.5h6M6.5 9h6M6.5 11.5h6M8.5 6.5v5"/><text x="8" y="14.8" font-size="4" font-weight="800" fill="#16A34A">X</text></g><path d="M15 7l3 3-3 3" stroke="white" stroke-width="1.6" stroke-linecap="round"/><rect x="14.5" y="9.5" width="5" height="1.6" rx="0.8" fill="white"/></g>`}} />;
  if (s === "pdf-to-powerpoint") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="4" y="3" width="11" height="14" rx="1.4" fill="white" opacity="0.96"/><rect x="6" y="6" width="7" height="5" rx="0.6" fill="#EA580C" opacity="0.15" stroke="#EA580C" stroke-width="1"/><text x="8.2" y="10" font-size="5" font-weight="900" fill="#EA580C">P</text><path d="M15 7l3 3-3 3" stroke="white" stroke-width="1.6" stroke-linecap="round"/><rect x="14.5" y="9.5" width="5" height="1.6" rx="0.8" fill="white"/></g>`}} />;
  if (s === "word-to-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="9" y="3" width="11" height="14" rx="1.4" fill="white" opacity="0.96"/><text x="12.2" y="12.5" font-size="6" font-weight="800" fill="#1E40AF">PDF</text><path d="M6 7l-3 3 3 3" stroke="white" stroke-width="1.6" stroke-linecap="round"/><rect x="1.5" y="9.5" width="5" height="1.6" rx="0.8" fill="white"/><text x="5.2" y="12" font-size="5" font-weight="900" fill="#2563EB">W</text></g>`}} />;
  if (s === "excel-to-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="9" y="3" width="11" height="14" rx="1.4" fill="white" opacity="0.96"/><text x="12" y="12.5" font-size="6" font-weight="800" fill="#15803D">PDF</text><path d="M6 7l-3 3 3 3" stroke="white" stroke-width="1.6" stroke-linecap="round"/><rect x="1.5" y="9.5" width="5" height="1.6" rx="0.8" fill="white"/><g stroke="#16A34A" stroke-width="0.9"><path d="M2.8 6.8h2.4M2.8 8h2.4M3.6 6.8v1.2"/></g></g>`}} />;
  if (s === "powerpoint-to-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="9" y="3" width="11" height="14" rx="1.4" fill="white" opacity="0.96"/><text x="12" y="12.5" font-size="6" font-weight="800" fill="#9A3412">PDF</text><path d="M6 7l-3 3 3 3" stroke="white" stroke-width="1.6"/><rect x="1.5" y="9.5" width="5" height="1.6" rx="0.8" fill="white"/><text x="3" y="11.2" font-size="4" font-weight="900" fill="#EA580C">P</text></g>`}} />;
  if (s === "pdf-editor") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="5" y="4" width="11" height="14" rx="1.4" fill="white" opacity="0.96"/><path d="M7.5 7.5h6M7.5 10h6M7.5 12.5h4" stroke="#7C3AED" stroke-width="1.1" stroke-linecap="round"/><path d="M14.5 5.5l3 3-6 6H8.5v-3z" fill="white" stroke="white" stroke-width="1.1" stroke-linejoin="round"/><path d="M14.5 5.5l1.5-1.5 1.5 1.5-1.5 1.5z" fill="#7C3AED"/></g>`}} />;
  if (s === "sign-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="4" y="5" width="11" height="13" rx="1.4" fill="white" opacity="0.96"/><path d="M6 13c1.5-1 2.5-1.5 4-1 1.2 0.4 1.8 1 3 0.8" stroke="#B45309" stroke-width="1.4" stroke-linecap="round" fill="none"/><path d="M13.5 6l3 3-4.5 4.5h-3v-3z" fill="none" stroke="white" stroke-width="1.3" stroke-linejoin="round"/><circle cx="17.5" cy="6.5" r="1.3" fill="white"/></g>`}} />;
  if (s === "fill-pdf-form") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="5" y="4" width="14" height="16" rx="1.6" fill="white" opacity="0.96"/><rect x="7" y="7" width="10" height="2.2" rx="0.5" fill="none" stroke="#4F46E5" stroke-width="1"/><rect x="7" y="10.2" width="10" height="2.2" rx="0.5" fill="#4F46E5" opacity="0.12" stroke="#4F46E5" stroke-width="0.9"/><path d="M10 11.1l1 1 2-2" stroke="#4F46E5" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><rect x="7" y="13.2" width="6" height="2.2" rx="0.5" fill="none" stroke="#4F46E5" stroke-width="1"/></g>`}} />;
  if (s === "pdf-to-jpg") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="4" y="4" width="11" height="13" rx="1.4" fill="white" opacity="0.96"/><path d="M6 14l2-2 1.5 1.2 1.5-1.7 2 2.5z" fill="#BE185D" opacity="0.9"/><circle cx="8.2" cy="8.5" r="1.3" fill="#F43F5E"/><path d="M15 7l3 3-3 3" stroke="white" stroke-width="1.6" stroke-linecap="round"/><rect x="14.5" y="9.5" width="5" height="1.6" rx="0.8" fill="white"/><text x="15.2" y="11" font-size="3" font-weight="900" fill="#BE185D">JPG</text></g>`}} />;
  if (s === "jpg-to-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="9" y="4" width="11" height="13" rx="1.4" fill="white" opacity="0.96"/><path d="M11 14l2-2 1.5 1.2 1.5-1.7 2 2.5z" fill="#0E7490" opacity="0.9"/><circle cx="13.2" cy="8.5" r="1.3" fill="#22D3EE"/><path d="M6 7l-3 3 3 3" stroke="white" stroke-width="1.6" stroke-linecap="round"/><rect x="1.5" y="9.5" width="5" height="1.6" rx="0.8" fill="white"/><text x="1.9" y="11" font-size="3" font-weight="700" fill="#0E7490">JPG</text></g>`}} />;
  if (s === "html-to-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="5" y="4" width="11" height="14" rx="1.4" fill="white" opacity="0.96"/><text x="6.5" y="10.5" font-size="5" font-weight="900" fill="#52525B">&lt;/&gt;</text><path d="M6 13h7" stroke="#F97316" stroke-width="1.1" stroke-linecap="round"/><path d="M15 7l3 3-3 3" stroke="white" stroke-width="1.6" stroke-linecap="round"/><rect x="14.5" y="9.5" width="5" height="1.6" rx="0.8" fill="white"/></g>`}} />;
  if (s === "organize-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="3" y="3" width="6" height="8" rx="0.9" fill="white" opacity="0.96"/><rect x="10" y="3" width="6" height="8" rx="0.9" fill="none" stroke="white" stroke-width="1.3"/><rect x="3" y="12" width="6" height="8" rx="0.9" fill="none" stroke="white" stroke-width="1.3"/><rect x="10" y="12" width="6" height="8" rx="0.9" fill="white" opacity="0.9"/><path d="M9 15h1M12 7l1 1-1 1" stroke="white" stroke-width="1.2" stroke-linecap="round"/></g>`}} />;
  if (s === "protect-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="5" y="6" width="11" height="11" rx="1.4" fill="white" opacity="0.96"/><rect x="8" y="3.5" width="6" height="5" rx="2.5" fill="none" stroke="white" stroke-width="1.6"/><rect x="8.2" y="9.5" width="5.6" height="4.5" rx="0.9" fill="#991B1B"/><circle cx="11" cy="11.7" r="1" fill="white"/><path d="M11 12.7v1.2" stroke="white" stroke-width="1" stroke-linecap="round"/></g>`}} />;
  if (s === "unlock-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="5" y="6" width="11" height="11" rx="1.4" fill="white" opacity="0.96"/><path d="M8 9V7.5a3 3 0 016 0V9" fill="none" stroke="white" stroke-width="1.6" stroke-linecap="round"/><rect x="8.2" y="9.5" width="5.6" height="4.5" rx="0.9" fill="#A16207"/><circle cx="11" cy="11.7" r="1" fill="white"/><path d="M13.5 6.5l1.2-1.2" stroke="white" stroke-width="1.4" stroke-linecap="round"/></g>`}} />;
  if (s === "compare-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="2.5" y="5" width="8" height="11" rx="1.1" fill="white" opacity="0.96"/><rect x="11.5" y="5" width="8" height="11" rx="1.1" fill="white" opacity="0.96"/><path d="M5 8h3M5 10.5h3M5 13h2M14 8h3M14 10.5h3M14.8 13l1.2 1 1.2-1" stroke="#0F766E" stroke-width="1" stroke-linecap="round"/><circle cx="11" cy="8" r="2.2" fill="none" stroke="white" stroke-width="1.3"/><path d="M12.3 9.3l1.2 1.2" stroke="white" stroke-width="1.2" stroke-linecap="round"/></g>`}} />;
  if (s === "redact-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="5" y="5" width="14" height="12" rx="1.4" fill="white" opacity="0.96"/><path d="M7 8h10M7 11h10M7 14h6" stroke="#111827" stroke-width="1.1" stroke-linecap="round"/><rect x="7" y="9.5" width="10" height="2.5" rx="0.4" fill="#111827"/><path d="M12.5 6l3 3-3 3" stroke="white" stroke-width="1" opacity="0" /></g>`}} />;
  if (s === "crop-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="6" y="4" width="12" height="14" rx="1.4" fill="white" opacity="0.96"/><path d="M6 7H4V4h3M18 4h3v3M18 18h3v3h-3M4 18V15H6" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><rect x="8" y="7" width="8" height="9" rx="0.4" fill="none" stroke="#047857" stroke-width="1.1" stroke-dasharray="1.5 1.2"/></g>`}} />;
  if (s === "pdf-to-pdfa") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="5" y="4" width="11" height="14" rx="1.4" fill="white" opacity="0.96"/><text x="7" y="11" font-size="6.5" font-weight="900" fill="#92400E">A</text><rect x="14" y="5" width="6" height="9" rx="1" fill="white" opacity="0.9" stroke="white" stroke-width="1.2"/><path d="M15 7h4M15 9h4M15 11h2.5" stroke="#92400E" stroke-width="0.9" stroke-linecap="round"/></g>`}} />;
  if (s === "repair-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="5" y="4" width="11" height="14" rx="1.4" fill="white" opacity="0.96"/><path d="M7 8h7M7 10.5h5M7 13h4" stroke="#65A30D" stroke-width="1.1" stroke-linecap="round"/><path d="M14.5 6.5l2.5 2.5-1 1-2.5-2.5z M16.5 9.5a2 2 0 11-2.8 2.8" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`}} />;
  if (s === "scan-to-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="5" y="8" width="14" height="10" rx="1.6" fill="white" opacity="0.96"/><circle cx="12" cy="13" r="3" fill="none" stroke="#9F1239" stroke-width="1.4"/><circle cx="12" cy="13" r="1.4" fill="#9F1239"/><rect x="8.5" y="4.5" width="7" height="3" rx="0.7" fill="white" opacity="0.9" stroke="white" stroke-width="1"/><path d="M10 6h4" stroke="#9F1239" stroke-width="1" stroke-linecap="round"/><path d="M7 8V6.5a1.5 1.5 0 011.5-1.5h7a1.5 1.5 0 011.5 1.5V8" stroke="white" stroke-width="1.2" fill="none"/></g>`}} />;
  if (s === "pdf-to-markdown") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="4" y="4" width="11" height="14" rx="1.4" fill="white" opacity="0.96"/><text x="6.2" y="10" font-size="3.2" font-weight="900" fill="#1E293B"># MD</text><path d="M6 12h7M6 14h5" stroke="#1E293B" stroke-width="1.1" stroke-linecap="round"/><path d="M15 7l3 3-3 3" stroke="white" stroke-width="1.6" stroke-linecap="round"/><rect x="14.5" y="9.5" width="5" height="1.6" rx="0.8" fill="white"/></g>`}} />;
  if (s === "pdf-to-images") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="4" y="4" width="11" height="13" rx="1.4" fill="white" opacity="0.96"/><path d="M6 14l2-2 1.5 1.2 1.5-1.7 2 2.5z" fill="#EC4899" opacity="0.9"/><circle cx="8.2" cy="8.5" r="1.3" fill="#F9A8D4" stroke="#EC4899" stroke-width="0.6"/><path d="M15 7l3 3-3 3" stroke="white" stroke-width="1.6"/><rect x="14.5" y="9.5" width="5" height="1.6" rx="0.8" fill="white"/></g>`}} />;
  if (s === "images-to-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="9" y="4" width="11" height="13" rx="1.4" fill="white" opacity="0.96"/><path d="M11 14l2-2 1.5 1.2 1.5-1.7 2 2.5z" fill="#0891B2" opacity="0.9"/><path d="M6 7l-3 3 3 3" stroke="white" stroke-width="1.6"/><rect x="1.5" y="9.5" width="5" height="1.6" rx="0.8" fill="white"/></g>`}} />;
  if (s === "page-numbers-pdf") return <g dangerouslySetInnerHTML={{__html: `<g><rect x="5" y="4" width="11" height="14" rx="1.4" fill="white" opacity="0.96"/><text x="8.5" y="10" font-size="6" font-weight="800" fill="#4338CA">#</text><text x="7.5" y="14.5" font-size="3" font-weight="600" fill="#4338CA">1 2 3</text><circle cx="16.5" cy="8" r="2" fill="white" opacity="0.9" stroke="white"/><path d="M15.5 8h2M16.5 7v2" stroke="#4338CA" stroke-width="1.1" stroke-linecap="round"/></g>`}} />;

  // Generic fallbacks by slug keywords - produce shape + letter

  // Image tools
  if (s.includes("image") || s.includes("jpg") || s.includes("png") || s.includes("webp")) {
    return (
      <g>
        <rect x="5" y="5" width="14" height="11" rx="1.6" fill="white" opacity="0.96"/>
        <path d="M7 13l2.2-2.2 1.8 1.4 2-2.2 2 2h-8z" fill="white" opacity="0.0" />
        <path d="M7 13l2.2-2.2 1.8 1.4 2-2.2 2 2.5V13z" fill="white" opacity="0.98" />
        <circle cx="9" cy="8.5" r="1.2" fill="white" />
        <rect x="5" y="5" width="14" height="11" rx="1.6" fill="none" stroke="white" strokeWidth="1.1" opacity="0.9"/>
      </g>
    );
  }
  if (s.includes("pdf") ) {
    return (
      <g>
        <rect x="6" y="4" width="12" height="14" rx="1.5" fill="white" opacity="0.96"/>
        <path d="M8.5 8h7M8.5 10.5h7M8.5 13h5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.95"/>
      </g>
    );
  }
  if (s.includes("word") || s.includes("text") || s.includes("lorem") || s.includes("case") || s.includes("slug")) {
    return (
      <g>
        <rect x="5" y="4" width="12" height="14" rx="1.4" fill="white" opacity="0.96"/>
        <path d="M7.5 7.5h7M7.5 10h7M7.5 12.5h5M7.5 15h6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      </g>
    );
  }
  if (s.includes("calculator") || s.includes("converter") || s.includes("percentage") || s.includes("gst") || s.includes("emi") || s.includes("sip") || s.includes("fd") || s.includes("discount") || s.includes("age") || s.includes("unit") || s.includes("cgpa") || s.includes("gpa") || s.includes("attendance")) {
    return (
      <g>
        <rect x="6" y="3" width="12" height="16" rx="2" fill="white" opacity="0.96"/>
        <rect x="8" y="5.5" width="8" height="3" rx="0.6" fill="currentColor" opacity="0.15"/>
        <circle cx="9" cy="11.5" r="1" fill="currentColor"/><circle cx="12" cy="11.5" r="1" fill="currentColor"/><circle cx="15" cy="11.5" r="1" fill="currentColor"/>
        <circle cx="9" cy="14.5" r="1" fill="currentColor"/><circle cx="12" cy="14.5" r="1" fill="currentColor"/><circle cx="15" cy="14.5" r="1" fill="currentColor"/>
      </g>
    );
  }
  if (s.includes("timer") || s.includes("stopwatch") || s.includes("clock") || s.includes("countdown") || s.includes("pomodoro")) {
    return (
      <g>
        <circle cx="12" cy="11" r="7" fill="white" opacity="0.96" stroke="white" strokeWidth="1.2"/>
        <path d="M12 11V8M12 11l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="12" cy="11" r="1.1" fill="currentColor"/>
        <path d="M10 4h4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      </g>
    );
  }
  if (s.includes("qr") || s.includes("wifi")) {
    return (
      <g>
        <rect x="4.5" y="4.5" width="15" height="15" rx="1.8" fill="white" opacity="0.96"/>
        <rect x="6.5" y="6.5" width="4" height="4" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="7.7" y="7.7" width="1.6" height="1.6" rx="0.3" fill="currentColor"/>
        <rect x="13.5" y="6.5" width="4" height="4" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="14.7" y="7.7" width="1.6" height="1.6" rx="0.3" fill="currentColor"/>
        <rect x="6.5" y="13.5" width="4" height="4" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="7.7" y="14.7" width="1.6" height="1.6" rx="0.3" fill="currentColor"/>
        <rect x="13.5" y="13.5" width="2" height="2" rx="0.3" fill="currentColor"/><rect x="16" y="13.5" width="1" height="4" rx="0.3" fill="currentColor"/>
      </g>
    );
  }
  if (s.includes("json") || s.includes("xml") || s.includes("base64") || s.includes("url-") || s.includes("jwt") || s.includes("uuid") || s.includes("regex") || s.includes("timestamp") || s.includes("hex") || s.includes("rgb") || s.includes("gradient") || s.includes("hash")) {
    return (
      <g>
        <rect x="4" y="4" width="16" height="14" rx="1.6" fill="white" opacity="0.96"/>
        <text x="6" y="11" fontSize="4.5" fontWeight="800" fill="currentColor" fontFamily="monospace">{`{ }`}</text>
        <path d="M6 13h10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      </g>
    );
  }
  if (s.includes("password") || s.includes("random") || s.includes("hash")) {
    return (
      <g>
        <rect x="6" y="8" width="12" height="9" rx="1.4" fill="white" opacity="0.96"/>
        <path d="M9 8V6.5a3 3 0 016 0V8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="12.5" r="1" fill="currentColor"/><path d="M12 13.5v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </g>
    );
  }
  if (s.includes("resume") || s.includes("keyword") || s.includes("email") || s.includes("cover")) {
    return (
      <g>
        <rect x="6" y="4" width="12" height="14" rx="1.5" fill="white" opacity="0.96"/>
        <circle cx="12" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M8.5 12.5c1 1.2 2.5 1.8 3.5 1.8s2.5-.6 3.5-1.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
        <path d="M8 15h8M8 16.5h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      </g>
    );
  }
  // default letter
  return (
    <g>
      <text x="12" y="14.5" textAnchor="middle" fontSize="8" fontWeight="900" fill="white" fontFamily="Inter,sans-serif">{s.slice(0,2).toUpperCase()}</text>
    </g>
  );
}

export function ToolIcon3D({ slug, size = 48, className = "" }: { slug: string; size?: number; className?: string }) {
  const c = getColors(slug);
  const s = size;
  const radius = s * 0.32;
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none ${className}`}
      style={{
        width: s,
        height: s,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${c.from} 0%, ${c.to} 100%)`,
        boxShadow: `0 10px 18px ${c.from}55, 0 4px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.12)`,
        overflow: "hidden",
      }}
    >
      {/* glossy highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          background: `linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)`,
          pointerEvents: "none",
        }}
      />
      {/* inner depth ring */}
      <div
        style={{
          position: "absolute",
          inset: 1,
          borderRadius: radius - 1,
          border: "1px solid rgba(255,255,255,0.18)",
          pointerEvents: "none",
        }}
      />
      <svg viewBox="0 0 24 24" width={Math.round(s * 0.62)} height={Math.round(s * 0.62)} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.18))", position: "relative", zIndex: 1 }}>
        <ToolSvg slug={slug} />
      </svg>
    </div>
  );
}

export function ToolIconCircle({ slug, size = 42 }: { slug: string; size?: number }) {
  const c = getColors(slug);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
        boxShadow: `0 8px 16px ${c.from}45, inset 0 1px 0 rgba(255,255,255,0.45)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg viewBox="0 0 24 24" width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.18))" }}>
        <ToolSvg slug={slug} />
      </svg>
    </div>
  );
}
