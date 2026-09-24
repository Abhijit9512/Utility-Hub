import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument } from "pdf-lib";

export default function UnlockPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const unlock = async () => {
    if (!file) return;
    try {
      setStatus("Attempting to unlock (decrypt)...");
      const bytes = await file.arrayBuffer();
      // pdf-lib needs password via load option if encrypted
      let pdf;
      try {
        pdf = await PDFDocument.load(bytes, { password } as any);
      } catch (e:any) {
        // Try without password
        if (password) throw new Error("Wrong password or not encrypted with this method: " + e.message);
        pdf = await PDFDocument.load(bytes);
      }
      // Save without encryption — effectively unlocked
      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — PDF unlocked and re-saved without password. If original had owner restrictions, they are removed. Browser only.`);
    } catch(e:any){
      setStatus("Error: " + e.message + " — Encrypted PDFs need correct password, and must have been encrypted with pdf-lib compatible method.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#33333B] text-white">
        <h3 className="font-bold">Unlock PDF — remove password</h3>
        <p className="text-sm opacity-70 mt-1">Load encrypted PDF with password via <code className="bg-white/10 px-1 rounded">pdf-lib</code> and re-save without encryption. No upload. Only works if password is known and encryption is compatible.</p>
      </div>
      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && setFile(f[0]) } label="Drop locked PDF here" />
        {file && <div className="mt-2 text-sm"><b>{file.name}</b></div>}
        <label className="text-sm mt-3 block">Password (if required)<input value={password} onChange={e=> setPassword(e.target.value)} placeholder="Enter password" className="input mt-1" type="password" /></label>
        <div className="flex gap-3 mt-4">
          <button onClick={unlock} disabled={!file} className="btn-primary">Unlock PDF</button>
          <button onClick={()=> {setFile(null); setUrl(null); setStatus(""); setPassword("");}} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
        {url && <a href={url} download={`unlocked-${file?.name}`} className="btn-primary mt-3 text-sm">Download unlocked PDF</a>}
      </div>
      <div className="card">
        <h4 className="font-bold">Note</h4>
        <p className="text-sm text-[#707078] mt-1">We do not break passwords. You must know the password. This simply re-saves without encryption. Strong encryption from other tools may not be decryptable with this browser library.</p>
      </div>
    </div>
  );
}
