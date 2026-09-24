import { useState } from "react";
import { UploadZone, FileList } from "../../components/common/UploadZone";
import { PDFDocument } from "pdf-lib";

export default function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [margin, setMargin] = useState(10);
  const [orientation, setOrientation] = useState<"portrait"|"landscape">("portrait");

  const convert = async () => {
    if (files.length===0) return;
    setStatus("Creating PDF from JPGs...");
    try {
      const pdf = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const isPng = f.type.includes("png");
        const img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage(orientation==="portrait" ? [595,842] : [842,595]);
        const pw = page.getWidth() - margin*2;
        const ph = page.getHeight() - margin*2;
        const scale = Math.min(pw / img.width, ph / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = margin + (pw - w)/2;
        const y = margin + (ph - h)/2;
        page.drawImage(img, { x, y, width: w, height: h });
      }
      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — ${files.length} JPGs → PDF (${orientation}, margin ${margin}pt). Browser only.`);
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#E30613] text-white">
        <h3 className="font-bold">JPG to PDF — images to PDF</h3>
        <p className="text-sm opacity-90 mt-1">Convert JPG/PNG to PDF, adjust orientation & margins. In your browser — no upload required.</p>
      </div>
      <div className="card">
        <UploadZone accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png" multiple onFiles={f=> setFiles(prev=> [...prev, ...f])} label="Drop JPGs here" description="JPG, PNG • multiple" />
        <FileList files={files} onRemove={i=> setFiles(files.filter((_,idx)=> idx!==i))} />
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <label className="text-sm">Orientation<select value={orientation} onChange={e=> setOrientation(e.target.value as any)} className="input mt-1"><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label>
          <label className="text-sm">Margin (pt)<input type="number" value={margin} onChange={e=> setMargin(parseInt(e.target.value)||0)} className="input mt-1" /></label>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={convert} disabled={files.length===0} className="btn-primary">Convert to PDF</button>
          <button onClick={()=> {setFiles([]); setUrl(null); setStatus("");}} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
        {url && <a href={url} download="jpg-to-pdf.pdf" className="btn-primary mt-3 text-sm">Download PDF</a>}
      </div>
    </div>
  );
}
