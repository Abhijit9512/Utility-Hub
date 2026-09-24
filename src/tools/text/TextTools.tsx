import { useMemo, useState } from "react";

export function WordCounter() {
  const [text, setText] = useState("Hello world! Try typing or pasting your text here. This tool counts words, characters, sentences, paragraphs — fully in your browser.");
  const stats = useMemo(()=>{
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g,"").length;
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length || (text.trim()?1:0) : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter(p=>p.trim().length>0).length : 0;
    const readingTime = Math.max(1, Math.ceil(words/200));
    return { chars, charsNoSpaces, words, sentences, paragraphs, readingTime };
  }, [text]);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          ["Words", stats.words],
          ["Characters", stats.chars],
          ["Without spaces", stats.charsNoSpaces],
          ["Sentences", stats.sentences],
          ["Paragraphs", stats.paragraphs],
          ["Reading time", `${stats.readingTime} min`],
        ].map(([k,v])=> <div key={k as string} className="p-4 bg-white border rounded-2xl text-center dark:bg-slate-900 dark:border-slate-800"><div className="text-2xl font-bold dark:text-white">{v}</div><div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">{k}</div></div>)}
      </div>
      <div className="card">
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={10} placeholder="Type or paste text..." className="input font-mono text-sm min-h-[180px]" />
        <div className="flex gap-2 mt-3">
          <button onClick={()=> navigator.clipboard.writeText(text)} className="btn-secondary text-sm">Copy</button>
          <button onClick={()=> setText("")} className="btn-secondary text-sm">Clear</button>
          <span className="text-xs text-slate-500 dark:text-slate-400 self-center ml-auto">Processed locally — not sent to server</span>
        </div>
      </div>
    </div>
  );
}

export function CaseConverter() {
  const [text, setText] = useState("Hello World — convert your text case instantly");
  const [mode, setMode] = useState<"upper"|"lower"|"title"|"sentence">("upper");
  const converted = useMemo(()=>{
    if(mode==="upper") return text.toUpperCase();
    if(mode==="lower") return text.toLowerCase();
    if(mode==="title") return text.replace(/\w\S*/g, w=> w.charAt(0).toUpperCase()+ w.slice(1).toLowerCase());
    // sentence
    return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c=> c.toUpperCase());
  }, [text, mode]);
  return (
    <div className="card space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          ["upper","UPPERCASE"],
          ["lower","lowercase"],
          ["title","Title Case"],
          ["sentence","Sentence case"],
        ].map(([v,label])=> <button key={v} onClick={()=>setMode(v as any)} className={`px-4 py-2 rounded-xl border text-sm font-medium ${mode===v?'bg-blue-600 text-white border-blue-600':'bg-white dark:bg-slate-900 dark:text-white'}`}>{label}</button>)}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium dark:text-white">Input</label><textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="input mt-1 font-mono text-sm" /></div>
        <div><label className="text-sm font-medium dark:text-white">Output — {mode}</label><textarea value={converted} readOnly rows={8} className="input mt-1 font-mono text-sm bg-slate-50 dark:bg-slate-800" /><button onClick={()=>navigator.clipboard.writeText(converted)} className="btn-secondary mt-2 text-sm">Copy output</button></div>
      </div>
    </div>
  );
}

