import { useState, useMemo } from "react";

export function AttendanceCalculator(){
  const [attended,setAttended]=useState(42);
  const [total,setTotal]=useState(50);
  const [required,setRequired]=useState(75);
  const perc = total? (attended/total)*100:0;
  const needed = useMemo(()=>{
    if(perc>=required) {
      // how many can bunk?
      let bunk=0;
      while((attended/(total+bunk))*100 >= required) bunk++;
      return { status:"safe", canBunk: Math.max(0,bunk-1) };
    } else {
      // needed to reach
      let need=0;
      while(((attended+need)/(total+need))*100 < required) { need++; if(need>1000) break; }
      return { status:"need", need };
    }
  },[attended,total,required,perc]);
  return (
    <div className="card space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        <label className="text-sm dark:text-white">Attended<input type="number" value={attended} onChange={e=>setAttended(parseInt(e.target.value)||0)} className="input mt-1" /></label>
        <label className="text-sm dark:text-white">Total<input type="number" value={total} onChange={e=>setTotal(parseInt(e.target.value)||0)} className="input mt-1" /></label>
        <label className="text-sm dark:text-white">Required %<input type="number" value={required} onChange={e=>setRequired(parseInt(e.target.value)||0)} className="input mt-1" /></label>
      </div>
      <div className="p-6 bg-blue-600 text-white rounded-2xl text-center">
        <div className="text-4xl font-bold">{perc.toFixed(2)}%</div>
        <div className="text-sm opacity-80">{attended} / {total}</div>
        <div className="mt-2 text-sm bg-white/20 inline-block px-3 py-1 rounded-full">{needed.status==="safe"?`You can bunk ${ (needed as any).canBunk } classes`:`Need ${(needed as any).need} more classes`}</div>
      </div>
    </div>
  );
}

export function CGPACalculator(){
  const [scale,setScale]=useState<10|4>(10);
  const [grades,setGrades]=useState("9,8,9,10,8");
  const result = useMemo(()=>{
    const arr = grades.split(",").map(s=> parseFloat(s.trim())).filter(n=> !isNaN(n));
    if(arr.length===0) return null;
    const avg = arr.reduce((a,b)=>a+b,0)/arr.length;
    const percent = scale===10 ? avg*9.5 : (avg/4)*100;
    return { avg, percent, count: arr.length };
  },[grades,scale]);
  return (
    <div className="card space-y-4">
      <div className="flex gap-2">
        <button onClick={()=>setScale(10)} className={`px-4 py-2 rounded-xl border text-sm ${scale===10?'bg-blue-600 text-white':''}`}>10-point scale</button>
        <button onClick={()=>setScale(4)} className={`px-4 py-2 rounded-xl border text-sm ${scale===4?'bg-blue-600 text-white':''}`}>4-point scale</button>
      </div>
      <label className="text-sm dark:text-white">SGPA/CGPA values (comma separated)<input value={grades} onChange={e=>setGrades(e.target.value)} className="input mt-1 font-mono" placeholder="e.g. 9,8,9,10" /></label>
      {result && <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="text-sm text-slate-500">Average</div><div className="font-bold dark:text-white">{result.avg.toFixed(2)}</div></div>
        <div className="p-4 bg-blue-50 rounded-2xl dark:bg-blue-900/20"><div className="text-sm text-slate-500">Percentage</div><div className="font-bold dark:text-white">{result.percent.toFixed(2)}%</div></div>
        <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-800"><div className="text-sm text-slate-500">Subjects</div><div className="font-bold dark:text-white">{result.count}</div></div>
      </div>}
      <div className="text-xs text-slate-500 dark:text-slate-400">10-point → % = CGPA×9.5 (common AICTE). Check your university formula.</div>
    </div>
  );
}

export function GPACalculator(){
  const [rows,setRows]=useState([{grade:9, credit:3},{grade:8, credit:4},{grade:10, credit:3}]);
  const gpa = useMemo(()=>{
    const totalCredits = rows.reduce((a,r)=>a+r.credit,0);
    const weighted = rows.reduce((a,r)=>a+r.grade*r.credit,0);
    return totalCredits? weighted/totalCredits:0;
  },[rows]);
  return (
    <div className="card space-y-4">
      <div className="space-y-2">
        {rows.map((r,i)=> <div key={i} className="flex gap-2">
          <input type="number" value={r.grade} onChange={e=> setRows(rows=> rows.map((x,idx)=> idx===i? {...x, grade:parseFloat(e.target.value)||0}:x))} placeholder="Grade" className="input" />
          <input type="number" value={r.credit} onChange={e=> setRows(rows=> rows.map((x,idx)=> idx===i? {...x, credit:parseFloat(e.target.value)||0}:x))} placeholder="Credit" className="input" />
          <button onClick={()=> setRows(rows.filter((_,idx)=> idx!==i))} className="btn-secondary text-sm">✕</button>
        </div>)}
      </div>
      <div className="flex gap-2"><button onClick={()=> setRows([...rows,{grade:8,credit:3}])} className="btn-secondary text-sm">Add subject</button></div>
      <div className="p-4 bg-blue-600 text-white rounded-2xl text-center"><div className="text-3xl font-bold">{gpa.toFixed(2)}</div><div className="text-sm opacity-80">GPA (weighted)</div></div>
    </div>
  );
}
