import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument, rgb } from "pdf-lib";

export default function RedactPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [rects, setRects] = useState<{x:number,y:number,w:number,h:number}[]>([]);
  const [cur, setCur] = useState({x:80,y:400,w:200,h:30});
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const loadPdf = async (f: File) => {
    setFile(f);
    setStatus("");
    setUrl(null);
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
      setRects([]);
      setStatus(`Loaded ${pdf.getPageCount()} pages. Add black redaction boxes — they will permanently cover content (visually). Note: underlying text not removed from PDF stream, but visually hidden.`);
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  const addRect = () => setRects([...rects, {...cur}]);

  const redact = async () => {
    if (!file || rects.length===0) { setStatus("Add at least one redaction box."); return; }
    try {
      setStatus("Redacting (covering with black)...");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = pdf.getPages();
      const idx = Math.max(0, Math.min(pageNum-1, pages.length-1));
      const page = pages[idx];
      for (const r of rects) {
        page.drawRectangle({ x: r.x, y: r.y, width: r.w, height: r.h, color: rgb(0,0,0) });
      }
      page.drawText("Redacted via UtilityHub", { x: 20, y: 20, size: 7, color: rgb(0.6,0.6,0.7) });
      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — ${rects.length} area(s) blacked on page ${pageNum}. This is visual covering; for certified redaction use professional tools.`);
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#111827] text-white">
        <h3 className="font-bold">Redact PDF — permanently black out content</h3>
        <p className="text-sm opacity-70 mt-1">Draw black rectangles over sensitive text/graphics via <code className="bg-white/10 px-1 rounded">pdf-lib</code>. Visually covers — not certified text removal. No upload.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && loadPdf(f[0])} label="Drop PDF to redact" />
          {file && <div className="mt-2 text-sm"><b>{file.name}</b> • {pageCount} pages</div>}
          <label className="text-sm mt-3 block">Page<input type="number" min={1} max={pageCount||1} value={pageNum} onChange={e=> setPageNum(parseInt(e.target.value)||1)} className="input mt-1" /></label>
          <div className="text-xs text-[#707078] mt-1">A4 595×842, bottom-left 0,0. Example: X80 Y400 W200 H30 covers a line.</div>
          {status && <div className="mt-3 text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
        </div>
        <div className="card">
          <h4 className="font-bold">Add redaction boxes</h4>
          <div className="grid grid-cols-4 gap-2 mt-2">
            <label className="text-xs">X<input value={cur.x} onChange={e=> setCur({...cur, x: parseInt(e.target.value)||0})} className="input mt-1" /></label>
            <label className="text-xs">Y<input value={cur.y} onChange={e=> setCur({...cur, y: parseInt(e.target.value)||0})} className="input mt-1" /></label>
            <label className="text-xs">W<input value={cur.w} onChange={e=> setCur({...cur, w: parseInt(e.target.value)||0})} className="input mt-1" /></label>
            <label className="text-xs">H<input value={cur.h} onChange={e=> setCur({...cur, h: parseInt(e.target.value)||0})} className="input mt-1" /></label>
          </div>
          <button onClick={addRect} className="btn-secondary w-full mt-3 text-sm">+ Add box</button>
          <div className="mt-3 space-y-1 max-h-[120px] overflow-auto">
            {rects.map((r,i)=> (
              <div key={i} className="flex justify-between items-center p-2 bg-black text-white rounded text-xs">
                <span>Box {i+1}: X{r.x} Y{r.y} {r.w}×{r.h}</span>
                <button onClick={()=> setRects(rects.filter((_,idx)=> idx!==i))} className="text-red-300">✕</button>
              </div>
            ))}
            {rects.length===0 && <div className="text-xs text-[#707078]">No boxes yet — add one above.</div>}
          </div>
          <button onClick={redact} disabled={!file || rects.length===0} className="btn-primary w-full mt-4">Redact & generate PDF</button>
          {url && <a href={url} download={`redacted-${file?.name}`} className="btn-primary w-full mt-3 text-sm">Download redacted PDF</a>}
        </div>
      </div>
    </div>
  );
}
