import { useParams, Link } from "react-router-dom";
import { categories, getToolsByCategory } from "../data/tools";
import { ToolGrid } from "../components/common/ToolCard";
import { SEO, breadcrumbJsonLd } from "../components/seo/SEO";
import { siteConfig } from "../config/site";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { AdPlaceholder } from "../components/ads/AdPlaceholder";
import { ToolIcon3D } from "../components/common/ToolIcon3D";

const gradients: Record<string,string> = {
  pdf: "from-[#E30613] via-[#C00511] to-[#33333B]",
  image: "from-emerald-500 via-teal-500 to-cyan-500",
  text: "from-violet-500 via-purple-500 to-fuchsia-500",
  calculators: "from-blue-600 via-indigo-600 to-violet-600",
  time: "from-amber-500 via-orange-500 to-red-500",
  qr: "from-slate-800 via-slate-900 to-black",
  developer: "from-cyan-500 via-blue-500 to-indigo-600",
  security: "from-emerald-600 via-green-600 to-teal-600",
  student: "from-pink-500 via-rose-500 to-red-500",
  career: "from-indigo-600 via-violet-600 to-purple-600",
};

export function CategoryHub() {
  const { categorySlug } = useParams();
  const pathname = typeof window !== "undefined" ? window.location.pathname.replace(/\/$/,"") : "";
  const slugFromPath = pathname.split("/").filter(Boolean)[0] ?? "";
  const effectiveSlug = categorySlug ?? slugFromPath;
  const cat = categories.find(c=> c.slug === effectiveSlug) || categories.find(c=> c.slug === categorySlug);
  if(!cat) return <div className="max-w-[1280px] mx-auto px-4 py-10">Category not found. <Link to="/" className="text-blue-600">Home</Link></div>;
  const tools = getToolsByCategory(cat.id);
  const url = `${siteConfig.url}/${cat.slug}`;
  const grad = (gradients as any)[cat.id] || "from-blue-600 to-indigo-600";
  return (
    <div>
      <SEO
        title={`${cat.title} — Free Online ${cat.title} | ${siteConfig.brand}`}
        description={cat.description + " Fast, free, browser-based where possible."}
        canonical={url}
        jsonLd={breadcrumbJsonLd([{name:"Home",url:siteConfig.url},{name:cat.title, url}])}
      />
      {/* hero */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-[0.08] dark:opacity-[0.12]`}></div>
        <div className="absolute inset-0 mesh-gradient opacity-40"></div>
        <div className="absolute inset-0 grid-pattern"></div>
        <div className="relative max-w-[1280px] mx-auto px-4 py-10">
          <Breadcrumbs items={[{label:"Home", href:"/"},{label:cat.title}]} />
          <div className="mt-6 flex flex-col md:flex-row gap-6 items-start">
            <div className={`w-16 h-16 rounded-[20px] bg-gradient-to-br ${grad} flex items-center justify-center text-3xl shadow-lg shadow-black/10 text-white shrink-0`}>
              {cat.icon}
            </div>
            <div className="hidden md:flex gap-2 flex-wrap max-w-[220px]">
              {tools.slice(0,4).map(t=> <ToolIcon3D key={t.id} slug={t.slug} size={36} />)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight dark:text-white" style={{fontFamily:'Plus Jakarta Sans'}}>{cat.title}</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-3xl leading-relaxed">{cat.description} All tools below work directly in your browser where technically possible — no signup, no paywall. Files stay on your device for PDF/image tools.</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${grad}`}></span> {tools.length} tools
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400">✓ Free • No upload needed</span>
                <span className="hidden sm:inline text-xs text-slate-500">Updated weekly • Privacy-first</span>
              </div>
            </div>
            <div className="hidden lg:block shrink-0">
              <div className="rounded-[20px] p-[1px] bg-gradient-to-br from-slate-200 to-white dark:from-slate-800 dark:to-slate-700">
                <div className="rounded-[19px] bg-white dark:bg-slate-900 px-5 py-4 min-w-[200px]">
                  <div className="text-xs font-bold tracking-widest uppercase text-slate-400">Quick stats</div>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <div><div className="text-xl font-black dark:text-white">{tools.length}</div><div className="text-xs text-slate-500">Tools</div></div>
                    <div><div className="text-xl font-black dark:text-white">100%</div><div className="text-xs text-slate-500">Free</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <AdPlaceholder className="rounded-[20px]" label={`${cat.title} — premium top slot`} placement="top" />

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black dark:text-white" style={{fontFamily:'Plus Jakarta Sans'}}>All {cat.title}</h2>
            <span className="text-xs font-bold tracking-widest uppercase text-slate-400">{tools.length} tools</span>
          </div>
          <div className="mt-4"><ToolGrid tools={tools} /></div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 rounded-[24px] p-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <h3 className="font-black text-lg" style={{fontFamily:'Plus Jakarta Sans'}}>How to use {cat.title.toLowerCase()}</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed opacity-90">
              <li className="flex gap-2"><span className="text-emerald-400">→</span> Choose a tool above — each page explains formats, privacy, and limits.</li>
              <li className="flex gap-2"><span className="text-emerald-400">→</span> Drag & drop or use the file picker; invalid files show friendly errors, never crashes.</li>
              <li className="flex gap-2"><span className="text-emerald-400">→</span> Use header search (⌘K) to jump instantly.</li>
            </ul>
          </div>
          <div className="rounded-[24px] p-[1px] bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500">
            <div className="rounded-[23px] bg-white p-5 dark:bg-slate-900 h-full">
              <div className="text-xs font-black tracking-widest uppercase text-slate-400">Related</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.filter(c=> c.id!==cat.id).slice(0,6).map(c=> <Link key={c.id} to={`/${c.slug}`} className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white dark:bg-slate-800 dark:text-white dark:hover:bg-white dark:hover:text-slate-900 text-xs font-bold transition-colors">{c.icon} {c.title}</Link>)}
              </div>
            </div>
          </div>
        </div>

        <AdPlaceholder className="mt-8 rounded-[20px]" label="Category bottom — premium" placement="bottom" />

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.filter(c=>c.id!==cat.id).map(c=> <Link key={c.id} to={`/${c.slug}`} className="px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-white text-sm font-semibold transition-all">{c.icon} {c.title}</Link>)}
        </div>
      </div>
    </div>
  );
}
