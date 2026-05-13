"use client";
import { useState } from "react";

const traders = [
  { id:"PF-001", name:"Ahmed Raza",  phase:"Phase 2", balance:98450,  dailyLoss:0.8, drawdown:1.55, status:"Active",  violations:0 },
  { id:"PF-002", name:"Sara Khan",   phase:"Phase 1", balance:49800,  dailyLoss:3.2, drawdown:4.1,  status:"Active",  violations:1 },
  { id:"PF-003", name:"Bilal Ahmed", phase:"Phase 2", balance:201000, dailyLoss:0.0, drawdown:0.5,  status:"Passed",  violations:0 },
  { id:"PF-004", name:"Zara Malik",  phase:"Phase 1", balance:9200,   dailyLoss:5.1, drawdown:10.2, status:"Failed",  violations:2 },
  { id:"PF-005", name:"Omar Sheikh", phase:"Phase 2", balance:102100, dailyLoss:1.1, drawdown:2.2,  status:"Active",  violations:0 },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [color, setColor] = useState("#7c6ff7");
  const [firmName, setFirmName] = useState("AlphaFund Pro");

  const nav = [
    { id:"dashboard", label:"Dashboard" },
    { id:"traders",   label:"Traders" },
    { id:"rules",     label:"Rules" },
    { id:"branding",  label:"Branding" },
    { id:"embed",     label:"Embed Widget" },
    { id:"preview",   label:"Preview AI" },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"system-ui,sans-serif", background:"#f9fafb" }}>
      <div style={{ width:210, background:"#fff", borderRight:"1px solid #e5e7eb", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"18px 16px 14px", borderBottom:"1px solid #e5e7eb" }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#7c6ff7" }}>PropFirm AI</div>
          <div style={{ fontSize:11, color:"#9ca3af" }}>Admin Panel</div>
        </div>
        <div style={{ padding:"10px 8px", flex:1 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              width:"100%", textAlign:"left", padding:"10px 12px", borderRadius:8,
              border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13,
              marginBottom:2, display:"block",
              fontWeight: page===n.id ? 600 : 400,
              background: page===n.id ? "#f5f3ff" : "transparent",
              color: page===n.id ? "#7c6ff7" : "#6b7280",
            }}>{n.label}</button>
          ))}
        </div>
        <div style={{ padding:"12px 16px", borderTop:"1px solid #e5e7eb" }}>
          <div style={{ fontSize:12, fontWeight:500 }}>{firmName}</div>
          <div style={{ fontSize:11, color:"#9ca3af" }}>{traders.length} traders</div>
        </div>
      </div>

      <div style={{ flex:1, padding:28, overflowY:"auto" }}>

        {page==="dashboard" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:6, color:"#111827" }}>Dashboard</h2>
            <p style={{ color:"#6b7280", fontSize:13, marginBottom:20 }}>Welcome back, {firmName}</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10, marginBottom:24 }}>
              {[
                { label:"Total Traders", value:traders.length, c:"#7c6ff7" },
                { label:"Active", value:traders.filter(t=>t.status==="Active").length, c:"#22c55e" },
                { label:"Passed", value:traders.filter(t=>t.status==="Passed").length, c:"#3b82f6" },
                { label:"Failed", value:traders.filter(t=>t.status==="Failed").length, c:"#ef4444" },
                { label:"At Risk", value:traders.filter(t=>t.drawdown>7).length, c:"#f59e0b" },
                { label:"Avg Drawdown", value:(traders.reduce((a,t)=>a+t.drawdown,0)/traders.length).toFixed(1)+"%", c:"#6b7280" },
              ].map(m=>(
                <div key={m.label} style={{ background:"#fff", borderRadius:10, padding:"14px 16px", border:"1px solid #e5e7eb" }}>
                  <div style={{ fontSize:24, fontWeight:700, color:m.c }}>{m.value}</div>
                  <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"16px 20px" }}>
              <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>Recent Traders</div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr>{["ID","Name","Phase","Balance","Drawdown","Status"].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"6px 8px", color:"#6b7280", fontWeight:500, fontSize:11, borderBottom:"1px solid #f3f4f6" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {traders.map(t=>(
                    <tr key={t.id} style={{ borderBottom:"1px solid #f9fafb" }}>
                      <td style={{ padding:"8px", color:"#7c6ff7", fontFamily:"monospace", fontSize:12 }}>{t.id}</td>
                      <td style={{ padding:"8px", fontWeight:500 }}>{t.name}</td>
                      <td style={{ padding:"8px", color:"#6b7280" }}>{t.phase}</td>
                      <td style={{ padding:"8px", fontFamily:"monospace" }}>${t.balance.toLocaleString()}</td>
                      <td style={{ padding:"8px", color:t.drawdown>7?"#ef4444":t.drawdown>4?"#f59e0b":"#22c55e", fontWeight:500 }}>{t.drawdown.toFixed(1)}%</td>
                      <td style={{ padding:"8px" }}>
                        <span style={{ fontSize:11, padding:"2px 10px", borderRadius:20, fontWeight:500,
                          background:t.status==="Active"?"#dcfce7":t.status==="Failed"?"#fee2e2":"#dbeafe",
                          color:t.status==="Active"?"#166534":t.status==="Failed"?"#991b1b":"#1e40af"
                        }}>{t.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {page==="traders" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20, color:"#111827" }}>Traders ({traders.length})</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {traders.map(t=>(
                <div key={t.id} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, color:"#7c6ff7", flexShrink:0 }}>
                    {t.name.split(" ").map((n: string)=>n[0]).join("")}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:"#9ca3af", fontFamily:"monospace" }}>{t.id} · {t.phase}</div>
                  </div>
                  <div style={{ textAlign:"center", minWidth:90 }}>
                    <div style={{ fontSize:11, color:"#6b7280" }}>Balance</div>
                    <div style={{ fontSize:13, fontWeight:600 }}>${t.balance.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign:"center", minWidth:80 }}>
                    <div style={{ fontSize:11, color:"#6b7280" }}>Drawdown</div>
                    <div style={{ fontSize:13, fontWeight:600, color:t.drawdown>7?"#ef4444":t.drawdown>4?"#f59e0b":"#22c55e" }}>{t.drawdown.toFixed(1)}%</div>
                  </div>
                  <div style={{ textAlign:"center", minWidth:70 }}>
                    <div style={{ fontSize:11, color:"#6b7280" }}>Daily Loss</div>
                    <div style={{ fontSize:13, fontWeight:600, color:t.dailyLoss>4?"#ef4444":"#111827" }}>{t.dailyLoss.toFixed(1)}%</div>
                  </div>
                  <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:500,
                    background:t.status==="Active"?"#dcfce7":t.status==="Failed"?"#fee2e2":"#dbeafe",
                    color:t.status==="Active"?"#166534":t.status==="Failed"?"#991b1b":"#1e40af"
                  }}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {page==="rules" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20, color:"#111827" }}>Rules & Config</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[
                { title:"Loss Limits", items:[["Daily Loss Limit","5%"],["Max Drawdown","10%"]] },
                { title:"Profit Targets", items:[["Phase 1 Target","8%"],["Phase 2 Target","5%"],["Min Trading Days","5 days"]] },
                { title:"Payout", items:[["Trader Split","80%"],["Firm Share","20%"],["Processing","1-3 days"]] },
                { title:"Restrictions", items:[["Weekend Holding","Not Allowed"],["News Trading","Restricted ±2min"]] },
              ].map(s=>(
                <div key={s.title} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"16px 20px" }}>
                  <div style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>{s.title}</div>
                  {s.items.map(([k,v])=>(
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f3f4f6" }}>
                      <span style={{ fontSize:13, color:"#6b7280" }}>{k}</span>
                      <span style={{ fontSize:13, fontWeight:600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {page==="branding" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20, color:"#111827" }}>Branding</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"16px 20px" }}>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Firm Identity</div>
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4, fontWeight:500 }}>Firm Name</label>
                  <input value={firmName} onChange={e=>setFirmName(e.target.value)}
                    style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1px solid #d1d5db", fontSize:13, fontFamily:"inherit", outline:"none" }} />
                </div>
                <div>
                  <label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4, fontWeight:500 }}>Primary Color</label>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <input type="color" value={color} onChange={e=>setColor(e.target.value)}
                      style={{ width:48, height:36, border:"1px solid #e5e7eb", borderRadius:8, cursor:"pointer", padding:2 }} />
                    <span style={{ fontSize:13, fontFamily:"monospace" }}>{color}</span>
                  </div>
                </div>
              </div>
              <div style={{ background:"#0d0f1a", borderRadius:12, overflow:"hidden" }}>
                <div style={{ padding:"12px 16px", borderBottom:"1px solid #1e2235", display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:color }} />
                  <span style={{ color:"#fff", fontSize:14, fontWeight:600 }}>{firmName}</span>
                  <span style={{ marginLeft:"auto", fontSize:10, color:"#4ade80" }}>● Live</span>
                </div>
                <div style={{ padding:14 }}>
                  <div style={{ display:"flex", gap:8 }}>
                    <div style={{ width:26, height:26, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", fontWeight:700 }}>AI</div>
                    <div style={{ background:"#151929", border:"1px solid #1e2235", borderRadius:"3px 12px 12px 12px", padding:"8px 11px", fontSize:12, color:"#d1d5db" }}>
                      Assalam o Alaikum! Main {firmName} ka AI agent hoon.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {page==="embed" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:6, color:"#111827" }}>Embed Widget</h2>
            <p style={{ color:"#6b7280", fontSize:13, marginBottom:20 }}>Yeh code PropFirm ki website pe lagao</p>
            <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"16px 20px" }}>
              <pre style={{ background:"#0d0f1a", color:"#a89ff5", padding:16, borderRadius:8, fontSize:12, fontFamily:"monospace", overflowX:"auto", lineHeight:1.7 }}>
{`<script 
  src="https://your-domain.vercel.app/widget.js"
  data-key="ak_live_alphafund_x9f2k"
  data-color="${color}">
</script>`}
              </pre>
            </div>
          </div>
        )}

        {page==="preview" && <PreviewAI firmName={firmName} color={color} />}
      </div>
    </div>
  );
}

