import { Link } from "react-router-dom";
import { ToolGrid } from "../components/common/ToolCard";
import { tools } from "../data/tools";

export function NotFound() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
      <div className="text-7xl">🔍</div>
      <h1 className="text-3xl font-extrabold mt-4 dark:text-white">Page not found</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2">The page you’re looking for doesn’t exist or has moved.</p>
      <div className="flex justify-center gap-3 mt-6">
        <Link to="/" className="btn-primary">Go home</Link>
        <Link to="/pdf-tools" className="btn-secondary">Browse PDF tools</Link>
      </div>
      <div className="mt-10">
        <h3 className="font-semibold dark:text-white">Try our popular tools</h3>
        <div className="mt-4"><ToolGrid tools={tools.filter(t=>t.featured).slice(0,4)} /></div>
      </div>
    </div>
  );
}
