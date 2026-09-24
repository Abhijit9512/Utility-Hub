import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { tools } from "../../data/tools";
import { ToolIcon3D } from "../common/ToolIcon3D";

export function Header() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const convertBtnRef = useRef<HTMLButtonElement>(null);
  const toolsBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const nd = !dark;
    setDark(nd);
    document.documentElement.classList.toggle("dark", nd);
    localStorage.setItem("theme", nd ? "dark" : "light");
  };

  const results = q.trim().length >= 2
    ? tools.filter(t =>
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.description.toLowerCase().includes(q.toLowerCase()) ||
        t.keywords.some(k => k.toLowerCase().includes(q.toLowerCase()))
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
        setConvertOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { if (q.trim().length >= 2) setOpen(true); else setOpen(false); }, [q]);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white border-b border-[#E5E5E5] dark:bg-slate-950 dark:border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 h-[62px] flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 shrink-0" onClick={()=> { setToolsOpen(false); setConvertOpen(false); }}>
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="26" height="26" rx="7" fill="#E30613"/>
              <path d="M9.4 8.8H11.9V15.4C11.9 17.3 12.7 18.2 14.3 18.2C15.9 18.2 16.7 17.3 16.7 15.4V8.8H19.2V15.6C19.2 19.1 17 20.9 14.3 20.9C11.6 20.9 9.4 19.1 9.4 15.6V8.8Z" fill="white"/>
            </svg>
          </div>
          <span className="text-[22px] font-bold tracking-tight whitespace-nowrap">
            <span className="text-[#33333B] dark:text-white">Utility</span><span className="text-[#E30613]">Hub</span>
          </span>
        </Link>

        {/* ONE-LINE VISIBLE NAV */}
        <div className="flex-1 min-w-0 flex items-center gap-1 ml-1">
          <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto scrollbar-none whitespace-nowrap pr-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <Link to="/pdf/merge-pdf" onClick={()=> { setToolsOpen(false); setConvertOpen(false); }} className="px-2.5 py-2 hover:text-[#E30613] transition-colors text-[12px] font-black tracking-wide shrink-0">MERGE PDF</Link>
            <Link to="/pdf/split-pdf" onClick={()=> { setToolsOpen(false); setConvertOpen(false); }} className="px-2.5 py-2 hover:text-[#E30613] transition-colors text-[12px] font-black tracking-wide shrink-0">SPLIT PDF</Link>
            <Link to="/pdf/compress-pdf" onClick={()=> { setToolsOpen(false); setConvertOpen(false); }} className="px-2.5 py-2 hover:text-[#E30613] transition-colors text-[12px] font-black tracking-wide shrink-0">COMPRESS PDF</Link>
            <button
              ref={convertBtnRef}
              type="button"
              onClick={()=> { setConvertOpen(v=>!v); setToolsOpen(false); }}
              className={`flex items-center gap-1 px-2.5 py-2 text-[12px] font-black tracking-wide shrink-0 transition-colors ${convertOpen ? "text-[#E30613]" : "hover:text-[#E30613]"}`}
              aria-expanded={convertOpen}
            >
              CONVERT PDF <span className={`text-[9px] transition-transform ${convertOpen ? "rotate-180" : ""}`}>▼</span>
            </button>
            <Link to="/pdf/pdf-editor" onClick={()=> { setToolsOpen(false); setConvertOpen(false); }} className="px-2.5 py-2 hover:text-[#E30613] text-[12px] font-black tracking-wide shrink-0">EDIT PDF</Link>
            <Link to="/pdf/organize-pdf" onClick={()=> { setToolsOpen(false); setConvertOpen(false); }} className="px-2.5 py-2 hover:text-[#E30613] text-[12px] font-black tracking-wide shrink-0">ORGANIZE</Link>
            <Link to="/pdf/sign-pdf" onClick={()=> { setToolsOpen(false); setConvertOpen(false); }} className="px-2.5 py-2 hover:text-[#E30613] text-[12px] font-black tracking-wide shrink-0">SIGN PDF</Link>
            <Link to="/image-tools" onClick={()=> { setToolsOpen(false); setConvertOpen(false); }} className="px-2.5 py-2 hover:text-[#E30613] text-[12px] font-black tracking-wide shrink-0">IMAGE</Link>
            <Link to="/text-tools" onClick={()=> { setToolsOpen(false); setConvertOpen(false); }} className="px-2.5 py-2 hover:text-[#E30613] text-[12px] font-black tracking-wide shrink-0">TEXT</Link>
            <button
              ref={toolsBtnRef}
              type="button"
              onClick={()=> { setToolsOpen(v=>!v); setConvertOpen(false); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black tracking-widest border shrink-0 transition-colors ml-1 ${toolsOpen ? "bg-[#E30613] text-white border-[#E30613]" : "bg-[#F6F6F8] dark:bg-slate-800 hover:text-[#E30613] border-transparent hover:border-[#E30613]/20"}`}
              aria-expanded={toolsOpen}
            >
              ALL PDF TOOLS <span className={`text-[9px] transition-transform ${toolsOpen ? "rotate-180" : ""}`}>▼</span>
            </button>
          </div>
        </div>

        {/* Right side - search + theme */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <div className="hidden md:flex relative" ref={wrapRef}>
            <input
              value={q}
              onChange={(e)=> setQ(e.target.value)}
              placeholder="Search tools..."
              className="w-[150px] lg:w-[200px] pl-8 pr-3 py-2 rounded-full border border-[#E5E5E5] bg-[#F6F6F8] text-sm focus:bg-white focus:border-[#E30613] focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#707078] pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
            {open && results.length>0 && (
              <div className="absolute top-full mt-2 w-[320px] right-0 bg-white border border-[#E5E5E5] rounded-xl shadow-xl overflow-hidden dark:bg-slate-900 dark:border-slate-700 z-50">
                {results.map(r=> (
                  <Link key={r.id} to={`/${r.category}/${r.slug}`} onClick={()=> {setOpen(false); setQ(""); setToolsOpen(false); setConvertOpen(false);}} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#F6F6F8] dark:hover:bg-slate-800">
                    <ToolIcon3D slug={r.slug} size={28} />
                    <div className="min-w-0"><div className="text-sm font-bold dark:text-white truncate">{r.name}</div><div className="text-xs text-[#707078] truncate">{r.category}</div></div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button onClick={toggleTheme} className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F6F6F8] dark:border-slate-700 dark:text-white shrink-0" aria-label="Toggle theme">
            <span className="text-sm">{dark ? "☀️" : "🌙"}</span>
          </button>
        </div>
      </div>

      {/* DROPDOWNS — rendered as direct children of header to avoid overflow clipping */}
      {convertOpen && (
        <div className="absolute left-0 right-0 top-[62px] z-40">
          <div className="max-w-[1280px] mx-auto px-4 relative">
            <div className="absolute left-4 lg:left-[280px] top-2 w-[320px] bg-white border border-[#E5E5E5] rounded-xl shadow-2xl p-3 dark:bg-slate-900 dark:border-slate-700">
              <div className="text-[11px] font-black tracking-widest text-[#707078] px-2 py-1">Convert from PDF</div>
              <div className="grid grid-cols-1 gap-0.5 mt-1">
                {[
                  ["PDF to Word","/pdf/pdf-to-word"],
                  ["PDF to Excel","/pdf/pdf-to-excel"],
                  ["PDF to PowerPoint","/pdf/pdf-to-powerpoint"],
                  ["PDF to JPG","/pdf/pdf-to-jpg"],
                  ["PDF to Markdown","/pdf/pdf-to-markdown"],
                  ["PDF to PDF/A","/pdf/pdf-to-pdfa"],
                ].map(([label,href])=> <Link key={label} to={href} onClick={()=> setConvertOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-[#F6F6F8] dark:hover:bg-slate-800 text-sm font-medium"><ToolIcon3D slug={href.split("/").pop()!} size={24} /> {label}</Link>)}
              </div>
              <div className="text-[11px] font-black tracking-widest text-[#707078] px-2 py-1 mt-3">Convert to PDF</div>
              <div className="grid grid-cols-1 gap-0.5 mt-1">
                {[
                  ["Word to PDF","/pdf/word-to-pdf"],
                  ["Excel to PDF","/pdf/excel-to-pdf"],
                  ["PowerPoint to PDF","/pdf/powerpoint-to-pdf"],
                  ["JPG to PDF","/pdf/jpg-to-pdf"],
                  ["HTML to PDF","/pdf/html-to-pdf"],
                  ["Scan to PDF","/pdf/scan-to-pdf"],
                ].map(([label,href])=> <Link key={label} to={href} onClick={()=> setConvertOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-[#F6F6F8] dark:hover:bg-slate-800 text-sm font-medium"><ToolIcon3D slug={href.split("/").pop()!} size={24} /> {label}</Link>)}
              </div>
              <button onClick={()=> setConvertOpen(false)} className="w-full mt-3 py-2 rounded-lg bg-[#F6F6F8] dark:bg-slate-800 text-xs font-bold hover:bg-[#EFEFEF]">Close</button>
            </div>
          </div>
          {/* backdrop to catch clicks */}
          <div className="fixed inset-0 top-[62px] bg-transparent -z-10" onClick={()=> setConvertOpen(false)} />
        </div>
      )}

      {toolsOpen && (
        <div className="absolute left-0 right-0 top-[62px] z-40">
          <div className="max-w-[1280px] mx-auto px-4 relative">
            <div className="absolute right-4 top-2 w-[760px] max-w-[calc(100vw-32px)] bg-white border border-[#E5E5E5] rounded-2xl shadow-2xl p-5 dark:bg-slate-900 dark:border-slate-700">
              <div className="grid grid-cols-3 gap-5">
                {[
                  {title:"ORGANIZE PDF", items:[["Merge PDF","/pdf/merge-pdf"],["Split PDF","/pdf/split-pdf"],["Organize PDF","/pdf/organize-pdf"],["Rotate PDF","/pdf/rotate-pdf"],["Page numbers","/pdf/page-numbers-pdf"],["Crop PDF","/pdf/crop-pdf"]]},
                  {title:"OPTIMIZE PDF", items:[["Compress PDF","/pdf/compress-pdf"],["Repair PDF","/pdf/repair-pdf"],["Crop PDF","/pdf/crop-pdf"],["Organize PDF","/pdf/organize-pdf"]]},
                  {title:"CONVERT FROM PDF", items:[["PDF to Word","/pdf/pdf-to-word"],["PDF to Excel","/pdf/pdf-to-excel"],["PDF to PowerPoint","/pdf/pdf-to-powerpoint"],["PDF to JPG","/pdf/pdf-to-jpg"],["PDF to Markdown","/pdf/pdf-to-markdown"]]},
                  {title:"CONVERT TO PDF", items:[["Word to PDF","/pdf/word-to-pdf"],["Excel to PDF","/pdf/excel-to-pdf"],["PowerPoint to PDF","/pdf/powerpoint-to-pdf"],["JPG to PDF","/pdf/jpg-to-pdf"],["HTML to PDF","/pdf/html-to-pdf"],["Scan to PDF","/pdf/scan-to-pdf"]]},
                  {title:"EDIT PDF", items:[["Edit PDF","/pdf/pdf-editor"],["Fill Form","/pdf/fill-pdf-form"],["Redact PDF","/pdf/redact-pdf"],["Compare PDF","/pdf/compare-pdf"]]},
                  {title:"SECURITY", items:[["Unlock PDF","/pdf/unlock-pdf"],["Protect PDF","/pdf/protect-pdf"],["Sign PDF","/pdf/sign-pdf"],["Watermark","/pdf/watermark-pdf"]]},
                ].map(col=> (
                  <div key={col.title}>
                    <div className="text-[11px] font-black tracking-widest text-[#707078] mb-2">{col.title}</div>
                    <div className="space-y-1">
                      {col.items.map(([label,href])=> {
                        const slug = href.split("/").pop()!;
                        return <Link key={label} to={href} onClick={()=> setToolsOpen(false)} className="flex items-center gap-2 text-sm hover:text-[#E30613] py-1"><ToolIcon3D slug={slug} size={18} /> {label}</Link>
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-[#E5E5E5] dark:border-slate-700 flex gap-2">
                <Link to="/pdf-tools" onClick={()=> setToolsOpen(false)} className="flex-1 py-2.5 rounded-xl bg-[#E30613] text-white text-center text-sm font-black hover:bg-[#C00511]">See all PDF tools</Link>
                <Link to="/image-tools" onClick={()=> setToolsOpen(false)} className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-sm font-black hover:bg-[#F6F6F8] dark:border-slate-700 dark:text-white">Image tools</Link>
                <Link to="/developer-tools" onClick={()=> setToolsOpen(false)} className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-sm font-black hover:bg-[#F6F6F8] dark:border-slate-700 dark:text-white">Developer</Link>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 top-[62px] bg-transparent -z-10" onClick={()=> setToolsOpen(false)} />
        </div>
      )}

      <style>{`.scrollbar-none::-webkit-scrollbar{display:none}`}</style>
    </header>
  );
}
