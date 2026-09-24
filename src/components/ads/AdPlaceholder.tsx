interface Props {
  slot?: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  label?: string;
  className?: string;
  placement?: "top" | "middle" | "bottom" | "sidebar";
}

export function AdPlaceholder({ label = "Ad space", format = "auto", className = "", placement = "middle" }: Props) {
  return (
    <div
      className={`ad-placeholder relative overflow-hidden border border-dashed border-slate-200/70 bg-slate-50/50 backdrop-blur rounded-[20px] flex items-center justify-center dark:border-slate-800 dark:bg-slate-900/30 ${className}`}
      data-format={format}
      data-placement={placement}
      aria-label="Advertisement placeholder"
      role="complementary"
    >
      <div className="absolute inset-0 mesh-gradient opacity-20"></div>
      <div className="relative text-center py-7 px-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-black tracking-widest uppercase text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> Advertisement
        </div>
        <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-2">{label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">AdSense will appear here — never over controls</div>
        <div className="hidden md:flex items-center justify-center gap-1.5 mt-2 text-[11px] font-medium text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Non-intrusive • Respects tool experience
        </div>
      </div>
    </div>
  );
}
