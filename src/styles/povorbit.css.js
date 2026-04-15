export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080808; overscroll-behavior: none; }

  :root {
    --red: #8b0000;
    --red-bright: #c0392b;
    --red-glow: rgba(139,0,0,0.45);
    --red-dim: rgba(139,0,0,0.15);
    --bg: #080808;
    --surface: #111111;
    --surface2: #1a1a1a;
    --border: rgba(255,255,255,0.07);
    --text: #f0f0f0;
    --text-dim: #888;
    --font-display: 'Bebas Neue', sans-serif;
    --font-ui: 'Barlow Condensed', sans-serif;
    --font-body: 'Barlow', sans-serif;
  }

  .po-app {
    min-height: 100svh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Noise overlay ── */
  .po-app::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Screen wrapper ── */
  .po-screen {
    width: 100%;
    max-width: 480px;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    padding: 0 20px 32px;
    position: relative;
    z-index: 1;
  }

  /* ── Onboarding ── */
  .po-onboard-glow {
    position: absolute;
    top: -80px; left: 50%; transform: translateX(-50%);
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(139,0,0,0.35) 0%, transparent 70%);
    pointer-events: none;
  }

  .po-logo {
    font-family: var(--font-display);
    font-size: clamp(72px, 22vw, 100px);
    letter-spacing: 2px;
    line-height: 0.9;
    color: var(--text);
    text-align: center;
    margin-top: 80px;
  }

  .po-logo span { color: var(--red-bright); }

  .po-tagline {
    font-family: var(--font-ui);
    font-size: 13px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--text-dim);
    text-align: center;
    margin-top: 6px;
  }

  .po-input-wrap {
    margin-top: 56px;
    position: relative;
  }

  .po-label {
    font-family: var(--font-ui);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-dim);
    display: block;
    margin-bottom: 10px;
  }

  .po-input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: var(--font-ui);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 2px;
    padding: 16px 20px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .po-input:focus {
    border-color: var(--red-bright);
    box-shadow: 0 0 0 3px var(--red-dim);
  }

  .po-input::placeholder { color: #333; }

  /* ── Buttons ── */
  .po-btn-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 18px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #8b0000 0%, #c0392b 100%);
    color: #fff;
    font-family: var(--font-ui);
    font-size: 20px;
    font-weight: 900;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    box-shadow: 0 0 24px rgba(139,0,0,0.4), 0 4px 16px rgba(0,0,0,0.4);
  }

  .po-btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 36px rgba(192,57,43,0.55), 0 8px 24px rgba(0,0,0,0.5);
  }

  .po-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .po-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .po-btn-ghost {
    display: flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-dim);
    font-family: var(--font-ui);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 8px 14px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }

  .po-btn-ghost:hover { border-color: var(--red-bright); color: var(--text); }

  /* ── Top bar ── */
  .po-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0 12px;
  }

  .po-player-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 6px 14px 6px 8px;
  }

  .po-player-pill-dot {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b0000, #c0392b);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-ui);
    font-size: 13px;
    font-weight: 900;
    color: #fff;
    flex-shrink: 0;
  }

  .po-player-pill-name {
    font-family: var(--font-ui);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── GPS status ── */
  .po-gps-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-ui);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid;
  }

  .po-gps-badge.idle { border-color: #333; color: #555; }
  .po-gps-badge.acquiring { border-color: #b8860b; color: #daa520; animation: po-pulse 1.2s ease-in-out infinite; }
  .po-gps-badge.active { border-color: #1a5c2a; color: #2ecc71; }
  .po-gps-badge.error { border-color: #5c1a1a; color: #e74c3c; }

  @keyframes po-pulse {
    0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
  }

  /* ── Orbit ring ── */
  .po-orbit-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto 0;
    position: relative;
    width: 220px; height: 220px;
  }

  .po-orbit-ring {
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 2px solid var(--border);
  }

  .po-orbit-ring-active {
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: var(--red-bright);
    border-right-color: var(--red-bright);
    animation: po-spin 2s linear infinite;
  }

  @keyframes po-spin { to { transform: rotate(360deg); } }

  .po-orbit-inner {
    width: 170px; height: 170px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: box-shadow 0.4s;
  }

  .po-orbit-inner.flash {
    box-shadow: 0 0 60px rgba(192,57,43,0.8), 0 0 0 6px rgba(139,0,0,0.3);
  }

  .po-lap-number {
    font-family: var(--font-display);
    font-size: 80px;
    line-height: 1;
    color: var(--text);
    transition: transform 0.15s;
  }

  .po-lap-number.pop { transform: scale(1.15); }

  .po-lap-label {
    font-family: var(--font-ui);
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-top: 2px;
  }

  /* ── Stats row ── */
  .po-stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 20px;
  }

  .po-stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .po-stat-icon {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-dim);
    font-family: var(--font-ui);
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
  }

  .po-stat-value {
    font-family: var(--font-ui);
    font-size: 32px;
    font-weight: 900;
    color: var(--text);
    line-height: 1;
  }

  .po-stat-unit {
    font-family: var(--font-ui);
    font-size: 13px;
    font-weight: 600;
    color: var(--text-dim);
    margin-left: 3px;
  }

  /* ── Start/Stop button ── */
  .po-action-wrap {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .po-start-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 22px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-family: var(--font-ui);
    font-size: 22px;
    font-weight: 900;
    letter-spacing: 4px;
    text-transform: uppercase;
    transition: transform 0.15s, box-shadow 0.15s;
    position: relative;
    overflow: hidden;
  }

  .po-start-btn.start {
    background: linear-gradient(135deg, #8b0000 0%, #c0392b 60%, #e74c3c 100%);
    color: #fff;
    box-shadow: 0 0 32px rgba(139,0,0,0.5), 0 6px 20px rgba(0,0,0,0.4);
  }

  .po-start-btn.start::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.07) 100%);
  }

  .po-start-btn.stop {
    background: var(--surface2);
    border: 1px solid rgba(192,57,43,0.4);
    color: #e74c3c;
    box-shadow: 0 0 16px rgba(139,0,0,0.2);
  }

  .po-start-btn:hover:not(:disabled) { transform: translateY(-2px); }
  .po-start-btn:active:not(:disabled) { transform: scale(0.98); }

  .po-start-btn.start:hover { box-shadow: 0 0 48px rgba(192,57,43,0.65), 0 10px 28px rgba(0,0,0,0.5); }

  .po-dev-row {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .po-dev-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: transparent;
    border: 1px dashed #2a2a2a;
    border-radius: 6px;
    color: #333;
    font-family: var(--font-ui);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 6px 12px;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }

  .po-dev-btn:hover { color: #666; border-color: #444; }

  /* ── Leaderboard ── */
  .po-board-title {
    font-family: var(--font-display);
    font-size: 52px;
    letter-spacing: 2px;
    color: var(--text);
    margin: 28px 0 4px;
    line-height: 1;
  }

  .po-board-sub {
    font-family: var(--font-ui);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 20px;
  }

  .po-board-header {
    display: grid;
    grid-template-columns: 32px 1fr 52px 64px 72px;
    gap: 8px;
    padding: 0 14px 8px;
    font-family: var(--font-ui);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #444;
  }

  .po-board-row {
    display: grid;
    grid-template-columns: 32px 1fr 52px 64px 72px;
    gap: 8px;
    align-items: center;
    padding: 14px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    margin-bottom: 8px;
    transition: border-color 0.2s;
  }

  .po-board-row.highlight {
    border-color: rgba(139,0,0,0.5);
    background: rgba(139,0,0,0.07);
  }

  .po-board-rank {
    font-family: var(--font-ui);
    font-size: 16px;
    font-weight: 900;
    color: var(--text-dim);
    text-align: center;
  }

  .po-board-rank.gold { color: #ffd700; }
  .po-board-rank.silver { color: #c0c0c0; }
  .po-board-rank.bronze { color: #cd7f32; }

  .po-board-name {
    font-family: var(--font-ui);
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .po-board-cell {
    font-family: var(--font-ui);
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    text-align: right;
  }

  .po-board-cell.laps { color: var(--red-bright); font-size: 18px; }

  .po-empty-board {
    text-align: center;
    padding: 48px 0;
    color: var(--text-dim);
    font-family: var(--font-ui);
    font-size: 14px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .po-lap-flash-overlay {
    position: fixed;
    inset: 0;
    background: rgba(139,0,0,0.18);
    pointer-events: none;
    z-index: 100;
    opacity: 0;
    transition: opacity 0.1s;
  }

  .po-lap-flash-overlay.show { opacity: 1; }

  .po-lap-toast {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(-80px);
    background: linear-gradient(135deg, #8b0000, #c0392b);
    color: #fff;
    font-family: var(--font-ui);
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 12px 28px;
    border-radius: 999px;
    box-shadow: 0 0 32px rgba(139,0,0,0.6);
    z-index: 101;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
    opacity: 0;
    white-space: nowrap;
  }

  .po-lap-toast.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }

  @media (min-width: 481px) {
    .po-screen { padding: 0 28px 40px; }
  }
`;
