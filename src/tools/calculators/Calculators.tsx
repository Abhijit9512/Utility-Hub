import { useState, useMemo } from "react";

export function AgeCalculator() {
  const [dob, setDob] = useState("2000-01-01");
  const [today, setToday] = useState(new Date().toISOString().slice(0,10));
  const age = useMemo(()=>{
    if(!dob) return null;
    const d = new Date(dob); const t = new Date(today);
    let years = t.getFullYear()-d.getFullYear();
    let months = t.getMonth()-d.getMonth();
    let days = t.getDate()-d.getDate();
    if(days<0){ months--; const prev = new Date(t.getFullYear(), t.getMonth(),0).getDate(); days+=prev; }
    if(months<0){ years--; months+=12; }
    const totalDays = Math.floor((t.getTime()-d.getTime())/86400000);
    return { years, months, days, totalDays };
  },[dob,today]);
  return (
    <div className="card space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm dark:text-white">Date of Birth<input type="date" value={dob} onChange={e=>setDob(e.target.value)} className="input mt-1" /></label>
        <label className="text-sm dark:text-white">Today<input type="date" value={today} onChange={e=>setToday(e.target.value)} className="input mt-1" /></label>
      </div>
      {age && <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-blue-50 rounded-2xl text-center dark:bg-blue-900/20"><div className="text-2xl font-bold dark:text-white">{age.years}</div><div className="text-xs uppercase text-slate-500">Years</div></div>
        <div className="p-4 bg-blue-50 rounded-2xl text-center dark:bg-blue-900/20"><div className="text-2xl font-bold dark:text-white">{age.months}</div><div className="text-xs uppercase text-slate-500">Months</div></div>
        <div className="p-4 bg-blue-50 rounded-2xl text-center dark:bg-blue-900/20"><div className="text-2xl font-bold dark:text-white">{age.days}</div><div className="text-xs uppercase text-slate-500">Days</div></div>
        <div className="p-4 bg-slate-50 rounded-2xl text-center dark:bg-slate-800"><div className="text-xl font-bold dark:text-white">{age.totalDays}</div><div className="text-xs uppercase text-slate-500">Total days</div></div>
      </div>}
      <div className="text-xs text-slate-500 dark:text-slate-400">Deterministic — uses browser date. No server.</div>
    </div>
  );
}

export function PercentageCalculator() {
  const [mode, setMode] = useState<"percentOf"|"isPercent"|"increase">("percentOf");
  const [a,setA]=useState(20); const [b,setB]=useState(150);
  const result = useMemo(()=>{
    if(mode==="percentOf") return (a/100)*b;
    if(mode==="isPercent") return b===0?0:(a/b)*100;
    // increase: a increased by b%
    return a + (a*b/100);
  },[mode,a,b]);
  return (
    <div className="card space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={()=>setMode("percentOf")} className={`px-3 py-2 rounded-xl border text-sm ${mode==="percentOf"?'bg-blue-600 text-white':''}`}>X% of Y</button>
        <button onClick={()=>setMode("isPercent")} className={`px-3 py-2 rounded-xl border text-sm ${mode==="isPercent"?'bg-blue-600 text-white':''}`}>X is what % of Y</button>
        <button onClick={()=>setMode("increase")} className={`px-3 py-2 rounded-xl border text-sm ${mode==="increase"?'bg-blue-600 text-white':''}`}>X + Y%</button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm dark:text-white">Value A<input type="number" value={a} onChange={e=>setA(parseFloat(e.target.value)||0)} className="input mt-1" /></label>
        <label className="text-sm dark:text-white">Value B<input type="number" value={b} onChange={e=>setB(parseFloat(e.target.value)||0)} className="input mt-1" /></label>
      </div>
      <div className="p-4 bg-blue-50 rounded-2xl text-center dark:bg-blue-900/20"><div className="text-3xl font-bold dark:text-white">{Number.isFinite(result)? result.toFixed(2):"—"}</div><div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{mode==="percentOf"?`${a}% of ${b}`: mode==="isPercent"?`${a} is ${result.toFixed(2)}% of ${b}`: `${a} + ${b}%`}</div></div>
    </div>
  );
}

