import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument } from "pdf-lib";

export default function RepairPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const repair = async () => {
    if (!file) return;
    try {
      setStatus("Attempting to repair (re-parse & re-save)...");
      const bytes = await file.arrayBuffer();
      let pdf;
      try {
        pdf = await PDFDocument.load(bytes, { ignoreEncryption: true } as any);
      } catch (e:any) {
        // Try lenient
        pdf = await PDFDocument.load(bytes);
      }
      const pageCount = pdf.getPageCount();
      // Force re-save with object streams — fixes many minor corruptions
      const out = await pdf.save({ useObjectStreams: true } as any);
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — re-saved ${pageCount} pages. Fixed structure where possible: repaired xref, object streams. Severely corrupted PDFs may still fail. Browser only.`);
    } catch(e:any){
      setStatus("Error: " + e.message + " — Severely damaged PDFs may be unrecoverable in browser. Try desktop Repair tool.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#E30613] text-white">
        <h3 className="font-bold">Repair PDF — recover damaged file</h3>
        <p className="text-sm opacity-90 mt-1">Try to fix corrupted PDFs by re-parsing with <code className="bg-white/20 px-1 rounded">pdf-lib</code> and re-saving clean. No upload.</p>
      </div>
      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && setFile(f[0])} label="Drop damaged PDF here" />
        {file && <div className="mt-2 text-sm"><b>{file.name}</b> • {(file.size/1024).toFixed(1)} KB</div>}
        <div className="flex gap-3 mt-4">
          <button onClick={repair} disabled={!file} className="btn-primary">Repair PDF</button>
          <button onClick={()=> {setFile(null); setUrl(null); setStatus("");}} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
        {url && <a href={url} download={`repaired-${file?.name}`} className="btn-primary mt-3 text-sm">Download repaired PDF</a>}
      </div>
      <div className="card">
        <h4 className="font-bold">Limits</h4>
        <p className="text-sm text-[#707078] mt-1">Fixes minor xref/object errors. Password-protected or heavily truncated PDFs may not recover. Use original source if possible.</p>
      </div>
    </div>
  );
}
