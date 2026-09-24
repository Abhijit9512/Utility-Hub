import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";

export default function PdfToMarkdown() {
  const [file, setFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const convert = async () => {
    if (!file) return;
    try {
      setStatus("Extracting text...");
      const pdfjs: any = await import("pdfjs-dist");
      try { pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`; } catch {}
      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      let md = `# ${file.name.replace(/\.pdf$/i,"")}\n\n*Converted via UtilityHub — ${pdf.numPages} pages • Browser only*\n\n`;
      for (let i=1;i<=pdf.numPages;i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const items = content.items as any[];
        // Heuristic: larger font size -> heading, grouped by y
        const lines: Record<string, any[]> = {};
        for (const it of items) {
          const y = Math.round(it.transform[5]/5)*5;
          const key = String(y);
          if (!lines[key]) lines[key]=[];
          lines[key].push(it);
        }
        const sortedY = Object.keys(lines).map(Number).sort((a,b)=> b-a);
        md += `\n## Page ${i}\n\n`;
        for (const y of sortedY) {
          const lineItems = lines[String(y)].sort((a,b)=> a.transform[4]-b.transform[4]);
          const lineText = lineItems.map(it=> it.str).join(" ").trim();
          if (!lineText) continue;
          // Heading detection: if line is short and items have larger height
          const avgHeight = lineItems.reduce((s,it)=> s+ (it.height||0),0)/lineItems.length;
          if (avgHeight>12 && lineText.length<80 && !lineText.endsWith(".")) {
            md += `### ${lineText}\n\n`;
          } else if (lineText.match(/^[•\-]\s/)) {
            md += `- ${lineText.replace(/^[•\-]\s/,"")}\n`;
          } else {
            md += `${lineText}\n\n`;
          }
        }
      }
      setMarkdown(md);
      const blob = new Blob([md], { type: "text/markdown" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — ${pdf.numPages} pages → Markdown (~${(md.length/1000).toFixed(1)} KB). Headings/lists heuristically detected. Scanned PDFs need OCR.`);
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#33333B] text-white">
        <h3 className="font-bold">PDF to Markdown — for notes & LLMs</h3>
        <p className="text-sm opacity-70 mt-1">Extracts text and preserves headings, lists, links heuristically via <code className="bg-white/10 px-1 rounded">pdfjs</code> → Markdown. Perfect for LLMs. No upload.</p>
      </div>
      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && setFile(f[0])} label="Drop PDF here" />
        {file && <div className="mt-2 text-sm"><b>{file.name}</b></div>}
        <div className="flex gap-3 mt-3">
          <button onClick={convert} disabled={!file} className="btn-primary">Convert to Markdown</button>
          <button onClick={()=> {setFile(null); setMarkdown(""); setUrl(null); setStatus("");}} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
        {markdown && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold">Preview</span>
              <a href={url!} download={`${file?.name.replace(/\.pdf$/i,"")}.md`} className="btn-primary text-sm">Download .md</a>
            </div>
            <textarea value={markdown} readOnly rows={14} className="input font-mono text-xs" />
            <button onClick={()=> navigator.clipboard.writeText(markdown)} className="btn-secondary mt-2 text-sm">Copy Markdown</button>
          </div>
        )}
      </div>
    </div>
  );
}