export function GSTCalculator() {
  const [amount,setAmount]=useState(1000);
  const [rate,setRate]=useState(18);
  const [inclusive,setInclusive]=useState(false);
  const calc = useMemo(()=>{
    if(inclusive){
      const base = amount / (1+rate/100);
      const gst = amount - base;
      return { base, gst, total: amount };
    } else {
      const gst = amount*rate/100;
      return { base: amount, gst, total: amount+gst };
    }
  },[amount,rate,inclusive]);
  return (
    <div className="card space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">India GST calculator. Choose exclusive or inclusive. Estimate only — not tax advice.</p>
      <div className="grid md:grid-cols-3 gap-3">
        <label className="text-sm dark:text-white">Amount (₹)<input type="number" value={amount} onChange={e=>setAmount(parseFloat(e.target.value)||0)} className="input mt-1" /></label>
        <label className="text-sm dark:text-white">GST Rate %<select value={rate} onChange={e=>setRate(parseFloat(e.target.value))} className="input mt-1"><option value={5}>5%</option><option value={12}>12%</option><option value={18}>18%</option><option value={28}>28%</option></select></label>
        <label className="text-sm dark:text-white flex flex-col justify-end"><span className="flex items-center gap-2"><input type="checkbox" checked={inclusive} onChange={e=>setInclusive(e.target.checked)} /> Inclusive (amount includes GST)</span></label>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="text-sm text-slate-500">Base</div><div className="font-bold dark:text-white">₹{calc.base.toFixed(2)}</div></div>
        <div className="p-4 bg-blue-50 rounded-2xl dark:bg-blue-900/20"><div className="text-sm text-slate-500">GST</div><div className="font-bold dark:text-white">₹{calc.gst.toFixed(2)}</div></div>
        <div className="p-4 bg-slate-900 text-white rounded-2xl dark:bg-white dark:text-slate-900"><div className="text-sm opacity-70">Total</div><div className="font-bold">₹{calc.total.toFixed(2)}</div></div>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">Assumes single GST rate. SGST/CGST split = 50% each for intra-state.</div>
    </div>
  );
}

export function EMICalculator() {
  const [p,setP]=useState(500000);
  const [r,setR]=useState(9);
  const [n,setN]=useState(60);
  const emi = useMemo(()=>{
    const monthly = r/12/100;
    if(monthly===0) return p/n;
    return p*monthly*Math.pow(1+monthly,n) / (Math.pow(1+monthly,n)-1);
  },[p,r,n]);
  const total = emi*n;
  const interest = total-p;
  return (
    <div className="card space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">EMI = P×r×(1+r)^n / ((1+r)^n−1). Estimate only — verify with lender.</p>
      <div className="grid md:grid-cols-3 gap-3">
        <label className="text-sm dark:text-white">Principal (₹)<input type="number" value={p} onChange={e=>setP(parseFloat(e.target.value)||0)} className="input mt-1" /></label>
        <label className="text-sm dark:text-white">Annual %<input type="number" step={0.1} value={r} onChange={e=>setR(parseFloat(e.target.value)||0)} className="input mt-1" /></label>
        <label className="text-sm dark:text-white">Months<input type="number" value={n} onChange={e=>setN(parseFloat(e.target.value)||0)} className="input mt-1" /></label>
      </div>
      <div className="grid md:grid-cols-3 gap-3 text-center">
        <div className="p-4 bg-blue-600 text-white rounded-2xl"><div className="text-sm opacity-80">EMI</div><div className="text-xl font-bold">₹{emi.toFixed(0)}</div></div>
        <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="text-sm text-slate-500">Total interest</div><div className="font-bold dark:text-white">₹{interest.toFixed(0)}</div></div>
        <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="text-sm text-slate-500">Total payable</div><div className="font-bold dark:text-white">₹{total.toFixed(0)}</div></div>
      </div>
    </div>
  );
}

export function GenericCalculator({ title, formula, inputs, compute }: { title:string, formula:string, inputs: {key:string,label:string, default:number}[], compute: (vals:Record<string,number>)=> number | string }) {
  const [vals, setVals] = useState<Record<string,number>>(()=> Object.fromEntries(inputs.map(i=> [i.key, i.default])));
  const result = useMemo(()=> {
    try { return compute(vals); } catch { return "—"; }
  },[vals, compute]);
  return (
    <div className="card space-y-4">
      <p className="text-xs font-mono bg-slate-50 border rounded-xl p-2 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">{formula}</p>
      <div className="grid md:grid-cols-3 gap-3">
        {inputs.map(inp=> <label key={inp.key} className="text-sm dark:text-white">{inp.label}<input type="number" value={vals[inp.key]} onChange={e=> setVals(v=> ({...v, [inp.key]: parseFloat(e.target.value)||0}))} className="input mt-1" /></label>)}
      </div>
      <div className="p-4 bg-blue-50 rounded-2xl text-center dark:bg-blue-900/20"><div className="text-2xl font-bold dark:text-white">{String(result)}</div><div className="text-xs text-slate-500">Result</div></div>
    </div>
  );
}

