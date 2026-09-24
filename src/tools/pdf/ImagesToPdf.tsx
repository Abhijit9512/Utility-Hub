import { useState } from "react";
import { UploadZone, FileList } from "../../components/common/UploadZone";
import { PDFDocument } from "pdf-lib";

export default function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const convert = async () => {
    if (files.length===0) return;
    setStatus("Creating PDF...");
    try {
      const pdf = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        let img;
        if (f.type.includes("png")) img = await pdf.embedPng(bytes);
        else img = await pdf.embedJpg(bytes);
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x:0, y:0, width: img.width, height: img.height });
      }
      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — ${files.length} images → PDF, in browser`);
    } catch (e:any) { setStatus("Error: "+e.message); }
  };

  return (
    <div className="card space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">Convert JPG/PNG images to a single PDF, client-side. Images are ordered as selected.</p>
      <UploadZone accept="image/*" multiple onFiles={(f)=> setFiles(prev=>[...prev, ...f.filter(x=> x.type.startsWith("image/"))])} label="Drop images here" description="JPG, PNG, WebP • multiple" />
      <FileList files={files} onRemove={(i)=> setFiles(files.filter((_,idx)=> idx!==i))} />
      <div className="flex gap-3">
        <button onClick={convert} disabled={files.length===0} className="btn-primary">Create PDF</button>
        <button onClick={()=>{setFiles([]); setUrl(null); setStatus("");}} className="btn-secondary">Reset</button>
      </div>
      {status && <div className="text-sm p-3 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
      {url && <a href={url} download="images.pdf" className="btn-primary">Download images.pdf</a>}
    </div>
  );
}
