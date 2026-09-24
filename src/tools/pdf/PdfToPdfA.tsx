import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument } from "pdf-lib";

export default function PdfToPdfA() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const convert = async () => {
    if (!file) return;
    try {
      setStatus("Converting to PDF/A-like (archival)...");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      // Set PDF/A-like metadata
      pdf.setTitle(pdf.getTitle() || file.name);
      pdf.setCreator("UtilityHub PDF/A");
      pdf.setProducer("UtilityHub PDF/A Converter — browser");
      pdf.setCreationDate(new Date());
      pdf.setModificationDate(new Date());
      // Add XMP-like info: we cannot fully validate ISO, but we embed standard info
      // For true PDF/A, need to embed fonts, color profile — not fully achievable client-side
      // We re-save with object streams and add metadata
      const out = await pdf.save({ useObjectStreams: true, addDefaultPage: false } as any);
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus("Done — re-saved with archival metadata (PDF/A-like). Note: True ISO 19005 validation requires embedding fonts/color profiles — this is a best-effort browser conversion, not certified PDF/A.");
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#33333B] text-white">
        <h3 className="font-bold">PDF to PDF/A — archival version</h3>
        <p className="text-sm opacity-70 mt-1">Re-save with PDF/A-like metadata via <code className="bg-white/10 px-1 rounded">pdf-lib</code>. Not certified ISO — but preserves formatting for long-term. No upload.</p>
      </div>
      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && setFile(f[0])} label="Drop PDF to convert" />
        {file && <div className="mt-2 text-sm"><b>{file.name}</b></div>}
        <div className="flex gap-3 mt-4">
          <button onClick={convert} disabled={!file} className="btn-primary">Convert to PDF/A</button>
          <button onClick={()=> {setFile(null); setUrl(null); setStatus("");}} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
        {url && <a href={url} download={`${file?.name.replace(/\.pdf$/i,"")}_PDFA.pdf`} className="btn-primary mt-3 text-sm">Download PDF/A</a>}
      </div>
      <div className="card">
        <h4 className="font-bold">What is PDF/A?</h4>
        <p className="text-sm text-[#707078] mt-1">ISO-standardized for long-term archiving. True PDF/A requires font embedding, device-independent color, and no encryption. Our browser conversion does metadata + re-save; for certified conversion, use Adobe.</p>
      </div>
    </div>
  );
}
