"use client";
import { useState, useRef } from "react";

const initialTraders = [
  { id: "PF-001", name: "Ahmed Raza", phase: "Phase 2", balance: 98450, dd: 1.55, dailyLoss: 0.8, status: "Active", violations: 0, profit: 3.2 },
  { id: "PF-002", name: "Sara Khan", phase: "Phase 1", balance: 49800, dd: 4.1, dailyLoss: 2.1, status: "Active", violations: 1, profit: 5.1 },
  { id: "PF-003", name: "Bilal Ahmed", phase: "Phase 2", balance: 201000, dd: 0.5, dailyLoss: 0.2, status: "Passed", violations: 0, profit: 8.4 },
  { id: "PF-004", name: "Zara Malik", phase: "Phase 1", balance: 9200, dd: 10.2, dailyLoss: 5.1, status: "Failed", violations: 3, profit: -2.1 },
  { id: "PF-005", name: "Omar Sheikh", phase: "Phase 1", balance: 48200, dd: 2.3, dailyLoss: 1.1, status: "Active", violations: 0, profit: 2.8 },
];

const initialRules = {
  dailyLossLimit: 5, maxDrawdown: 10, phase1Target: 8, phase2Target: 5,
  minTradingDays: 5, payoutSplit: 80, payoutProcessing: 3,
  weekendHolding: false, newsTrading: false, newsWindow: 2,
  consistencyEnabled: false, minDailyTrades: 1, minDailyVolume: 1,
  maxDailyTrades: 10, consistencyScore: 70,
  customRules: [] as {id:number, label:string, value:number, min:number, max:number}[],
};

