import { useState, useEffect } from "react";
import QRCode from "qrcode";

type QrType = "url"|"text"|"wifi"|"email"|"phone"|"vcard"|"sms";

export default function QRGenerator({ initialType = "url" }: { initialType?: QrType }) {
  const [type, setType] = useState<QrType>(initialType);
  const [url, setUrl] = useState("https://utilityhub.example.com");
  const [text, setText] = useState("Hello from UtilityHub!");
  const [wifiSsid, setWifiSsid] = useState("MyWiFi");
  const [wifiPass, setWifiPass] = useState("password123");
  const [wifiEnc, setWifiEnc] = useState("WPA");
  const [email, setEmail] = useState("hello@example.com");
  const [emailSubject, setEmailSubject] = useState("Hello");
  const [phone, setPhone] = useState("+919876543210");
  const [sms, setSms] = useState("+919876543210");
  const [smsBody, setSmsBody] = useState("Hi!");
  const [vcard, setVcard] = useState({ name:"John Doe", phone:"+911234567890", email:"john@example.com", org:"Acme" });
  const [dataUrl, setDataUrl] = useState<string>("");
  const [error, setError] = useState("");

  const payload = (()=> {
    switch(type){
      case "url": return url;
      case "text": return text;
      case "wifi": return `WIFI:T:${wifiEnc};S:${wifiSsid};P:${wifiPass};;`;
      case "email": return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}`;
      case "phone": return `tel:${phone}`;
      case "sms": return `SMSTO:${sms}:${smsBody}`;
      case "vcard": return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcard.name}\nORG:${vcard.org}\nTEL:${vcard.phone}\nEMAIL:${vcard.email}\nEND:VCARD`;
      default: return text;
    }
  })();

  useEffect(()=>{
    if(!payload) { setDataUrl(""); return; }
    QRCode.toDataURL(payload, { width: 512, margin: 2, errorCorrectionLevel: "M" }).then(setDataUrl).catch(e=> setError(e.message));
  },[payload]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {(["url","text","wifi","email","phone","vcard","sms"] as QrType[]).map(t=> <button key={t} onClick={()=> setType(t)} className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border ${type===t?'bg-blue-600 text-white border-blue-600':'bg-white dark:bg-slate-900 dark:text-white'}`}>{t}</button>)}
        </div>
        {type==="url" && <label className="text-sm dark:text-white">URL<input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com" className="input mt-1" /></label>}
        {type==="text" && <label className="text-sm dark:text-white">Text<textarea value={text} onChange={e=>setText(e.target.value)} rows={4} className="input mt-1" /></label>}
        {type==="wifi" && <div className="space-y-2">
          <input value={wifiSsid} onChange={e=>setWifiSsid(e.target.value)} placeholder="SSID" className="input" />
          <input value={wifiPass} onChange={e=>setWifiPass(e.target.value)} placeholder="Password" className="input" />
          <select value={wifiEnc} onChange={e=>setWifiEnc(e.target.value)} className="input"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">No password</option></select>
        </div>}
        {type==="email" && <div className="space-y-2"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="input" /><input value={emailSubject} onChange={e=>setEmailSubject(e.target.value)} placeholder="Subject" className="input" /></div>}
        {type==="phone" && <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91..." className="input" />}
        {type==="sms" && <div className="space-y-2"><input value={sms} onChange={e=>setSms(e.target.value)} placeholder="Phone" className="input" /><input value={smsBody} onChange={e=>setSmsBody(e.target.value)} placeholder="Message" className="input" /></div>}
        {type==="vcard" && <div className="space-y-2"><input value={vcard.name} onChange={e=>setVcard({...vcard,name:e.target.value})} placeholder="Full name" className="input" /><input value={vcard.phone} onChange={e=>setVcard({...vcard,phone:e.target.value})} placeholder="Phone" className="input" /><input value={vcard.email} onChange={e=>setVcard({...vcard,email:e.target.value})} placeholder="Email" className="input" /><input value={vcard.org} onChange={e=>setVcard({...vcard,org:e.target.value})} placeholder="Organization" className="input" /></div>}
        <div className="text-xs font-mono p-2 bg-slate-50 border rounded-xl break-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">{payload.slice(0,300)}</div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="text-xs text-slate-500 dark:text-slate-400">QR generated locally in your browser (qrcode lib). No upload.</div>
      </div>
      <div className="card text-center space-y-3">
        {dataUrl ? <img src={dataUrl} alt="QR Code" className="w-full max-w-[320px] mx-auto border rounded-2xl p-2 bg-white" /> : <div className="h-64 flex items-center justify-center text-slate-400">Generating…</div>}
        {dataUrl && <div className="flex justify-center gap-2"><a href={dataUrl} download={`qr-${type}.png`} className="btn-primary text-sm">Download PNG</a><button onClick={()=> navigator.clipboard.writeText(payload)} className="btn-secondary text-sm">Copy data</button></div>}
      </div>
    </div>
  );
}
