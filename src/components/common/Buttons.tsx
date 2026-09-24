export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const copy = async () => {
    await navigator.clipboard.writeText(text);
  };
  return <button onClick={copy} className="btn-secondary text-sm py-2">{label}</button>;
}
export function DownloadButton({ blob, filename, label = "Download" }: { blob: Blob; filename: string; label?: string }) {
  const download = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <button onClick={download} className="btn-primary text-sm">{label}</button>;
}
export function ResetButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="btn-secondary text-sm">Reset</button>;
}
