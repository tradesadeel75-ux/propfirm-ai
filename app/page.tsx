"use client";
import { useState, useRef } from "react";

const DEMO_FIRM = {
  id: "firm_001",
  name: "AlphaFund Pro",
  email: "admin@alphafund.io",
  primaryColor: "#7c6ff7",
  plan: "Pro",
  traders: [
    { id: "PF-001", name: "Ahmed Raza",  phase: "Phase 2", balance: 98450,  dailyLoss: 0.8, drawdown: 1.55, target: 5, days: 12, status: "Active",  violations: 0 },
    { id: "PF-002", name: "Sara Khan",   phase: "Phase 1", balance: 49800,  dailyLoss: 3.2, drawdown: 4.1,  target: 8, days: 6,  status: "Active",  violations: 1 },
    { id: "PF-003", name: "Bilal Ahmed", phase: "Phase 2", balance: 201000, dailyLoss: 0.0, drawdown: 0.5,  target: 5, days: 21, status: "Passed",  violations: 0 },
    { id: "PF-004", name: "Zara Malik",  phase: "Phase 1", balance: 9200,   dailyLoss: 5.1, drawdown: 10.2, target: 8, days: 3,  status: "Failed",  violations: 2 },
    { id: "PF-005", name: "Omar Sheikh", phase: "Phase 2", balance: 102100, dailyLoss: 1.1, drawdown: 2.2,  target: 5, days: 18, status: "Active",  violations: 0 },
  ],
  rules: { dailyLossLimit: 5, maxDrawdown: 10, phase1Target: 8, phase2Target: 5, minDays: 5, payoutSplit: 80, payoutDays: "1-3" },
  embedKey: "ak_live_alphafund_x9f2k",
};

const NAV = [
  { id: "dashboard", label: "Dashboard",    icon: "◈" },
  { id: "traders",   label: "Traders",      icon: "◉" },
  { id: "upload",    label: "Upload Data",  icon: "⊕" },
  { id: "rules",     label: "Rules",        icon: "≡" },
  { id: "branding",  label: "Branding",     icon: "◐" },
  { id: "embed",     label: "Embed Widget", icon: "⟨⟩" },
  { id: "preview",   label: "Preview AI",   icon: "▷" },
];

