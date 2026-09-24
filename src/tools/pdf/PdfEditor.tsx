import { useState, useRef, useEffect } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export default function PdfEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [text, setText] = useState("Hello UtilityHub — edited!");
  const [x, setX] = useState(50);
  const [y, setY] = useState(700);
  const [size, setSize] = useState(24);
  const [color, setColor] = useState("#2563eb");
  const [shape, setShape] = useState<"none"|"rect"|"circle">("none");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const loadPdfInfo = async (f: File) => {
    setFile(f);
    setStatus("");
    setUrl(null);
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
      setPageNum(1);
      // Generate preview of first page via pdfjs
      try {
        const pdfjs: any = await import("pdfjs-dist");
        try { pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`; } catch {}
        const data = await f.arrayBuffer();
        const doc = await pdfjs.getDocument({ data }).promise;
        const page = await doc.getPage(1);
        const viewport = page.getViewport({ scale: 0.6 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
        setPreviewDataUrl(canvas.toDataURL("image/png"));
      } catch {}
    } catch (e:any) {
      setStatus("Error loading PDF: " + e.message);
    }
  };

  const apply = async () => {
    if (!file) return;
    try {
      setStatus("Applying edits...");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = pdf.getPages();
      const idx = Math.max(0, Math.min(pageNum - 1, pages.length - 1));
      const page = pages[idx];
      const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
      const { width, height } = page.getSize();

      // Hex to rgb
      const hex = color.replace("#", "");
      const r = parseInt(hex.substring(0,2),16)/255;
      const g = parseInt(hex.substring(2,4),16)/255;
      const b = parseInt(hex.substring(4,6),16)/255;

      if (text.trim()) {
        page.drawText(text, { x: Math.min(x, width-50), y: Math.min(y, height-20), size, font: helvetica, color: rgb(r,g,b) });
      }
      if (shape === "rect") {
        page.drawRectangle({ x: Math.min(x, width-80), y: Math.min(y, height-60)-30, width: 120, height: 60, borderColor: rgb(r,g,b), borderWidth: 2, color: rgb(r,g,b), opacity: 0.1 });
      } else if (shape === "circle") {
        page.drawCircle({ x: Math.min(x+40, width-40), y: Math.min(y, height-40)-20, size: 30, borderColor: rgb(r,g,b), borderWidth: 2, color: rgb(r,g,b), opacity: 0.1 });
      }
      if (imageFile) {
        const imgBytes = await imageFile.arrayBuffer();
        const isPng = imageFile.type.includes("png");
        const img = isPng ? await pdf.embedPng(imgBytes) : await pdf.embedJpg(imgBytes);
        const iw = 100, ih = 100 * (img.height / img.width);
        page.drawImage(img, { x: Math.min(x, width-iw), y: Math.min(y, height-ih)-50, width: iw, height: ih });
      }

      // Add footer note
      page.drawText("Edited with UtilityHub — browser only", { x: 20, y: 20, size: 8, font: helvetica, color: rgb(0.6,0.6,0.7) });

      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — edited page ${pageNum}/${pages.length}: text${shape!=="none" ? " + shape" : ""}${imageFile?" + image":""} added. Browser only.`);
    } catch (e:any) {
      setStatus("Error: " + e.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <h3 className="font-black" style={{fontFamily:'Plus Jakarta Sans'}}>PDF Editor — add text, shapes, images</h3>
        <p className="text-sm opacity-80 mt-1">Lightweight editor via <code className="bg-white/10 px-1 rounded">pdf-lib</code>. Add text at (x,y), optional rectangle/circle, and overlay image. Not a full Acrobat — but works in browser, no upload.</p>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="card">
          <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && loadPdfInfo(f[0])} label="Drop PDF to edit" />
          {file && <div className="mt-3 text-sm dark:text-white"><b>{file.name}</b> • {pageCount} pages</div>}
          {previewDataUrl && <div className="mt-4 rounded-2xl overflow-hidden border dark:border-slate-700"><img src={previewDataUrl} alt="PDF preview page 1" className="w-full" /><div className="text-xs text-center p-2 bg-slate-50 dark:bg-slate-800 dark:text-slate-400">Preview — page 1 (edits apply to selected page)</div></div>}
        </div>

        <div className="card space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm dark:text-white">Page
              <input type="number" min={1} max={pageCount||1} value={pageNum} onChange={e=> setPageNum(parseInt(e.target.value)||1)} className="input mt-1" />
              <span className="text-xs text-slate-500">1 – {pageCount||1}</span>
            </label>
            <label className="text-sm dark:text-white">Font size
              <input type="number" value={size} onChange={e=> setSize(parseInt(e.target.value)||12)} className="input mt-1" />
            </label>
          </div>
          <label className="text-sm dark:text-white">Text to add
            <input value={text} onChange={e=> setText(e.target.value)} placeholder="Your text" className="input mt-1" />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm dark:text-white">X
              <input type="number" value={x} onChange={e=> setX(parseInt(e.target.value)||0)} className="input mt-1" />
            </label>
            <label className="text-sm dark:text-white">Y
              <input type="number" value={y} onChange={e=> setY(parseInt(e.target.value)||0)} className="input mt-1" />
            </label>
            <label className="text-sm dark:text-white">Color
              <input type="color" value={color} onChange={e=> setColor(e.target.value)} className="w-full h-10 rounded-xl mt-1" />
            </label>
          </div>
          <div className="flex gap-2">
            {[
              ["none","No shape"],
              ["rect","Rectangle"],
              ["circle","Circle"],
            ].map(([v,l])=> <button key={v} onClick={()=> setShape(v as any)} className={`flex-1 py-2 rounded-xl border text-sm font-semibold ${shape===v?'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 dark:text-white'}`}>{l}</button>)}
          </div>
          <label className="text-sm dark:text-white">Overlay image (optional)
            <input type="file" accept="image/*" onChange={e=> setImageFile(e.target.files?.[0]||null)} className="input mt-1" />
          </label>
          <div className="text-xs text-slate-500 dark:text-slate-400">Coordinates: (0,0) bottom-left, A4 is 595×842. Preview helps estimate. Text at X,Y.</div>
          <div className="flex gap-3">
            <button onClick={apply} disabled={!file} className="btn-primary flex-1">Apply & generate PDF</button>
            <button onClick={()=> { setFile(null); setUrl(null); setStatus(""); setPreviewDataUrl(null); }} className="btn-secondary">Reset</button>
          </div>
          {status && <div className="text-sm p-3 rounded-2xl bg-slate-50 border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
          {url && <a href={url} download={`edited-${file?.name}`} className="btn-primary w-full text-sm">Download edited PDF</a>}
        </div>
      </div>
    </div>
  );
}
