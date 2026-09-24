import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument } from "pdf-lib";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState("1-2,3");
  const [status, setStatus] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const split = async () => {
    if (!file) return;
    try {
      setStatus("Processing...");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const total = pdf.getPageCount();
      
      // parse ranges like "1-3,5" into page indices
      const indices: number[] = [];
      if (ranges.trim().toLowerCase() === "all") {
        // will produce zip-like? For MVP, extract all as single? We'll just create one file with all.
        for (let i=0;i<total;i++) indices.push(i);
      } else {
        const parts = ranges.split(",").map(s=>s.trim()).filter(Boolean);
        for (const part of parts) {
          if (part.includes("-")) {
            const [a,b] = part.split("-").map(n=>parseInt(n.trim(),10));
            if (isNaN(a)||isNaN(b)) throw new Error("Invalid range: "+part);
            for (let p=a; p<=b; p++) { if (p>=1 && p<=total) indices.push(p-1); }
          } else {
            const p = parseInt(part,10);
            if (isNaN(p)) throw new Error("Invalid page: "+part);
            if (p>=1 && p<=total) indices.push(p-1);
          }
        }
      }
      if (indices.length===0) throw new Error("No valid pages selected. Document has "+total+" pages.");

      const out = await PDFDocument.create();
      const pages = await out.copyPages(pdf, indices);
      pages.forEach(p=> out.addPage(p));
      const saved = await out.save();
      const blob = new Blob([saved as any], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
      setStatus(`Done — extracted ${indices.length} of ${total} pages. Browser-only — not uploaded.`);
    } catch (e:any) { setStatus("Error: "+e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Split/extract pages client-side. Enter pages like <code>1-3,5</code> or <code>all</code>. Processing stays in your browser.</p>
        <UploadZone accept=".pdf,application/pdf" onFiles={(f)=> setFile(f[0]||null)} label="Drop PDF here" />
        {file && <div className="mt-3 text-sm dark:text-white">{file.name} • {(file.size/1024).toFixed(1)} KB</div>}
        <div className="mt-4">
          <label className="text-sm font-medium dark:text-white">Pages to extract</label>
          <input value={ranges} onChange={e=>setRanges(e.target.value)} placeholder="e.g. 1-3,5 or all" className="input mt-1" />
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={split} disabled={!file} className="btn-primary">Extract pages</button>
          <button onClick={()=>{setFile(null); setResultUrl(null); setStatus(""); setRanges("1-2,3");}} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 rounded-xl bg-slate-50 border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
        {resultUrl && <a href={resultUrl} download="extracted.pdf" className="btn-primary mt-3">Download extracted.pdf</a>}
      </div>
    </div>
  );
}
