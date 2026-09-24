import { useRef, useState, useEffect } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument, rgb } from "pdf-lib";

export default function SignPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [x, setX] = useState(200);
  const [y, setY] = useState(120);
  const [typedName, setTypedName] = useState("John Doe");
  const [mode, setMode] = useState<"draw"|"type"|"upload">("draw");
  const [uploadedSig, setUploadedSig] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const loadPdf = async (f: File) => {
    setFile(f);
    setStatus("");
    setUrl(null);
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
    } catch (e:any) { setStatus("Error: " + e.message); }
  };

  // signature pad
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f172a";
    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = (e as TouchEvent).touches?.[0];
      const clientX = t ? t.clientX : (e as MouseEvent).clientX;
      const clientY = t ? t.clientY : (e as MouseEvent).clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };
    const start = (e: any) => { drawing.current = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); };
    const move = (e: any) => { if (!drawing.current) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); };
    const end = () => { drawing.current = false; };
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false } as any);
    canvas.addEventListener("touchmove", move, { passive: false } as any);
    window.addEventListener("touchend", end);
    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      canvas.removeEventListener("touchstart", start as any);
      canvas.removeEventListener("touchmove", move as any);
      window.removeEventListener("touchend", end);
    };
  }, [mode]);

  const clearCanvas = () => {
    const c = canvasRef.current;
    if (c) c.getContext("2d")!.clearRect(0,0,c.width,c.height);
  };

  const sign = async () => {
    if (!file) return;
    try {
      setStatus("Embedding signature...");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = pdf.getPages();
      const idx = Math.max(0, Math.min(pageNum-1, pages.length-1));
      const page = pages[idx];
      const { width, height } = page.getSize();

      let pngBytes: ArrayBuffer | null = null;
      let pngDataUrl: string | null = null;

      if (mode === "draw") {
        const c = canvasRef.current!;
        // Check if empty
        const blank = document.createElement("canvas");
        blank.width = c.width; blank.height = c.height;
        if (c.toDataURL() === blank.toDataURL()) throw new Error("Please draw your signature first.");
        pngDataUrl = c.toDataURL("image/png");
        pngBytes = await (await fetch(pngDataUrl)).arrayBuffer();
      } else if (mode === "upload" && uploadedSig) {
        pngBytes = await uploadedSig.arrayBuffer();
        // If jpg, need jpg embed; handle both
        const isPng = uploadedSig.type.includes("png");
        if (!isPng) {
          // Convert to png via canvas? Keep as is and embed as jpg
          // pdf-lib can embed jpg directly; we will branch
        }
      } else if (mode === "type") {
        // Create canvas with typed name
        const c = document.createElement("canvas");
        c.width = 400; c.height = 120;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,c.width,c.height);
        ctx.fillStyle = "#0f172a";
        ctx.font = "48px 'Brush Script MT', cursive";
        ctx.fillText(typedName, 20, 70);
        pngDataUrl = c.toDataURL("image/png");
        pngBytes = await (await fetch(pngDataUrl)).arrayBuffer();
      }

      if (!pngBytes) throw new Error("No signature data.");

      // Determine embed type
      let img;
      const isJpgUpload = mode==="upload" && uploadedSig && uploadedSig.type.includes("jpeg");
      if (isJpgUpload) {
        img = await pdf.embedJpg(pngBytes);
      } else {
        img = await pdf.embedPng(pngBytes);
      }
      const iw = 160, ih = 60;
      const drawX = Math.min(x, width - iw - 10);
      const drawY = Math.min(y, height - ih - 10);
      page.drawImage(img, { x: drawX, y: drawY, width: iw, height: ih });

      // Optional date text below signature
      const helv = await pdf.embedFont((await import("pdf-lib")).StandardFonts.Helvetica);
      page.drawText(new Date().toLocaleDateString(), { x: drawX, y: drawY - 14, size: 8, font: helv, color: rgb(0.5,0.5,0.6) });
      page.drawText("Signed via UtilityHub — electronic signature (not certified)", { x: 20, y: 20, size: 7, font: helv, color: rgb(0.6,0.6,0.7) });

      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — signature placed on page ${pageNum}/${pages.length} at (${drawX.toFixed(0)},${drawY.toFixed(0)}). Browser only • Not a cryptographic digital signature.`);
    } catch (e:any) {
      setStatus("Error: " + e.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] p-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <h3 className="font-black" style={{fontFamily:'Plus Jakarta Sans'}}>Sign PDF — electronic signature</h3>
        <p className="text-sm opacity-90 mt-1">Draw, type, or upload a signature and place it on any page via <code className="bg-white/20 px-1 rounded">pdf-lib</code>. This is an electronic image signature, not a certified digital signature. No upload.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && loadPdf(f[0])} label="Drop PDF to sign" />
          {file && <div className="mt-3 text-sm dark:text-white"><b>{file.name}</b> • {pageCount} pages</div>}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <label className="text-sm dark:text-white">Page<input type="number" min={1} max={pageCount||1} value={pageNum} onChange={e=> setPageNum(parseInt(e.target.value)||1)} className="input mt-1" /></label>
            <label className="text-sm dark:text-white">X<input type="number" value={x} onChange={e=> setX(parseInt(e.target.value)||0)} className="input mt-1" /></label>
            <label className="text-sm dark:text-white">Y<input type="number" value={y} onChange={e=> setY(parseInt(e.target.value)||0)} className="input mt-1" /></label>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bottom-left is 0,0. A4 is 595×842. Try X:100 Y:100 for bottom-left.</div>
        </div>

        <div className="card">
          <div className="flex gap-2 mb-3">
            {(["draw","type","upload"] as const).map(m=> <button key={m} onClick={()=> setMode(m)} className={`flex-1 py-2 rounded-xl border text-sm font-bold capitalize ${mode===m?'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 dark:text-white'}`}>{m}</button>)}
          </div>

          {mode==="draw" && (
            <div>
              <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800">
                <canvas ref={canvasRef} width={360} height={140} className="w-full bg-white rounded-xl touch-none dark:bg-slate-900" style={{cursor:"crosshair"}} />
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={clearCanvas} className="btn-secondary text-sm flex-1">Clear</button>
                <span className="text-xs text-slate-500 self-center">Draw with mouse/touch</span>
              </div>
            </div>
          )}
          {mode==="type" && (
            <div>
              <input value={typedName} onChange={e=> setTypedName(e.target.value)} placeholder="Your name" className="input" />
              <div className="mt-3 p-6 rounded-2xl bg-white border dark:bg-slate-800 dark:border-slate-700 text-center">
                <div className="text-3xl" style={{fontFamily:'"Brush Script MT", cursive'}}>{typedName || "Your Name"}</div>
                <div className="text-xs text-slate-500 mt-1">Preview — will be rendered as image</div>
              </div>
            </div>
          )}
          {mode==="upload" && (
            <div>
              <input type="file" accept="image/*" onChange={e=> setUploadedSig(e.target.files?.[0]||null)} className="input" />
              {uploadedSig && <div className="mt-2 text-sm dark:text-white">Selected: {uploadedSig.name}</div>}
            </div>
          )}

          <button onClick={sign} disabled={!file} className="btn-primary w-full mt-4">Place signature & generate PDF</button>
          {status && <div className="mt-3 text-sm p-3 rounded-2xl bg-slate-50 border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
          {url && <a href={url} download={`signed-${file?.name}`} className="btn-primary w-full mt-3 text-sm">Download signed PDF</a>}
        </div>
      </div>

      <div className="card">
        <h4 className="font-bold dark:text-white">Disclaimer</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">This adds an image of your signature — it is not a cryptographic digital signature and may not satisfy legal requirements for certified signatures. For high-assurance signing, use a qualified provider.</p>
      </div>
    </div>
  );
}
