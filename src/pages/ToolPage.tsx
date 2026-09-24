import { useParams, Link } from "react-router-dom";
import { Suspense } from "react";
import { getToolBySlug, getRelatedTools, tools, categories } from "../data/tools";
import { SEO, breadcrumbJsonLd } from "../components/seo/SEO";
import { siteConfig } from "../config/site";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { AdPlaceholder } from "../components/ads/AdPlaceholder";
import { ToolGrid } from "../components/common/ToolCard";
import { ToolIcon3D } from "../components/common/ToolIcon3D";

const catGrad: Record<string,string> = {
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

export function ToolPage() {
  const { category, slug } = useParams();
  const tool = getToolBySlug(category || "", slug || "");
  if(!tool){
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto rounded-[20px] bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white text-3xl">?</div>
        <h1 className="text-3xl font-black mt-6 dark:text-white" style={{fontFamily:'Plus Jakarta Sans'}}>Tool not found</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">We couldn't find <code className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">{category}/{slug}</code>.</p>
        <Link to="/" className="btn-primary mt-6">Go home</Link>
        <div className="mt-10 max-w-2xl mx-auto">
          <h3 className="font-bold dark:text-white">Try these instead</h3>
          <div className="mt-4"><ToolGrid tools={tools.slice(0,4)} /></div>
        </div>
      </div>
    );
  }
  const cat = categories.find(c=> c.id===tool.category);
  const related = getRelatedTools(tool).slice(0,6);
  const canonical = `${siteConfig.url}/${tool.category}/${tool.slug}`;
  const breadcrumbLd = breadcrumbJsonLd([
    { name:"Home", url: siteConfig.url },
    { name: cat?.title || tool.category, url: `${siteConfig.url}/${cat?.slug || tool.category+"-tools"}` },
    { name: tool.name, url: canonical }
  ]);
  const Component = tool.component;
  const grad = (catGrad as any)[tool.category] || "from-blue-600 to-indigo-600";

  return (
    <div>
      {/* header */}
      <div className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60">
        <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-[0.06] dark:opacity-[0.10]`}></div>
        <div className="absolute inset-0 mesh-gradient opacity-30"></div>
        <div className="relative max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumbs items={[{label:"Home", href:"/"},{label: cat?.title || tool.category, href: `/${cat?.slug || tool.category+"-tools"}`},{label: tool.name}]} />
          <div className="mt-6 flex flex-col md:flex-row gap-5 items-start">
            <ToolIcon3D slug={tool.slug} size={58} className="shrink-0 shadow-lg" />
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-[36px] font-black tracking-tight dark:text-white leading-tight" style={{fontFamily:'Plus Jakarta Sans'}}>{tool.h1}</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-3 leading-relaxed max-w-3xl">{tool.intro}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${grad}`}></span> {cat?.title}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400">● Browser-based</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold dark:bg-white dark:text-slate-900">Free • No signup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div>
            <AdPlaceholder className="rounded-[20px]" label="Tool — premium top" placement="top" />

            {/* Tool card premium wrapper */}
            <div className="mt-6 rounded-[24px] p-[1px] bg-gradient-to-br from-slate-200 via-white to-slate-100 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 shadow-soft">
              <div className="rounded-[23px] bg-white dark:bg-slate-900 p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${grad} animate-pulse`}></div>
                    <span className="text-xs font-black tracking-widest uppercase text-slate-400">Interactive tool • Live preview</span>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ready</span>
                </div>
                <Suspense fallback={<div className="rounded-[20px] border border-dashed border-slate-200 p-10 text-center dark:border-slate-700"><div className="w-8 h-8 mx-auto rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin"></div><div className="text-sm font-semibold mt-3 dark:text-white">Loading tool…</div><div className="text-xs text-slate-500 mt-1">Heavy libraries are lazy-loaded for speed</div></div>}>
                  <Component />
                </Suspense>
              </div>
            </div>

            <AdPlaceholder className="mt-6 rounded-[20px]" label="Tool — premium middle" placement="middle" />

            {tool.howTo && (
              <div className="mt-8 rounded-[24px] p-6 bg-white border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800 shadow-soft">
                <h2 className="text-lg font-black dark:text-white flex items-center gap-2" style={{fontFamily:'Plus Jakarta Sans'}}>
                  <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-sm`}>?</span>
                  How to use {tool.name}
                </h2>
                <ol className="mt-4 space-y-3">
                  {tool.howTo.map((step,i)=> (
                    <li key={i} className="flex gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0 dark:bg-white dark:text-slate-900">{i+1}</span>
                      <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="rounded-[20px] p-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white">
                <h3 className="font-black" style={{fontFamily:'Plus Jakarta Sans'}}>Features</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed opacity-90">
                  <li className="flex gap-2"><span>✓</span> Works in your browser where possible — no mandatory upload</li>
                  <li className="flex gap-2"><span>✓</span> Free, no signup, no paywall</li>
                  <li className="flex gap-2"><span>✓</span> Mobile-first, keyboard-accessible, fast</li>
                </ul>
              </div>
              <div className="rounded-[20px] p-5 bg-white border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800">
                <h3 className="font-black dark:text-white" style={{fontFamily:'Plus Jakarta Sans'}}>Privacy</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mt-2">
                  {["pdf","image","security","developer"].includes(tool.category)
                    ? "Your file is processed in your browser and is not uploaded to our server."
                    : "This tool runs entirely in your browser — nothing is sent to a server."}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">If server processing is ever required, it will be clearly marked — we never secretly upload files.</p>
              </div>
            </div>

            {tool.faq && tool.faq.length>0 && (
              <div className="mt-6 rounded-[24px] p-6 bg-white border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800">
                <h2 className="text-lg font-black dark:text-white" style={{fontFamily:'Plus Jakarta Sans'}}>FAQ</h2>
                <div className="mt-4 space-y-3">
                  {tool.faq.map((f,i)=> (
                    <details key={i} className="group rounded-2xl border border-slate-100 dark:border-slate-800 open:bg-slate-50 dark:open:bg-slate-800/50" open={i===0}>
                      <summary className="cursor-pointer list-none flex items-center justify-between p-4 font-semibold text-sm dark:text-white">
                        {f.q}
                        <span className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center group-open:rotate-180 transition-transform dark:bg-slate-900 dark:border-slate-700">⌄</span>
                      </summary>
                      <div className="px-4 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-black dark:text-white" style={{fontFamily:'Plus Jakarta Sans'}}>Related tools</h3>
              <div className="mt-4"><ToolGrid tools={related} /></div>
            </div>

            <AdPlaceholder className="mt-6 rounded-[20px]" label="Tool — premium bottom" placement="bottom" />
          </div>

          {/* Sidebar premium */}
          <aside className="space-y-5">
            <AdPlaceholder className="min-h-[280px] hidden lg:flex rounded-[20px]" label="Sidebar — premium" placement="sidebar" />
            <div className="rounded-[20px] p-5 bg-white border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800">
              <h4 className="font-black dark:text-white" style={{fontFamily:'Plus Jakarta Sans'}}>Why use this tool?</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-2"><span className="text-emerald-500">✓</span> No file leaves your device (where stated)</li>
                <li className="flex gap-2"><span className="text-emerald-500">✓</span> Instant — no waiting for uploads</li>
                <li className="flex gap-2"><span className="text-emerald-500">✓</span> Works offline after load</li>
              </ul>
            </div>
            <div className="rounded-[20px] p-5 bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <h4 className="font-black" style={{fontFamily:'Plus Jakarta Sans'}}>Popular in {cat?.title}</h4>
              <div className="mt-3 space-y-2">
                {tools.filter(t=> t.category===tool.category && t.id!==tool.id).slice(0,5).map(t=> <Link key={t.id} to={`/${t.category}/${t.slug}`} className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/15 dark:bg-slate-100 dark:hover:bg-slate-200 transition-colors">
                  <span className="text-sm font-semibold truncate pr-2">{t.name}</span><span className="text-xs opacity-60">→</span>
                </Link>)}
              </div>
              <Link to={`/${cat?.slug}`} className="mt-4 inline-flex text-sm font-bold hover:gap-1 gap-1 transition-all">View all {cat?.title} →</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
