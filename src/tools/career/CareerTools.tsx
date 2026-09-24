import { useMemo, useState } from "react";

export function ResumeAnalyzer(){
  const [text,setText]=useState("John Doe\nSoftware Engineer with 3 years experience in React, Node.js, TypeScript, AWS. Built scalable web apps, led team of 4, improved performance by 40%. B.Tech in Computer Science.\nSkills: React, TypeScript, Node, AWS, Docker, SQL\nExperience: ...");
  const stats = useMemo(()=>{
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const sentences = (text.match(/[.!?]+/g)||[]).length;
    const hasEmail = /\S+@\S+\.\S+/.test(text);
    const hasPhone = /(\+?\d[\d\s-]{8,})/.test(text);
    const hasLink = /https?:\/\//.test(text);
    const keywords = ["react","node","typescript","aws","docker","sql","python","java","leadership","team","agile"];
    const found = keywords.filter(k=> text.toLowerCase().includes(k));
    const missing = keywords.filter(k=> !text.toLowerCase().includes(k)).slice(0,5);
    const score = Math.min(100, Math.round((words>100?20: words/5) + (hasEmail?15:0)+(hasPhone?10:0)+(found.length*5)+ (sentences>5?10:0)));
    return {words, chars, sentences, hasEmail, hasPhone, hasLink, found, missing, score};
  },[text]);
  return (
    <div className="space-y-4">
      <div className="card">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Deterministic analyzer — checks length, contacts, keywords. Not AI.</p>
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={10} className="input font-mono text-sm" placeholder="Paste resume text..." />
        <div className="flex gap-2 mt-3"><button onClick={()=> navigator.clipboard.writeText(text)} className="btn-secondary text-sm">Copy</button><button onClick={()=>setText("")} className="btn-secondary text-sm">Clear</button></div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="card text-center"><div className="text-3xl font-bold dark:text-white">{stats.score}</div><div className="text-xs uppercase tracking-widest text-slate-500">Score /100</div><div className="w-full h-2 bg-slate-100 rounded-full mt-2 dark:bg-slate-800"><div className="h-full bg-blue-600 rounded-full" style={{width:`${stats.score}%`}} /></div></div>
        <div className="card text-sm space-y-1 dark:text-slate-300"><div>Words: <b>{stats.words}</b> • Chars: <b>{stats.chars}</b></div><div>Sentences: <b>{stats.sentences}</b></div><div>Email: {stats.hasEmail?"✓":"✕"} • Phone: {stats.hasPhone?"✓":"✕"} • Link: {stats.hasLink?"✓":"✕"}</div></div>
        <div className="card text-sm"><div className="font-medium dark:text-white">Keywords found</div><div className="flex flex-wrap gap-1 mt-1">{stats.found.map(k=> <span key={k} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs dark:bg-green-900/30 dark:text-green-300">{k}</span>)}{stats.found.length===0 && <span className="text-slate-500">None</span>}</div><div className="font-medium mt-2 dark:text-white">Consider adding</div><div className="flex flex-wrap gap-1 mt-1">{stats.missing.map(k=> <span key={k} className="px-2 py-1 bg-slate-100 rounded-full text-xs dark:bg-slate-800 dark:text-slate-300">{k}</span>)}</div></div>
      </div>
      <div className="card">
        <h4 className="font-semibold dark:text-white">Suggestions (rule-based)</h4>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
          {stats.words<150 && <li>Resume seems short — aim for 300-600 words for 1-page resume.</li>}
          {!stats.hasEmail && <li>Add an email address.</li>}
          {!stats.hasPhone && <li>Add a phone number.</li>}
          {stats.found.length<3 && <li>Add more relevant skills keywords.</li>}
          <li>Use action verbs: built, led, improved, delivered.</li>
        </ul>
      </div>
    </div>
  );
}

export function KeywordExtractor(){
  const [jd,setJd]=useState("We are looking for a React developer with experience in TypeScript, Node.js, AWS, Docker, REST APIs, and agile methodologies. Must have strong problem solving and team collaboration skills.");
  const [resume,setResume]=useState("React developer, TypeScript, Node.js, SQL");
  const result = useMemo(()=>{
    const tokenize = (s:string)=> s.toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=> w.length>2);
    const jdTokens = tokenize(jd);
    const freq:Record<string,number>={};
    jdTokens.forEach(w=> freq[w]=(freq[w]||0)+1);
    const sorted = Object.entries(freq).sort((a,b)=> b[1]-a[1]).slice(0,20);
    const resumeTokens = new Set(tokenize(resume));
    return sorted.map(([w,c])=> ({word:w, count:c, inResume: resumeTokens.has(w)}));
  },[jd,resume]);
  const density = useMemo(()=>{
    const total = jd.trim().split(/\s+/).filter(Boolean).length || 1;
    return result.map(r=> ({...r, density: ((r.count/total)*100).toFixed(2)}));
  },[result,jd]);
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card"><label className="font-medium dark:text-white">Job Description</label><textarea value={jd} onChange={e=>setJd(e.target.value)} rows={8} className="input mt-1 text-sm" /></div>
        <div className="card"><label className="font-medium dark:text-white">Your resume keywords (optional)</label><textarea value={resume} onChange={e=>setResume(e.target.value)} rows={8} className="input mt-1 text-sm" /></div>
      </div>
      <div className="card">
        <h4 className="font-semibold dark:text-white">Keyword analysis</h4>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {density.map(r=> <div key={r.word} className={`flex justify-between items-center p-2 rounded-xl border text-sm ${r.inResume?'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900':'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}><span className="font-mono dark:text-white">{r.word} <span className="text-xs text-slate-500">×{r.count} • {r.density}%</span></span>{r.inResume?<span className="text-xs text-green-600 dark:text-green-400">✓ in resume</span>:<span className="text-xs text-slate-400">missing</span>}</div>)}
        </div>
      </div>
    </div>
  );
}

export function EmailTemplate(){
  const [role,setRole]=useState("Software Engineer");
  const [company,setCompany]=useState("Acme Corp");
  const [name,setName]=useState("Hiring Manager");
  const [sender,setSender]=useState("John Doe");
  const template = `Subject: Application for ${role} — ${sender}

Dear ${name},

I hope you are well. I am writing to apply for the ${role} position at ${company}. With experience in React, TypeScript and cloud technologies, I believe I can contribute effectively to your team.

Please find my resume attached. I would welcome the opportunity to discuss how my background aligns with your needs.

Thank you for your consideration.

Best regards,
${sender}
Phone: +91-XXXXXXXXXX
Email: your.email@example.com
`;
  return (
    <div className="card space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">Professional email template generator — deterministic, no AI.</p>
      <div className="grid md:grid-cols-2 gap-3">
        <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Role" className="input" />
        <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company" className="input" />
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Recipient name" className="input" />
        <input value={sender} onChange={e=>setSender(e.target.value)} placeholder="Your name" className="input" />
      </div>
      <textarea value={template} readOnly rows={10} className="input font-mono text-sm bg-slate-50 dark:bg-slate-800" />
      <button onClick={()=>navigator.clipboard.writeText(template)} className="btn-primary text-sm">Copy email</button>
    </div>
  );
}
