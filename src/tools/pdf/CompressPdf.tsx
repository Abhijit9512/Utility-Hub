import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument } from "pdf-lib";

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [mode, setMode] = useState<"lossless"|"lossy">("lossless");
  const [quality, setQuality] = useState(0.6);

  const compress = async () => {
    if (!file) return;
    try {
      setStatus(mode === "lossless" ? "Compressing (lossless) — re-saving with optimization..." : "Compressing (lossy) — re-rendering pages as JPEG...");
      setCompressedBlob(null);
      setCompressedUrl(null);

      if (mode === "lossless") {
        // Lossless: strip metadata, re-save with object streams
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        // Remove metadata
        pdf.setTitle("");
        pdf.setAuthor("");
        pdf.setSubject("");
        pdf.setKeywords([]);
        pdf.setProducer("UtilityHub");
        pdf.setCreator("UtilityHub");
        const out = await pdf.save({ useObjectStreams: true });
        const blob = new Blob([out as any], { type: "application/pdf" });
        setCompressedBlob(blob);
        setCompressedUrl(URL.createObjectURL(blob));
        const reduction = ((originalSize - blob.size) / originalSize * 100).toFixed(1);
        setStatus(`Done — ${ (blob.size/1024).toFixed(1)} KB vs ${(originalSize/1024).toFixed(1)} KB original (${reduction}% ${parseFloat(reduction)>=0?'saved':'larger — already optimized'}). Processed in browser.`);
      } else {
        // Lossy: render each page to canvas as JPEG with quality, rebuild PDF
        // Use pdfjs to render, then pdf-lib to embed JPEGs
        const pdfjs: any = await import("pdfjs-dist");
        // set worker
        try { pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`; } catch {}
        const data = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data });
        const pdf = await loadingTask.promise;
        const newPdf = await PDFDocument.create();
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.2 }); // slightly downscale for size
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
          const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
          const jpegBytes = await (await fetch(jpegDataUrl)).arrayBuffer();
          const img = await newPdf.embedJpg(jpegBytes);
          const newPage = newPdf.addPage([img.width, img.height]);
          newPage.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        const out = await newPdf.save();
        const blob = new Blob([out as any], { type: "application/pdf" });
        setCompressedBlob(blob);
        setCompressedUrl(URL.createObjectURL(blob));
        const reduction = ((originalSize - blob.size) / originalSize * 100).toFixed(1);
        setStatus(`Done (lossy) — ${ (blob.size/1024).toFixed(1)} KB vs ${(originalSize/1024).toFixed(1)} KB (${reduction}% ${parseFloat(reduction)>=0?'saved':'larger'}). Text becomes image — not selectable. Browser only.`);
      }
    } catch (e:any) {
      setStatus("Error: " + e.message);
    }
  };

  const onFile = (f: File) => {
    setFile(f);
    setOriginalSize(f.size);
    setCompressedBlob(null);
    setCompressedUrl(null);
    setStatus("");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] p-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white">
        <h3 className="font-black" style={{fontFamily:'Plus Jakarta Sans'}}>Compress PDF — reduce file size</h3>
        <p className="text-sm opacity-90 mt-1">Lossless (metadata strip + re-save) for text PDFs; Lossy (JPEG re-render) for scanned/image PDFs. 100% in-browser — never uploaded. Results vary — already-optimized PDFs may not shrink.</p>
      </div>

      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && onFile(f[0])} label="Drop PDF here" description="PDF only • up to 25 MB" />
        {file && <div className="mt-3 text-sm dark:text-white">Selected: <b>{file.name}</b> • {(originalSize/1024).toFixed(1)} KB</div>}

        <div className="mt-4 grid md:grid-cols-2 gap-3">
          <label className="text-sm dark:text-white">Mode
            <select value={mode} onChange={e=> setMode(e.target.value as any)} className="input mt-1">
              <option value="lossless">Lossless — keep text selectable</option>
              <option value="lossy">Lossy — image-based (smaller for scans)</option>
            </select>
          </label>
          {mode==="lossy" && (
            <label className="text-sm dark:text-white">JPEG quality: {Math.round(quality*100)}%
              <input type="range" min={0.3} max={0.9} step={0.05} value={quality} onChange={e=> setQuality(parseFloat(e.target.value))} className="w-full mt-2" />
            </label>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={compress} disabled={!file} className="btn-primary">Compress PDF</button>
          <button onClick={()=> { setFile(null); setCompressedBlob(null); setCompressedUrl(null); setStatus(""); }} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 rounded-2xl bg-slate-50 border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
        {compressedUrl && compressedBlob && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900">
            <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Compressed ready — {(compressedBlob.size/1024).toFixed(1)} KB</div>
            <a href={compressedUrl} download={`compressed-${file?.name}`} className="btn-primary mt-3 text-sm">Download compressed PDF</a>
          </div>
        )}
      </div>

      <div className="card">
        <h4 className="font-bold dark:text-white">Limitations</h4>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
          <li>Lossless only strips metadata/optimizes structure — already optimized PDFs see 2-10% at most.</li>
          <li>Lossy mode re-renders pages as images: text becomes non-selectable, smaller for scanned PDFs but larger for text-heavy PDFs if quality high.</li>
          <li>Encrypted PDFs may fail.</li>
        </ul>
      </div>
    </div>
  );
}
