import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default function HtmlToPdf() {
  const [html, setHtml] = useState(`<h1>Hello UtilityHub</h1><p>This is <b>HTML</b> to PDF demo. Paste your HTML or URL content.</p><ul><li>Bullet point</li><li>Another point</li></ul>`);
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [mode, setMode] = useState<"html"|"url">("html");
  const [urlInput, setUrlInput] = useState("https://example.com");

  const convertHtml = async () => {
    try {
      setStatus("Converting HTML to PDF...");
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
      let page = pdf.addPage([595,842]);
      let y = 800;
      const margin = 50;
      const drawLine = (text:string, opts:any={}) => {
        if (y < 50) { page = pdf.addPage([595,842]); y = 800; }
        page.drawText(text, { x: margin, y, size: opts.size||11, font: opts.bold?boldFont:font, color: opts.color||rgb(0.2,0.2,0.25), maxWidth: 595-100 });
        y -= opts.size ? opts.size+4 : 16;
      };

      if (mode==="html") {
        // Simple HTML parsing: strip tags, handle h1, p, li, b
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        const walk = (node: Node) => {
          if (node.nodeType===3) {
            const t = node.textContent?.trim();
            if (t) drawLine(t);
          } else if (node.nodeType===1) {
            const el = node as HTMLElement;
            const tag = el.tagName.toLowerCase();
            if (tag==="h1") { y-=6; drawLine(el.textContent||"", {size:22, bold:true, color: rgb(0.89,0.02,0.07)}); y-=6; }
            else if (tag==="h2") drawLine(el.textContent||"", {size:16, bold:true});
            else if (tag==="li") drawLine("• " + (el.textContent||""));
            else if (tag==="p" || tag==="div") { if (el.textContent?.trim()) drawLine(el.textContent||""); y-=4; }
            else for (const c of Array.from(el.childNodes)) walk(c);
          }
        };
        for (const c of Array.from(tmp.childNodes)) walk(c);
        if (y===800) drawLine("No content parsed — add HTML with h1/p/li.");
      } else {
        // URL mode: fetch (CORS may block) -> fallback
        setStatus("Fetching URL (CORS may block)...");
        try {
          const res = await fetch(urlInput);
          const text = await res.text();
          const tmp = document.createElement("div");
          tmp.innerHTML = text;
          const bodyText = tmp.innerText.slice(0, 4000);
          drawLine(`URL: ${urlInput}`, {size:10, color: rgb(0.5,0.5,0.6)});
          y-=10;
          for (const line of bodyText.split("\n").filter(Boolean).slice(0,80)) {
            drawLine(line.slice(0,90));
          }
        } catch (e:any) {
          drawLine(`Failed to fetch ${urlInput}: ${e.message} (CORS). Try copying HTML manually.`, {color: rgb(0.8,0.2,0.2)});
        }
      }

      page.drawText("Generated via UtilityHub HTML to PDF — browser only", { x: margin, y: 20, size: 7, font, color: rgb(0.6,0.6,0.7) });
      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus("Done — HTML → PDF (text extraction, not pixel-perfect rendering). Browser only.");
    } catch(e:any){ setStatus("Error: "+e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 bg-[#E30613] text-white">
        <h3 className="font-bold">HTML to PDF</h3>
        <p className="text-sm opacity-90 mt-1">Paste HTML or URL → PDF. Text-based conversion (not Chrome rendering) — no upload required.</p>
      </div>
      <div className="card">
        <div className="flex gap-2 mb-3">
          <button onClick={()=> setMode("html")} className={`flex-1 py-2 rounded-lg border text-sm font-bold ${mode==="html"?'bg-[#33333B] text-white':'bg-white'}`}>Paste HTML</button>
          <button onClick={()=> setMode("url")} className={`flex-1 py-2 rounded-lg border text-sm font-bold ${mode==="url"?'bg-[#33333B] text-white':'bg-white'}`}>From URL</button>
        </div>
        {mode==="html" ? (
          <textarea value={html} onChange={e=> setHtml(e.target.value)} rows={8} className="input font-mono text-sm" placeholder="<h1>Title</h1><p>Content</p>" />
        ) : (
          <input value={urlInput} onChange={e=> setUrlInput(e.target.value)} placeholder="https://example.com" className="input" />
        )}
        <div className="flex gap-3 mt-3">
          <button onClick={convertHtml} className="btn-primary">Convert to PDF</button>
          <button onClick={()=> {setUrl(null); setStatus("");}} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 bg-[#F6F6F8] border rounded-xl dark:bg-slate-800 dark:border-slate-700">{status}</div>}
        {url && <a href={url} download={mode==="html"?"html-to-pdf.pdf":"webpage.pdf"} className="btn-primary mt-3 text-sm">Download PDF</a>}
      </div>
      <div className="card">
        <h4 className="font-bold">Limits</h4>
        <p className="text-sm text-[#707078] mt-1">Simple text extraction — not full Chrome rendering. Images/CSS not preserved. For pixel-perfect, use browser Print → Save as PDF.</p>
      </div>
    </div>
  );
}
