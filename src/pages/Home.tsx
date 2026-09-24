import { Link } from "react-router-dom";
import { tools } from "../data/tools";
import { SEO, websiteJsonLd } from "../components/seo/SEO";
import { siteConfig } from "../config/site";
import { AdPlaceholder } from "../components/ads/AdPlaceholder";
import { ToolIcon3D } from "../components/common/ToolIcon3D";

function PdfToolCard({ tool }: { tool: any }) {
  const isNew = ["fill-pdf-form","pdf-to-markdown","compare-pdf","redact-pdf","crop-pdf","scan-to-pdf","html-to-pdf","organize-pdf"].includes(tool.slug);
  return (
    <Link to={`/${tool.category}/${tool.slug}`} className="tool-card group min-h-[188px] relative">
      {isNew && <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#E30613] text-white text-[10px] font-black tracking-widest shadow-sm">NEW!</span>}
      <ToolIcon3D slug={tool.slug} size={54} />
      <div className="mt-1">
        <div className="font-bold text-[16px] leading-tight text-[#33333B] dark:text-white group-hover:text-[#E30613]">{tool.name}</div>
        <div className="text-[12px] leading-relaxed text-[#707078] dark:text-slate-400 mt-1 line-clamp-3">{tool.description}</div>
      </div>
    </Link>
  );
}

export function Home() {
  const pdfTools = tools.filter(t=> t.category==="pdf");
  // group pdf tools
  const organize = pdfTools.filter(t=> ["merge-pdf","split-pdf","organize-pdf","rotate-pdf","page-numbers-pdf","crop-pdf"].includes(t.slug));
  const optimize = pdfTools.filter(t=> ["compress-pdf","repair-pdf","crop-pdf"].includes(t.slug));
  // dedup crop
  const seen = new Set<string>();
  const dedup = (arr:any[]) => arr.filter(t=> { if(seen.has(t.id)) return false; seen.add(t.id); return true; });

  // All pdf tools in featured order
  const pdfToolOrder = [
    "merge-pdf","split-pdf","compress-pdf",
    "pdf-to-word","pdf-to-powerpoint","pdf-to-excel",
    "word-to-pdf","powerpoint-to-pdf","excel-to-pdf",
    "pdf-editor","pdf-to-jpg","jpg-to-pdf",
    "sign-pdf","watermark-pdf","rotate-pdf",
    "html-to-pdf","unlock-pdf","protect-pdf",
    "organize-pdf","pdf-to-pdfa","repair-pdf",
    "page-numbers-pdf","compare-pdf","redact-pdf","crop-pdf",
    "fill-pdf-form","pdf-to-markdown",
    // remaining
    "pdf-to-images","images-to-pdf","pdf-info","pdf-text-extract",
    "sign-pdf","fill-pdf-form"
  ];
  // Build ordered list without duplicates, then append rest
  const ordered: any[] = [];
  const used = new Set();
  for (const slug of pdfToolOrder) {
    const t = pdfTools.find(x=> x.slug===slug);
    if (t && !used.has(t.id)) { ordered.push(t); used.add(t.id); }
  }
  for (const t of pdfTools) if (!used.has(t.id)) { ordered.push(t); used.add(t.id); }

  const allTools = tools.filter(t=> t.category!=="pdf").slice(0,12);

  return (
    <div>
      <SEO title={siteConfig.defaultSeo.title} description={siteConfig.defaultSeo.description} canonical={siteConfig.url + "/"} jsonLd={websiteJsonLd()} />
      
      {/* Hero — PDF tools */}
      <section className="bg-[#F6F6F8] dark:bg-slate-950 border-b border-[#E5E5E5] dark:border-slate-800">
        <div className="max-w-[1280px] mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-[32px] md:text-[42px] font-bold leading-tight text-[#33333B] dark:text-white max-w-3xl mx-auto">
            Complete PDF toolkit — fast, free & private
          </h1>
          <p className="mt-4 text-[16px] md:text-[18px] leading-relaxed text-[#47474F] dark:text-slate-400 max-w-3xl mx-auto">
            Merge, split, compress, convert, edit and sign PDFs securely in your browser. <span className="font-semibold text-[#33333B] dark:text-white">No signup, no watermark, no quality loss</span> — documents stay on your device where possible.
          </p>
        </div>
      </section>

      {/* PDF tools grid */}
      <section className="bg-[#F6F6F8] dark:bg-slate-950">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ordered.map(t=> <PdfToolCard key={t.id} tool={t} />)}
          </div>

          <AdPlaceholder className="mt-8 bg-white border-[#E5E5E5] rounded-xl" label="Advertisement — sponsored top" placement="top" />

          {/* Secondary — other categories */}
          <div className="mt-12">
            <h2 className="text-[22px] font-bold text-[#33333B] dark:text-white">More free tools — Image, Text & Productivity</h2>
            <p className="text-sm text-[#707078] dark:text-slate-400 mt-1">Beyond PDFs, explore our image, text, calculator and developer tools — also 100% free, browser-based where possible.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {allTools.map(t=> (
                <Link key={t.id} to={`/${t.category}/${t.slug}`} className="tool-card min-h-[150px] bg-white">
                  <ToolIcon3D slug={t.slug} size={46} />
                  <div>
                    <div className="font-bold text-sm text-[#33333B] dark:text-white">{t.name}</div>
                    <div className="text-xs text-[#707078] dark:text-slate-400 mt-1 line-clamp-2">{t.description}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/image-tools" className="px-4 py-2 rounded-full bg-white border border-[#E5E5E5] text-sm font-bold hover:border-[#E30613] hover:text-[#E30613] dark:bg-slate-900 dark:border-slate-700 dark:text-white">Explore Image tools →</Link>
              <Link to="/text-tools" className="px-4 py-2 rounded-full bg-white border border-[#E5E5E5] text-sm font-bold hover:border-[#E30613] hover:text-[#E30613] dark:bg-slate-900 dark:border-slate-700 dark:text-white">Text tools →</Link>
              <Link to="/developer-tools" className="px-4 py-2 rounded-full bg-white border border-[#E5E5E5] text-sm font-bold hover:border-[#E30613] hover:text-[#E30613] dark:bg-slate-900 dark:border-slate-700 dark:text-white">Developer tools →</Link>
            </div>
          </div>

          <AdPlaceholder className="mt-8 bg-white border-[#E5E5E5] rounded-xl" label="Mid-content ad" placement="middle" />

          {/* Trust section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 dark:bg-slate-900 dark:border-slate-800 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F6F6F8] dark:bg-slate-800 flex items-center justify-center text-xl">🔒</div>
              <h4 className="font-bold mt-3 dark:text-white">Secure & Private</h4>
              <p className="text-sm text-[#707078] dark:text-slate-400 mt-1">Files processed in your browser where possible. No unnecessary uploads. HTTPS everywhere.</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 dark:bg-slate-900 dark:border-slate-800 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F6F6F8] dark:bg-slate-800 flex items-center justify-center text-xl">⚡</div>
              <h4 className="font-bold mt-3 dark:text-white">Fast & Free</h4>
              <p className="text-sm text-[#707078] dark:text-slate-400 mt-1">No signup, no paywall for core PDF tools. Works on mobile and desktop.</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 dark:bg-slate-900 dark:border-slate-800 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F6F6F8] dark:bg-slate-800 flex items-center justify-center text-xl">✓</div>
              <h4 className="font-bold mt-3 dark:text-white">No Quality Loss</h4>
              <p className="text-sm text-[#707078] dark:text-slate-400 mt-1">Optimized for maximal PDF quality. Real functionality, not fake converters.</p>
            </div>
          </div>

          <div className="mt-10 bg-white rounded-xl border border-[#E5E5E5] p-6 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-bold text-[#33333B] dark:text-white">The PDF software trusted by millions</h3>
            <p className="text-sm text-[#707078] dark:text-slate-400 mt-2">Our free web app is the easiest way to edit PDFs — merge, split, compress, convert, edit, sign and protect. Everything is in one place — with our own original code and privacy-first architecture.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold tracking-widest text-[#707078]">
              <span className="px-3 py-1 rounded-full bg-[#F6F6F8] dark:bg-slate-800">ISO27001 inspired</span>
              <span className="px-3 py-1 rounded-full bg-[#F6F6F8] dark:bg-slate-800">SSL Secure</span>
              <span className="px-3 py-1 rounded-full bg-[#F6F6F8] dark:bg-slate-800">Browser-based</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
