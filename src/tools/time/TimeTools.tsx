import { useEffect, useRef, useState } from "react";

export function TimerTool() {
  const [seconds, setSeconds] = useState(60);
  const [inputMin, setInputMin] = useState(1);
  const [inputSec, setInputSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(60);
  const ref = useRef<number | null>(null);
  useEffect(()=>{
    if(running && left>0){
      ref.current = window.setTimeout(()=> setLeft(l=> l-1), 1000);
    } else if(left===0 && running){
      setRunning(false);
      // beep
      try{ const ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); const o=ctx.createOscillator(); o.connect(ctx.destination); o.start(); setTimeout(()=>o.stop(),400); }catch{}
      if("Notification" in window && Notification.permission==="granted") new Notification("Timer finished");
    }
    return ()=> { if(ref.current) clearTimeout(ref.current); };
  },[running,left]);
  const start = ()=> { const total = inputMin*60+inputSec; setSeconds(total); setLeft(total); setRunning(true); if("Notification" in window && Notification.permission==="default") Notification.requestPermission(); };
  return (
    <div className="card text-center space-y-4">
      <div className="text-6xl font-mono font-bold dark:text-white">{String(Math.floor(left/60)).padStart(2,"0")}:{String(left%60).padStart(2,"0")}</div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800"><div className="h-full bg-blue-600 transition-all" style={{ width: `${seconds? (left/seconds)*100:0}%` }} /></div>
      <div className="flex justify-center gap-2">
        <label className="text-sm dark:text-white">Min<input type="number" value={inputMin} onChange={e=>setInputMin(parseInt(e.target.value)||0)} className="input w-20 ml-1" /></label>
        <label className="text-sm dark:text-white">Sec<input type="number" value={inputSec} onChange={e=>setInputSec(parseInt(e.target.value)||0)} className="input w-20 ml-1" /></label>
      </div>
      <div className="flex justify-center gap-2">
        {!running? <button onClick={start} className="btn-primary">Start</button> : <button onClick={()=> setRunning(false)} className="btn-secondary">Pause</button>}
        <button onClick={()=> {setRunning(false); setLeft(seconds);}} className="btn-secondary">Reset</button>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">Browser timer — works offline, no server.</div>
    </div>
  );
}

export function StopwatchTool() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  useEffect(()=>{
    if(!running) return;
    const id = setInterval(()=> setMs(v=> v+10),10);
    return ()=> clearInterval(id);
  },[running]);
  const fmt = (m:number)=> {
    const totalSec = Math.floor(m/1000);
    const min = String(Math.floor(totalSec/60)).padStart(2,"0");
    const sec = String(totalSec%60).padStart(2,"0");
    const cent = String(Math.floor((m%1000)/10)).padStart(2,"0");
    return `${min}:${sec}.${cent}`;
  };
  return (
    <div className="card text-center space-y-4">
      <div className="text-6xl font-mono font-bold dark:text-white">{fmt(ms)}</div>
      <div className="flex justify-center gap-2">
        <button onClick={()=> setRunning(v=>!v)} className="btn-primary">{running?"Pause":"Start"}</button>
        <button onClick={()=> setLaps(l=> [...l, ms])} disabled={!running} className="btn-secondary">Lap</button>
        <button onClick={()=> {setRunning(false); setMs(0); setLaps([]);}} className="btn-secondary">Reset</button>
      </div>
      {laps.length>0 && <div className="text-left max-h-40 overflow-auto border rounded-xl p-2 dark:border-slate-700"><div className="text-sm font-medium dark:text-white mb-1">Laps</div>{laps.map((l,i)=> <div key={i} className="text-sm font-mono flex justify-between dark:text-slate-300"><span>Lap {i+1}</span><span>{fmt(l)}</span></div>)}</div>}
    </div>
  );
}

export function PomodoroTool() {
  const [work,setWork]=useState(25);
  const [breakMin,setBreakMin]=useState(5);
  const [phase,setPhase]=useState<"work"|"break">("work");
  const [left,setLeft]=useState(25*60);
  const [running,setRunning]=useState(false);
  useEffect(()=>{ setLeft((phase==="work"?work:breakMin)*60); },[work,breakMin,phase]);
  useEffect(()=>{
    if(!running) return;
    if(left<=0){
      // switch phase
      setPhase(p=> p==="work"?"break":"work");
      return;
    }
    const id=setTimeout(()=> setLeft(l=>l-1),1000);
    return ()=> clearTimeout(id);
  },[running,left,phase]);
  const fmt = (s:number)=> `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  return (
    <div className="card text-center space-y-4">
      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${phase==="work"?"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300":"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"}`}>{phase} • {phase==="work"?work:breakMin} min</div>
      <div className="text-6xl font-mono font-bold dark:text-white">{fmt(left)}</div>
      <div className="flex justify-center gap-2">
        <label className="text-sm dark:text-white">Work<input type="number" value={work} onChange={e=>setWork(parseInt(e.target.value)||0)} className="input w-20 ml-1" /></label>
        <label className="text-sm dark:text-white">Break<input type="number" value={breakMin} onChange={e=>setBreakMin(parseInt(e.target.value)||0)} className="input w-20 ml-1" /></label>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={()=> setRunning(v=>!v)} className="btn-primary">{running?"Pause":"Start"}</button>
        <button onClick={()=> {setRunning(false); setLeft((phase==="work"?work:breakMin)*60);}} className="btn-secondary">Reset</button>
        <button onClick={()=> setPhase(p=> p==="work"?"break":"work")} className="btn-secondary">Switch</button>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">Pomodoro timer runs in browser. No account needed.</div>
    </div>
  );
}

