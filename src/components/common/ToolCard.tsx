import { Link } from "react-router-dom";
import type { ToolDefinition } from "../../types/tool";
import { ToolIcon3D } from "./ToolIcon3D";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const isNew = ["fill-pdf-form","pdf-to-markdown","compare-pdf","redact-pdf","crop-pdf"].includes(tool.slug);
  return (
    <Link to={`/${tool.category}/${tool.slug}`} className="tool-card group min-h-[190px] relative bg-white dark:bg-slate-900 overflow-hidden">
      {isNew && <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#E30613] text-white text-[10px] font-black tracking-widest shadow-sm">NEW!</span>}
      <ToolIcon3D slug={tool.slug} size={52} />
      <div className="mt-1">
        <div className="font-bold text-[15px] leading-tight text-[#33333B] dark:text-white group-hover:text-[#E30613] line-clamp-1">{tool.name}</div>
        <div className="text-[12px] leading-relaxed text-[#707078] dark:text-slate-400 mt-1 line-clamp-2">{tool.description}</div>
      </div>
    </Link>
  );
}

export function ToolGrid({ tools }: { tools: ToolDefinition[] }) {
  if (tools.length === 0) return <div className="text-center py-12 text-[#707078]">No tools found</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tools.map(t => <ToolCard key={t.id} tool={t} />)}
    </div>
  );
}
