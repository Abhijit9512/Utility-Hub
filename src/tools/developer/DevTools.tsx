import { useState, useMemo } from "react";

export function JsonFormatter({ mode = "format" }: { mode?: "format"|"validate"|"minify" }) {
  const [input, setInput] = useState('{"name":"UtilityHub","tools": ["pdf","image","text"],"count": 42, "nested": {"a":1}}');
  const [error, setError] = useState<string | null>(null);
  const output = useMemo(()=>{
    try {
      setError(null);
      if(!input.trim()) return "";
      const parsed = JSON.parse(input);
      if(mode==="minify") return JSON.stringify(parsed);
      if(mode==="validate") return "✓ Valid JSON";
      return JSON.stringify(parsed, null, 2);
    } catch(e:any){ setError(e.message); return ""; }
  },[input,mode]);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card"><label className="font-medium dark:text-white">Input JSON</label><textarea value={input} onChange={e=>setInput(e.target.value)} rows={14} className="input mt-1 font-mono text-xs" placeholder='{"key":"value"}' /></div>
      <div className="card"><div className="flex justify-between items-center"><label className="font-medium dark:text-white">{mode==="minify"?"Minified": mode==="validate"?"Validation":"Formatted"}</label><button onClick={()=> output && navigator.clipboard.writeText(mode==="validate"?"":output)} className="btn-secondary text-xs" disabled={mode==="validate"}>Copy</button></div>
        {error ? <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 dark:bg-red-950/30 dark:border-red-900 dark:text-red-300">{error}</div> : <textarea value={output} readOnly rows={14} className="input mt-2 font-mono text-xs bg-slate-50 dark:bg-slate-800" />}
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">Processed locally — not sent to server.</div>
      </div>
    </div>
  );
}

export function Base64Tool({ mode = "encode" }: { mode?: "encode"|"decode" }) {
  const [input,setInput]=useState(mode==="encode"?"Hello UtilityHub!":"SGVsbG8gVXRpbGl0eUh1YiE=");
  const [error,setError]=useState("");
  const output = useMemo(()=>{
    try{
      setError("");
      if(mode==="encode") return btoa(unescape(encodeURIComponent(input)));
      else return decodeURIComponent(escape(atob(input.trim())));
    }catch(e:any){ setError(e.message); return ""; }
  },[input,mode]);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card"><label className="font-medium dark:text-white">{mode==="encode"?"Text to encode":"Base64 to decode"}</label><textarea value={input} onChange={e=>setInput(e.target.value)} rows={10} className="input mt-1 font-mono text-sm" /></div>
      <div className="card"><div className="flex justify-between"><label className="font-medium dark:text-white">Output</label><button onClick={()=>navigator.clipboard.writeText(output)} className="btn-secondary text-xs">Copy</button></div><textarea value={error?`Error: ${error}`:output} readOnly rows={10} className="input mt-1 font-mono text-sm bg-slate-50 dark:bg-slate-800" /><div className="text-xs text-slate-500 dark:text-slate-400 mt-2">Client-side base64 — no upload.</div></div>
    </div>
  );
}

export function UrlCodec({ mode="encode" }: { mode?: "encode"|"decode"}) {
  const [input,setInput]=useState(mode==="encode"?"https://example.com/search?q=hello world & lang=en":"https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world");
  const output = useMemo(()=>{
    try{ return mode==="encode"? encodeURIComponent(input): decodeURIComponent(input);}catch{ return "Invalid input";}
  },[input,mode]);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card"><label className="font-medium dark:text-white">Input</label><textarea value={input} onChange={e=>setInput(e.target.value)} rows={8} className="input mt-1 font-mono text-sm" /></div>
      <div className="card"><div className="flex justify-between"><label className="font-medium dark:text-white">Output</label><button onClick={()=>navigator.clipboard.writeText(output)} className="btn-secondary text-xs">Copy</button></div><textarea value={output} readOnly rows={8} className="input mt-1 font-mono text-sm bg-slate-50 dark:bg-slate-800" /></div>
    </div>
  );
}

