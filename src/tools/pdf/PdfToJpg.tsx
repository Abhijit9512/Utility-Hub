import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [quality, setQuality] = useState(0.85);

  const convert = async () => {
    if (!file) return;
    try {
      setStatus("Rendering PDF pages to JPG...");
      setImages([]);
      const pdfjs: any = await import("pdfjs-dist");
      try { pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`; } catch {}
      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      const out: string[] = [];
      for (let i=1;i<=pdf.numPages;i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.8 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
        out.push(canvas.toDataURL("image/jpeg", quality));
      }
      setImages(out);
      setStatus(`Done — ${out.length} pages → JPG, in browser. Quality ${Math.round(quality*100)}%`);
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#E30613] text-white">
        <h3 className="font-bold">PDF to JPG — each page as JPG</h3>
        <p className="text-sm opacity-90 mt-1">Render PDF pages to JPG via PDF.js + Canvas, quality slider. No upload.</p>
      </div>
      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && setFile(f[0])} label="Drop PDF here" />
        {file && <div className="mt-2 text-sm"><b>{file.name}</b></div>}
        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm">JPG quality {Math.round(quality*100)}%<input type="range" min={0.4} max={0.95} step={0.05} value={quality} onChange={e=> setQuality(parseFloat(e.target.value))} className="w-full" /></label>
          <button onClick={convert} disabled={!file} className="btn-primary">Convert to JPG</button>
          <button onClick={()=> {setFile(null); setImages([]); setStatus("");}} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
        {images.length>0 && <div className="grid md:grid-cols-2 gap-4 mt-4">{images.map((src,i)=> <div key={i} className="border rounded-xl overflow-hidden dark:border-slate-700"><img src={src} alt={`Page ${i+1}`} className="w-full"/><div className="p-2 flex justify-between bg-[#F6F6F8] dark:bg-slate-800"><span className="text-xs">Page {i+1}</span><a href={src} download={`page-${i+1}.jpg`} className="text-xs text-[#E30613]">Download JPG</a></div></div>)}</div>}
      </div>
    </div>
  );
}
