import { useState, useEffect, useRef } from "react";
import { Play, Square, Trophy, Timer, MapPin, ChevronLeft, Wifi, WifiOff, Loader, Zap, User, RotateCcw, Navigation } from "lucide-react";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --red: #8b0000; --red-bright: #c0392b; --red-glow: rgba(139,0,0,0.45); --red-dim: rgba(139,0,0,0.15);
    --bg: #080808; --surface: #111111; --surface2: #1a1a1a; --border: rgba(255,255,255,0.07);
    --text: #f0f0f0; --text-dim: #888;
    --font-display: 'Bebas Neue', sans-serif; --font-ui: 'Barlow Condensed', sans-serif; --font-body: 'Barlow', sans-serif;
  }
  .po-app { min-height:100vh; background:var(--bg); color:var(--text); font-family:var(--font-body); display:flex; flex-direction:column; align-items:center; position:relative; overflow-x:hidden; }
  .po-app::before { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E"); opacity:0.03; pointer-events:none; z-index:0; }
  .po-screen { width:100%; max-width:480px; min-height:100vh; display:flex; flex-direction:column; padding:0 20px 32px; position:relative; z-index:1; }
  .po-onboard-glow { position:absolute; top:-80px; left:50%; transform:translateX(-50%); width:320px; height:320px; background:radial-gradient(circle, rgba(139,0,0,0.35) 0%, transparent 70%); pointer-events:none; }
  .po-logo { font-family:var(--font-display); font-size:clamp(72px,22vw,100px); letter-spacing:2px; line-height:0.9; color:var(--text); text-align:center; margin-top:80px; }
  .po-logo span { color:var(--red-bright); }
  .po-tagline { font-family:var(--font-ui); font-size:13px; letter-spacing:4px; text-transform:uppercase; color:var(--text-dim); text-align:center; margin-top:6px; }
  .po-input-wrap { margin-top:56px; position:relative; }
  .po-label { font-family:var(--font-ui); font-size:11px; letter-spacing:3px; text-transform:uppercase; color:var(--text-dim); display:block; margin-bottom:10px; }
  .po-input { width:100%; background:var(--surface); border:1px solid var(--border); border-radius:8px; color:var(--text); font-family:var(--font-ui); font-size:22px; font-weight:700; letter-spacing:2px; padding:16px 20px; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
  .po-input:focus { border-color:var(--red-bright); box-shadow:0 0 0 3px var(--red-dim); }
  .po-input::placeholder { color:#333; }
  .po-btn-primary { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:18px; border-radius:10px; border:none; background:linear-gradient(135deg,#8b0000 0%,#c0392b 100%); color:#fff; font-family:var(--font-ui); font-size:20px; font-weight:900; letter-spacing:3px; text-transform:uppercase; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s,opacity 0.15s; box-shadow:0 0 24px rgba(139,0,0,0.4),0 4px 16px rgba(0,0,0,0.4); }
  .po-btn-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 0 36px rgba(192,57,43,0.55),0 8px 24px rgba(0,0,0,0.5); }
  .po-btn-primary:disabled { opacity:0.4; cursor:not-allowed; }
  .po-btn-ghost { display:flex; align-items:center; gap:6px; background:transparent; border:1px solid var(--border); border-radius:8px; color:var(--text-dim); font-family:var(--font-ui); font-size:13px; font-weight:600; letter-spacing:2px; text-transform:uppercase; padding:8px 14px; cursor:pointer; transition:border-color 0.2s,color 0.2s; }
  .po-btn-ghost:hover { border-color:var(--red-bright); color:var(--text); }
  .po-topbar { display:flex; align-items:center; justify-content:space-between; padding:20px 0 12px; }
  .po-player-pill { display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); border-radius:999px; padding:6px 14px 6px 8px; }
  .po-player-pill-dot { width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#8b0000,#c0392b); display:flex; align-items:center; justify-content:center; font-family:var(--font-ui); font-size:13px; font-weight:900; color:#fff; flex-shrink:0; }
  .po-player-pill-name { font-family:var(--font-ui); font-size:14px; font-weight:700; letter-spacing:1px; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .po-gps-badge { display:flex; align-items:center; gap:6px; font-family:var(--font-ui); font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; padding:6px 12px; border-radius:999px; border:1px solid; }
  .po-gps-badge.idle { border-color:#333; color:#555; }
  .po-gps-badge.acquiring { border-color:#b8860b; color:#daa520; animation:po-pulse 1.2s ease-in-out infinite; }
  .po-gps-badge.active { border-color:#1a5c2a; color:#2ecc71; }
  .po-gps-badge.error { border-color:#5c1a1a; color:#e74c3c; }
  @keyframes po-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .po-orbit-wrap { display:flex; align-items:center; justify-content:center; margin:20px auto 0; position:relative; width:220px; height:220px; }
  .po-orbit-ring { position:absolute; inset:0; border-radius:50%; border:2px solid var(--border); }
  .po-orbit-ring-active { position:absolute; inset:0; border-radius:50%; border:2px solid transparent; border-top-color:var(--red-bright); border-right-color:var(--red-bright); animation:po-spin 2s linear infinite; }
  @keyframes po-spin { to{transform:rotate(360deg)} }
  .po-orbit-inner { width:170px; height:170px; border-radius:50%; background:var(--surface); border:1px solid var(--border); display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; transition:box-shadow 0.4s; }
  .po-orbit-inner.flash { box-shadow:0 0 60px rgba(192,57,43,0.8),0 0 0 6px rgba(139,0,0,0.3); }
  .po-lap-number { font-family:var(--font-display); font-size:80px; line-height:1; color:var(--text); transition:transform 0.15s; }
  .po-lap-number.pop { transform:scale(1.15); }
  .po-lap-label { font-family:var(--font-ui); font-size:11px; letter-spacing:4px; text-transform:uppercase; color:var(--text-dim); margin-top:2px; }
  .po-stats-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px; }
  .po-stat-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:6px; }
  .po-stat-icon { display:flex; align-items:center; gap:6px; color:var(--text-dim); font-family:var(--font-ui); font-size:10px; letter-spacing:2.5px; text-transform:uppercase; }
  .po-stat-value { font-family:var(--font-ui); font-size:32px; font-weight:900; color:var(--text); line-height:1; }
  .po-stat-unit { font-family:var(--font-ui); font-size:13px; font-weight:600; color:var(--text-dim); margin-left:3px; }
  .po-action-wrap { margin-top:28px; display:flex; flex-direction:column; gap:12px; }
  .po-start-btn { display:flex; align-items:center; justify-content:center; gap:12px; width:100%; padding:22px; border-radius:14px; border:none; cursor:pointer; font-family:var(--font-ui); font-size:22px; font-weight:900; letter-spacing:4px; text-transform:uppercase; transition:transform 0.15s,box-shadow 0.15s; position:relative; overflow:hidden; }
  .po-start-btn.start { background:linear-gradient(135deg,#8b0000 0%,#c0392b 60%,#e74c3c 100%); color:#fff; box-shadow:0 0 32px rgba(139,0,0,0.5),0 6px 20px rgba(0,0,0,0.4); }
  .po-start-btn.start::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,transparent 0%,rgba(255,255,255,0.07) 100%); }
  .po-start-btn.stop { background:var(--surface2); border:1px solid rgba(192,57,43,0.4); color:#e74c3c; }
  .po-start-btn:hover { transform:translateY(-2px); }
  .po-start-btn:active { transform:scale(0.98); }
  .po-dev-row { display:flex; gap:8px; justify-content:center; }
  .po-dev-btn { display:flex; align-items:center; gap:5px; background:transparent; border:1px dashed #2a2a2a; border-radius:6px; color:#333; font-family:var(--font-ui); font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; padding:6px 12px; cursor:pointer; transition:color 0.2s,border-color 0.2s; }
  .po-dev-btn:hover { color:#666; border-color:#444; }
  .po-board-title { font-family:var(--font-display); font-size:52px; letter-spacing:2px; color:var(--text); margin:28px 0 4px; line-height:1; }
  .po-board-sub { font-family:var(--font-ui); font-size:11px; letter-spacing:3px; text-transform:uppercase; color:var(--text-dim); margin-bottom:20px; }
  .po-board-header { display:grid; grid-template-columns:32px 1fr 52px 64px 72px; gap:8px; padding:0 14px 8px; font-family:var(--font-ui); font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#444; }
  .po-board-row { display:grid; grid-template-columns:32px 1fr 52px 64px 72px; gap:8px; align-items:center; padding:14px; border-radius:10px; background:var(--surface); border:1px solid var(--border); margin-bottom:8px; }
  .po-board-row.highlight { border-color:rgba(139,0,0,0.5); background:rgba(139,0,0,0.07); }
  .po-board-rank { font-family:var(--font-ui); font-size:16px; font-weight:900; color:var(--text-dim); text-align:center; }
  .po-board-rank.gold{color:#ffd700} .po-board-rank.silver{color:#c0c0c0} .po-board-rank.bronze{color:#cd7f32}
  .po-board-name { font-family:var(--font-ui); font-size:16px; font-weight:700; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .po-board-cell { font-family:var(--font-ui); font-size:15px; font-weight:700; color:var(--text); text-align:right; }
  .po-board-cell.laps { color:var(--red-bright); font-size:18px; }
  .po-empty-board { text-align:center; padding:48px 0; color:var(--text-dim); font-family:var(--font-ui); font-size:14px; letter-spacing:2px; text-transform:uppercase; }
  .po-lap-flash-overlay { position:fixed; inset:0; background:rgba(139,0,0,0.18); pointer-events:none; z-index:100; opacity:0; transition:opacity 0.1s; }
  .po-lap-flash-overlay.show { opacity:1; }
  .po-lap-toast { position:fixed; top:24px; left:50%; transform:translateX(-50%) translateY(-80px); background:linear-gradient(135deg,#8b0000,#c0392b); color:#fff; font-family:var(--font-ui); font-size:18px; font-weight:900; letter-spacing:3px; text-transform:uppercase; padding:12px 28px; border-radius:999px; box-shadow:0 0 32px rgba(139,0,0,0.6); z-index:101; transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s; opacity:0; white-space:nowrap; }
  .po-lap-toast.show { transform:translateX(-50%) translateY(0); opacity:1; }
`;

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371000, toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2-lat1), dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const fmtTime = s => {
  const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=s%60;
  return h>0 ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}` : `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
};
const fmtKm = m => (m/1000).toFixed(2);
const LS_KEY = "povorbit_v2";
const loadPlayers = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };
const upsertPlayer = (players, entry) => {
  const u = players.filter(p => p.name !== entry.name);
  u.push(entry); u.sort((a,b) => b.laps-a.laps || b.distKm-a.distKm);
  localStorage.setItem(LS_KEY, JSON.stringify(u)); return u;
};

export default function PovOrbit() {
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = GLOBAL_CSS; document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const [screen, setScreen] = useState("onboarding");
  const [name, setName] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [laps, setLaps] = useState(0);
  const [totalDist, setTotalDist] = useState(0);
  const [walkTime, setWalkTime] = useState(0);
  const [gpsStatus, setGpsStatus] = useState("idle");
  const [players, setPlayers] = useState(loadPlayers);
  const [lapFlash, setLapFlash] = useState(false);
  const [lapPop, setLapPop] = useState(false);

  const watchRef = useRef(null), timerRef = useRef(null);
  const startPosRef = useRef(null), lastPosRef = useRef(null);
  const movedAwayRef = useRef(false);
  const stateRef = useRef({ laps: 0, totalDist: 0, walkTime: 0 });

  useEffect(() => { stateRef.current.laps = laps; }, [laps]);
  useEffect(() => { stateRef.current.totalDist = totalDist; }, [totalDist]);
  useEffect(() => { stateRef.current.walkTime = walkTime; }, [walkTime]);

  const triggerFlash = () => {
    setLapFlash(true); setLapPop(true);
    setTimeout(() => setLapFlash(false), 700);
    setTimeout(() => setLapPop(false), 300);
  };

  const commitPlayer = (n, l, d, t) => {
    setPlayers(prev => upsertPlayer(prev, { name: n, laps: l, distKm: parseFloat(fmtKm(d)), timeSeconds: t }));
  };

  const handlePosition = pos => {
    const { latitude: lat, longitude: lon } = pos.coords;
    setGpsStatus("active");
    if (!startPosRef.current) {
      startPosRef.current = { lat, lon }; lastPosRef.current = { lat, lon }; return;
    }
    if (lastPosRef.current) {
      const d = haversine(lastPosRef.current.lat, lastPosRef.current.lon, lat, lon);
      if (d > 0.5 && d < 50) setTotalDist(p => p + d);
    }
    lastPosRef.current = { lat, lon };
    const distFromStart = haversine(startPosRef.current.lat, startPosRef.current.lon, lat, lon);
    if (distFromStart > 80) movedAwayRef.current = true;
    if (movedAwayRef.current && distFromStart < 25) {
      movedAwayRef.current = false; startPosRef.current = { lat, lon };
      setLaps(p => { const n2 = p+1; setTimeout(() => commitPlayer(name, n2, stateRef.current.totalDist, stateRef.current.walkTime), 50); return n2; });
      triggerFlash();
    }
  };

  const startTracking = () => {
    setIsTracking(true); setGpsStatus("acquiring");
    startPosRef.current = null; lastPosRef.current = null; movedAwayRef.current = false;
    timerRef.current = setInterval(() => setWalkTime(t => t+1), 1000);
    if (navigator.geolocation) {
      watchRef.current = navigator.geolocation.watchPosition(handlePosition, () => setGpsStatus("error"), { enableHighAccuracy:true, timeout:15000, maximumAge:2000 });
    } else setGpsStatus("error");
  };

  const stopTracking = () => {
    if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current);
    clearInterval(timerRef.current); setIsTracking(false); setGpsStatus("idle");
    commitPlayer(name, laps, totalDist, walkTime);
  };

  const simulateLap = () => {
    setTotalDist(p => { const nd = p+480; setLaps(p2 => { const nl = p2+1; setTimeout(() => commitPlayer(name, nl, nd, stateRef.current.walkTime), 50); return nl; }); return nd; });
    triggerFlash();
  };

  const enterSession = () => {
    const n = name.trim(); if (!n) return; setName(n);
    const ex = players.find(p => p.name.toLowerCase() === n.toLowerCase());
    if (ex) { const d = ex.distKm*1000; setLaps(ex.laps); setTotalDist(d); setWalkTime(ex.timeSeconds); stateRef.current = { laps: ex.laps, totalDist: d, walkTime: ex.timeSeconds }; }
    setScreen("tracker");
  };

  const GpsIcon = gpsStatus === "acquiring" ? Loader : gpsStatus === "active" ? Wifi : WifiOff;
  const gpsLabel = { idle:"GPS OFF", acquiring:"Acquiring…", active:"GPS LIVE", error:"No GPS" };

  if (screen === "onboarding") return (
    <div className="po-app">
      <div className="po-screen" style={{ justifyContent:"flex-start" }}>
        <div className="po-onboard-glow" />
        <div className="po-logo">POV<span>ORBIT</span></div>
        <p className="po-tagline">Giretti di Povo · UniTrento</p>
        <div className="po-input-wrap">
          <label className="po-label" htmlFor="name-in">Your name</label>
          <input id="name-in" className="po-input" placeholder="Enter name…" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==="Enter" && enterSession()} maxLength={24} autoComplete="off" autoFocus />
        </div>
        <div style={{ marginTop:24 }}>
          <button className="po-btn-primary" onClick={enterSession} disabled={!name.trim()}>
            <Navigation size={18} /> Enter the Orbit
          </button>
        </div>
        {players.length > 0 && (
          <div style={{ marginTop:48 }}>
            <p className="po-label">Current Leaders</p>
            {players.slice(0,3).map((p,i) => (
              <div key={p.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                <span style={{ fontFamily:"var(--font-ui)", fontSize:14, color:[`#ffd700`,`#c0c0c0`,`#cd7f32`][i] }}>{["🥇","🥈","🥉"][i]} {p.name}</span>
                <span style={{ fontFamily:"var(--font-ui)", fontSize:14, fontWeight:700, color:"var(--red-bright)" }}>{p.laps} laps</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (screen === "board") return (
    <div className="po-app">
      <div className="po-screen">
        <div className="po-topbar">
          <button className="po-btn-ghost" onClick={() => setScreen("tracker")}><ChevronLeft size={14}/> Back</button>
        </div>
        <div className="po-board-title">BOARD</div>
        <p className="po-board-sub">of Players</p>
        {players.length === 0 ? (
          <div className="po-empty-board">No players yet.<br/>Go run some laps!</div>
        ) : (
          <>
            <div className="po-board-header"><span>#</span><span>Player</span><span style={{textAlign:"right"}}>Laps</span><span style={{textAlign:"right"}}>Km</span><span style={{textAlign:"right"}}>Time</span></div>
            {players.map((p,i) => (
              <div key={p.name} className={`po-board-row${p.name===name?" highlight":""}`}>
                <div className={`po-board-rank${i===0?" gold":i===1?" silver":i===2?" bronze":""}`}>{i<3?["🥇","🥈","🥉"][i]:i+1}</div>
                <div className="po-board-name">{p.name}</div>
                <div className="po-board-cell laps">{p.laps}</div>
                <div className="po-board-cell">{p.distKm}</div>
                <div className="po-board-cell" style={{fontSize:12}}>{fmtTime(p.timeSeconds)}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="po-app">
      <div className={`po-lap-flash-overlay${lapFlash?" show":""}`} />
      <div className={`po-lap-toast${lapFlash?" show":""}`}>⚡ Giro Completato!</div>
      <div className="po-screen">
        <div className="po-topbar">
          <div className="po-player-pill">
            <div className="po-player-pill-dot">{name[0]?.toUpperCase()}</div>
            <span className="po-player-pill-name">{name}</span>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div className={`po-gps-badge ${gpsStatus}`}><GpsIcon size={10}/> {gpsLabel[gpsStatus]}</div>
            <button className="po-btn-ghost" onClick={() => setScreen("board")}><Trophy size={12}/> Board</button>
          </div>
        </div>

        <div className="po-orbit-wrap">
          <div className="po-orbit-ring" />
          {isTracking && <div className="po-orbit-ring-active" />}
          <div className={`po-orbit-inner${lapFlash?" flash":""}`}>
            <div className={`po-lap-number${lapPop?" pop":""}`}>{laps}</div>
            <div className="po-lap-label">Giretti</div>
          </div>
        </div>

        <div className="po-stats-row">
          <div className="po-stat-card">
            <div className="po-stat-icon"><MapPin size={11}/> Distance</div>
            <div className="po-stat-value">{fmtKm(totalDist)}<span className="po-stat-unit">km</span></div>
          </div>
          <div className="po-stat-card">
            <div className="po-stat-icon"><Timer size={11}/> Walk Time</div>
            <div className="po-stat-value" style={{fontSize:26}}>{fmtTime(walkTime)}</div>
          </div>
        </div>

        <div className="po-action-wrap">
          {!isTracking ? (
            <button className="po-start-btn start" onClick={startTracking}><Play size={22} fill="white"/> Start: Giretti</button>
          ) : (
            <button className="po-start-btn stop" onClick={stopTracking}><Square size={20} fill="#e74c3c"/> Stop Tracking</button>
          )}
          <div className="po-dev-row">
            <button className="po-dev-btn" onClick={simulateLap}><Zap size={10}/> Simulate Lap</button>
            {!isTracking && laps > 0 && (
              <button className="po-dev-btn" onClick={() => { setLaps(0); setTotalDist(0); setWalkTime(0); stateRef.current={laps:0,totalDist:0,walkTime:0}; }}>
                <RotateCcw size={10}/> Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