function PreviewAI({ firmName, color }: { firmName: string; color: string }) {
  const [messages, setMessages] = useState([
    { role:"ai", text:`Assalam o Alaikum! Main ${firmName} ka AI agent hoon. Koi bhi sawal karein!` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{role:string;content:string}[]>([]);

  const sys = `You are AI support for "${firmName}". Traders: PF-001 Ahmed Raza Phase2 $98450 DD:1.55% Active, PF-002 Sara Khan Phase1 $49800 DD:4.1% Active, PF-003 Bilal Ahmed Phase2 $201000 Passed, PF-004 Zara Malik Phase1 $9200 DD:10.2% Failed, PF-005 Omar Sheikh Phase2 $102100 Active. Rules: daily loss 5%, drawdown 10%, Phase1 8%, Phase2 5%, payout 80/20. Reply in user's language. Max 100 words.`;

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const newHist = [...history, { role:"user", content:text }];
    setMessages(m=>[...m,{role:"user",text}]);
    setHistory(newHist);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({messages:newHist,system:sys}) });
      const data = await res.json();
      const reply = data.reply || "Error.";
      setHistory(h=>[...h,{role:"assistant",content:reply}]);
      setMessages(m=>[...m,{role:"ai",text:reply}]);
    } catch { setMessages(m=>[...m,{role:"ai",text:"Connection error."}]); }
    setLoading(false);
  }

  return (
    <div>
      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:6, color:"#111827" }}>Preview AI Agent</h2>
      <p style={{ color:"#6b7280", fontSize:13, marginBottom:16 }}>Real Claude AI se test karein</p>
      <div style={{ background:"#0d0f1a", borderRadius:14, overflow:"hidden", border:"1px solid #1e2235" }}>
        <div style={{ padding:"11px 16px", borderBottom:"1px solid #1e2235", display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:color }} />
          <span style={{ color:"#fff", fontSize:14, fontWeight:600 }}>{firmName} Support</span>
          <span style={{ marginLeft:"auto", fontSize:10, color:"#4ade80" }}>● Live</span>
        </div>
        <div style={{ padding:14, display:"flex", flexDirection:"column", gap:12, minHeight:240, maxHeight:300, overflowY:"auto" }}>
          {messages.map((m,i)=>(
            <div key={i} style={{ display:"flex", gap:8, flexDirection:m.role==="user"?"row-reverse":"row" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:m.role==="ai"?color:"#1e2235", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", fontWeight:700, flexShrink:0 }}>
                {m.role==="ai"?"AI":"U"}
              </div>
              <div style={{ maxWidth:"80%", padding:"9px 12px", fontSize:13, lineHeight:1.6, color:"#d1d5db", whiteSpace:"pre-wrap",
                borderRadius:m.role==="user"?"12px 3px 12px 12px":"3px 12px 12px 12px",
                background:m.role==="user"?`${color}33`:"#151929",
                border:`1px solid ${m.role==="user"?color+"55":"#1e2235"}`
              }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", fontWeight:700 }}>AI</div>
              <div style={{ padding:"10px 14px", background:"#151929", border:"1px solid #1e2235", borderRadius:"3px 12px 12px 12px", color:"#6b7280", fontSize:13 }}>Typing...</div>
            </div>
          )}
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"0 14px 10px" }}>
          {["PF-001 ka status?","Who can get payout?","Drawdown rules?","Sara Khan ki info?"].map(q=>(
            <button key={q} onClick={()=>send(q)} style={{ fontSize:11, padding:"4px 9px", borderRadius:7, border:"1px solid #2a2f45", background:"#10121e", color:"#9ca3af", cursor:"pointer", fontFamily:"inherit" }}>{q}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, padding:"10px 14px", borderTop:"1px solid #1e2235" }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
            placeholder="Koi bhi sawal karein..."
            style={{ flex:1, background:"#10121e", border:"1px solid #1e2235", color:"#d1d5db", fontSize:13, fontFamily:"inherit", borderRadius:9, padding:"9px 12px", outline:"none" }} />
          <button onClick={()=>send(input)} disabled={loading}
            style={{ background:loading?"#2a2f45":color, border:"none", color:"#fff", width:38, height:38, borderRadius:9, cursor:"pointer", fontSize:15 }}>➤</button>
        </div>
      </div>
    </div>
  );
}
