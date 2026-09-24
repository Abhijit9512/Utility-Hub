import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";

export default function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const convert = async () => {
    if (!file) return;
    try {
      setStatus("Extracting text with PDF.js...");
      setProgress(10);
      const pdfjs: any = await import("pdfjs-dist");
      try { pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`; } catch {}
      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      setProgress(30);
      // Dynamic import docx
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");

      const children: any[] = [];
      children.push(new Paragraph({
        children: [new TextRun({ text: `Converted from ${file.name} — ${pdf.numPages} pages`, italics: true, size: 18, color: "64748B" })],
        spacing: { after: 400 }
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: "Note: ", bold: true }), new TextRun({ text: "This is a text-extraction conversion. Layout, images and scanned content may not be preserved perfectly. Processed in your browser.", size: 18 })],
        spacing: { after: 400 }
      }));

      for (let i = 1; i <= pdf.numPages; i++) {
        setStatus(`Extracting page ${i}/${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = (content.items as any[]).map(it => it.str).join(" ");
        // Heading per page
        children.push(new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: `Page ${i}`, bold: true, color: "2563EB" })],
          spacing: { before: 400, after: 200 },
          border: { bottom: { color: "E2E8F0", space: 1, style: "single", size: 6 } }
        }));
        if (text.trim().length === 0) {
          children.push(new Paragraph({
            children: [new TextRun({ text: "[No extractable text — scanned image?]", italics: true, color: "94A3B8" })],
            spacing: { after: 200 }
          }));
        } else {
          // Split into paragraphs by double spaces or long text
          const paras = text.split(/\s{2,}/).filter(Boolean);
          // If text is very long without double spaces, chunk by 800 chars
          const finalParas = paras.length <= 1 && text.length > 800 ? text.match(/.{1,800}(\s|$)/g) || [text] : paras;
          for (const p of finalParas) {
            children.push(new Paragraph({
              children: [new TextRun({ text: p.trim(), size: 21 })],
              spacing: { after: 160 },
              alignment: AlignmentType.LEFT
            }));
          }
        }
        setProgress(30 + Math.round((i / pdf.numPages) * 50));
      }

      setStatus("Generating DOCX...");
      setProgress(85);
      const doc = new Document({
        sections: [{ properties: {}, children }],
        creator: "UtilityHub",
        title: file.name.replace(/\.pdf$/i, ""),
        description: `Converted from ${file.name} via UtilityHub — browser only`
      });
      const blob = await Packer.toBlob(doc);
      setUrl(URL.createObjectURL(blob));
      setProgress(100);
      setStatus(`Done — ${pdf.numPages} pages converted to DOCX (${(blob.size/1024).toFixed(1)} KB). Text-based PDFs convert best; scanned PDFs need OCR (not included). Browser only.`);

    } catch (e:any) {
      setStatus("Error: " + e.message + " — Try a text-based PDF (selectable text), not a scanned image.");
      setProgress(0);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <h3 className="font-black" style={{fontFamily:'Plus Jakarta Sans'}}>PDF to Word — DOCX from selectable text</h3>
        <p className="text-sm opacity-90 mt-1">Extracts text per page via PDF.js and builds a DOCX with <code className="bg-white/20 px-1 rounded">docx</code>. Complex layouts/images/scans lose fidelity — but you get editable text. No upload.</p>
      </div>
      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && setFile(f[0])} label="Drop PDF here" description="Text-based PDF works best • up to 25 MB" />
        {file && <div className="mt-3 text-sm dark:text-white"><b>{file.name}</b> • {(file.size/1024).toFixed(1)} KB</div>}
        <div className="flex gap-3 mt-4">
          <button onClick={convert} disabled={!file} className="btn-primary">Convert to DOCX</button>
          <button onClick={()=> { setFile(null); setUrl(null); setStatus(""); setProgress(0); }} className="btn-secondary">Reset</button>
        </div>
        {progress>0 && progress<100 && <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800"><div className="h-full bg-blue-600 transition-all" style={{width:`${progress}%`}}></div></div>}
        {status && <div className="mt-3 text-sm p-3 rounded-2xl bg-slate-50 border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
        {url && <a href={url} download={`${file?.name.replace(/\.pdf$/i,"")}.docx`} className="btn-primary mt-3 text-sm">Download DOCX</a>}
      </div>
      <div className="card">
        <h4 className="font-bold dark:text-white">When it works well / limits</h4>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
          <li>✅ Text-based PDFs with selectable text → clean DOCX.</li>
          <li>⚠️ Scanned/image PDFs → “No extractable text” — needs OCR (not included, would require paid API).</li>
          <li>⚠️ Tables/columns/images → extracted as linear text, not precise layout.</li>
        </ul>
      </div>
    </div>
  );
}
