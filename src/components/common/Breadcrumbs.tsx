import { Link } from "react-router-dom";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-slate-500 dark:text-slate-400">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-slate-300 dark:text-slate-600">›</span>}
            {item.href ? <Link to={item.href} className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline">{item.label}</Link> : <span className="text-slate-900 dark:text-white font-medium">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
