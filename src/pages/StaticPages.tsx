import { SEO } from "../components/seo/SEO";
import { siteConfig } from "../config/site";

function Wrapper({ title, h1, children, desc }: { title:string, h1:string, children: React.ReactNode, desc?:string }) {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-10">
      <SEO title={title} description={desc || title} canonical={siteConfig.url + "/" + title.toLowerCase().replace(/\s+/g,"-")} />
      <h1 className="text-3xl font-extrabold dark:text-white">{h1}</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none mt-6 leading-relaxed text-slate-700 dark:text-slate-300">{children}</div>
    </div>
  );
}

export function About() {
  return (
    <Wrapper title={`About — ${siteConfig.brand}`} h1={`About ${siteConfig.brand}`} desc="Learn about our free utility tools platform.">
      <p><strong>{siteConfig.brand}</strong> is a free, fast, privacy-focused platform for everyday work: PDF, image, text, calculators, time, QR, developer, security, student and career tools.</p>
      <p>We prioritize <em>real functionality</em> over inflated tool counts, <em>user experience</em> over ad density, and <em>accurate privacy claims</em> over marketing.</p>
      <h3>Principles</h3>
      <ul>
        <li>Free for normal users — no paywalls, no mandatory accounts.</li>
        <li>Client-side processing where technically possible (File API, Canvas, Web Crypto, pdf-lib, PDF.js).</li>
        <li>AdSense only — never deceptive ads over buttons or upload zones.</li>
        <li>Accessible, mobile-first, SEO-clean architecture.</li>
      </ul>
      <p>Brand name and URL are configured centrally in <code>src/config/site.ts</code> for easy rebranding.</p>
    </Wrapper>
  );
}

export function Contact() {
  return (
    <Wrapper title={`Contact — ${siteConfig.brand}`} h1="Contact" desc="Contact us.">
      <p>Have a question, bug report, or tool request? Reach us at:</p>
      <p><strong>Email:</strong> <a href={`mailto:${siteConfig.contactEmail}`} className="text-blue-600">{siteConfig.contactEmail}</a> (placeholder — update in site config)</p>
      <p>We aim to reply within 2–3 business days. This is a template contact page — replace with your real support channel before launch.</p>
    </Wrapper>
  );
}

export function Privacy() {
  return (
    <Wrapper title={`Privacy Policy — ${siteConfig.brand}`} h1="Privacy Policy" desc="Privacy policy template.">
      <p><em>Template — not legal advice. Have a lawyer review before production use.</em></p>
      <h3>Overview</h3>
      <p>We process files in your browser where possible. For tools marked “processed in your browser and not uploaded”, your files never leave your device.</p>
      <h3>Data we collect</h3>
      <ul>
        <li>Basic aggregated analytics (optional, anonymized) — page views, tool usage — no personal data.</li>
        <li>We do not store uploaded file contents on our servers for client-side tools.</li>
      </ul>
      <h3>Cookies</h3>
      <p>We may use essential cookies and, if enabled, analytics/ads cookies. See Cookie Information.</p>
      <h3>Contact</h3>
      <p>Questions: <a href={`mailto:${siteConfig.contactEmail}`} className="text-blue-600">{siteConfig.contactEmail}</a></p>
      <p>Last updated: {new Date().toISOString().slice(0,10)}</p>
    </Wrapper>
  );
}

export function Terms() {
  return (
    <Wrapper title={`Terms of Service — ${siteConfig.brand}`} h1="Terms of Service" desc="Terms template.">
      <p><em>Template — not legal advice.</em></p>
      <p>By using {siteConfig.brand}, you agree to use tools as-is, without warranty. Do not abuse, attempt to breach, or use tools for illegal purposes.</p>
      <h3>Accuracy</h3>
      <p>Calculators provide estimates (GST, EMI, SIP, etc.) and are not professional financial/tax advice. Verify with qualified professionals.</p>
      <h3>Liability</h3>
      <p>We are not liable for damages from use of free tools.</p>
    </Wrapper>
  );
}

export function Disclaimer() {
  return (
    <Wrapper title={`Disclaimer — ${siteConfig.brand}`} h1="Disclaimer" desc="Disclaimer.">
      <p>All tools are provided “as is” without warranties. Financial calculators are estimates based on documented formulas and assumptions — not official advice. Security tools do not replace professional audits. Validate critical results independently.</p>
      <p>We do not claim AI functionality unless explicitly documented (e.g., local model). Resume analyzers etc. are rule-based.</p>
    </Wrapper>
  );
}

export function CookieInfo() {
  return (
    <Wrapper title={`Cookie Information — ${siteConfig.brand}`} h1="Cookie Information" desc="Cookie info.">
      <p>We use essential cookies for theme preference and, if you consent, analytics/advertising cookies (e.g., Google AdSense/Analytics). You can control cookies via your browser settings.</p>
      <h3>Types</h3>
      <ul>
        <li><strong>Essential:</strong> theme choice (localStorage).</li>
        <li><strong>Analytics (optional):</strong> aggregated usage.</li>
        <li><strong>Advertising (optional):</strong> AdSense.</li>
      </ul>
      <p>We do not set intrusive tracking beyond what you configure.</p>
    </Wrapper>
  );
}
