import { useState, useMemo } from "react";

export function PasswordGenerator(){
  const [len,setLen]=useState(16);
  const [opts,setOpts]=useState({upper:true, lower:true, numbers:true, symbols:true});
  const [pwd,setPwd]=useState("");
  const generate = ()=>{
    const upper="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower="abcdefghijklmnopqrstuvwxyz";
    const nums="0123456789";
    const sym="!@#$%^&*_-+=<>?";
    let pool="";
    if(opts.upper) pool+=upper;
    if(opts.lower) pool+=lower;
    if(opts.numbers) pool+=nums;
    if(opts.symbols) pool+=sym;
    if(!pool) return;
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    let out="";
    for(let i=0;i<len;i++) out+= pool[arr[i]%pool.length];
    setPwd(out);
  };
  return (
    <div className="card space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">Cryptographically random via Web Crypto API. Nothing sent to server.</p>
      <div className="flex items-center gap-3"><label className="text-sm dark:text-white">Length {len}</label><input type="range" min={8} max={32} value={len} onChange={e=>setLen(parseInt(e.target.value))} className="flex-1" /></div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <label className="flex items-center gap-2 dark:text-white"><input type="checkbox" checked={opts.upper} onChange={e=>setOpts({...opts,upper:e.target.checked})} /> Uppercase</label>
        <label className="flex items-center gap-2 dark:text-white"><input type="checkbox" checked={opts.lower} onChange={e=>setOpts({...opts,lower:e.target.checked})} /> Lowercase</label>
        <label className="flex items-center gap-2 dark:text-white"><input type="checkbox" checked={opts.numbers} onChange={e=>setOpts({...opts,numbers:e.target.checked})} /> Numbers</label>
        <label className="flex items-center gap-2 dark:text-white"><input type="checkbox" checked={opts.symbols} onChange={e=>setOpts({...opts,symbols:e.target.checked})} /> Symbols</label>
      </div>
      <button onClick={generate} className="btn-primary">Generate password</button>
      {pwd && <div className="p-4 bg-slate-900 text-green-400 rounded-xl font-mono text-center break-all flex justify-between items-center gap-2"><span>{pwd}</span><button onClick={()=>navigator.clipboard.writeText(pwd)} className="btn-secondary text-xs shrink-0">Copy</button></div>}
    </div>
  );
}

export function PasswordStrength(){
  const [pwd,setPwd]=useState("P@ssw0rd123!");
  const score = useMemo(()=>{
    let s=0;
    if(pwd.length>=8) s++;
    if(pwd.length>=12) s++;
    if(/[A-Z]/.test(pwd)) s++;
    if(/[a-z]/.test(pwd)) s++;
    if(/[0-9]/.test(pwd)) s++;
    if(/[^A-Za-z0-9]/.test(pwd)) s++;
    // cap 5
    s=Math.min(5, s);
    const labels=["Very weak","Weak","Fair","Good","Strong","Very strong"];
    const colors=["bg-red-500","bg-orange-500","bg-yellow-500","bg-blue-500","bg-green-500","bg-emerald-600"];
    return {s, label:labels[s], color:colors[s]};
  },[pwd]);
  return (
    <div className="card space-y-4">
      <input value={pwd} onChange={e=>setPwd(e.target.value)} type="text" placeholder="Enter password" className="input font-mono" />
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800"><div className={`h-full ${score.color} transition-all`} style={{width:`${(score.s/5)*100}%`}} /></div>
      <div className="flex justify-between text-sm"><span className="dark:text-white">{score.label}</span><span className="text-slate-500 dark:text-slate-400">{score.s}/5</span></div>
      <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc pl-5 space-y-1">
        <li>Checked locally — not sent to server</li>
        <li>Length, uppercase, lowercase, numbers, symbols increase strength</li>
        <li>Use generator for better randomness</li>
      </ul>
    </div>
  );
}

export function RandomGenerators(){
  const [count,setCount]=useState(5);
  const [min,setMin]=useState(1);
  const [max,setMax]=useState(100);
  const [nums,setNums]=useState<number[]>([]);
  const [strLen,setStrLen]=useState(12);
  const [str,setStr]=useState("");
  const genNums = ()=>{
    const arr=new Uint32Array(count);
    crypto.getRandomValues(arr);
    setNums(Array.from(arr).map(n=> min + (n % (max-min+1)) ));
  };
  const genStr = ()=>{
    const pool="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const arr=new Uint32Array(strLen);
    crypto.getRandomValues(arr);
    setStr(Array.from(arr).map(n=> pool[n % pool.length]).join(""));
  };
  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <h4 className="font-semibold dark:text-white">Random Numbers (Web Crypto)</h4>
        <div className="grid grid-cols-3 gap-2">
          <label className="text-sm dark:text-white">Count<input type="number" value={count} onChange={e=>setCount(parseInt(e.target.value)||0)} className="input mt-1" /></label>
          <label className="text-sm dark:text-white">Min<input type="number" value={min} onChange={e=>setMin(parseInt(e.target.value)||0)} className="input mt-1" /></label>
          <label className="text-sm dark:text-white">Max<input type="number" value={max} onChange={e=>setMax(parseInt(e.target.value)||0)} className="input mt-1" /></label>
        </div>
        <button onClick={genNums} className="btn-primary">Generate</button>
        {nums.length>0 && <div className="p-3 bg-slate-50 border rounded-xl font-mono text-sm flex flex-wrap gap-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white">{nums.map((n,i)=> <span key={i} className="px-2 py-1 bg-white border rounded dark:bg-slate-900 dark:border-slate-700">{n}</span>)}</div>}
      </div>
      <div className="card space-y-3">
        <h4 className="font-semibold dark:text-white">Random String</h4>
        <div className="flex gap-2 items-end">
          <label className="text-sm dark:text-white flex-1">Length<input type="number" value={strLen} onChange={e=>setStrLen(parseInt(e.target.value)||0)} className="input mt-1" /></label>
          <button onClick={genStr} className="btn-primary">Generate</button>
        </div>
        {str && <div className="p-3 bg-slate-900 text-white rounded-xl font-mono flex justify-between items-center"><span className="break-all">{str}</span><button onClick={()=>navigator.clipboard.writeText(str)} className="text-xs text-blue-400 ml-2">Copy</button></div>}
      </div>
    </div>
  );
}
