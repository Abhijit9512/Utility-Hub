import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const convert = async () => {
    if (!file) return;
    try {
      setStatus("Reading DOCX...");
      const _mammothMod: any = await import("mammoth");
      const mammoth: any = _mammothMod.default || _mammothMod;
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value as string;
      if (!text.trim()) throw new Error("No text found in DOCX (empty or binary?).");

      setStatus("Generating PDF via pdf-lib...");
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 11;
      const lineHeight = 14;
      const margin = 50;
      const pageWidth = 595; // A4
      const pageHeight = 842;
      const maxWidth = pageWidth - margin * 2;

      // Title page header
      let page = pdf.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;
      page.drawText(file.name.replace(/\.docx$/i,""), { x: margin, y, size: 16, font: boldFont, color: rgb(0.15,0.23,0.42) });
      y -= 20;
      page.drawText(`Converted via UtilityHub — ${new Date().toLocaleDateString()} • ${text.split(/\s+/).length} words`, { x: margin, y, size: 8, font, color: rgb(0.5,0.55,0.6) });
      y -= 14;
      page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 0.5, color: rgb(0.9,0.9,0.9) });
      y -= 20;

      // Wrap text
      const words = text.split(/\s+/);
      let line = "";
      const lines: string[] = [];
      for (const w of words) {
        const test = line ? line + " " + w : w;
        const width = font.widthOfTextAtSize(test, fontSize);
        if (width > maxWidth) {
          if (line) lines.push(line);
          line = w;
          // If single word longer than maxWidth, hard-break
          if (font.widthOfTextAtSize(line, fontSize) > maxWidth) {
            // split chars
            let chunk = "";
            for (const ch of line) {
              if (font.widthOfTextAtSize(chunk + ch, fontSize) > maxWidth) {
                lines.push(chunk);
                chunk = ch;
              } else chunk += ch;
            }
            line = chunk;
          }
        } else line = test;
      }
      if (line) lines.push(line);

      for (const l of lines) {
        if (y < margin + 20) {
          page = pdf.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(l, { x: margin, y, size: fontSize, font, color: rgb(0.2,0.2,0.25) });
        y -= lineHeight;
      }

      // Footer on each page
      const pages = pdf.getPages();
      pages.forEach((p, idx) => {
        p.drawText(`Page ${idx+1} / ${pages.length} • UtilityHub Word→PDF (browser)`, { x: margin, y: 20, size: 7, font, color: rgb(0.6,0.6,0.7) });
      });

      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — DOCX → PDF with ${pages.length} page(s), ${words.length} words. Layout is text-flow (not pixel-perfect). Browser only.`);

    } catch (e:any) {
      setStatus("Error: " + e.message + " — Try a DOCX with selectable text, not scanned images.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] p-5 bg-gradient-to-br from-blue-700 to-indigo-700 text-white">
        <h3 className="font-black" style={{fontFamily:'Plus Jakarta Sans'}}>Word to PDF — DOCX → PDF</h3>
        <p className="text-sm opacity-90 mt-1">Extracts DOCX text via <code className="bg-white/20 px-1 rounded">mammoth</code> and reflows into A4 PDF via <code className="bg-white/20 px-1 rounded">pdf-lib</code>. Formatting is simplified — but selectable text preserved. No upload.</p>
      </div>
      <div className="card">
        <UploadZone accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onFiles={f=> f[0] && setFile(f[0])} label="Drop DOCX here" description="DOCX only • up to 25 MB" />
        {file && <div className="mt-3 text-sm dark:text-white"><b>{file.name}</b> • {(file.size/1024).toFixed(1)} KB</div>}
        <div className="flex gap-3 mt-4">
          <button onClick={convert} disabled={!file} className="btn-primary">Convert to PDF</button>
          <button onClick={()=> { setFile(null); setUrl(null); setStatus(""); }} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 rounded-2xl bg-slate-50 border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
        {url && <a href={url} download={`${file?.name.replace(/\.docx$/i,"")}.pdf`} className="btn-primary mt-3 text-sm">Download PDF</a>}
      </div>
      <div className="card">
        <h4 className="font-bold dark:text-white">Limits</h4>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
          <li>Text reflowed — headings/images/tables become linear text.</li>
          <li>Scanned DOCX (images) → no text.</li>
          <li>For pixel-perfect, use desktop Word → Save as PDF.</li>
        </ul>
      </div>
    </div>
  );
}