function statusBadge(s: string) {
  const colors: Record<string, string> = {
    Active: "background:#dcfce7;color:#166534",
    Failed: "background:#fee2e2;color:#991b1b",
    Passed: "background:#dbeafe;color:#1e40af",
  };
  return colors[s] || "background:#f3f4f6;color:#374151";
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [firm, setFirm] = useState(DEMO_FIRM);

  const pages: Record<string, JSX.Element> = {
    dashboard: <Dashboard firm={firm} />,
    traders:   <Traders firm={firm} />,
    upload:    <Upload onUpload={(t) => { setFirm(f => ({ ...f, traders: t })); setPage("traders"); }} />,
    rules:     <Rules firm={firm} onSave={(r) => setFirm(f => ({ ...f, rules: r }))} />,
    branding:  <Branding firm={firm} onSave={(b) => setFirm(f => ({ ...f, ...b }))} />,
    embed:     <Embed firm={firm} />,
    preview:   <PreviewAI firm={firm} />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui,sans-serif", background: "#f9fafb" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#7c6ff7" }}>PropFirm AI</div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Admin Panel</div>
        </div>
        <div style={{ flex: 1, padding: "10px 8px" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 8, border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: 13, marginBottom: 2,
              fontWeight: page === n.id ? 600 : 400,
              background: page === n.id ? "#f5f3ff" : "transparent",
              color: page === n.id ? "#7c6ff7" : "#6b7280",
            }}>
              <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{firm.name}</div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>{firm.plan} · {firm.traders.length} traders</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
        {pages[page]}
      </div>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────
function Dashboard({ firm }: { firm: typeof DEMO_FIRM }) {
  const metrics = [
    { label: "Total Traders", value: firm.traders.length, color: "#7c6ff7" },
    { label: "Active",        value: firm.traders.filter(t => t.status === "Active").length, color: "#22c55e" },
    { label: "Passed",        value: firm.traders.filter(t => t.status === "Passed").length, color: "#3b82f6" },
    { label: "Failed",        value: firm.traders.filter(t => t.status === "Failed").length, color: "#ef4444" },
    { label: "At Risk",       value: firm.traders.filter(t => t.drawdown > 7).length, color: "#f59e0b" },
    { label: "Avg Drawdown",  value: (firm.traders.reduce((a, t) => a + t.drawdown, 0) / firm.traders.length).toFixed(1) + "%", color: "#6b7280" },
  ];
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Dashboard</h2>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>Welcome back, {firm.name}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 24 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 20px" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Recent Traders</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              {["ID", "Name", "Phase", "Balance", "Drawdown", "Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#6b7280", fontWeight: 500, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {firm.traders.map(t => (
              <tr key={t.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                <td style={{ padding: "8px 8px", color: "#7c6ff7", fontFamily: "monospace", fontSize: 12 }}>{t.id}</td>
                <td style={{ padding: "8px 8px", fontWeight: 500 }}>{t.name}</td>
                <td style={{ padding: "8px 8px", color: "#6b7280" }}>{t.phase}</td>
                <td style={{ padding: "8px 8px", fontFamily: "monospace" }}>${t.balance.toLocaleString()}</td>
                <td style={{ padding: "8px 8px", color: t.drawdown > 7 ? "#ef4444" : t.drawdown > 4 ? "#f59e0b" : "#22c55e", fontWeight: 500 }}>{t.drawdown.toFixed(1)}%</td>
                <td style={{ padding: "8px 8px" }}>
                  <span style={{ ...Object.fromEntries(statusBadge(t.status).split(";").map(s => s.split(":")) as any), fontSize: 11, padding: "2px 9px", borderRadius: 20 }}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Traders ──────────────────────────────────────────────
function Traders({ firm }: { firm: typeof DEMO_FIRM }) {
  const [q, setQ] = useState("");
  const filtered = firm.traders.filter(t => t.name.toLowerCase().includes(q.toLowerCase()) || t.id.includes(q));
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827" }}>Traders ({firm.traders.length})</h2>
        <input placeholder="Search..." value={q} onChange={e => setQ(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, fontFamily: "inherit", outline: "none", width: 200 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(t => (
          <div key={t.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#7c6ff7", flexShrink: 0 }}>
              {t.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>{t.id}</div>
            </div>
            {[
              { label: "Phase", value: t.phase },
              { label: "Balance", value: "$" + t.balance.toLocaleString() },
              { label: "Drawdown", value: t.drawdown.toFixed(1) + "%" },
              { label: "Daily Loss", value: t.dailyLoss.toFixed(1) + "%" },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center", minWidth: 80 }}>
                <div style={{ fontSize: 11, color: "#6b7280" }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</div>
              </div>
            ))}
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: t.status === "Active" ? "#dcfce7" : t.status === "Failed" ? "#fee2e2" : "#dbeafe", color: t.status === "Active" ? "#166534" : t.status === "Failed" ? "#991b1b" : "#1e40af", fontWeight: 500 }}>
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Upload ───────────────────────────────────────────────
function Upload({ onUpload }: { onUpload: (t: any[]) => void }) {
  const [drag, setDrag] = useState(false);
  const [parsed, setParsed] = useState<any[] | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  function parse(text: string) {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    return lines.slice(1).map(line => {
      const vals = line.split(",");
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => obj[h] = vals[i]?.trim() || "");
      return {
        id: obj.id || `PF-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        name: obj.name || "Unknown",
        phase: obj.phase || "Phase 1",
        balance: parseFloat(obj.balance) || 0,
        dailyLoss: parseFloat(obj.daily_loss || obj.dailyloss) || 0,
        drawdown: parseFloat(obj.drawdown) || 0,
        target: parseFloat(obj.target || obj.profit_target) || 8,
        days: parseInt(obj.days || obj.days_traded) || 0,
        status: obj.status || "Active",
        violations: parseInt(obj.violations) || 0,
      };
    });
  }

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = e => setParsed(parse(e.target!.result as string));
    reader.readAsText(file);
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 6 }}>Upload Trader Data</h2>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>CSV file upload karein — AI agent is data se jawab dega</p>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Required columns:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["id","name","phase","balance","daily_loss","drawdown","target","days","status","violations"].map(c => (
            <span key={c} style={{ fontSize: 11, fontFamily: "monospace", background: "#f3f4f6", padding: "3px 8px", borderRadius: 6 }}>{c}</span>
          ))}
        </div>
      </div>
      <div onClick={() => ref.current?.click()} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
        style={{ border: `2px dashed ${drag ? "#7c6ff7" : "#e5e7eb"}`, borderRadius: 12, padding: "2.5rem", textAlign: "center", background: drag ? "#f5f3ff" : "#fafafa", cursor: "pointer", marginBottom: 16 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>CSV file yahan drop karein ya click karein</div>
        <input ref={ref} type="file" accept=".csv" style={{ display: "none" }} onChange={e => e.target.files && handleFile(e.target.files[0])} />
      </div>
      {parsed && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 600 }}>{parsed.length} traders found</div>
            <button onClick={() => onUpload(parsed)} style={{ background: "#7c6ff7", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
              Import ✓
            </button>
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>First 3: {parsed.slice(0, 3).map(t => t.name).join(", ")}...</div>
        </div>
      )}
    </div>
  );
}

// ── Rules ────────────────────────────────────────────────
function Rules({ firm, onSave }: { firm: typeof DEMO_FIRM; onSave: (r: any) => void }) {
  const [rules, setRules] = useState({ ...firm.rules });
  const [saved, setSaved] = useState(false);
  function save() { onSave(rules); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827" }}>Rules & Config</h2>
        <button onClick={save} style={{ background: saved ? "#22c55e" : "#7c6ff7", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
          {saved ? "Saved ✓" : "Save Rules"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { title: "Loss Limits", fields: [{ label: "Daily Loss Limit (%)", key: "dailyLossLimit" }, { label: "Max Drawdown (%)", key: "maxDrawdown" }] },
          { title: "Profit Targets", fields: [{ label: "Phase 1 Target (%)", key: "phase1Target" }, { label: "Phase 2 Target (%)", key: "phase2Target" }, { label: "Min Trading Days", key: "minDays" }] },
          { title: "Payout", fields: [{ label: "Trader Split (%)", key: "payoutSplit" }, { label: "Processing Days", key: "payoutDays" }] },
        ].map(section => (
          <div key={section.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>{section.title}</div>
            {section.fields.map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4, fontWeight: 500 }}>{f.label}</label>
                <input type={f.key === "payoutDays" ? "text" : "number"} value={(rules as any)[f.key]}
                  onChange={e => setRules(r => ({ ...r, [f.key]: f.key === "payoutDays" ? e.target.value : parseFloat(e.target.value) }))}
                  style={{ padding: "8px 11px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, fontFamily: "inherit", outline: "none", width: 120 }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Branding ─────────────────────────────────────────────
function Branding({ firm, onSave }: { firm: typeof DEMO_FIRM; onSave: (b: any) => void }) {
  const [name, setName] = useState(firm.name);
  const [color, setColor] = useState(firm.primaryColor);
  const [saved, setSaved] = useState(false);
  function save() { onSave({ name, primaryColor: color }); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827" }}>Branding</h2>
        <button onClick={save} style={{ background: saved ? "#22c55e" : "#7c6ff7", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
          {saved ? "Saved ✓" : "Save"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Firm Identity</div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4, fontWeight: 500 }}>Firm Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              style={{ padding: "8px 11px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, fontFamily: "inherit", outline: "none", width: "100%" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4, fontWeight: 500 }}>Primary Color</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                style={{ width: 48, height: 36, border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer", padding: 2 }} />
              <input value={color} onChange={e => setColor(e.target.value)}
                style={{ padding: "8px 11px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, fontFamily: "monospace", outline: "none", width: 110 }} />
            </div>
          </div>
        </div>
        <div style={{ background: "#0d0f1a", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e2235", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{name}</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#4ade80" }}>● Live</span>
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>AI</div>
              <div style={{ background: "#151929", border: "1px solid #1e2235", borderRadius: "3px 12px 12px 12px", padding: "8px 11px", fontSize: 12, color: "#d1d5db" }}>
                Assalam o Alaikum! Main {name} ka AI agent hoon.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Embed ────────────────────────────────────────────────
function Embed({ firm }: { firm: typeof DEMO_FIRM }) {
  const [copied, setCopied] = useState(false);
  const code = `<script src="https://your-domain.vercel.app/widget.js"\n  data-key="${firm.embedKey}"\n  data-color="${firm.primaryColor}">\n</script>`;
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 6 }}>Embed Widget</h2>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>Yeh code PropFirm ki website pe lagao</p>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Your Embed Code</div>
          <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{ background: copied ? "#dcfce7" : "#f3f4f6", color: copied ? "#166534" : "#374151", border: "1px solid #e5e7eb", borderRadius: 7, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <pre style={{ background: "#0d0f1a", color: "#a89ff5", padding: 14, borderRadius: 8, fontSize: 12, fontFamily: "monospace", overflowX: "auto", lineHeight: 1.6 }}>{code}</pre>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[{ label: "API Key", value: firm.embedKey }, { label: "Plan", value: firm.plan }, { label: "Status", value: "Active" }].map(i => (
            <div key={i.label} style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 3 }}>{i.label}</div>
              <div style={{ fontSize: 12, fontWeight: 500, wordBreak: "break-all", fontFamily: "monospace" }}>{i.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Preview AI ───────────────────────────────────────────
function PreviewAI({ firm }: { firm: typeof DEMO_FIRM }) {
  const [messages, setMessages] = useState([{ role: "ai", text: `Assalam o Alaikum! Main ${firm.name} ka AI support agent hoon. Koi bhi sawal karein!` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);

  const sys = `You are AI support agent for "${firm.name}". Rules: daily loss ${firm.rules.dailyLossLimit}%, drawdown ${firm.rules.maxDrawdown}%, Phase1 target ${firm.rules.phase1Target}%, Phase2 target ${firm.rules.phase2Target}%, min ${firm.rules.minDays} days, payout split ${firm.rules.payoutSplit}%.
Traders: ${firm.traders.map(t => `${t.id}|${t.name}|${t.phase}|$${t.balance}|DD:${t.drawdown}%|Status:${t.status}`).join(", ")}
IMPORTANT: Reply in same language as user. Be concise under 100 words.`;

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const newHist = [...history, { role: "user", content: text }];
    setMessages(m => [...m, { role: "user", text }]);
    setHistory(newHist);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHist, system: sys }),
      });
      const data = await res.json();
      const reply = data.reply || "Error. Dobara koshish karein.";
      setHistory(h => [...h, { role: "assistant", content: reply }]);
      setMessages(m => [...m, { role: "ai", text: reply }]);
    } catch { setMessages(m => [...m, { role: "ai", text: "Connection error." }]); }
    setLoading(false);
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 6 }}>Preview AI Agent</h2>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Real Claude AI se test karein</p>
      <div style={{ background: "#0d0f1a", borderRadius: 14, overflow: "hidden", border: "1px solid #1e2235" }}>
        <div style={{ background: "#0d0f1a", borderBottom: "1px solid #1e2235", padding: "11px 16px", display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: firm.primaryColor }} />
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{firm.name} Support</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#4ade80" }}>● Claude AI Live</span>
        </div>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12, minHeight: 280, maxHeight: 340, overflowY: "auto" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.role === "ai" ? firm.primaryColor : "#1e2235", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                {m.role === "ai" ? "AI" : "U"}
              </div>
              <div style={{ maxWidth: "80%", padding: "9px 12px", borderRadius: m.role === "user" ? "12px 3px 12px 12px" : "3px 12px 12px 12px", fontSize: 13, lineHeight: 1.6, background: m.role === "user" ? `${firm.primaryColor}33` : "#151929", border: `1px solid ${m.role === "user" ? firm.primaryColor + "55" : "#1e2235"}`, color: "#d1d5db", whiteSpace: "pre-wrap" }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: firm.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>AI</div>
              <div style={{ padding: "12px 14px", background: "#151929", border: "1px solid #1e2235", borderRadius: "3px 12px 12px 12px", color: "#6b7280", fontSize: 13 }}>Typing...</div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 14px 10px" }}>
          {["PF-001 ka status?", "Who can get payout?", "Drawdown rules kya hain?"].map(q => (
            <button key={q} onClick={() => send(q)} style={{ fontSize: 11, padding: "4px 9px", borderRadius: 7, border: "1px solid #2a2f45", background: "#10121e", color: "#9ca3af", cursor: "pointer", fontFamily: "inherit" }}>{q}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, padding: "10px 14px", borderTop: "1px solid #1e2235" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
            placeholder="Koi bhi sawal karein..." style={{ flex: 1, background: "#10121e", border: "1px solid #1e2235", color: "#d1d5db", fontSize: 13, fontFamily: "inherit", borderRadius: 9, padding: "9px 12px", outline: "none" }} />
          <button onClick={() => send(input)} disabled={loading} style={{ background: loading ? "#2a2f45" : firm.primaryColor, border: "none", color: "#fff", width: 38, height: 38, borderRadius: 9, cursor: "pointer", fontSize: 15 }}>➤</button>
        </div>
      </div>
    </div>
  );
}
