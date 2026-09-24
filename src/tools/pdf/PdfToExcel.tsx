import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";

export default function PdfToExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const convert = async () => {
    if (!file) return;
    try {
      setStatus("Extracting PDF text...");
      const pdfjs: any = await import("pdfjs-dist");
      try { pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`; } catch {}
      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;

      // Extract structured lines per page: use text items with positions to group into lines
      const allRows: any[][] = [];
      allRows.push(["Page", "Line", "Text"]); // header

      for (let i = 1; i <= pdf.numPages; i++) {
        setStatus(`Processing page ${i}/${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const items = content.items as any[];
        // Group by y position (line)
        const lines: Record<string, any[]> = {};
        for (const it of items) {
          const y = Math.round(it.transform[5]); // y position
          const key = String(y);
          if (!lines[key]) lines[key] = [];
          lines[key].push(it);
        }
        // Sort lines by y descending (top to bottom)
        const sortedY = Object.keys(lines).map(Number).sort((a,b)=> b-a);
        for (const y of sortedY) {
          const lineItems = lines[String(y)].sort((a,b)=> a.transform[4] - b.transform[4]); // sort by x
          const lineText = lineItems.map(it=> it.str).join(" ").trim();
          if (lineText) {
            // Try to split into columns by large gaps? Simple: split by 2+ spaces or tabs -> columns
            // For now keep single column, but also attempt to split into up to 5 columns by double spaces
            // We'll put full line in one cell; user can use Text to Columns in Excel
            allRows.push([`Page ${i}`, `Y:${y}`, lineText]);
          }
        }
        // Add empty row between pages
        if (i < pdf.numPages) allRows.push(["", "", ""]);
      }

      if (allRows.length <= 1) throw new Error("No extractable text found (scanned PDF?).");

      setStatus("Generating XLSX...");
      const _xlsxMod: any = await import("xlsx");
      const XLSX: any = _xlsxMod.default || _xlsxMod;
      const ws = XLSX.utils.aoa_to_sheet(allRows);
      // Set column widths
      ws["!cols"] = [{ wch: 10 }, { wch: 10 }, { wch: 80 }];
      // Add filter
      ws["!autofilter"] = { ref: `A1:C${allRows.length}` };
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "PDF Text");
      // Add second sheet with page-wise text blocks
      const pageBlocks: any[][] = [["Page", "Full Text (per page)"]];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = (content.items as any[]).map(it=> it.str).join(" ");
        pageBlocks.push([`Page ${i}`, text.slice(0, 32000)]); // Excel cell limit
      }
      const ws2 = XLSX.utils.aoa_to_sheet(pageBlocks);
      ws2["!cols"] = [{ wch: 12 }, { wch: 100 }];
      XLSX.utils.book_append_sheet(wb, ws2, "Pages");
      const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — ${pdf.numPages} pages → ${allRows.length-1} rows across 2 sheets. Text extraction: tables become linear text; use Excel Text-to-Columns. Browser only.`);
    } catch (e:any) {
      setStatus("Error: " + e.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] p-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <h3 className="font-black" style={{fontFamily:'Plus Jakarta Sans'}}>PDF to Excel — extract tables to XLSX</h3>
        <p className="text-sm opacity-90 mt-1">Extracts selectable text line-by-line (y-position grouped) into Excel — 2 sheets: line table + per-page. Real tables become linear text; no OCR. Uses <code className="bg-white/20 px-1 rounded">xlsx</code> locally.</p>
      </div>
      <div className="card">
        <UploadZone accept=".pdf,application/pdf" onFiles={f=> f[0] && setFile(f[0])} label="Drop PDF here" description="Best for text PDFs with tables • up to 25 MB" />
        {file && <div className="mt-3 text-sm dark:text-white"><b>{file.name}</b> • {(file.size/1024).toFixed(1)} KB</div>}
        <div className="flex gap-3 mt-4">
          <button onClick={convert} disabled={!file} className="btn-primary">Convert to XLSX</button>
          <button onClick={()=> { setFile(null); setUrl(null); setStatus(""); }} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 rounded-2xl bg-slate-50 border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
        {url && <a href={url} download={`${file?.name.replace(/\.pdf$/i,"")}.xlsx`} className="btn-primary mt-3 text-sm">Download XLSX</a>}
      </div>
      <div className="card">
        <h4 className="font-bold dark:text-white">Tips for tables</h4>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
          <li>Open in Excel → use <b>Data → Text to Columns</b> (delimited by space) to split columns.</li>
          <li>Scanned PDFs → no text, shows empty — needs OCR.</li>
          <li>Complex merged cells/images → not preserved as layout.</li>
        </ul>
      </div>
    </div>
  );
}
