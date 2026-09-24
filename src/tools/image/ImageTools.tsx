import { useState, useRef } from "react";
import { UploadZone } from "../../components/common/UploadZone";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = rej;
    img.src = url;
  });
}

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [result, setResult] = useState<{url:string, size:number, blob:Blob}|null>(null);
  const [origSize, setOrigSize] = useState<number>(0);
  const [preview, setPreview] = useState<string | null>(null);
  const compress = async () => {
    if(!file) return;
    const img = await loadImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img,0,0);
    canvas.toBlob(blob=>{
      if(!blob) return;
      setResult({ url: URL.createObjectURL(blob), size: blob.size, blob });
    }, file.type.includes("png") ? "image/png" : "image/jpeg", quality);
  };
  const onFile = async (f:File)=>{
    setFile(f); setOrigSize(f.size); setResult(null);
    setPreview(URL.createObjectURL(f));
  };
  return (
    <div className="card space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">Compress images in your browser using Canvas. Adjust quality and download — no upload.</p>
      <UploadZone accept="image/*" onFiles={f=> f[0] && onFile(f[0])} />
      {preview && <img src={preview} alt="preview" className="max-h-64 mx-auto rounded-xl border dark:border-slate-700" />}
      <div className="flex items-center gap-3">
        <label className="text-sm dark:text-white">Quality</label>
        <input type="range" min={0.1} max={0.95} step={0.05} value={quality} onChange={e=>setQuality(parseFloat(e.target.value))} className="flex-1" />
        <span className="text-sm dark:text-white">{Math.round(quality*100)}%</span>
      </div>
      <div className="flex gap-3"><button onClick={compress} disabled={!file} className="btn-primary">Compress</button><button onClick={()=>{setFile(null); setResult(null); setPreview(null);}} className="btn-secondary">Reset</button></div>
      {file && <div className="text-sm dark:text-slate-300">Original: {(origSize/1024).toFixed(1)} KB</div>}
      {result && <div className="p-4 bg-green-50 border border-green-200 rounded-xl dark:bg-green-950/20 dark:border-green-900"><div className="text-sm dark:text-green-300">Compressed: {(result.size/1024).toFixed(1)} KB — saved {(((origSize-result.size)/origSize)*100).toFixed(1)}%</div><div className="flex gap-2 mt-2"><a href={result.url} download={`compressed-${file?.name}`} className="btn-primary text-sm">Download</a><img src={result.url} alt="compressed" className="h-20 rounded border" /></div></div>}
    </div>
  );
}

export function ImageResizer() {
  const [file, setFile] = useState<File|null>(null);
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [keepAspect, setKeepAspect] = useState(true);
  const [preview, setPreview] = useState<string|null>(null);
  const [result, setResult] = useState<string|null>(null);
  const [origDim, setOrigDim] = useState<{w:number,h:number}|null>(null);
  const onFile = async (f:File)=>{
    setFile(f);
    const img = await loadImage(f);
    setOrigDim({w:img.naturalWidth, h:img.naturalHeight});
    setW(img.naturalWidth); setH(img.naturalHeight);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };
  const resize = async ()=>{
    if(!file) return;
    const img = await loadImage(file);
    let nw=w, nh=h;
    if(keepAspect && origDim){
      const ratio = origDim.w / origDim.h;
      // if user changed w, derive h; else use inputs? Simplify: keep ratio based on w
      nh = Math.round(nw / ratio);
      setH(nh);
    }
    const canvas = document.createElement("canvas");
    canvas.width = nw; canvas.height = nh;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img,0,0,nw,nh);
    setResult(canvas.toDataURL(file.type || "image/png"));
  };
  return (
    <div className="card space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">Resize any image client-side. Preserve aspect ratio optionally. No server upload.</p>
      <UploadZone accept="image/*" onFiles={f=> f[0] && onFile(f[0])} />
      {preview && <img src={preview} alt="preview" className="max-h-56 mx-auto rounded-xl border dark:border-slate-700" />}
      {origDim && <div className="text-xs text-slate-500 dark:text-slate-400">Original: {origDim.w} × {origDim.h}px</div>}
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm dark:text-white">Width <input type="number" value={w} onChange={e=>setW(parseInt(e.target.value)||0)} className="input mt-1" /></label>
        <label className="text-sm dark:text-white">Height <input type="number" value={h} onChange={e=>setH(parseInt(e.target.value)||0)} className="input mt-1" /></label>
      </div>
      <label className="flex items-center gap-2 text-sm dark:text-white"><input type="checkbox" checked={keepAspect} onChange={e=>setKeepAspect(e.target.checked)} /> Keep aspect ratio</label>
      <div className="flex gap-3"><button onClick={resize} disabled={!file} className="btn-primary">Resize</button><button onClick={()=>{setFile(null); setResult(null); setPreview(null);}} className="btn-secondary">Reset</button></div>
      {result && <div className="p-3 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700"><img src={result} alt="resized" className="max-h-64 mx-auto rounded" /><a href={result} download={`resized-${file?.name}.png`} className="btn-primary mt-3 text-sm">Download</a></div>}
    </div>
  );
}