export function WorldClock() {
  const [now,setNow]=useState(new Date());
  useEffect(()=>{ const id=setInterval(()=> setNow(new Date()),1000); return ()=> clearInterval(id);},[]);
  const zones = [
    "Asia/Kolkata","Asia/Dubai","Asia/Singapore","Asia/Tokyo","Europe/London","Europe/Berlin","America/New_York","America/Los_Angeles","Australia/Sydney","UTC"
  ];
  return (
    <div className="space-y-4">
      <div className="card text-center"><div className="text-sm text-slate-500">Your local time</div><div className="text-3xl font-mono font-bold dark:text-white">{now.toLocaleString()}</div></div>
      <div className="grid md:grid-cols-2 gap-3">
        {zones.map(z=> (
          <div key={z} className="card flex justify-between items-center">
            <div className="text-sm font-medium dark:text-white">{z}</div>
            <div className="font-mono text-sm dark:text-slate-300">{new Intl.DateTimeFormat("en-GB",{ timeZone: z, hour:"2-digit", minute:"2-digit", second:"2-digit", dateStyle:"medium" }).format(now)}</div>
          </div>
        ))}
      </div>
      <TimeZoneConverter />
    </div>
  );
}

export function TimeZoneConverter(){
  const [date,setDate]=useState(new Date().toISOString().slice(0,16));
  const [from,setFrom]=useState("Asia/Kolkata");
  const [to,setTo]=useState("America/New_York");
  const zones = ["Asia/Kolkata","Asia/Dubai","UTC","Europe/London","Europe/Berlin","America/New_York","America/Los_Angeles","Asia/Tokyo"];
  const converted = (()=> {
    try{
      const d = new Date(date);
      // Interpret input as in 'from' zone — approximate by using Intl
      // Simpler: show same instant in different zone
      const fmt = new Intl.DateTimeFormat("en-GB",{ timeZone: to, dateStyle:"medium", timeStyle:"medium" }).format(d);
      return fmt;
    }catch{ return "—"; }
  })();
  return (
    <div className="card space-y-3">
      <h4 className="font-semibold dark:text-white">Time Zone Converter</h4>
      <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} className="input" />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm dark:text-white">From<select value={from} onChange={e=>setFrom(e.target.value)} className="input mt-1">{zones.map(z=> <option key={z} value={z}>{z}</option>)}</select></label>
        <label className="text-sm dark:text-white">To<select value={to} onChange={e=>setTo(e.target.value)} className="input mt-1">{zones.map(z=> <option key={z} value={z}>{z}</option>)}</select></label>
      </div>
      <div className="p-3 bg-blue-50 rounded-xl text-center dark:bg-blue-900/20"><div className="text-sm text-slate-500">In {to}</div><div className="font-mono font-bold dark:text-white">{converted}</div></div>
      <div className="text-xs text-slate-500 dark:text-slate-400">Conversion uses browser Intl API — same instant shown in target zone.</div>
    </div>
  );
}

export function CountdownTool({ type }: { type: "date"|"birthday"|"exam" }) {
  const [target,setTarget]=useState(()=> {
    const d=new Date(); d.setDate(d.getDate()+30); return d.toISOString().slice(0,10);
  });
  const [label,setLabel]=useState(type==="birthday"?"Birthday": type==="exam"?"Exam":"Event");
  const [now,setNow]=useState(new Date());
  useEffect(()=>{ const id=setInterval(()=> setNow(new Date()),1000); return ()=> clearInterval(id);},[]);
  const diff = (()=> {
    const t = new Date(target+"T00:00:00");
    const ms = t.getTime() - now.getTime();
    const abs = Math.abs(ms);
    const days=Math.floor(abs/86400000);
    const hours=Math.floor((abs%86400000)/3600000);
    const mins=Math.floor((abs%3600000)/60000);
    const secs=Math.floor((abs%60000)/1000);
    return { ms, days, hours, mins, secs };
  })();
  return (
    <div className="card space-y-4 text-center">
      <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Label" className="input text-center font-medium" />
      <input type="date" value={target} onChange={e=>setTarget(e.target.value)} className="input" />
      <div className={`text-lg font-semibold ${diff.ms>=0?"text-blue-600 dark:text-blue-400":"text-green-600 dark:text-green-400"}`}>{diff.ms>=0?`Time until ${label}`:`Time since ${label}`}</div>
      <div className="grid grid-cols-4 gap-2">
        <div className="p-3 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="text-2xl font-bold dark:text-white">{diff.days}</div><div className="text-xs uppercase text-slate-500">Days</div></div>
        <div className="p-3 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="text-2xl font-bold dark:text-white">{diff.hours}</div><div className="text-xs uppercase text-slate-500">Hours</div></div>
        <div className="p-3 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="text-2xl font-bold dark:text-white">{diff.mins}</div><div className="text-xs uppercase text-slate-500">Mins</div></div>
        <div className="p-3 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="text-2xl font-bold dark:text-white">{diff.secs}</div><div className="text-xs uppercase text-slate-500">Secs</div></div>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">Live countdown — browser time only.</div>
    </div>
  );
}
