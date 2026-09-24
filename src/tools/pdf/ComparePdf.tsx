import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";

export default function ComparePdf() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [diff, setDiff] = useState<{a:string,b:string,type:"same"|"diff"}[]>([]);

  const compare = async () => {
    if (!fileA || !fileB) { setStatus("Need 2 PDFs"); return; }
    try {
      setStatus("Extracting text from both PDFs...");
      const pdfjs: any = await import("pdfjs-dist");
      try { pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`; } catch {}
      const extract = async (f:File) => {
        const data = await f.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data }).promise;
        let full = "";
        for (let i=1;i<=pdf.numPages;i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const text = (content.items as any[]).map(it=> it.str).join(" ");
          full += `\n--- Page ${i} ---\n` + text;
        }
        return full.split("\n").filter(l=> l.trim());
      };
      const aLines = await extract(fileA);
      const bLines = await extract(fileB);
      const max = Math.max(aLines.length, bLines.length);
      const rows: any[] = [];
      for (let i=0;i<max;i++) {
        const av = aLines[i] ?? "";
        const bv = bLines[i] ?? "";
        rows.push({ a: av, b: bv, type: av===bv?"same":"diff" });
      }
      setDiff(rows);
      const same = rows.filter(r=> r.type==="same").length;
      setStatus(`Done — ${rows.length} lines compared, ${same} identical, ${rows.length-same} different. Text-based diff; scanned PDFs need OCR.`);
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#E30613] text-white">
        <h3 className="font-bold">Compare PDF — side-by-side text diff</h3>
        <p className="text-sm opacity-90 mt-1">Extracts selectable text via PDF.js and shows line-by-line diff. Text-only comparison — no upload required.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h4 className="font-bold">PDF A</h4>
          <div className="mt-2"><UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && setFileA(f[0])} label="Drop first PDF" /></div>
          {fileA && <div className="text-sm mt-2">{fileA.name}</div>}
        </div>
        <div className="card">
          <h4 className="font-bold">PDF B</h4>
          <div className="mt-2"><UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && setFileB(f[0])} label="Drop second PDF" /></div>
          {fileB && <div className="text-sm mt-2">{fileB.name}</div>}
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={compare} disabled={!fileA||!fileB} className="btn-primary">Compare PDFs</button>
        <button onClick={()=> {setFileA(null); setFileB(null); setDiff([]); setStatus("");}} className="btn-secondary">Reset</button>
      </div>
      {status && <div className="text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
      {diff.length>0 && (
        <div className="card max-h-[500px] overflow-auto">
          <div className="space-y-1 font-mono text-xs">
            {diff.map((r,i)=> (
              <div key={i} className={`p-2 rounded flex gap-2 ${r.type==="same"?'bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20':'bg-red-50 border border-red-200 dark:bg-red-950/20'}`}>
                <span className="flex-1 truncate">{r.a || "∅"}</span>
                <span className="text-[#707078]">→</span>
                <span className="flex-1 truncate">{r.b || "∅"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