export function ImageConverter({ from, to }: { from: string; to: string }) {
  const [file, setFile] = useState<File|null>(null);
  const [result, setResult] = useState<string|null>(null);
  const [preview, setPreview] = useState<string|null>(null);
  const convert = async () => {
    if(!file) return;
    const img = await loadImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    // For JPG background fill white if transparent
    if(to==="image/jpeg") { ctx.fillStyle="#fff"; ctx.fillRect(0,0,canvas.width,canvas.height); }
    ctx.drawImage(img,0,0);
    const mime = to==="image/png" ? "image/png" : to==="image/webp" ? "image/webp" : "image/jpeg";
    setResult(canvas.toDataURL(mime, 0.92));
  };
  const onFile = (f:File)=>{ setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); };
  return (
    <div className="card space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">Convert {from.toUpperCase()} → {to.split("/")[1].toUpperCase()} in your browser. No upload.</p>
      <UploadZone accept={`image/${from},.${from}`} onFiles={f=> f[0] && onFile(f[0])} label={`Drop ${from.toUpperCase()} here`} />
      {preview && <img src={preview} alt="preview" className="max-h-56 mx-auto rounded-xl border dark:border-slate-700" />}
      <div className="flex gap-3"><button onClick={convert} disabled={!file} className="btn-primary">Convert to {to.split("/")[1].toUpperCase()}</button><button onClick={()=>{setFile(null); setResult(null); setPreview(null);}} className="btn-secondary">Reset</button></div>
      {result && <div className="p-3 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700"><img src={result} alt="converted" className="max-h-64 mx-auto rounded" /><a href={result} download={`converted.${to.split("/")[1]}`} className="btn-primary mt-3 text-sm">Download</a></div>}
    </div>
  );
}

