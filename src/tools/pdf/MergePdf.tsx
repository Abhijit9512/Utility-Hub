import { useState } from "react";
import { UploadZone, FileList } from "../../components/common/UploadZone";
import { PDFDocument } from "pdf-lib";

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const merge = async () => {
    if (files.length < 2) { setStatus("Select at least 2 PDFs"); return; }
    try {
      setStatus("Merging...");
      const merged = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const out = await merged.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
      setStatus("Done — processed in your browser");
    } catch (e:any) {
      setStatus("Failed: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="font-semibold dark:text-white mb-3">Merge PDF — browser only</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Your files are processed in your browser and are not uploaded to our server. Select 2+ PDFs in the order you want them merged.</p>
        <UploadZone accept=".pdf,application/pdf" multiple onFiles={(f)=> setFiles(prev=> [...prev, ...f])} label="Drop PDFs here or click to browse" description="PDF only • order matters" />
        <FileList files={files} onRemove={(i)=> setFiles(files.filter((_,idx)=>idx!==i))} />
        <div className="flex gap-3 mt-4">
          <button onClick={merge} className="btn-primary" disabled={files.length<2}>Merge PDFs</button>
          <button onClick={()=>{setFiles([]); setResultUrl(null); setResultBlob(null); setStatus("");}} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm px-3 py-2 rounded-xl bg-slate-50 border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
        {resultUrl && resultBlob && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl dark:bg-green-950/20 dark:border-green-900">
            <div className="text-sm font-medium text-green-800 dark:text-green-300">Merged successfully — {files.length} files</div>
            <a href={resultUrl} download="merged.pdf" className="btn-primary mt-3">Download merged.pdf</a>
          </div>
        )}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">Limitations: Encrypted PDFs may fail. Large files may be slow on low-memory devices.</div>
    </div>
  );
}
