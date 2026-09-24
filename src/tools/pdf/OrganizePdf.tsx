import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument, degrees } from "pdf-lib";

export default function OrganizePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [deleteSet, setDeleteSet] = useState<Set<number>>(new Set());
  const [rotateMap, setRotateMap] = useState<Record<number, number>>({});
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const loadPdf = async (f: File) => {
    setFile(f);
    setStatus("");
    setUrl(null);
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const n = pdf.getPageCount();
      setPageCount(n);
      setOrder(Array.from({length:n}, (_,i)=> i));
      setDeleteSet(new Set());
      setRotateMap({});
      setStatus(`Loaded ${n} pages. Drag to reorder (via buttons), mark delete, rotate per page.`);
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  const move = (idx:number, dir:number) => {
    const newOrder = [...order];
    const pos = newOrder.indexOf(idx);
    const newPos = pos + dir;
    if (newPos <0 || newPos >= newOrder.length) return;
    newOrder.splice(pos,1);
    newOrder.splice(newPos,0,idx);
    setOrder(newOrder);
  };

  const toggleDelete = (idx:number) => {
    const s = new Set(deleteSet);
    if (s.has(idx)) s.delete(idx); else s.add(idx);
    setDeleteSet(s);
  };

  const rotate = (idx:number) => {
    const cur = rotateMap[idx] || 0;
    setRotateMap({...rotateMap, [idx]: (cur+90)%360});
  };

  const apply = async () => {
    if (!file) return;
    try {
      setStatus("Building organized PDF...");
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const dest = await PDFDocument.create();
      const keep = order.filter(i=> !deleteSet.has(i));
      if (keep.length===0) throw new Error("No pages left — uncheck delete.");
      const copied = await dest.copyPages(src, keep);
      copied.forEach((p, i) => {
        const origIdx = keep[i];
        const rot = rotateMap[origIdx] || 0;
        if (rot) p.setRotation(degrees(rot));
        dest.addPage(p);
      });
      const out = await dest.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — ${keep.length}/${pageCount} pages kept, order changed, rotations applied. Browser only.`);
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#33333B] text-white">
        <h3 className="font-bold">Organize PDF — reorder, delete, rotate pages</h3>
        <p className="text-sm opacity-70 mt-1">Sort, delete or rotate pages however you like — 100% in your browser.</p>
      </div>
      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && loadPdf(f[0])} label="Drop PDF to organize" />
        {file && <div className="mt-3 text-sm"><b>{file.name}</b> • {pageCount} pages</div>}
        {order.length>0 && (
          <div className="mt-4 space-y-2 max-h-[380px] overflow-auto pr-1">
            {order.map((origIdx) => {
              const pos = order.indexOf(origIdx);
              const isDeleted = deleteSet.has(origIdx);
              const rot = rotateMap[origIdx]||0;
              return (
                <div key={origIdx} className={`flex items-center gap-2 p-3 rounded-xl border ${isDeleted?'bg-red-50 border-red-200 opacity-60':'bg-white dark:bg-slate-900 dark:border-slate-700'}`}>
                  <div className="w-8 h-8 rounded bg-[#F6F6F8] dark:bg-slate-800 flex items-center justify-center text-xs font-bold">{origIdx+1}</div>
                  <div className="flex-1 text-sm font-medium">Page {origIdx+1} {rot?`• ${rot}°`:''} {isDeleted&&'(deleted)'}</div>
                  <button onClick={()=> move(origIdx,-1)} disabled={pos===0} className="w-7 h-7 rounded bg-white border text-xs disabled:opacity-30">↑</button>
                  <button onClick={()=> move(origIdx,1)} disabled={pos===order.length-1} className="w-7 h-7 rounded bg-white border text-xs disabled:opacity-30">↓</button>
                  <button onClick={()=> rotate(origIdx)} className="px-2 py-1 rounded bg-[#F6F6F8] text-xs font-bold">↻ {rot}°</button>
                  <button onClick={()=> toggleDelete(origIdx)} className={`px-2 py-1 rounded text-xs font-bold ${isDeleted?'bg-emerald-500 text-white':'bg-red-500 text-white'}`}>{isDeleted?'Undo':'Delete'}</button>
                </div>
              );
            })}
          </div>
        )}
        {order.length>0 && (
          <div className="flex gap-3 mt-4">
            <button onClick={apply} className="btn-primary">Save organized PDF</button>
            <button onClick={()=> {if(file) loadPdf(file); setUrl(null);}} className="btn-secondary">Reset</button>
          </div>
        )}
        {status && <div className="mt-3 text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
        {url && <a href={url} download={`organized-${file?.name}`} className="btn-primary mt-3 text-sm">Download PDF</a>}
      </div>
    </div>
  );
}
