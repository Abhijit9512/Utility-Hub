import { useState } from "react";
import { UploadZone } from "../../components/common/UploadZone";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default function ExcelToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const convert = async () => {
    if (!file) return;
    try {
      setStatus("Reading Excel...");
      const _xlsxMod: any = await import("xlsx");
      const XLSX: any = _xlsxMod.default || _xlsxMod;
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: "array" });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) throw new Error("No sheets found.");
      const ws = wb.Sheets[sheetName];
      const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
      if (rows.length === 0) throw new Error("Sheet is empty.");

      setStatus(`Generating PDF for sheet "${sheetName}" (${rows.length} rows)...`);
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

      const pageWidth = 842; // landscape A4 for tables
      const pageHeight = 595;
      const margin = 30;
      const rowHeight = 14;
      const colWidth = (pageWidth - margin*2) / Math.min(8, Math.max(...rows.map(r=> r.length), 1)); // max 8 columns visible
      const maxRowsPerPage = Math.floor((pageHeight - margin*2 - 30) / rowHeight);

      let pageIndex = 0;
      for (let start = 0; start < rows.length; start += maxRowsPerPage) {
        const slice = rows.slice(start, start + maxRowsPerPage);
        const page = pdf.addPage([pageWidth, pageHeight]);
        pageIndex++;
        // Title
        page.drawText(`${file.name} — Sheet: ${sheetName} • Page ${pageIndex}`, { x: margin, y: pageHeight - 22, size: 10, font: boldFont, color: rgb(0.15,0.23,0.42) });
        page.drawLine({ start: { x: margin, y: pageHeight - 28 }, end: { x: pageWidth - margin, y: pageHeight - 28 }, thickness: 0.5, color: rgb(0.9,0.9,0.9) });

        // Header row styling
        let y = pageHeight - 45;
        for (let r = 0; r < slice.length; r++) {
          const isHeader = start === 0 && r === 0;
          const row = slice[r];
          let x = margin;
          for (let c = 0; c < Math.min(row.length, 8); c++) {
            const cell = String(row[c] ?? "");
            // Clip
            const clipped = cell.length > 22 ? cell.slice(0, 22) + "…" : cell;
            // Cell background for header
            if (isHeader) {
              page.drawRectangle({ x, y: y-2, width: colWidth, height: rowHeight, color: rgb(0.15,0.23,0.42) });
              page.drawText(clipped, { x: x+4, y, size: 7, font: boldFont, color: rgb(1,1,1) });
            } else {
              // alternating row
              if (r % 2 === 1) page.drawRectangle({ x, y: y-2, width: colWidth, height: rowHeight, color: rgb(0.97,0.98,1) });
              page.drawText(clipped, { x: x+4, y, size: 7, font, color: rgb(0.2,0.2,0.25) });
            }
            x += colWidth;
          }
          // Grid lines
          y -= rowHeight;
          // Horizontal line
          page.drawLine({ start: { x: margin, y: y+2 }, end: { x: margin+ colWidth*Math.min(row.length,8), y: y+2 }, thickness: 0.3, color: rgb(0.9,0.9,0.92) });
        }
        // vertical lines
        for (let c=0; c<=Math.min(slice[0]?.length||0,8); c++) {
          const x = margin + c*colWidth;
          page.drawLine({ start: { x, y: pageHeight-45+rowHeight-2 }, end: { x, y }, thickness: 0.3, color: rgb(0.9,0.9,0.92) });
        }
        page.drawText(`UtilityHub Excel→PDF • ${rows.length} rows total • Browser only`, { x: margin, y: 14, size: 7, font, color: rgb(0.6,0.6,0.7) });
      }

      const out = await pdf.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setUrl(URL.createObjectURL(blob));
      setStatus(`Done — ${wb.SheetNames.length} sheet(s), ${rows.length} rows from "${sheetName}" → ${Math.ceil(rows.length / maxRowsPerPage)} page(s) PDF. Only first 8 columns shown; landscape A4. Browser only.`);

    } catch (e:any) {
      setStatus("Error: " + e.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] p-5 bg-gradient-to-br from-emerald-700 to-green-700 text-white">
        <h3 className="font-black" style={{fontFamily:'Plus Jakarta Sans'}}>Excel to PDF — XLSX → PDF</h3>
        <p className="text-sm opacity-90 mt-1">Reads first sheet via <code className="bg-white/20 px-1 rounded">xlsx</code> and renders as landscape table PDF via <code className="bg-white/20 px-1 rounded">pdf-lib</code>. Limited to 8 columns for readability. No upload.</p>
      </div>
      <div className="card">
        <UploadZone accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onFiles={f=> f[0] && setFile(f[0])} label="Drop Excel here" description="XLSX/XLS • first sheet converted" />
        {file && <div className="mt-3 text-sm dark:text-white"><b>{file.name}</b> • {(file.size/1024).toFixed(1)} KB</div>}
        <div className="flex gap-3 mt-4">
          <button onClick={convert} disabled={!file} className="btn-primary">Convert to PDF</button>
          <button onClick={()=> { setFile(null); setUrl(null); setStatus(""); }} className="btn-secondary">Reset</button>
        </div>
        {status && <div className="mt-3 text-sm p-3 rounded-2xl bg-slate-50 border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">{status}</div>}
        {url && <a href={url} download={`${file?.name.replace(/\.(xlsx|xls)$/i,"")}.pdf`} className="btn-primary mt-3 text-sm">Download PDF</a>}
      </div>
      <div className="card">
        <h4 className="font-bold dark:text-white">Limits</h4>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
          <li>Only first sheet, first 8 columns shown for layout.</li>
          <li>Formulas are converted to displayed values, charts/images ignored.</li>
          <li>For pixel-perfect, use Excel → Save as PDF.</li>
        </ul>
      </div>
    </div>
  );
}