export function JwtDecoder(){
  const [token,setToken]=useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  const decoded = useMemo(()=>{
    try{
      const parts = token.split(".");
      if(parts.length!==3) return {error:"JWT must have 3 parts"};
      const header = JSON.parse(atob(parts[0].replace(/-/g,"+").replace(/_/g,"/")));
      const payload = JSON.parse(atob(parts[1].replace(/-/g,"+").replace(/_/g,"/")));
      return {header,payload, signature:parts[2]};
    } catch(e:any){ return {error:e.message};}
  },[token]);
  return (
    <div className="space-y-4">
      <div className="card">
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-300">Decodes locally — does NOT verify signature. Verification requires the secret/public key and is not done here.</p>
        <label className="font-medium dark:text-white mt-3 block">JWT<input value={token} onChange={e=>setToken(e.target.value)} className="input mt-1 font-mono text-xs" /></label>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card"><h4 className="font-semibold dark:text-white">Header</h4><pre className="mt-2 p-3 bg-slate-900 text-green-400 rounded-xl overflow-auto text-xs">{ (decoded as any).header ? JSON.stringify((decoded as any).header,null,2) : (decoded as any).error }</pre></div>
        <div className="card"><h4 className="font-semibold dark:text-white">Payload</h4><pre className="mt-2 p-3 bg-slate-900 text-green-400 rounded-xl overflow-auto text-xs">{ (decoded as any).payload ? JSON.stringify((decoded as any).payload,null,2) : (decoded as any).error }</pre></div>
      </div>
      {(decoded as any).signature && <div className="card"><h4 className="font-semibold dark:text-white">Signature (base64url)</h4><div className="font-mono text-xs break-all mt-2 p-2 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">{(decoded as any).signature}</div></div>}
    </div>
  );
}

export function UuidGenerator(){
  const [uuids,setUuids]=useState<string[]>([]);
  const generate = (n=1)=>{
    const arr=[];
    for(let i=0;i<n;i++){
      // use crypto.randomUUID if available
      // @ts-ignore
      const u = (crypto.randomUUID && crypto.randomUUID()) || ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c:any)=> (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c/4).toString(16));
      arr.push(u);
    }
    setUuids(arr);
  };
  return (
    <div className="card space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">Cryptographically random UUID v4 via Web Crypto API where available.</p>
      <div className="flex gap-2"><button onClick={()=>generate(1)} className="btn-primary">Generate 1</button><button onClick={()=>generate(5)} className="btn-secondary">Generate 5</button><button onClick={()=>generate(10)} className="btn-secondary">Generate 10</button></div>
      <div className="space-y-2">{uuids.map((u,i)=> <div key={i} className="flex justify-between items-center p-3 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700"><span className="font-mono text-sm dark:text-white">{u}</span><button onClick={()=>navigator.clipboard.writeText(u)} className="text-xs text-blue-600 dark:text-blue-400">Copy</button></div>)}</div>
    </div>
  );
}

export function RegexTester(){
  const [pattern,setPattern]=useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags,setFlags]=useState("g");
  const [text,setText]=useState("Contact us at hello@example.com or support@utilityhub.example.com for help.");
  const [result,setResult]=useState<{ok:boolean,matches:string[], error?:string}>({ok:true,matches:[]});
  const test = ()=>{
    try{
      const re = new RegExp(pattern, flags);
      const matches = [...text.matchAll(re as any)].map(m=> m[0]);
      setResult({ok:true, matches});
    }catch(e:any){ setResult({ok:false, matches:[], error:e.message}); }
  };
  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <div className="grid md:grid-cols-3 gap-2"><input value={pattern} onChange={e=>setPattern(e.target.value)} placeholder="Pattern" className="input font-mono text-sm md:col-span-2" /><input value={flags} onChange={e=>setFlags(e.target.value)} placeholder="flags g i m" className="input font-mono text-sm" /></div>
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={6} className="input font-mono text-sm" />
        <button onClick={test} className="btn-primary">Test regex</button>
        {!result.ok && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-2 dark:bg-red-950/20 dark:border-red-900">{result.error}</div>}
        {result.ok && <div className="text-sm p-3 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">Matches: {result.matches.length} {result.matches.length? `— ${result.matches.join(", ")}`:"(none)"}</div>}
        <div className="text-xs text-slate-500 dark:text-slate-400">Runs locally. Catastrophic patterns may still freeze — keep tests short.</div>
      </div>
    </div>
  );
}