export function UnitConverter() {
  const [type, setType] = useState<"length"|"weight"|"temp"|"data">("length");
  const [val, setVal] = useState(1);
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("km");
  // conversion factors to base
  const maps:any = {
    length: { m:1, km:1000, cm:0.01, mm:0.001, mile:1609.34, ft:0.3048, inch:0.0254 },
    weight: { kg:1, g:0.001, mg:0.000001, lb:0.453592, oz:0.0283495 },
    data: { B:1, KB:1024, MB:1024*1024, GB:1024*1024*1024, TB:1024*1024*1024*1024 },
  };
  const converted = useMemo(()=>{
    if(type==="temp"){
      // to celsius then to target
      let c = val;
      if(from==="F") c=(val-32)*5/9;
      if(from==="K") c=val-273.15;
      if(to==="C") return c;
      if(to==="F") return c*9/5+32;
      if(to==="K") return c+273.15;
      return c;
    } else {
      const map = maps[type];
      if(!map[from]||!map[to]) return 0;
      const base = val*map[from];
      return base / map[to];
    }
  },[type,val,from,to]);
  const options:any = {
    length: ["m","km","cm","mm","mile","ft","inch"],
    weight: ["kg","g","mg","lb","oz"],
    temp: ["C","F","K"],
    data: ["B","KB","MB","GB","TB"],
  };
  return (
    <div className="card space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["length","weight","temp","data"] as const).map(t=> <button key={t} onClick={()=>{setType(t); setFrom(options[t][0]); setTo(options[t][1]);}} className={`px-3 py-1.5 rounded-xl border text-sm capitalize ${type===t?'bg-blue-600 text-white':''}`}>{t}</button>)}
      </div>
      <div className="grid md:grid-cols-3 gap-3 items-end">
        <label className="text-sm dark:text-white">Value<input type="number" value={val} onChange={e=>setVal(parseFloat(e.target.value)||0)} className="input mt-1" /></label>
        <label className="text-sm dark:text-white">From<select value={from} onChange={e=>setFrom(e.target.value)} className="input mt-1">{options[type].map((o:string)=> <option key={o} value={o}>{o}</option>)}</select></label>
        <label className="text-sm dark:text-white">To<select value={to} onChange={e=>setTo(e.target.value)} className="input mt-1">{options[type].map((o:string)=> <option key={o} value={o}>{o}</option>)}</select></label>
      </div>
      <div className="p-4 bg-blue-50 rounded-2xl text-center dark:bg-blue-900/20"><div className="text-2xl font-bold dark:text-white">{Number(converted).toFixed(6).replace(/\.?0+$/,"")} {to}</div><div className="text-sm text-slate-500">{val} {from} = {Number(converted).toFixed(4)} {to}</div></div>
    </div>
  );
}

export function DateDiff() {
  const [a,setA]=useState("2024-01-01");
  const [b,setB]=useState(new Date().toISOString().slice(0,10));
  const diff = useMemo(()=>{
    const da=new Date(a), db=new Date(b);
    const ms = Math.abs(db.getTime()-da.getTime());
    const days=Math.floor(ms/86400000);
    return { days, weeks:(days/7).toFixed(1), months:(days/30.44).toFixed(1), years:(days/365.25).toFixed(2) };
  },[a,b]);
  return (
    <div className="card space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm dark:text-white">Start<input type="date" value={a} onChange={e=>setA(e.target.value)} className="input mt-1" /></label>
        <label className="text-sm dark:text-white">End<input type="date" value={b} onChange={e=>setB(e.target.value)} className="input mt-1" /></label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="font-bold dark:text-white">{diff.days}</div><div className="text-xs text-slate-500">Days</div></div>
        <div className="p-3 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="font-bold dark:text-white">{diff.weeks}</div><div className="text-xs text-slate-500">Weeks</div></div>
        <div className="p-3 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="font-bold dark:text-white">{diff.months}</div><div className="text-xs text-slate-500">Months ~</div></div>
        <div className="p-3 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="font-bold dark:text-white">{diff.years}</div><div className="text-xs text-slate-500">Years ~</div></div>
      </div>
    </div>
  );
}

export function SIPCalculator() {
  const [monthly,setMonthly]=useState(5000);
  const [rate,setRate]=useState(12);
  const [years,setYears]=useState(10);
  const res = useMemo(()=>{
    const r = rate/12/100; const n = years*12;
    const fv = monthly * ( (Math.pow(1+r,n)-1)/r ) * (1+r);
    const invested = monthly*n;
    return { fv, invested, gain: fv-invested };
  },[monthly,rate,years]);
  return (
    <div className="card space-y-4">
      <p className="text-xs text-slate-500 dark:text-slate-400">Annual rate compounded monthly. Estimate only — not financial advice.</p>
      <div className="grid md:grid-cols-3 gap-3">
        <label className="text-sm dark:text-white">Monthly (₹)<input type="number" value={monthly} onChange={e=>setMonthly(parseFloat(e.target.value)||0)} className="input mt-1" /></label>
        <label className="text-sm dark:text-white">Annual %<input type="number" value={rate} onChange={e=>setRate(parseFloat(e.target.value)||0)} className="input mt-1" /></label>
        <label className="text-sm dark:text-white">Years<input type="number" value={years} onChange={e=>setYears(parseFloat(e.target.value)||0)} className="input mt-1" /></label>
      </div>
      <div className="grid md:grid-cols-3 gap-3 text-center">
        <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="text-sm text-slate-500">Invested</div><div className="font-bold dark:text-white">₹{res.invested.toFixed(0)}</div></div>
        <div className="p-4 bg-blue-50 rounded-2xl dark:bg-blue-900/20"><div className="text-sm text-slate-500">Est. value</div><div className="font-bold dark:text-white">₹{res.fv.toFixed(0)}</div></div>
        <div className="p-4 bg-green-50 rounded-2xl dark:bg-green-900/20"><div className="text-sm text-slate-500">Gain</div><div className="font-bold dark:text-white">₹{res.gain.toFixed(0)}</div></div>
      </div>
    </div>
  );
}