const TABS = ["Dashboard","Traders","Upload Data","Rules","Branding","Embed Widget","Preview AI"];export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [traders, setTraders] = useState(initialTraders);
  const [rules, setRules] = useState(initialRules);
  const [savedRules, setSavedRules] = useState(initialRules);
  const [rulesSaved, setRulesSaved] = useState(false);
  const [brandName, setBrandName] = useState("AlphaFund Pro");
  const [brandColor, setBrandColor] = useState("#7c6ff7");
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvError, setCsvError] = useState("");
  const [csvSuccess, setCsvSuccess] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role:string,text:string}[]>([
    { role: "ai", text: "Assalam o Alaikum! Main aapka PropFirm AI Support Agent hoon. Koi bhi sawal puchh sakte hain!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [newRuleLabel, setNewRuleLabel] = useState("");
  const [newRuleMin, setNewRuleMin] = useState(0);
  const [newRuleMax, setNewRuleMax] = useState(100);
  const fileRef = useRef<HTMLInputElement>(null);

  const active = traders.filter(t => t.status==="Active").length;
  const passed = traders.filter(t => t.status==="Passed").length;
  const failed = traders.filter(t => t.status==="Failed").length;
  const atRisk = traders.filter(t => t.dd>7).length;
  const avgDd = (traders.reduce((a,b)=>a+b.dd,0)/traders.length).toFixed(1);
  const statusColor = (s:string) => s==="Active"?"#10b981":s==="Passed"?"#3b82f6":"#ef4444";

  function saveRules() { setSavedRules({...rules}); setRulesSaved(true); setTimeout(()=>setRulesSaved(false),2500); }

  function parseCSV(text:string) {
    setCsvError(""); setCsvSuccess("");
    const lines = text.trim().split("\n");
    if (lines.length<2) { setCsvError("CSV mein data nahi hai."); return; }
    const headers = lines[0].split(",").map(h=>h.trim().toLowerCase());
    const parsed:any[] = [];
    for (let i=1;i<lines.length;i++) {
      const vals = lines[i].split(",").map(v=>v.trim());
      if (vals.length<4) continue;
      const obj:any={};
      headers.forEach((h,idx)=>{obj[h]=vals[idx]||"";});
      parsed.push({ id:obj.id||`PF-${String(i).padStart(3,"0")}`, name:obj.name||"Unknown", phase:obj.phase||"Phase 1", balance:parseFloat(obj.balance)||0, dd:parseFloat(obj.drawdown||obj.dd||"0"), dailyLoss:parseFloat(obj["daily loss"]||obj.dailyloss||"0"), status:obj.status||"Active", violations:parseInt(obj.violations||"0"), profit:parseFloat(obj.profit||"0") });
    }
    if (parsed.length===0) { setCsvError("Koi valid row nahi mili."); return; }
    setTraders(parsed); setCsvData(parsed); setCsvSuccess(`${parsed.length} traders import ho gaye!`);
  }

  function handleFileUpload(file:File) {
    if (!file.name.endsWith(".csv")) { setCsvError("Sirf .csv file upload karein."); return; }
    const reader = new FileReader();
    reader.onload = (e) => { if (e.target?.result) parseCSV(e.target.result as string); };
    reader.readAsText(file);
  }

  function addCustomRule() {
    if (!newRuleLabel.trim()) return;
    const newRule = { id: Date.now(), label: newRuleLabel, value: newRuleMin, min: newRuleMin, max: newRuleMax };
    setRules(prev=>({...prev, customRules:[...prev.customRules, newRule]}));
    setNewRuleLabel(""); setNewRuleMin(0); setNewRuleMax(100);
  }

  function removeCustomRule(id:number) {
    setRules(prev=>({...prev, customRules:prev.customRules.filter(r=>r.id!==id)}));
  }

  async function sendChat() {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev=>[...prev,{role:"user",text:userMsg}]);
    setAiLoading(true);
    const systemPrompt = `You are ${brandName} PropFirm AI Support Agent. Rules: Daily Loss ${savedRules.dailyLossLimit}%, Drawdown ${savedRules.maxDrawdown}%, Phase1 target ${savedRules.phase1Target}%, Phase2 target ${savedRules.phase2Target}%, Payout split ${savedRules.payoutSplit}/${100-savedRules.payoutSplit}. Traders: ${traders.slice(0,5).map(t=>`${t.name}(${t.id}):${t.phase},Balance $${t.balance},DD ${t.dd}%,${t.status}`).join("; ")}. Detect language and reply in SAME language. Keep under 80 words. End with 2-3 follow-up bullets.`;
    try {
      const res = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system:systemPrompt,messages:[{role:"user",content:userMsg}]})});
      const data = await res.json();
      setChatMessages(prev=>[...prev,{role:"ai",text:data.reply||"Error aaya."}]);
    } catch { setChatMessages(prev=>[...prev,{role:"ai",text:"Connection error."}]); }
    setAiLoading(false);
  }

  const embedCode = `<script src="https://propfirm-ai.vercel.app/widget.js" data-firm="${brandName}" data-color="${brandColor}"></script>`;return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#f8f9fb"}}>
      <div style={{width:220,background:"#fff",borderRight:"1px solid #e5e7eb",padding:"20px 12px"}}>
        <div style={{fontSize:15,fontWeight:700,color:brandColor,marginBottom:4,padding:"0 8px"}}>{brandName}</div>
        <div style={{fontSize:11,color:"#9ca3af",marginBottom:24,padding:"0 8px"}}>Admin Panel</div>
        {TABS.map(tab=>(
          <button key={tab} onClick={()=>setActiveTab(tab)} style={{display:"block",width:"100%",textAlign:"left",padding:"9px 12px",marginBottom:2,borderRadius:8,border:"none",cursor:"pointer",background:activeTab===tab?brandColor+"18":"transparent",color:activeTab===tab?brandColor:"#6b7280",fontWeight:activeTab===tab?600:400,fontSize:13,fontFamily:"inherit"}}>{tab}</button>
        ))}
      </div>
      <div style={{flex:1,padding:32,overflowY:"auto"}}>

        {activeTab==="Dashboard" && (
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:"#111827",marginBottom:4}}>Dashboard</h2>
            <p style={{color:"#6b7280",marginBottom:24,fontSize:14}}>Welcome back, {brandName}</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16,marginBottom:28}}>
              {[{label:"Total Traders",value:traders.length,color:"#7c6ff7"},{label:"Active",value:active,color:"#10b981"},{label:"Passed",value:passed,color:"#3b82f6"},{label:"Failed",value:failed,color:"#ef4444"},{label:"Avg Drawdown",value:avgDd+"%",color:"#f59e0b"}].map(m=>(
                <div key={m.label} style={{background:"#fff",borderRadius:12,padding:"18px 20px",border:"1px solid #e5e7eb"}}>
                  <div style={{fontSize:24,fontWeight:700,color:m.color}}>{m.value}</div>
                  <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>{m.label}</div>
                </div>
              ))}
            </div>
            {atRisk>0 && <div style={{background:"#fef3c7",border:"1px solid #f59e0b",borderRadius:10,padding:"12px 16px",marginBottom:20,fontSize:13,color:"#92400e"}}>{atRisk} trader(s) drawdown 7% se zyada!</div>}
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",overflow:"hidden"}}>
              <div style={{padding:"16px 20px",borderBottom:"1px solid #e5e7eb",fontSize:14,fontWeight:600}}>Recent Traders</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr style={{background:"#f9fafb"}}>{["ID","Name","Phase","Balance","Drawdown","Status"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",color:"#6b7280",fontWeight:500}}>{h}</th>)}</tr></thead>
                <tbody>{traders.map((t,i)=>(
                  <tr key={t.id} style={{borderTop:"1px solid #f3f4f6",background:i%2===0?"#fff":"#fafafa"}}>
                    <td style={{padding:"10px 16px",color:"#6b7280"}}>{t.id}</td>
                    <td style={{padding:"10px 16px",fontWeight:500}}>{t.name}</td>
                    <td style={{padding:"10px 16px",color:"#6b7280"}}>{t.phase}</td>
                    <td style={{padding:"10px 16px"}}>${t.balance.toLocaleString()}</td>
                    <td style={{padding:"10px 16px",color:t.dd>7?"#ef4444":t.dd>5?"#f59e0b":"#10b981",fontWeight:600}}>{t.dd}%</td>
                    <td style={{padding:"10px 16px"}}><span style={{background:statusColor(t.status)+"20",color:statusColor(t.status),padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{t.status}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}{activeTab==="Traders" && (
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:"#111827",marginBottom:20}}>All Traders</h2>
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr style={{background:"#f9fafb"}}>{["ID","Name","Phase","Balance","DD%","Daily Loss","Profit%","Violations","Status"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:"left",color:"#6b7280",fontWeight:500}}>{h}</th>)}</tr></thead>
                <tbody>{traders.map((t,i)=>(
                  <tr key={t.id} style={{borderTop:"1px solid #f3f4f6",background:i%2===0?"#fff":"#fafafa"}}>
                    <td style={{padding:"10px 14px",color:"#9ca3af",fontSize:12}}>{t.id}</td>
                    <td style={{padding:"10px 14px",fontWeight:600}}>{t.name}</td>
                    <td style={{padding:"10px 14px",color:"#6b7280"}}>{t.phase}</td>
                    <td style={{padding:"10px 14px"}}>${t.balance.toLocaleString()}</td>
                    <td style={{padding:"10px 14px",color:t.dd>7?"#ef4444":t.dd>5?"#f59e0b":"#10b981",fontWeight:700}}>{t.dd}%</td>
                    <td style={{padding:"10px 14px",color:t.dailyLoss>4?"#ef4444":"#6b7280"}}>{t.dailyLoss}%</td>
                    <td style={{padding:"10px 14px",color:t.profit>=0?"#10b981":"#ef4444",fontWeight:600}}>{t.profit>0?"+":""}{t.profit}%</td>
                    <td style={{padding:"10px 14px",color:t.violations>0?"#ef4444":"#6b7280"}}>{t.violations}</td>
                    <td style={{padding:"10px 14px"}}><span style={{background:statusColor(t.status)+"20",color:statusColor(t.status),padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600}}>{t.status}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab==="Upload Data" && (
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:"#111827",marginBottom:8}}>Upload Trader Data</h2>
            <p style={{color:"#6b7280",fontSize:14,marginBottom:24}}>CSV file upload karein — traders automatically import ho jayenge</p>
            <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,padding:16,marginBottom:24,fontSize:13}}>
              <div style={{fontWeight:600,color:"#166534",marginBottom:8}}>CSV Format:</div>
              <code style={{color:"#15803d",fontSize:12,display:"block",background:"#dcfce7",padding:"8px 12px",borderRadius:6}}>id, name, phase, balance, drawdown, status, violations, profit</code>
              <div style={{color:"#166534",marginTop:8,fontSize:12}}>Example: PF-001, Ahmed Raza, Phase 2, 98450, 1.55, Active, 0, 3.2</div>
            </div>
            <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)}
              onDrop={e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)handleFileUpload(f);}}
              onClick={()=>fileRef.current?.click()}
              style={{border:`2px dashed ${dragOver?brandColor:"#d1d5db"}`,borderRadius:12,padding:"48px 32px",textAlign:"center",cursor:"pointer",background:dragOver?brandColor+"08":"#fff",marginBottom:16}}>
              <div style={{fontSize:40,marginBottom:12}}>📂</div>
              <div style={{fontSize:15,fontWeight:600,color:"#374151",marginBottom:6}}>CSV file yahan drag karein</div>
              <div style={{fontSize:13,color:"#9ca3af"}}>ya click karke select karein</div>
              <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>{if(e.target.files?.[0])handleFileUpload(e.target.files[0]);}}/>
            </div>
            {csvError && <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"12px 16px",color:"#dc2626",fontSize:13,marginBottom:16}}>{csvError}</div>}
            {csvSuccess && <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,padding:"12px 16px",color:"#16a34a",fontSize:13,marginBottom:16}}>{csvSuccess}</div>}
            {csvData.length>0 && (
              <div style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",overflow:"hidden"}}>
                <div style={{padding:"14px 20px",borderBottom:"1px solid #e5e7eb",fontSize:14,fontWeight:600}}>Preview — {csvData.length} traders</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead><tr style={{background:"#f9fafb"}}>{["ID","Name","Phase","Balance","Drawdown","Status"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",color:"#6b7280",fontWeight:500}}>{h}</th>)}</tr></thead>
                  <tbody>{csvData.slice(0,10).map((t,i)=>(
                    <tr key={i} style={{borderTop:"1px solid #f3f4f6"}}>
                      <td style={{padding:"9px 14px",color:"#9ca3af"}}>{t.id}</td>
                      <td style={{padding:"9px 14px",fontWeight:500}}>{t.name}</td>
                      <td style={{padding:"9px 14px",color:"#6b7280"}}>{t.phase}</td>
                      <td style={{padding:"9px 14px"}}>${Number(t.balance).toLocaleString()}</td>
                      <td style={{padding:"9px 14px",color:t.dd>7?"#ef4444":"#10b981",fontWeight:600}}>{t.dd}%</td>
                      <td style={{padding:"9px 14px"}}><span style={{background:statusColor(t.status)+"20",color:statusColor(t.status),padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600}}>{t.status}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        )}{activeTab==="Rules" && (
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:"#111827",marginBottom:8}}>Rules & Configuration</h2>
            <p style={{color:"#6b7280",fontSize:14,marginBottom:24}}>Apni PropFirm ke rules set karein — AI agent in rules ko use karega</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
              {[{label:"Daily Loss Limit (%)",key:"dailyLossLimit",min:1,max:20},{label:"Max Drawdown (%)",key:"maxDrawdown",min:1,max:30},{label:"Phase 1 Profit Target (%)",key:"phase1Target",min:1,max:20},{label:"Phase 2 Profit Target (%)",key:"phase2Target",min:1,max:20},{label:"Min Trading Days",key:"minTradingDays",min:1,max:30},{label:"Payout Split (Trader %)",key:"payoutSplit",min:50,max:95},{label:"Payout Processing (days)",key:"payoutProcessing",min:1,max:14},{label:"News Window (minutes)",key:"newsWindow",min:1,max:30}].map(f=>(
                <div key={f.key} style={{background:"#fff",borderRadius:10,padding:18,border:"1px solid #e5e7eb"}}>
                  <label style={{fontSize:13,fontWeight:500,color:"#374151",display:"block",marginBottom:10}}>{f.label}</label>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <input type="range" min={f.min} max={f.max} value={(rules as any)[f.key]} onChange={e=>setRules(prev=>({...prev,[f.key]:Number(e.target.value)}))} style={{flex:1,accentColor:brandColor}}/>
                    <input type="number" min={f.min} max={f.max} value={(rules as any)[f.key]} onChange={e=>setRules(prev=>({...prev,[f.key]:Number(e.target.value)}))} style={{width:60,padding:"6px 8px",borderRadius:6,border:"1px solid #d1d5db",textAlign:"center",fontSize:14,fontWeight:600,color:brandColor,fontFamily:"inherit"}}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
              {[{label:"Weekend Holding",key:"weekendHolding",desc:"Traders positions weekend hold kar sakte hain"},{label:"News Trading",key:"newsTrading",desc:"High-impact news ke time trading allow hai"}].map(f=>(
                <div key={f.key} style={{background:"#fff",borderRadius:10,padding:18,border:"1px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div><div style={{fontSize:13,fontWeight:500,color:"#374151"}}>{f.label}</div><div style={{fontSize:12,color:"#9ca3af",marginTop:4}}>{f.desc}</div></div>
                  <div onClick={()=>setRules(prev=>({...prev,[f.key]:!(prev as any)[f.key]}))} style={{width:44,height:24,borderRadius:12,cursor:"pointer",background:(rules as any)[f.key]?brandColor:"#d1d5db",position:"relative",flexShrink:0,transition:"background 0.2s"}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:(rules as any)[f.key]?23:3,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:10,padding:18,border:"1px solid #e5e7eb",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:rules.consistencyEnabled?16:0}}>
                <div><div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Consistency Rule</div><div style={{fontSize:12,color:"#9ca3af",marginTop:4}}>Trader ko har din minimum trading karni hogi</div></div>
                <div onClick={()=>setRules(prev=>({...prev,consistencyEnabled:!prev.consistencyEnabled}))} style={{width:44,height:24,borderRadius:12,cursor:"pointer",background:rules.consistencyEnabled?brandColor:"#d1d5db",position:"relative",flexShrink:0,transition:"background 0.2s"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:rules.consistencyEnabled?23:3,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                </div>
              </div>
              {rules.consistencyEnabled && (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[{label:"Min Daily Trades",key:"minDailyTrades",min:1,max:20},{label:"Min Daily Volume (lots)",key:"minDailyVolume",min:1,max:100},{label:"Max Daily Trades",key:"maxDailyTrades",min:1,max:50},{label:"Consistency Score (%)",key:"consistencyScore",min:0,max:100}].map(f=>(
                    <div key={f.key} style={{background:"#f9fafb",borderRadius:8,padding:14,border:"1px solid #e5e7eb",position:"relative"}}>
                      <label style={{fontSize:12,fontWeight:500,color:"#374151",display:"block",marginBottom:8}}>{f.label}</label>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <input type="range" min={f.min} max={f.max} value={(rules as any)[f.key]} onChange={e=>setRules(prev=>({...prev,[f.key]:Number(e.target.value)}))} style={{flex:1,accentColor:brandColor}}/>
                        <input type="number" min={f.min} max={f.max} value={(rules as any)[f.key]} onChange={e=>setRules(prev=>({...prev,[f.key]:Number(e.target.value)}))} style={{width:55,padding:"5px 6px",borderRadius:6,border:"1px solid #d1d5db",textAlign:"center",fontSize:13,fontWeight:600,color:brandColor,fontFamily:"inherit"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{background:"#fff",borderRadius:10,padding:18,border:"1px solid #e5e7eb",marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:12}}>+ Custom Rule Add Karein</div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:10,alignItems:"center"}}>
                <input placeholder="Rule name (e.g. Max Lot Size)" value={newRuleLabel} onChange={e=>setNewRuleLabel(e.target.value)} style={{padding:"8px 12px",borderRadius:7,border:"1px solid #d1d5db",fontSize:13,fontFamily:"inherit"}}/>
                <input type="number" placeholder="Min" value={newRuleMin} onChange={e=>setNewRuleMin(Number(e.target.value))} style={{padding:"8px 10px",borderRadius:7,border:"1px solid #d1d5db",fontSize:13,fontFamily:"inherit"}}/>
                <input type="number" placeholder="Max" value={newRuleMax} onChange={e=>setNewRuleMax(Number(e.target.value))} style={{padding:"8px 10px",borderRadius:7,border:"1px solid #d1d5db",fontSize:13,fontFamily:"inherit"}}/>
                <button onClick={addCustomRule} style={{background:brandColor,color:"#fff",border:"none",borderRadius:7,padding:"8px 16px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Add</button>
              </div>
              {rules.customRules.length>0 && (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:16}}>
                  {rules.customRules.map(f=>(
                    <div key={f.id} style={{background:"#f9fafb",borderRadius:8,padding:14,border:"1px solid #e5e7eb",position:"relative"}}>
                      <button onClick={()=>removeCustomRule(f.id)} style={{position:"absolute",top:8,right:8,background:"#fee2e2",color:"#ef4444",border:"none",borderRadius:5,width:22,height:22,fontSize:13,cursor:"pointer",fontWeight:700}}>×</button>
                      <label style={{fontSize:12,fontWeight:500,color:"#374151",display:"block",marginBottom:8}}>{f.label}</label>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <input type="range" min={f.min} max={f.max} value={f.value} onChange={e=>setRules(prev=>({...prev,customRules:prev.customRules.map(r=>r.id===f.id?{...r,value:Number(e.target.value)}:r)}))} style={{flex:1,accentColor:brandColor}}/>
                        <input type="number" min={f.min} max={f.max} value={f.value} onChange={e=>setRules(prev=>({...prev,customRules:prev.customRules.map(r=>r.id===f.id?{...r,value:Number(e.target.value)}:r)}))} style={{width:55,padding:"5px 6px",borderRadius:6,border:"1px solid #d1d5db",textAlign:"center",fontSize:13,fontWeight:600,color:brandColor,fontFamily:"inherit"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={saveRules} style={{background:brandColor,color:"#fff",border:"none",borderRadius:8,padding:"12px 28px",fontSize:14,fontWeight:600,cursor:"pointer"}}>{rulesSaved?"✅ Saved!":"Save Rules"}</button>
            {rulesSaved && <span style={{marginLeft:12,color:"#10b981",fontSize:13}}>AI agent ab updated rules use karega</span>}
          </div>
        )}{activeTab==="Branding" && (
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:"#111827",marginBottom:24}}>Branding</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div style={{background:"#fff",borderRadius:12,padding:24,border:"1px solid #e5e7eb"}}>
                <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Firm Settings</div>
                <label style={{fontSize:13,color:"#6b7280",display:"block",marginBottom:6}}>Firm Name</label>
                <input value={brandName} onChange={e=>setBrandName(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #d1d5db",fontSize:14,marginBottom:16,boxSizing:"border-box",fontFamily:"inherit"}}/>
                <label style={{fontSize:13,color:"#6b7280",display:"block",marginBottom:6}}>Brand Color</label>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <input type="color" value={brandColor} onChange={e=>setBrandColor(e.target.value)} style={{width:48,height:40,borderRadius:6,border:"1px solid #d1d5db",cursor:"pointer",padding:2}}/>
                  <input value={brandColor} onChange={e=>setBrandColor(e.target.value)} style={{flex:1,padding:"10px 12px",borderRadius:8,border:"1px solid #d1d5db",fontSize:13,fontFamily:"monospace"}}/>
                </div>
              </div>
              <div style={{background:brandColor+"12",borderRadius:12,padding:24,border:`1px solid ${brandColor}40`}}>
                <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:brandColor}}>Live Preview</div>
                <div style={{background:"#fff",borderRadius:10,padding:20,boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
                  <div style={{fontWeight:700,color:brandColor,marginBottom:4}}>{brandName}</div>
                  <div style={{fontSize:12,color:"#9ca3af",marginBottom:16}}>AI Support Agent</div>
                  <div style={{background:brandColor+"15",borderRadius:8,padding:12,fontSize:13,color:"#374151"}}>Welcome! Koi bhi sawal puchh sakte hain.</div>
                  <div style={{marginTop:12,display:"flex",gap:8}}>
                    {["Account Status","Payout"].map(b=><span key={b} style={{background:brandColor,color:"#fff",padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:600}}>{b}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab==="Embed Widget" && (
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:"#111827",marginBottom:8}}>Embed Widget</h2>
            <p style={{color:"#6b7280",fontSize:14,marginBottom:24}}>Yeh code apni website mein paste karein</p>
            <div style={{background:"#1e1e2e",borderRadius:10,padding:20,marginBottom:16}}>
              <code style={{color:"#a6e3a1",fontSize:13,fontFamily:"monospace",whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{embedCode}</code>
            </div>
            <button onClick={()=>navigator.clipboard.writeText(embedCode)} style={{background:brandColor,color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Copy Code</button>
          </div>
        )}

        {activeTab==="Preview AI" && (
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:"#111827",marginBottom:8}}>Preview AI Agent</h2>
            <p style={{color:"#6b7280",fontSize:14,marginBottom:20}}>Real AI se test karein</p>
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",display:"flex",flexDirection:"column",height:480}}>
              <div style={{padding:"14px 16px",borderBottom:"1px solid #e5e7eb",fontSize:14,fontWeight:600,color:brandColor}}>{brandName} — AI Support</div>
              <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
                {chatMessages.map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                    <div style={{maxWidth:"78%",padding:"10px 14px",borderRadius:12,fontSize:13,lineHeight:1.5,background:m.role==="user"?brandColor:"#f3f4f6",color:m.role==="user"?"#fff":"#374151",whiteSpace:"pre-wrap"}}>{m.text}</div>
                  </div>
                ))}
                {aiLoading && <div style={{display:"flex",gap:5,padding:"10px 14px",background:"#f3f4f6",borderRadius:12,width:"fit-content"}}>
                  {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#9ca3af",animation:`bounce 1s ${i*0.2}s infinite`}}/>)}
                </div>}
              </div>
              <div style={{padding:12,borderTop:"1px solid #e5e7eb",display:"flex",gap:8}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!aiLoading&&sendChat()} placeholder="Koi bhi sawal likhein (Urdu/English)..." style={{flex:1,padding:"10px 14px",borderRadius:8,border:"1px solid #d1d5db",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                <button onClick={sendChat} disabled={aiLoading||!chatInput.trim()} style={{background:brandColor,color:"#fff",border:"none",borderRadius:8,padding:"0 18px",fontSize:13,fontWeight:600,cursor:"pointer",opacity:aiLoading?0.6:1}}>Send</button>
              </div>
            </div>
          </div>
        )}

      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}