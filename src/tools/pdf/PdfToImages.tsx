import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";

export default function PdfToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [scale, setScale] = useState(1.5);

  const convert = async () => {
    if (!file) return;
    try {
      setStatus("Loading PDF...");
      setImages([]);
      // dynamic import pdfjs
      const pdfjs: any = await import("pdfjs-dist");
      // set worker
      const version = pdfjs.version;
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
      // fallback if cdn fails, try unpkg
      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      setStatus(`Rendering ${pdf.numPages} page(s)...`);
      const imgs: string[] = [];
      for (let i=1;i<=pdf.numPages;i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
        imgs.push(canvas.toDataURL("image/png"));
      }
      setImages(imgs);
      setStatus(`Done — ${imgs.length} images generated in your browser`);
    } catch (e:any) {
      setStatus("Error: " + e.message + " (try smaller PDF or different browser)");
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Convert each PDF page to PNG images, 100% client-side via PDF.js. No upload.</p>
        <UploadZone accept=".pdf,application/pdf" onFiles={(f)=> setFile(f[0]||null)} />
        {file && <div className="mt-2 text-sm dark:text-white">{file.name}</div>}
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm dark:text-white">Quality (scale):</label>
          <input type="range" min={0.8} max={3} step={0.1} value={scale} onChange={e=> setScale(parseFloat(e.target.value))} />
          <span className="text-sm dark:text-white">{scale.toFixed(1)}x</span>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={convert} disabled={!file} className="btn-primary">Convert to images</button>
          <button onClick={()=>{setFile(null); setImages([]); setStatus("");}} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
        {images.length>0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {images.map((src,i)=> (
              <div key={i} className="border rounded-xl overflow-hidden dark:border-slate-700">
                <img src={src} alt={`Page ${i+1}`} className="w-full" />
                <div className="p-2 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                  <span className="text-xs dark:text-slate-300">Page {i+1}</span>
                  <a href={src} download={`page-${i+1}.png`} className="text-xs text-blue-600 dark:text-blue-400">Download PNG</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
