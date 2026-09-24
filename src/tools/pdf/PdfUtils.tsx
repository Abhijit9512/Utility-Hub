import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument, degrees } from "pdf-lib";

export function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(90);
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const run = async () => {
    if (!file) return;
    setStatus("Rotating...");
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      pdf.getPages().forEach(p=> p.setRotation(degrees(angle)));
      const out = await pdf.save();
      setUrl(URL.createObjectURL(new Blob([out as any], { type: "application/pdf" })));
      setStatus("Done — browser only");
    } catch(e:any){ setStatus("Error: "+e.message); }
  };
  return (
    <div className="card">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Rotate all pages 90/180/270°. In-browser only.</p>
      <UploadZone accept=".pdf" onFiles={f=>setFile(f[0]||null)} />
      {file && <div className="text-sm mt-2 dark:text-white">{file.name}</div>}
      <div className="flex gap-2 mt-3">{[90,180,270].map(a=> <button key={a} onClick={()=>setAngle(a)} className={`px-4 py-2 rounded-xl border ${angle===a?'bg-blue-600 text-white border-blue-600':'bg-white dark:bg-slate-900 dark:text-white'}`}>{a}°</button>)}</div>
      <div className="flex gap-3 mt-4"><button onClick={run} disabled={!file} className="btn-primary">Rotate PDF</button><button onClick={()=>{setFile(null); setUrl(null); setStatus("");}} className="btn-secondary">Reset</button></div>
      {status && <div className="mt-3 text-sm p-3 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
      {url && <a href={url} download="rotated.pdf" className="btn-primary mt-3">Download</a>}
    </div>
  );
}

export function PdfInfo() {
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<any>(null);
  const [status, setStatus] = useState("");
  const analyze = async () => {
    if(!file) return;
    setStatus("Reading...");
    try{
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setInfo({
        pages: pdf.getPageCount(),
        title: pdf.getTitle() || "—",
        author: pdf.getAuthor() || "—",
        subject: pdf.getSubject() || "—",
        creator: pdf.getCreator() || "—",
        producer: pdf.getProducer() || "—",
        size: (file.size/1024).toFixed(1)+" KB",
      });
      setStatus("Done");
    }catch(e:any){ setStatus("Error: "+e.message); }
  };
  return (
    <div className="card">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">View PDF metadata & page count locally.</p>
      <UploadZone accept=".pdf" onFiles={f=>setFile(f[0]||null)} />
      {file && <div className="text-sm mt-2 dark:text-white">{file.name}</div>}
      <button onClick={analyze} disabled={!file} className="btn-primary mt-3">Analyze PDF</button>
      {status && <div className="text-sm mt-3 p-2 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
      {info && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {Object.entries(info).map(([k,v])=> <div key={k} className="p-3 bg-slate-50 rounded-xl dark:bg-slate-800"><div className="text-xs text-slate-500 uppercase">{k}</div><div className="font-medium dark:text-white break-all">{String(v)}</div></div>)}
        </div>
      )}
    </div>
  );
}

export function PdfTextExtract() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const extract = async () => {
    if(!file) return;
    setStatus("Extracting text...");
    try{
      const pdfjs:any = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({data}).promise;
      let out="";
      for(let i=1;i<=pdf.numPages;i++){
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((it:any)=> it.str).join(" ");
        out += `\n--- Page ${i} ---\n` + strings + "\n";
      }
      setText(out.trim() || "No extractable text found (scanned PDF?)");
      setStatus(`Done — ${pdf.numPages} pages`);
    }catch(e:any){ setStatus("Error: "+e.message); }
  };
  return (
    <div className="card">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Extract text client-side via PDF.js. Scanned images need OCR (not included).</p>
      <UploadZone accept=".pdf" onFiles={f=>setFile(f[0]||null)} />
      <div className="flex gap-3 mt-3"><button onClick={extract} disabled={!file} className="btn-primary">Extract text</button><button onClick={()=>{setText(""); setStatus(""); setFile(null);}} className="btn-secondary">Reset</button></div>
      {status && <div className="text-sm mt-3 p-2 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
      {text && <><textarea value={text} readOnly rows={12} className="input mt-3 font-mono text-xs" /><button onClick={()=>navigator.clipboard.writeText(text)} className="btn-secondary mt-2 text-sm">Copy text</button></>}
    </div>
  );
}

export function WatermarkPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const add = async () => {
    if(!file) return;
    setStatus("Adding watermark...");
    try{
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = pdf.getPages();
      for(const p of pages){
        const { width, height } = p.getSize();
        p.drawText(text, { x: width/2 - text.length*4, y: height/2, size: 32, opacity: 0.15, rotate: degrees(30) });
      }
      const out = await pdf.save();
      setUrl(URL.createObjectURL(new Blob([out as any],{type:"application/pdf"})));
      setStatus("Done");
    }catch(e:any){ setStatus("Error: "+e.message); }
  };
  return (
    <div className="card">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Add text watermark diagonally on every page, client-side.</p>
      <UploadZone accept=".pdf" onFiles={f=>setFile(f[0]||null)} />
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Watermark text" className="input mt-3" />
      <div className="flex gap-3 mt-3"><button onClick={add} disabled={!file||!text} className="btn-primary">Add watermark</button><button onClick={()=>{setFile(null); setUrl(null); setStatus("");}} className="btn-secondary">Reset</button></div>
      {status && <div className="mt-3 text-sm p-2 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
      {url && <a href={url} download="watermarked.pdf" className="btn-primary mt-3">Download</a>}
    </div>
  );
}

export function PageNumbersPdf() {
  const [file, setFile] = useState<File|null>(null);
  const [url, setUrl] = useState<string|null>(null);
  const [status,setStatus]=useState("");
  const add = async()=>{
    if(!file) return;
    setStatus("Adding page numbers...");
    try{
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      pdf.getPages().forEach((p,i)=>{
        const {width, height} = p.getSize();
        p.drawText(`${i+1} / ${pdf.getPageCount()}`, { x: width/2 -20, y: 20, size: 10, opacity: 0.7 });
      });
      const out = await pdf.save();
      setUrl(URL.createObjectURL(new Blob([out as any],{type:"application/pdf"})));
      setStatus("Done");
    }catch(e:any){ setStatus("Error: "+e.message); }
  };
  return (
    <div className="card">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Add "1 / N" footers to each page, in browser.</p>
      <UploadZone accept=".pdf" onFiles={f=>setFile(f[0]||null)} />
      <div className="flex gap-3 mt-3"><button onClick={add} disabled={!file} className="btn-primary">Add page numbers</button><button onClick={()=>{setFile(null); setUrl(null); setStatus("");}} className="btn-secondary">Reset</button></div>
      {status && <div className="mt-3 text-sm p-2 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
      {url && <a href={url} download="pagenumbered.pdf" className="btn-primary mt-3">Download</a>}
    </div>
  );
}
