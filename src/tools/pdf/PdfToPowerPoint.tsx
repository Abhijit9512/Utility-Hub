import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";

export default function PdfToPowerPoint() {
  const [file, setFile] = useState<File | null>(null);
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

      setStatus("Building PPTX...");
      const PptxGenJS: any = (await import("pptxgenjs")).default;

      const pptx = new PptxGenJS();
      pptx.author = "UtilityHub";
      pptx.title = file.name.replace(/\.pdf$/i,"");
      pptx.subject = "Converted from PDF — browser only";

      // Title slide
      const titleSlide = pptx.addSlide();
      titleSlide.background = { color: "0F172A" };
      titleSlide.addText(`Converted from ${file.name}`, { x: 0.5, y: 1.5, w: 9, h: 0.6, fontSize: 24, bold: true, color: "FFFFFF", align: "center", fontFace: "Inter" });
      titleSlide.addText(`${pdf.numPages} pages • Text extraction • UtilityHub — browser only`, { x: 0.5, y: 2.4, w: 9, h: 0.4, fontSize: 12, color: "94A3B8", align: "center" });
      titleSlide.addText("Note: Layout/images/scanned content may not be preserved — editable text only.", { x: 0.5, y: 5.0, w: 9, h: 0.3, fontSize: 9, color: "64748B", align: "center", italic: true });

      for (let i = 1; i <= pdf.numPages; i++) {
        setStatus(`Creating slide ${i}/${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = (content.items as any[]).map(it=> it.str).join(" ").trim();
        const slide = pptx.addSlide();
        slide.background = { color: "FFFFFF" };
        // Header bar
        slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: "2563EB" } });
        slide.addText(`Page ${i} — ${file.name}`, { x: 0.3, y: 0.15, w: 9.4, h: 0.3, fontSize: 10, color: "FFFFFF", bold: true });
        // Content
        if (!text) {
          slide.addText("[No extractable text — scanned image?]", { x: 0.5, y: 2.5, w: 9, h: 0.8, fontSize: 14, color: "94A3B8", italic: true, align: "center" });
        } else {
          // Chunk text to avoid overflow — pptx handles overflow but we also paginate if > 2000 chars
          const chunks = text.match(/.{1,1800}(\s|$)/g) || [text];
          slide.addText(chunks[0].trim(), { x: 0.5, y: 0.8, w: 9, h: 4.5, fontSize: 10, color: "1E293B", valign: "top", lineSpacingMultiple: 1.1 });
          // If very long, add continuation slide(s)
          for (let c = 1; c < chunks.length; c++) {
            const cont = pptx.addSlide();
            cont.background = { color: "FFFFFF" };
            cont.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: "6366F1" } });
            cont.addText(`Page ${i} (cont. ${c+1}/${chunks.length})`, { x: 0.3, y: 0.15, w: 9.4, h: 0.3, fontSize: 10, color: "FFFFFF", bold: true });
            cont.addText(chunks[c].trim(), { x: 0.5, y: 0.8, w: 9, h: 4.5, fontSize: 10, color: "1E293B", valign: "top" });
          }
        }
        // Footer
        slide.addText(`UtilityHub • Converted from PDF • Page ${i}/${pdf.numPages}`, { x: 0.5, y: 5.2, w: 9, h: 0.2, fontSize: 8, color: "94A3B8", align: "right", italic: true });
      }

      const blob = await pptx.write({ outputType: "blob" }) as Blob;
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — ${pdf.numPages} pages → ${pptx.slides.length} slides. Text only; layout approximated. Browser only.`);
    } catch (e:any) {
      setStatus("Error: " + e.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] p-5 bg-gradient-to-br from-orange-600 to-red-600 text-white">
        <h3 className="font-black" style={{fontFamily:'Plus Jakarta Sans'}}>PDF to PowerPoint — PPTX from text</h3>
        <p className="text-sm opacity-90 mt-1">Each PDF page → slide with extracted text via <code className="bg-white/20 px-1 rounded">pptxgenjs</code>. Not pixel-perfect — but editable. No upload.</p>
      </div>
      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && setFile(f[0])} label="Drop PDF here" />
        {file && <div className="mt-3 text-sm dark:text-white"><b>{file.name}</b> • {(file.size/1024).toFixed(1)} KB</div>}
        <div className="flex gap-3 mt-4">
          <button onClick={convert} disabled={!file} className="btn-primary">Convert to PPTX</button>
          <button onClick={()=> { setFile(null); setUrl(null); setStatus(""); }} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 rounded-2xl bg-slate-50 border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
        {url && <a href={url} download={`${file?.name.replace(/\.pdf$/i,"")}.pptx`} className="btn-primary mt-3 text-sm">Download PPTX</a>}
      </div>
      <div className="card">
        <h4 className="font-bold dark:text-white">Limitations</h4>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
          <li>Text-based PDFs → good; scanned → empty (needs OCR).</li>
          <li>Images/tables → not laid out as original; text linear.</li>
          <li>Very long pages auto-split into continuation slides.</li>
        </ul>
      </div>
    </div>
  );
}
