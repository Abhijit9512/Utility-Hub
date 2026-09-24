import fs from "fs";
import path from "path";
const siteUrl = "https://utilityhub.example.com";
const categorySlugs = ["pdf-tools","image-tools","text-tools","calculator-tools","time-tools","qr-tools","developer-tools","security-tools","student-tools","career-tools"];
const staticPages = ["about","contact","privacy-policy","terms-of-service","disclaimer","cookie-information"];
const content = fs.readFileSync(path.resolve("src/data/tools.ts"), "utf-8");
// Split by tool object start: look for id:
const parts = content.split(/id:\s*"/);
const tools=[];
for(let i=1;i<parts.length;i++){
  const block = parts[i];
  // block starts with e.g. merge-pdf",\n slug: "merge-pdf", ... category: "pdf",
  const slugMatch = block.match(/slug:\s*"([^"]+)"/);
  const catMatch = block.match(/category:\s*"([^"]+)"/);
  if(slugMatch && catMatch){
    const slug = slugMatch[1];
    const cat = catMatch[1];
    const valid = ["pdf","image","text","calculators","time","qr","developer","security","student","career"];
    if(valid.includes(cat)){
      tools.push({category:cat, slug});
    }
  }
}
console.log("found tools", tools.length);
console.log(tools.slice(0,10));
const urls = [
  siteUrl + "/",
  ...categorySlugs.map(s=> siteUrl + "/" + s),
  ...staticPages.map(s=> siteUrl + "/" + s),
  ...tools.map(t=> `${siteUrl}/${t.category}/${t.slug}`)
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u=> `  <url><loc>${u}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.resolve("public/sitemap.xml"), xml);
try{ fs.writeFileSync(path.resolve("dist/sitemap.xml"), xml); }catch{}
console.log(`Generated sitemap with ${urls.length} URLs`);
