import { useState, useRef } from "react";
import { UploadZone, FileList } from "../../components/common/UploadZone";
import { PDFDocument } from "pdf-lib";

export default function ScanToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(s);
      if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); }
      setStatus("Camera started — capture scans, then convert to PDF.");
    } catch(e:any){ setStatus("Camera error: "+e.message+" — use file upload instead."); }
  };
  const stopCamera = () => { stream?.getTracks().forEach(t=> t.stop()); setStream(null); };
  const capture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video,0,0);
    canvas.toBlob(blob=> {
      if (blob) {
        const f = new File([blob], `scan-${Date.now()}.jpg`, { type: "image/jpeg" });
        setFiles(prev=> [...prev, f]);
        setStatus(`Captured scan ${files.length+1}`);
      }
    }, "image/jpeg", 0.9);
  };

  const createPdf = async () => {
    if (files.length===0) return;
    setStatus("Creating PDF from scans...");
    try {
      const pdf = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const img = f.type.includes("png") ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x:0, y:0, width: img.width, height: img.height });
      }
      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — ${files.length} scan(s) → PDF, browser only.`);
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#E30613] text-white">
        <h3 className="font-bold">Scan to PDF — capture from mobile camera</h3>
        <p className="text-sm opacity-90 mt-1">Capture document scans via camera or upload images → PDF, 100% in your browser.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <h4 className="font-bold">Camera scan</h4>
          {!stream ? <button onClick={startCamera} className="btn-primary mt-3">Start camera</button> : <button onClick={stopCamera} className="btn-secondary mt-3">Stop camera</button>}
          <div className="mt-3 rounded-xl overflow-hidden border bg-black aspect-[4/3] flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {!stream && <span className="absolute text-white/60 text-sm">Camera off — start to scan</span>}
          </div>
          {stream && <button onClick={capture} className="btn-primary w-full mt-3">Capture photo</button>}
          <p className="text-xs text-[#707078] mt-2">Tip: On mobile, use environment camera for best scan. Or just upload images below.</p>
        </div>
        <div className="card">
          <h4 className="font-bold">Upload scans</h4>
          <div className="mt-2"><UploadZone accept="image/*" multiple onFiles={f=> setFiles(prev=> [...prev, ...f])} label="Drop scan images here" description="JPG, PNG • multiple" /></div>
          <FileList files={files} onRemove={i=> setFiles(files.filter((_,idx)=> idx!==i))} />
          <div className="flex gap-3 mt-4">
            <button onClick={createPdf} disabled={files.length===0} className="btn-primary flex-1">Create PDF from {files.length} scans</button>
            <button onClick={()=> {setFiles([]); setUrl(null); setStatus("");}} className="btn-secondary">Reset</button>
          </div>
          {status && <div className="mt-3 text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
          {url && <a href={url} download="scanned.pdf" className="btn-primary mt-3 text-sm">Download scanned.pdf</a>}
        </div>
      </div>
    </div>
  );
}