export function ImageTransformer({ mode }: { mode: "rotate" | "flip" | "grayscale" | "dimensions" | "exif" }) {
  const [file, setFile] = useState<File|null>(null);
  const [angle, setAngle] = useState(90);
  const [flip, setFlip] = useState<"h"|"v">("h");
  const [result, setResult] = useState<string|null>(null);
  const [info, setInfo] = useState<string>("");
  const [preview, setPreview] = useState<string|null>(null);

  const onFile = async (f:File)=>{
    setFile(f); setResult(null); setPreview(URL.createObjectURL(f));
    if(mode==="dimensions"){
      const img = await loadImage(f);
      setInfo(`Dimensions: ${img.naturalWidth} × ${img.naturalHeight}px • Size: ${(f.size/1024).toFixed(1)} KB • Type: ${f.type}`);
    }
    if(mode==="exif"){
      // We don't parse full EXIF but we can strip metadata by re-encoding
      setInfo(`File: ${f.name} • Size: ${(f.size/1024).toFixed(1)} KB • Type: ${f.type} • Last modified: ${new Date(f.lastModified).toLocaleString()}. Note: Re-encoding this image will strip most metadata.`);
    }
  };

  const process = async ()=>{
    if(!file) return;
    const img = await loadImage(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    if(mode==="rotate"){
      const rad = angle * Math.PI/180;
      const sin = Math.abs(Math.sin(rad)), cos = Math.abs(Math.cos(rad));
      canvas.width = img.naturalWidth * cos + img.naturalHeight * sin;
      canvas.height = img.naturalWidth * sin + img.naturalHeight * cos;
      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.naturalWidth/2, -img.naturalHeight/2);
    } else if(mode==="flip"){
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      ctx.save();
      if(flip==="h"){ ctx.scale(-1,1); ctx.drawImage(img, -canvas.width,0); }
      else { ctx.scale(1,-1); ctx.drawImage(img,0,-canvas.height); }
      ctx.restore();
    } else if(mode==="grayscale"){
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      ctx.drawImage(img,0,0);
      const data = ctx.getImageData(0,0,canvas.width,canvas.height);
      for(let i=0;i<data.data.length;i+=4){
        const avg = 0.299*data.data[i] + 0.587*data.data[i+1] + 0.114*data.data[i+2];
        data.data[i]=data.data[i+1]=data.data[i+2]=avg;
      }
      ctx.putImageData(data,0,0);
    } else if(mode==="exif"){
      // strip metadata by re-encode
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      ctx.drawImage(img,0,0);
    }
    if(mode!=="dimensions"){
      setResult(canvas.toDataURL("image/png"));
      setInfo("Processed in browser — metadata stripped where applicable.");
    }
  };

  const downloadStripped = async ()=>{
    if(!file) return;
    const img = await loadImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    canvas.getContext("2d")!.drawImage(img,0,0);
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a"); a.href=url; a.download=`clean-${file.name}.png`; a.click();
  };

  return (
    <div className="card space-y-4">
      {mode==="rotate" && <p className="text-sm text-slate-500 dark:text-slate-400">Rotate image 90/180/270° locally.</p>}
      {mode==="flip" && <p className="text-sm text-slate-500 dark:text-slate-400">Flip horizontally or vertically, client-side.</p>}
      {mode==="grayscale" && <p className="text-sm text-slate-500 dark:text-slate-400">Convert to grayscale using Canvas.</p>}
      {mode==="dimensions" && <p className="text-sm text-slate-500 dark:text-slate-400">Check image dimensions and file size — no upload.</p>}
      {mode==="exif" && <p className="text-sm text-slate-500 dark:text-slate-400">View basic file info and strip metadata by re-encoding.</p>}
      <UploadZone accept="image/*" onFiles={f=> f[0] && onFile(f[0])} />
      {preview && <img src={preview} alt="preview" className="max-h-56 mx-auto rounded-xl border dark:border-slate-700" />}
      {mode==="rotate" && <div className="flex gap-2">{[90,180,270].map(a=> <button key={a} onClick={()=>setAngle(a)} className={`px-3 py-2 rounded-xl border text-sm ${angle===a?'bg-blue-600 text-white':''}`}>{a}°</button>)}</div>}
      {mode==="flip" && <div className="flex gap-2"><button onClick={()=>setFlip("h")} className={`px-3 py-2 rounded-xl border text-sm ${flip==="h"?'bg-blue-600 text-white':''}`}>Flip Horizontal</button><button onClick={()=>setFlip("v")} className={`px-3 py-2 rounded-xl border text-sm ${flip==="v"?'bg-blue-600 text-white':''}`}>Flip Vertical</button></div>}
      {mode==="exif" && <button onClick={downloadStripped} disabled={!file} className="btn-secondary text-sm">Download metadata-stripped PNG</button>}
      {mode!=="dimensions" && <div className="flex gap-3"><button onClick={process} disabled={!file} className="btn-primary">Process</button><button onClick={()=>{setFile(null); setResult(null); setPreview(null); setInfo("");}} className="btn-secondary">Reset</button></div>}
      {info && <div className="text-sm p-3 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{info}</div>}
      {result && <div className="p-3 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700"><img src={result} alt="result" className="max-h-64 mx-auto rounded" /><a href={result} download="processed.png" className="btn-primary mt-3 text-sm">Download PNG</a></div>}
    </div>
  );
}

export function ImageCropper() {
  // Simple centered crop to square or custom ratio via canvas — lightweight placeholder that actually works
  const [file, setFile] = useState<File|null>(null);
  const [preview, setPreview] = useState<string|null>(null);
  const [result, setResult] = useState<string|null>(null);
  const [ratio, setRatio] = useState("1:1");
  const onFile = (f:File)=>{ setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); };
  const crop = async ()=>{
    if(!file) return;
    const img = await loadImage(file);
    const canvas = document.createElement("canvas");
    let rw=1,rh=1;
    if(ratio!=="free"){ const [a,b]=ratio.split(":").map(Number); rw=a; rh=b; }
    else { rw=img.naturalWidth; rh=img.naturalHeight; }
    const targetRatio = rw/rh;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let sx=0, sy=0, sw=img.naturalWidth, sh=img.naturalHeight;
    if(imgRatio > targetRatio){ sw = sh*targetRatio; sx = (img.naturalWidth - sw)/2; }
    else { sh = sw/targetRatio; sy = (img.naturalHeight - sh)/2; }
    canvas.width = 800*targetRatio > 800 ? 800 : 800*targetRatio;
    // simpler: use sw,sh as output? We'll output 800x800/ratio
    if(ratio==="1:1"){ canvas.width=600; canvas.height=600; }
    else if(ratio==="16:9"){ canvas.width=800; canvas.height=450; }
    else if(ratio==="4:3"){ canvas.width=800; canvas.height=600; }
    else { canvas.width=sw; canvas.height=sh; }
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, sx,sy,sw,sh, 0,0,canvas.width,canvas.height);
    setResult(canvas.toDataURL("image/png"));
  };
  return (
    <div className="card space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">Crop to preset ratios (1:1, 16:9, 4:3) center-crop, client-side.</p>
      <UploadZone accept="image/*" onFiles={f=> f[0] && onFile(f[0])} />
      {preview && <img src={preview} alt="preview" className="max-h-56 mx-auto rounded-xl border dark:border-slate-700" />}
      <div className="flex gap-2 flex-wrap">{["1:1","16:9","4:3","free"].map(r=> <button key={r} onClick={()=>setRatio(r)} className={`px-3 py-1.5 rounded-xl border text-sm ${ratio===r?'bg-blue-600 text-white':''}`}>{r}</button>)}</div>
      <div className="flex gap-3"><button onClick={crop} disabled={!file} className="btn-primary">Crop</button><button onClick={()=>{setFile(null); setResult(null); setPreview(null);}} className="btn-secondary">Reset</button></div>
      {result && <div className="p-3 bg-slate-50 border rounded-xl dark:bg-slate-800 dark:border-slate-700"><img src={result} alt="cropped" className="max-h-64 mx-auto rounded" /><a href={result} download="cropped.png" className="btn-primary mt-3 text-sm">Download</a></div>}
    </div>
  );
}
