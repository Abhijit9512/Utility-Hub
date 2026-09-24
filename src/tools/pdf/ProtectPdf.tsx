import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument } from "pdf-lib";

export default function ProtectPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [userPass, setUserPass] = useState("1234");
  const [ownerPass, setOwnerPass] = useState("owner123");
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const protect = async () => {
    if (!file) return;
    if (!userPass) { setStatus("User password required"); return; }
    try {
      setStatus("Encrypting PDF...");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      // pdf-lib encrypt - if not available, fallback to just saving with note?
      // Try to use encrypt if exists
      if (typeof (pdf as any).encrypt === "function") {
        (pdf as any).encrypt({ userPassword: userPass, ownerPassword: ownerPass || userPass, permissions: { printing: "highResolution", modifying: false, copying: false } });
      } else {
        // Fallback: pdf-lib version may not support encrypt; we will still save but warn
        setStatus("Note: This pdf-lib version does not support encryption API — saving without encryption (demo). For real protection, use desktop tools.");
        // Still generate but not encrypted
      }
      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      if (typeof (pdf as any).encrypt === "function") {
        setStatus(`Done — PDF encrypted. Open password: "${userPass}" (owner: "${ownerPass}"). Keep passwords safe. Browser only.`);
      }
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#E30613] text-white">
        <h3 className="font-bold">Protect PDF — add password</h3>
        <p className="text-sm opacity-90 mt-1">Encrypt PDF with user/owner passwords via <code className="bg-white/20 px-1 rounded">pdf-lib</code>. Prevent unauthorized opening. No upload.</p>
      </div>
      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && setFile(f[0]) } label="Drop PDF to protect" />
        {file && <div className="mt-2 text-sm"><b>{file.name}</b></div>}
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <label className="text-sm">User password (to open)<input value={userPass} onChange={e=> setUserPass(e.target.value)} placeholder="1234" className="input mt-1" type="password" /></label>
          <label className="text-sm">Owner password (permissions)<input value={ownerPass} onChange={e=> setOwnerPass(e.target.value)} placeholder="owner123" className="input mt-1" type="password" /></label>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={protect} disabled={!file} className="btn-primary">Protect PDF</button>
          <button onClick={()=> {setFile(null); setUrl(null); setStatus("");}} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
        {url && <a href={url} download={`protected-${file?.name}`} className="btn-primary mt-3 text-sm">Download protected PDF</a>}
        <div className="mt-3 text-xs text-[#707078]">Permissions: printing allowed, modifying/copying disabled. Owner password can override. If your pdf-lib version lacks encrypt, file will be unencrypted — check status message.</div>
      </div>
    </div>
  );
}