export function TextCleaner() {
  const [text, setText] = useState("  hello   world  \n\n\nthis  is  a   test\n\ndup line\ndup line\n  extra   spaces  ");
  const [opts, setOpts] = useState({ trim:true, extraSpaces:true, emptyLines:true, duplicates:true, sort:false, reverse:false });
  const [find,setFind]=useState("test");
  const [replace,setReplace]=useState("demo");
  const cleaned = useMemo(()=>{
    let out = text;
    // find replace handled separately
    if(opts.extraSpaces) out = out.replace(/[ \t]+/g, " ");
    if(opts.trim) out = out.split("\n").map(l=>l.trim()).join("\n");
    if(opts.emptyLines) out = out.replace(/\n{3,}/g, "\n\n").split("\n").filter(l=> l.trim()!=="" || !opts.emptyLines).join("\n");
    // Actually simpler for empty lines toggle
    if(opts.emptyLines) out = out.split("\n").filter(l=> l.trim().length>0).join("\n");
    if(opts.duplicates){
      const seen = new Set<string>(); const lines = out.split("\n");
      out = lines.filter(l=> { if(seen.has(l)) return false; seen.add(l); return true; }).join("\n");
    }
    if(opts.sort) out = out.split("\n").sort().join("\n");
    if(opts.reverse) out = out.split("\n").reverse().join("\n");
    return out;
  }, [text, opts]);
  const slug = useMemo(()=> text.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80), [text]);
  const diffNote = "Deterministic local processing only.";
  return (
    <div className="space-y-4">
      <div className="card">
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="input font-mono text-sm" placeholder="Paste text..." />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 text-sm">
          <label className="flex items-center gap-2 dark:text-white"><input type="checkbox" checked={opts.trim} onChange={e=>setOpts({...opts, trim:e.target.checked})} /> Trim lines</label>
          <label className="flex items-center gap-2 dark:text-white"><input type="checkbox" checked={opts.extraSpaces} onChange={e=>setOpts({...opts, extraSpaces:e.target.checked})} /> Remove extra spaces</label>
          <label className="flex items-center gap-2 dark:text-white"><input type="checkbox" checked={opts.emptyLines} onChange={e=>setOpts({...opts, emptyLines:e.target.checked})} /> Remove empty lines</label>
          <label className="flex items-center gap-2 dark:text-white"><input type="checkbox" checked={opts.duplicates} onChange={e=>setOpts({...opts, duplicates:e.target.checked})} /> Remove duplicates</label>
          <label className="flex items-center gap-2 dark:text-white"><input type="checkbox" checked={opts.sort} onChange={e=>setOpts({...opts, sort:e.target.checked})} /> Sort lines</label>
          <label className="flex items-center gap-2 dark:text-white"><input type="checkbox" checked={opts.reverse} onChange={e=>setOpts({...opts, reverse:e.target.checked})} /> Reverse</label>
        </div>
        <div className="grid md:grid-cols-3 gap-2 mt-3">
          <input value={find} onChange={e=>setFind(e.target.value)} placeholder="Find" className="input" />
          <input value={replace} onChange={e=>setReplace(e.target.value)} placeholder="Replace" className="input" />
          <button onClick={()=> setText(text.split(find).join(replace))} className="btn-secondary">Find & Replace</button>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">{diffNote} • Slug: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{slug || "—"}</code> <button onClick={()=>slug && navigator.clipboard.writeText(slug)} className="text-blue-600 ml-2">Copy slug</button></div>
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-2"><span className="font-medium dark:text-white">Cleaned output</span><button onClick={()=>navigator.clipboard.writeText(cleaned)} className="btn-secondary text-sm">Copy</button></div>
        <textarea value={cleaned} readOnly rows={8} className="input font-mono text-sm bg-slate-50 dark:bg-slate-800" />
        <div className="flex gap-2 mt-2"><button onClick={()=> setText(cleaned)} className="btn-primary text-sm">Use as input</button><button onClick={()=> setText("")} className="btn-secondary text-sm">Clear</button></div>
      </div>
      <div className="card">
        <h4 className="font-semibold dark:text-white mb-2">Extra generators</h4>
        <div className="flex gap-2">
          <button onClick={()=> setText(prev=> prev + "\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")} className="btn-secondary text-sm">Append Lorem Ipsum</button>
          <button onClick={()=> setText(prev=> prev.split("").reverse().join(""))} className="btn-secondary text-sm">Reverse Text</button>
        </div>
      </div>
    </div>
  );
}

export function TextDiff() {
  const [a, setA] = useState("Hello world\nThis is line 2\nSame line");
  const [b, setB] = useState("Hello world!\nThis is line 2 changed\nSame line");
  const diff = useMemo(()=>{
    const la = a.split("\n"); const lb = b.split("\n");
    const max = Math.max(la.length, lb.length);
    const rows=[];
    for(let i=0;i<max;i++){
      const av = la[i] ?? ""; const bv = lb[i] ?? "";
      if(av===bv) rows.push({type:"same", a:av, b:bv});
      else rows.push({type:"diff", a:av, b:bv});
    }
    return rows;
  },[a,b]);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card"><label className="font-medium dark:text-white">Original</label><textarea value={a} onChange={e=>setA(e.target.value)} rows={10} className="input mt-1 font-mono text-sm" /></div>
      <div className="card"><label className="font-medium dark:text-white">Modified</label><textarea value={b} onChange={e=>setB(e.target.value)} rows={10} className="input mt-1 font-mono text-sm" /></div>
      <div className="card md:col-span-2">
        <h4 className="font-medium dark:text-white mb-2">Line-by-line diff</h4>
        <div className="space-y-1 font-mono text-sm">
          {diff.map((r,i)=> <div key={i} className={`p-2 rounded flex gap-4 ${r.type==="same"?"bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900":"bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900"}`}><span className="w-1/2 truncate">{r.a || "∅"}</span><span className="text-slate-400">→</span><span className="w-1/2 truncate">{r.b || "∅"}</span></div>)}
        </div>
      </div>
    </div>
  );
}
