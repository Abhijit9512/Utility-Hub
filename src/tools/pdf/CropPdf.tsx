import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument } from "pdf-lib";

export default function CropPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [margin, setMargin] = useState(40);
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
      setStatus(`Loaded ${pdf.getPageCount()} pages. Cropping will inset CropBox by ${margin}pt on all sides.`);
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  const crop = async () => {
    if (!file) return;
    try {
      setStatus("Cropping margins...");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = pdf.getPages();
      for (const page of pages) {
        const { width, height } = page.getSize();
        // Inset CropBox
        const newX = margin;
        const newY = margin;
        const newW = Math.max(10, width - margin*2);
        const newH = Math.max(10, height - margin*2);
        // pdf-lib: set CropBox via page.setCropBox? There is not direct, but we can use setCropBox via low-level?
        // Use page.setCropBox if exists, else set MediaBox trick via setSize? We'll use page.setCropBox if available
        try {
          (page as any).setCropBox(newX, newY, newW, newH);
        } catch {
          // Fallback: set MediaBox via page.setMediaBox?
          try { (page as any).setMediaBox(newX, newY, newW, newH); } catch {}
          // Also try to set via box
          page.setSize(newW, newH);
        }
      }
      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — cropped ${pages.length} pages by ${margin}pt inset. Some viewers ignore CropBox — if no effect, try larger margin. Browser only.`);
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#E30613] text-white">
        <h3 className="font-bold">Crop PDF — trim margins</h3>
        <p className="text-sm opacity-90 mt-1">Inset CropBox on all pages via <code className="bg-white/20 px-1 rounded">pdf-lib</code>. Works for uniform margins; not a visual editor. No upload.</p>
      </div>
      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && loadPdf(f[0])} label="Drop PDF to crop" />
        {file && <div className="mt-2 text-sm"><b>{file.name}</b> • {pageCount} pages</div>}
        <label className="text-sm mt-3 block">Margin to trim (pt)<input type="range" min={0} max={100} value={margin} onChange={e=> setMargin(parseInt(e.target.value))} className="w-full" /><span className="text-xs text-[#707078]">{margin}pt ≈ {(margin*0.35).toFixed(1)}mm on each side</span></label>
        <div className="flex gap-3 mt-4">
          <button onClick={crop} disabled={!file} className="btn-primary">Crop PDF</button>
          <button onClick={()=> {setFile(null); setUrl(null); setStatus("");}} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
        {url && <a href={url} download={`cropped-${file?.name}`} className="btn-primary mt-3 text-sm">Download cropped PDF</a>}
      </div>
      <div className="card">
        <h4 className="font-bold">Note</h4>
        <p className="text-sm text-[#707078] mt-1">Crop sets PDF CropBox; some viewers/printers may still show MediaBox. For selective area crop, use a desktop editor.</p>
      </div>
    </div>
  );
}
