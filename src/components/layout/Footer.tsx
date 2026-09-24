import { Link } from "react-router-dom";
import { siteConfig } from "../../config/site";

export function Footer() {
  return (
    <footer className="bg-[#33333B] text-white mt-12">
      <div className="max-w-[1280px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-1.5">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="26" height="26" rx="7" fill="#E30613"/><path d="M9.4 8.8H11.9V15.4C11.9 17.3 12.7 18.2 14.3 18.2C15.9 18.2 16.7 17.3 16.7 15.4V8.8H19.2V15.6C19.2 19.1 17 20.9 14.3 20.9C11.6 20.9 9.4 19.1 9.4 15.6V8.8Z" fill="white"/></svg>
              <span className="text-[18px] font-bold"><span className="text-white">Utility</span><span className="text-[#E30613]">Hub</span></span>
            </Link>
            <p className="text-sm text-white/60 mt-3 leading-relaxed">All-in-one PDF toolkit — 100% free, secure and easy to use. Merge, split, compress, convert and edit documents privately in your browser.</p>
            <div className="mt-4 flex gap-2">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 cursor-pointer">f</span>
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 cursor-pointer">𝕏</span>
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 cursor-pointer">in</span>
            </div>
          </div>
          <div>
            <div className="font-bold text-sm mb-4 text-white tracking-wide">PRODUCT</div>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/pdf-tools" className="hover:text-white">PDF Tools</Link></li>
              <li><Link to="/image-tools" className="hover:text-white">Image Tools</Link></li>
              <li><Link to="/text-tools" className="hover:text-white">Text Tools</Link></li>
              <li><Link to="/about" className="hover:text-white">Features</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-sm mb-4 text-white tracking-wide">SOLUTIONS</div>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/developer-tools" className="hover:text-white">Developer Tools</Link></li>
              <li><Link to="/security-tools" className="hover:text-white">Security</Link></li>
              <li><Link to="/student-tools" className="hover:text-white">Education</Link></li>
              <li><Link to="/career-tools" className="hover:text-white">Business</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-sm mb-4 text-white tracking-wide">LEGAL</div>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white">Terms</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-sm text-white/40">
          <div>© {new Date().getFullYear()} {siteConfig.brand} — Original code, privacy-first. All processing is secure and transparent.</div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-white/10 text-white text-xs">EN</span>
            <span>🌐 English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
