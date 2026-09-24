import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument } from "pdf-lib";

export default function FillPdfForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<{name:string, type:string, value:string, options?:string[]}[]>([]);
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [rawBytes, setRawBytes] = useState<Uint8Array | null>(null);

  const loadPdf = async (f: File) => {
    setFile(f);
    setStatus("Detecting form fields...");
    setUrl(null);
    setFields([]);
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const form = pdf.getForm();
      const flds = form.getFields();
      if (flds.length === 0) {
        setStatus("No AcroForm fields found. This PDF has no fillable form fields (may be flat/flattened). You can still use PDF Editor to add text.");
        setRawBytes(new Uint8Array(bytes));
        return;
      }
      const parsed = flds.map(fd => {
        const name = fd.getName();
        let type = "text";
        let options: string[] | undefined;
        try {
          const t = (fd as any).constructor.name;
          if (t.includes("CheckBox")) type = "checkbox";
          else if (t.includes("Dropdown") || t.includes("OptionList")) { type = "select"; options = (fd as any).getOptions?.() || []; }
          else if (t.includes("RadioGroup")) { type = "radio"; options = (fd as any).getOptions?.() || []; }
          else if (t.includes("Button")) type = "button";
        } catch {}
        return { name, type, value: type==="checkbox"?"false":"", options };
      });
      setFields(parsed);
      setRawBytes(new Uint8Array(bytes));
      setStatus(`Found ${parsed.length} field(s). Fill below and generate. Browser only.`);
    } catch (e:any) {
      setStatus("Error: " + e.message);
    }
  };

  const fill = async () => {
    if (!file || !rawBytes) return;
    try {
      setStatus("Filling form...");
      const pdf = await PDFDocument.load(rawBytes);
      const form = pdf.getForm();
      for (const f of fields) {
        try {
          const field = form.getField(f.name);
          const ctor = (field as any).constructor.name;
          if (ctor.includes("TextField")) {
            (field as any).setText(f.value);
          } else if (ctor.includes("CheckBox")) {
            if (f.value==="true") (field as any).check(); else (field as any).uncheck();
          } else if (ctor.includes("Dropdown") || ctor.includes("OptionList")) {
            (field as any).select(f.value);
          } else if (ctor.includes("RadioGroup")) {
            (field as any).select(f.value);
          }
        } catch (err) {
          console.warn("Field failed", f.name, err);
        }
      }
      // Optionally flatten? Keep interactive by default, but provide flattened version as well? We'll keep interactive.
      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — filled ${fields.length} field(s). Download retains form fields (interactive). Browser only.`);
    } catch (e:any) {
      setStatus("Error: " + e.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] p-5 bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
        <h3 className="font-black" style={{fontFamily:'Plus Jakarta Sans'}}>Fill PDF Form — AcroForms</h3>
        <p className="text-sm opacity-90 mt-1">Detects <code className="bg-white/20 px-1 rounded">AcroForm</code> fields via <code className="bg-white/20 px-1 rounded">pdf-lib</code>, lets you fill text/checkboxes/dropdowns, and saves a new PDF. No upload. Flat PDFs (no fields) cannot be filled — use Editor.</p>
      </div>

      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && loadPdf(f[0])} label="Drop fillable PDF here" description="Must contain AcroForm fields" />
        {file && <div className="mt-3 text-sm dark:text-white"><b>{file.name}</b> • {(file.size/1024).toFixed(1)} KB</div>}
        {status && <div className="mt-3 text-sm p-3 rounded-2xl bg-slate-50 border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
      </div>

      {fields.length>0 && (
        <div className="card">
          <h4 className="font-bold dark:text-white">Form fields ({fields.length})</h4>
          <div className="mt-4 space-y-3 max-h-[400px] overflow-auto pr-1">
            {fields.map((f, idx)=> (
              <div key={f.name} className="p-3 rounded-2xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="text-xs font-bold tracking-widest uppercase text-slate-500">{f.type} • {f.name}</div>
                {f.type==="text" && <input value={f.value} onChange={e=> setFields(fields=> fields.map((x,i)=> i===idx? {...x, value:e.target.value}:x))} placeholder="Enter text" className="input mt-2" />}
                {f.type==="checkbox" && <label className="flex items-center gap-2 mt-2 text-sm dark:text-white"><input type="checkbox" checked={f.value==="true"} onChange={e=> setFields(fields=> fields.map((x,i)=> i===idx? {...x, value: e.target.checked?"true":"false"}:x))} /> Checked</label>}
                {(f.type==="select" || f.type==="radio") && (
                  <select value={f.value} onChange={e=> setFields(fields=> fields.map((x,i)=> i===idx? {...x, value:e.target.value}:x))} className="input mt-2">
                    <option value="">— select —</option>
                    {f.options?.map(o=> <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
                {f.type==="button" && <div className="text-xs text-slate-500 mt-2">Button field — not fillable.</div>}
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={fill} className="btn-primary">Generate filled PDF</button>
            <button onClick={()=> { setFields(fields=> fields.map(f=> ({...f, value: f.type==="checkbox"?"false":""}))); setUrl(null); }} className="btn-secondary">Clear</button>
          </div>
          {url && <a href={url} download={`filled-${file?.name}`} className="btn-primary mt-3 text-sm">Download filled PDF</a>}
        </div>
      )}

      <div className="card">
        <h4 className="font-bold dark:text-white">How to create a fillable PDF?</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Create in Adobe Acrobat, LibreOffice, or Word → Export as PDF with form fields. Flat PDFs (scanned/printed) have no fields — use our PDF Editor to overlay text.</p>
      </div>
    </div>
  );
}