export function TimestampConverter(){
  const [ts,setTs]=useState(String(Math.floor(Date.now()/1000)));
  const [date,setDate]=useState(new Date().toISOString().slice(0,16));
  const fromTs = useMemo(()=> {
    const n=parseInt(ts,10);
    if(isNaN(n)) return "Invalid";
    return new Date(n*1000).toLocaleString();
  },[ts]);
  const toTs = useMemo(()=> {
    const d=new Date(date);
    return isNaN(d.getTime())?"Invalid":String(Math.floor(d.getTime()/1000));
  },[date]);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card space-y-3"><h4 className="font-semibold dark:text-white">Unix → Date</h4><input value={ts} onChange={e=>setTs(e.target.value)} className="input font-mono" /><div className="p-3 bg-blue-50 rounded-xl font-mono text-sm dark:bg-blue-900/20 dark:text-white">{fromTs}</div></div>
      <div className="card space-y-3"><h4 className="font-semibold dark:text-white">Date → Unix</h4><input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} className="input" /><div className="p-3 bg-blue-50 rounded-xl font-mono text-sm dark:bg-blue-900/20 dark:text-white">{toTs}</div></div>
    </div>
  );
}

export function ColorTools({ mode="hex2rgb"}:{mode?:string}){
  const [hex,setHex]=useState("#2563eb");
  const [rgb,setRgb]=useState("37, 99, 235");
  const hexToRgb = hex.replace("#","").match(/.{2}/g)?.map(h=> parseInt(h,16)).join(", ") ?? "—";
  const rgbToHex = (()=> {
    try{ const [r,g,b]=rgb.split(",").map(n=> parseInt(n.trim(),10)); return "#" + [r,g,b].map(n=> n.toString(16).padStart(2,"0")).join(""); } catch{ return "—"; }
  })();
  return (
    <div className="card space-y-4">
      {mode==="hex2rgb" && <><label className="text-sm dark:text-white">HEX<input value={hex} onChange={e=>setHex(e.target.value)} className="input mt-1 font-mono" /></label><div className="p-4 bg-slate-50 rounded-xl flex gap-3 items-center dark:bg-slate-800"><div className="w-12 h-12 rounded-xl border" style={{background:hex}} /><div><div className="font-mono dark:text-white">RGB: {hexToRgb}</div><button onClick={()=>navigator.clipboard.writeText(hexToRgb)} className="text-xs text-blue-600">Copy</button></div></div></>}
      {mode==="rgb2hex" && <><label className="text-sm dark:text-white">RGB (r,g,b)<input value={rgb} onChange={e=>setRgb(e.target.value)} className="input mt-1 font-mono" /></label><div className="p-4 bg-slate-50 rounded-xl flex gap-3 items-center dark:bg-slate-800"><div className="w-12 h-12 rounded-xl border" style={{background:rgbToHex}} /><div><div className="font-mono dark:text-white">{rgbToHex}</div><button onClick={()=>navigator.clipboard.writeText(rgbToHex)} className="text-xs text-blue-600">Copy</button></div></div></>}
      {mode==="gradient" && <GradientGen />}
    </div>
  );
}

