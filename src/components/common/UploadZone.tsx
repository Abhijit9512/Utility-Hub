import { useCallback, useRef, useState } from "react";

interface Props {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFiles: (files: File[]) => void;
  label?: string;
  description?: string;
}

export function UploadZone({ accept, multiple = false, maxSizeMB = 25, onFiles, label = "Drop files here or click to browse", description }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    if (maxSizeMB) {
      const tooLarge = files.find(f => f.size > maxSizeMB * 1024 * 1024);
      if (tooLarge) {
        setError(`File "${tooLarge.name}" exceeds ${maxSizeMB} MB limit`);
        return;
      }
    }
    if (accept) {
      const accepts = accept.split(",").map(s => s.trim().toLowerCase());
      const invalid = files.find(f => {
        const ext = "." + f.name.split(".").pop()?.toLowerCase();
        const mime = f.type.toLowerCase();
        return !accepts.some(a => a === ext || a === mime || (a.endsWith("/*") && mime.startsWith(a.replace("/*","/"))));
      });
      if (invalid && files.length === 1 && false) {
        setError(`Unsupported format: ${invalid!.name}`);
        return;
      }
    }
    setError(null);
    onFiles(files);
  }, [accept, maxSizeMB, onFiles]);

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`group relative overflow-hidden rounded-[20px] p-8 text-center cursor-pointer transition-all duration-300 border-2 border-dashed ${dragOver ? "border-blue-500 bg-blue-50/80 shadow-glow dark:bg-blue-950/20 scale-[1.01]" : "border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-medium dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:hover:border-slate-600"}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); }}}
        aria-label="File upload zone"
      >
        {/* hover gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-blue-500/[0.03] via-indigo-500/[0.03] to-violet-500/[0.03] pointer-events-none"></div>
        {dragOver && <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-violet-500/10 pointer-events-none"></div>}
        
        <div className="relative">
          <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${dragOver ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white scale-110 shadow-lg" : "bg-white border border-slate-200 text-slate-600 group-hover:border-blue-200 group-hover:text-blue-600 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div className="font-bold text-slate-900 dark:text-white mt-3">{label}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description ?? (accept ? `Accepted: ${accept}` : "All files")}{maxSizeMB ? ` • Up to ${maxSizeMB} MB` : ""}</div>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all dark:bg-white dark:text-slate-900">
            Browse files <span>→</span>
          </div>
          <div className="mt-2 text-xs font-medium tracking-wide text-slate-400">or drag & drop • Secure • Private</div>
        </div>
      </div>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      {error && <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-2 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400"><span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">!</span> {error}</div>}
    </div>
  );
}

export function FileList({ files, onRemove }: { files: File[]; onRemove?: (idx: number) => void }) {
  if (files.length === 0) return null;
  return (
    <div className="space-y-2.5 mt-4">
      {files.map((f, i) => (
        <div key={i} className="group flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 dark:bg-white dark:text-slate-900">
              {f.name.split(".").pop()?.slice(0,3).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate pr-2 dark:text-white">{f.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{(f.size/1024).toFixed(1)} KB • {f.type || "unknown"}</div>
            </div>
          </div>
          {onRemove && <button onClick={() => onRemove(i)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-500 transition-colors dark:bg-slate-800 dark:hover:bg-red-950/30">✕</button>}
        </div>
      ))}
    </div>
  );
}
