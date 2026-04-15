import { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  Trophy,
  Timer,
  MapPin,
  ChevronLeft,
  Wifi,
  WifiOff,
  Loader,
  Zap,
  User,
  RotateCcw,
  Navigation,
} from "lucide-react";
import { haversine, fmtTime, fmtKm } from "../utils/helpers";
import {
  loadPlayers,
  savePlayers,
  upsertPlayer,
} from "../utils/localStorage";
import { GLOBAL_CSS } from "../styles/povorbit.css.js";

/**
 * PovOrbit - Main tracking application component
 * Tracks GPS-based lap counting for runners/walkers
 */
export default function PovOrbit() {
  // ── Inject CSS ──
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ── State ──
  const [screen, setScreen] = useState("onboarding");
  const [name, setName] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [laps, setLaps] = useState(0);
  const [totalDist, setTotalDist] = useState(0); // meters
  const [walkTime, setWalkTime] = useState(0); // seconds
  const [gpsStatus, setGpsStatus] = useState("idle");
  const [players, setPlayers] = useState(loadPlayers);
  const [lapFlash, setLapFlash] = useState(false);
  const [lapPop, setLapPop] = useState(false);

  // ── Refs ──
  const watchRef = useRef(null);
  const timerRef = useRef(null);
  const startPosRef = useRef(null);
  const lastPosRef = useRef(null);
  const movedAwayRef = useRef(false);
  const stateRef = useRef({ laps: 0, totalDist: 0, walkTime: 0 });

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current.laps = laps;
  }, [laps]);
  useEffect(() => {
    stateRef.current.totalDist = totalDist;
  }, [totalDist]);
  useEffect(() => {
    stateRef.current.walkTime = walkTime;
  }, [walkTime]);

  // ── Lap flash animation ──
  const triggerFlash = () => {
    setLapFlash(true);
    setLapPop(true);
    setTimeout(() => setLapFlash(false), 600);
    setTimeout(() => setLapPop(false), 300);
  };

  // ── Save player data ──
  const commitPlayer = (n, l, d, t) => {
    setPlayers((prev) => {
      const updated = upsertPlayer(prev, {
        name: n,
        laps: l,
        distKm: parseFloat(fmtKm(d)),
        timeSeconds: t,
      });
      return updated;
    });
  };

  // ── GPS Position handler ──
  const handlePosition = (pos) => {
    const { latitude: lat, longitude: lon } = pos.coords;
    setGpsStatus("active");

    if (!startPosRef.current) {
      startPosRef.current = { lat, lon };
      lastPosRef.current = { lat, lon };
      return;
    }

    // Accumulate distance
    if (lastPosRef.current) {
      const d = haversine(
        lastPosRef.current.lat,
        lastPosRef.current.lon,
        lat,
        lon
      );
      if (d > 0.5 && d < 50) {
        setTotalDist((prev) => prev + d);
      }
    }
    lastPosRef.current = { lat, lon };

    // Lap detection (when returning to start area)
    const distFromStart = haversine(
      startPosRef.current.lat,
      startPosRef.current.lon,
      lat,
      lon
    );
    if (distFromStart > 80) movedAwayRef.current = true;
    if (movedAwayRef.current && distFromStart < 25) {
      movedAwayRef.current = false;
      startPosRef.current = { lat, lon };
      setLaps((prev) => {
        const next = prev + 1;
        setTimeout(
          () =>
            commitPlayer(
              name,
              next,
              stateRef.current.totalDist,
              stateRef.current.walkTime
            ),
          50
        );
        return next;
      });
      triggerFlash();
    }
  };

  // ── Start GPS tracking ──
  const startTracking = () => {
    setIsTracking(true);
    setGpsStatus("acquiring");
    startPosRef.current = null;
    lastPosRef.current = null;
    movedAwayRef.current = false;

    timerRef.current = setInterval(
      () => setWalkTime((t) => t + 1),
      1000
    );

    if (navigator.geolocation) {
      watchRef.current = navigator.geolocation.watchPosition(
        handlePosition,
        () => setGpsStatus("error"),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 2000,
        }
      );
    } else {
      setGpsStatus("error");
    }
  };

  // ── Stop GPS tracking ──
  const stopTracking = () => {
    if (watchRef.current != null)
      navigator.geolocation.clearWatch(watchRef.current);
    clearInterval(timerRef.current);
    setIsTracking(false);
    setGpsStatus("idle");
    commitPlayer(name, laps, totalDist, walkTime);
  };

  // ── Dev: Simulate a lap ──
  const simulateLap = () => {
    const d = 480;
    setTotalDist((prev) => {
      const nd = prev + d;
      setLaps((prev2) => {
        const nl = prev2 + 1;
        setTimeout(
          () => commitPlayer(name, nl, nd, stateRef.current.walkTime),
          50
        );
        return nl;
      });
      return nd;
    });
    triggerFlash();
  };

  // ── Enter session (from onboarding) ──
  const enterSession = () => {
    const n = name.trim();
    if (!n) return;
    setName(n);
    const existing = players.find(
      (p) => p.name.toLowerCase() === n.toLowerCase()
    );
    if (existing) {
      const d = existing.distKm * 1000;
      setLaps(existing.laps);
      setTotalDist(d);
      setWalkTime(existing.timeSeconds);
      stateRef.current = {
        laps: existing.laps,
        totalDist: d,
        walkTime: existing.timeSeconds,
      };
    }
    setScreen("tracker");
  };

  // ────────────────────────────────────────
  // ONBOARDING SCREEN
  // ────────────────────────────────────────
  if (screen === "onboarding") {
    return (
      <div className="po-app">
        <div className="po-screen" style={{ justifyContent: "flex-start" }}>
          <div className="po-onboard-glow" />
          <div className="po-logo">
            POV<span>ORBIT</span>
          </div>
          <p className="po-tagline">Giretti di Povo · UniTrento</p>

          <div className="po-input-wrap">
            <label className="po-label" htmlFor="name-input">
              <User
                size={10}
                style={{ display: "inline", marginRight: 6 }}
              />
              Your name
            </label>
            <input
              id="name-input"
              className="po-input"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enterSession()}
              maxLength={24}
              autoComplete="off"
              autoFocus
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              className="po-btn-primary"
              onClick={enterSession}
              disabled={!name.trim()}
            >
              <Navigation size={18} />
              Enter the Orbit
            </button>
          </div>

          {players.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <p className="po-label">
                <Trophy
                  size={10}
                  style={{ display: "inline", marginRight: 6 }}
                />
                Current Leaders
              </p>
              {players.slice(0, 3).map((p, i) => (
                <div
                  key={p.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 14,
                      color:
                        i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : "#cd7f32",
                    }}
                  >
                    {["🥇", "🥈", "🥉"][i]} {p.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--red-bright)",
                    }}
                  >
                    {p.laps} laps
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────
  // LEADERBOARD SCREEN
  // ────────────────────────────────────────
  if (screen === "board") {
    return (
      <div className="po-app">
        <div className="po-screen">
          <div className="po-topbar">
            <button
              className="po-btn-ghost"
              onClick={() => setScreen("tracker")}
            >
              <ChevronLeft size={14} /> Back
            </button>
          </div>
          <div className="po-board-title">BOARD</div>
          <p className="po-board-sub">of Players</p>

          {players.length === 0 ? (
            <div className="po-empty-board">
              No players yet.
              <br />
              Go run some laps!
            </div>
          ) : (
            <>
              <div className="po-board-header">
                <span>#</span>
                <span>Player</span>
                <span style={{ textAlign: "right" }}>Laps</span>
                <span style={{ textAlign: "right" }}>Km</span>
                <span style={{ textAlign: "right" }}>Time</span>
              </div>
              {players.map((p, i) => (
                <div
                  key={p.name}
                  className={`po-board-row${
                    p.name === name ? " highlight" : ""
                  }`}
                >
                  <div
                    className={`po-board-rank${
                      i === 0 ? " gold" : i === 1 ? " silver" : i === 2 ? " bronze" : ""
                    }`}
                  >
                    {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                  </div>
                  <div className="po-board-name">{p.name}</div>
                  <div className="po-board-cell laps">{p.laps}</div>
                  <div className="po-board-cell">{p.distKm}</div>
                  <div
                    className="po-board-cell"
                    style={{ fontSize: 12 }}
                  >
                    {fmtTime(p.timeSeconds)}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────
  // TRACKER SCREEN
  // ────────────────────────────────────────
  const gpsColors = {
    idle: "",
    acquiring: "acquiring",
    active: "active",
    error: "error",
  };
  const gpsLabel = {
    idle: "GPS OFF",
    acquiring: "Acquiring…",
    active: "GPS LIVE",
    error: "GPS Error",
  };
  const GpsIcon =
    gpsStatus === "acquiring"
      ? Loader
      : gpsStatus === "active"
        ? Wifi
        : WifiOff;

  return (
    <div className="po-app">
      {/* Lap flash overlay */}
      <div className={`po-lap-flash-overlay${lapFlash ? " show" : ""}`} />
      <div className={`po-lap-toast${lapFlash ? " show" : ""}`}>
        ⚡ Giro Completato!
      </div>

      <div className="po-screen">
        {/* Top bar */}
        <div className="po-topbar">
          <div className="po-player-pill">
            <div className="po-player-pill-dot">{name[0]?.toUpperCase()}</div>
            <span className="po-player-pill-name">{name}</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              className={`po-gps-badge ${gpsColors[gpsStatus] || "idle"}`}
            >
              <GpsIcon
                size={10}
                className={gpsStatus === "acquiring" ? "spin" : ""}
              />
              {gpsLabel[gpsStatus]}
            </div>
            <button
              className="po-btn-ghost"
              onClick={() => setScreen("board")}
            >
              <Trophy size={12} />
              Board
            </button>
          </div>
        </div>

        {/* Orbit lap counter */}
        <div className="po-orbit-wrap">
          <div className="po-orbit-ring" />
          {isTracking && <div className="po-orbit-ring-active" />}
          <div className={`po-orbit-inner${lapFlash ? " flash" : ""}`}>
            <div className={`po-lap-number${lapPop ? " pop" : ""}`}>
              {laps}
            </div>
            <div className="po-lap-label">Giretti</div>
          </div>
        </div>

        {/* Stats */}
        <div className="po-stats-row">
          <div className="po-stat-card">
            <div className="po-stat-icon">
              <MapPin size={11} /> Distance
            </div>
            <div className="po-stat-value">
              {fmtKm(totalDist)}
              <span className="po-stat-unit">km</span>
            </div>
          </div>
          <div className="po-stat-card">
            <div className="po-stat-icon">
              <Timer size={11} /> Walk Time
            </div>
            <div className="po-stat-value" style={{ fontSize: 26 }}>
              {fmtTime(walkTime)}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="po-action-wrap">
          {!isTracking ? (
            <button className="po-start-btn start" onClick={startTracking}>
              <Play size={22} fill="white" />
              Start: Giretti
            </button>
          ) : (
            <button className="po-start-btn stop" onClick={stopTracking}>
              <Square size={20} fill="#e74c3c" />
              Stop Tracking
            </button>
          )}

          {/* Dev tools */}
          <div className="po-dev-row">
            <button className="po-dev-btn" onClick={simulateLap}>
              <Zap size={10} /> Simulate Lap
            </button>
            {!isTracking && laps > 0 && (
              <button
                className="po-dev-btn"
                onClick={() => {
                  setLaps(0);
                  setTotalDist(0);
                  setWalkTime(0);
                  stateRef.current = {
                    laps: 0,
                    totalDist: 0,
                    walkTime: 0,
                  };
                }}
              >
                <RotateCcw size={10} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