function GradientGen(){
  const [c1,setC1]=useState("#2563eb");
  const [c2,setC2]=useState("#06b6d4");
  const [angle,setAngle]=useState(90);
  const css = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
  return (
    <div className="space-y-3">
      <div className="h-32 rounded-2xl border dark:border-slate-700" style={{background:css}} />
      <div className="grid grid-cols-3 gap-2"><input type="color" value={c1} onChange={e=>setC1(e.target.value)} className="h-10 w-full" /><input type="color" value={c2} onChange={e=>setC2(e.target.value)} className="h-10 w-full" /><input type="range" min={0} max={360} value={angle} onChange={e=>setAngle(parseInt(e.target.value))} /></div>
      <div className="font-mono text-xs p-2 bg-slate-900 text-white rounded-xl">{`background: ${css};`}</div><button onClick={()=>navigator.clipboard.writeText(`background: ${css};`)} className="btn-secondary text-sm">Copy CSS</button>
    </div>
  );
}

export function XmlFormatter(){
  const [input,setInput]=useState('<root><item id="1">Hello</item><item id="2">World</item></root>');
  const [error,setError]=useState("");
  const formatted = useMemo(()=>{
    try{
      setError("");
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "text/xml");
      if(doc.querySelector("parsererror")) throw new Error("Invalid XML");
      const serialize = (node: Element, indent=0)=>{
        const pad = "  ".repeat(indent);
        let out = `${pad}<${node.tagName}`;
        for(const attr of Array.from(node.attributes)) out+=` ${attr.name}="${attr.value}"`;
        if(node.children.length===0 && !node.textContent?.trim()) return out+"/>\n";
        out+=">";
        if(node.children.length>0){
          out+="\n";
          for(const child of Array.from(node.children)) out+=serialize(child as Element, indent+1);
          for(const t of Array.from(node.childNodes)) if(t.nodeType===3 && t.textContent?.trim()) out+= "  ".repeat(indent+1)+ t.textContent.trim()+"\n";
          out+=`${pad}</${node.tagName}>\n`;
        } else {
          out+= `${node.textContent?.trim() ?? ""}</${node.tagName}>\n`;
        }
        return out;
      };
      return serialize(doc.documentElement).trim();
    }catch(e:any){ setError(e.message); return ""; }
  },[input]);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card"><label className="font-medium dark:text-white">XML Input</label><textarea value={input} onChange={e=>setInput(e.target.value)} rows={12} className="input mt-1 font-mono text-xs" /></div>
      <div className="card"><div className="flex justify-between"><label className="font-medium dark:text-white">Formatted</label><button onClick={()=>navigator.clipboard.writeText(formatted)} className="btn-secondary text-xs">Copy</button></div>{error?<div className="text-sm text-red-600 mt-2">{error}</div>:<textarea value={formatted} readOnly rows={12} className="input mt-1 font-mono text-xs bg-slate-50 dark:bg-slate-800" />}</div>
    </div>
  );
}

export function HashGenerator(){
  const [input,setInput]=useState("Hello UtilityHub");
  const [hashes,setHashes]=useState<Record<string,string>>({});
  const generate = async ()=>{
    const enc = new TextEncoder();
    const data = enc.encode(input);
    const algs = ["SHA-1","SHA-256","SHA-384","SHA-512"] as const;
    const out:Record<string,string>={};
    for(const alg of algs){
      const buf = await crypto.subtle.digest(alg, data);
      out[alg] = Array.from(new Uint8Array(buf)).map(b=> b.toString(16).padStart(2,"0")).join("");
    }
    setHashes(out);
  };
  return (
    <div className="card space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-400">Generate SHA hashes via Web Crypto API — client-side.</p>
      <textarea value={input} onChange={e=>setInput(e.target.value)} rows={3} className="input font-mono text-sm" />
      <button onClick={generate} className="btn-primary">Generate hashes</button>
      <div className="space-y-2">{Object.entries(hashes).map(([k,v])=> <div key={k} className="p-3 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700"><div className="text-xs font-bold uppercase text-slate-500">{k}</div><div className="font-mono text-xs break-all dark:text-white">{v}</div><button onClick={()=>navigator.clipboard.writeText(v)} className="text-xs text-blue-600">Copy</button></div>)}</div>
    </div>
  );
}
