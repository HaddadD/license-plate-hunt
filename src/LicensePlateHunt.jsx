import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { US, CA, ALL } from "./regions.js";

// Each plate mimics the state's real-world design: bg, embossed text color, bottom slogan.
const PLATE_STYLES = {
  // Northeast
  CT: { bg: "linear-gradient(180deg,#d7e8f7 0%,#9dc3e6 100%)", text: "#1b3a6b", slogan: "Constitution State" },
  ME: { bg: "linear-gradient(180deg,#f4f9ff 0%,#cfe3f0 100%)", text: "#20455e", slogan: "Vacationland" },
  MA: { bg: "#f5f3ec", text: "#b02a30", slogan: "The Spirit of America" },
  NH: { bg: "linear-gradient(180deg,#f2f5f0 0%,#cfe0cf 100%)", text: "#1e5c34", slogan: "Live Free or Die" },
  NJ: { bg: "linear-gradient(180deg,#fdf3c9 0%,#f3d97a 100%)", text: "#2b2b2b", slogan: "Garden State" },
  NY: { bg: "linear-gradient(180deg,#f0a838 0%,#f0a838 12%,#fdfbf4 12%,#fdfbf4 88%,#f0a838 88%,#f0a838 100%)", text: "#17335e", slogan: "Excelsior" },
  PA: { bg: "linear-gradient(180deg,#1d3f7a 0%,#1d3f7a 16%,#fdfdf8 16%,#fdfdf8 84%,#f2c33d 84%,#f2c33d 100%)", text: "#1d3f7a", slogan: "Keystone State" },
  RI: { bg: "linear-gradient(180deg,#ffffff 0%,#bcd9ee 100%)", text: "#1d4f91", slogan: "Ocean State" },
  VT: { bg: "#1a5632", text: "#f3f1ea", slogan: "Green Mountain State" },
  // South
  AL: { bg: "linear-gradient(180deg,#fdfdf8 0%,#f6d5c4 100%)", text: "#b02a30", slogan: "Sweet Home Alabama" },
  AR: { bg: "#fdfdf8", text: "#b02a30", slogan: "The Natural State" },
  DC: { bg: "#fdfdf8", text: "#c8102e", slogan: "End Taxation Without Representation" },
  DE: { bg: "#20293d", text: "#d9b64e", slogan: "The First State" },
  FL: { bg: "radial-gradient(circle at 50% 60%, #f5a13c 0%, #f7b45e 22%, #fdfaf2 60%)", text: "#1e6b3a", slogan: "Sunshine State" },
  GA: { bg: "linear-gradient(180deg,#fdf6ec 0%,#f8d9a8 60%,#f0a860 100%)", text: "#22344c", slogan: "Peach State" },
  KY: { bg: "linear-gradient(180deg,#fdfdf8 0%,#bcd9ee 100%)", text: "#1d4f91", slogan: "Unbridled Spirit" },
  LA: { bg: "#fdfdf8", text: "#1d4f91", slogan: "Sportsman's Paradise" },
  MD: { bg: "linear-gradient(180deg,#fdfbf4 0%,#fdfbf4 86%,#d13438 86%,#d13438 93%,#f2c33d 93%)", text: "#2b2b2b", slogan: "Old Line State" },
  MS: { bg: "linear-gradient(180deg,#fdfdf8 0%,#d5e5f0 100%)", text: "#243f6b", slogan: "Birthplace of America's Music" },
  NC: { bg: "linear-gradient(180deg,#fdfdf8 0%,#dbe9f5 100%)", text: "#1d4f91", slogan: "First in Flight" },
  OK: { bg: "linear-gradient(180deg,#8fc7e8 0%,#cde7f5 100%)", text: "#17456b", slogan: "Explore Oklahoma" },
  SC: { bg: "linear-gradient(180deg,#fdfdf8 0%,#cfe3f0 100%)", text: "#1a3e6e", slogan: "Palmetto State" },
  TN: { bg: "#1b2f5e", text: "#f3f1ea", slogan: "The Volunteer State" },
  TX: { bg: "#fdfdf8", text: "#2b2b2b", slogan: "The Lone Star State" },
  VA: { bg: "#fbfaf4", text: "#1d3a6e", slogan: "Old Dominion" },
  WV: { bg: "linear-gradient(180deg,#fdfbf0 0%,#f3e3b3 100%)", text: "#1d3a6e", slogan: "Wild, Wonderful" },
  // Midwest
  IA: { bg: "linear-gradient(180deg,#fdfdf8 0%,#bcd9ee 100%)", text: "#17335e", slogan: "The Hawkeye State" },
  IL: { bg: "linear-gradient(180deg,#cde3f5 0%,#fdfdf8 65%,#eecaca 100%)", text: "#b02a30", slogan: "Land of Lincoln" },
  IN: { bg: "linear-gradient(180deg,#1d3f7a 0%,#3e6db5 45%,#d9e8d9 100%)", text: "#f3f1ea", slogan: "Crossroads of America" },
  KS: { bg: "linear-gradient(180deg,#f7e6a2 0%,#f0c96a 100%)", text: "#17335e", slogan: "To the Stars" },
  MI: { bg: "#fdfdf8", text: "#17335e", slogan: "Pure Michigan" },
  MN: { bg: "linear-gradient(180deg,#cde3f5 0%,#fdfdf8 55%,#cfe0cf 100%)", text: "#17456b", slogan: "10,000 Lakes" },
  MO: { bg: "linear-gradient(180deg,#fdfdf8 0%,#bcd9ee 100%)", text: "#1d3a6e", slogan: "Show-Me State" },
  ND: { bg: "linear-gradient(180deg,#cde3f5 0%,#f7e0b8 100%)", text: "#17456b", slogan: "Peace Garden State" },
  NE: { bg: "linear-gradient(180deg,#fdfdf8 0%,#f3e3b3 100%)", text: "#1d3a6e", slogan: "The Good Life" },
  OH: { bg: "linear-gradient(180deg,#fdfdf8 0%,#d5e5f0 100%)", text: "#b02a30", slogan: "Birthplace of Aviation" },
  SD: { bg: "linear-gradient(180deg,#cde3f5 0%,#fdfdf8 50%,#cfe0cf 100%)", text: "#1d3a6e", slogan: "Great Faces. Great Places." },
  WI: { bg: "linear-gradient(180deg,#fdfdf8 0%,#f0d9b8 100%)", text: "#b02a30", slogan: "America's Dairyland" },
  // West
  AK: { bg: "#f7cf47", text: "#17335e", slogan: "The Last Frontier" },
  AZ: { bg: "linear-gradient(180deg,#5b3a6e 0%,#b0486e 45%,#e8a23c 100%)", text: "#f8e9c9", slogan: "Grand Canyon State" },
  CA: { bg: "#fdfdf8", text: "#b02a30", slogan: "The Golden State" },
  CO: { bg: "linear-gradient(180deg,#f4f9ff 0%,#f4f9ff 45%,#2f6b4f 45%,#1a5632 100%)", text: "#f3f1ea", slogan: "Colorful Colorado" },
  HI: { bg: "linear-gradient(100deg,#f8c9c9 0%,#f8e3c0 25%,#f8f4c0 50%,#cfe8cf 75%,#c9d9f0 100%)", text: "#2b2b2b", slogan: "Aloha State" },
  ID: { bg: "linear-gradient(180deg,#f4f9ff 0%,#cfe0cf 60%,#8fbf8f 100%)", text: "#b02a30", slogan: "Scenic Idaho" },
  MT: { bg: "#17335e", text: "#f3f1ea", slogan: "Big Sky Country" },
  NM: { bg: "#f7cf47", text: "#c8102e", slogan: "Land of Enchantment" },
  NV: { bg: "linear-gradient(180deg,#a8c8e0 0%,#d8d8d8 60%,#b8b8c0 100%)", text: "#17335e", slogan: "The Silver State" },
  OR: { bg: "linear-gradient(180deg,#f4f9ff 0%,#cfe0cf 100%)", text: "#17456b", slogan: "Pacific Wonderland" },
  UT: { bg: "linear-gradient(180deg,#f4e6d0 0%,#e8b06a 100%)", text: "#8a3c1e", slogan: "Life Elevated" },
  WA: { bg: "linear-gradient(180deg,#cde3f5 0%,#fdfdf8 100%)", text: "#17456b", slogan: "Evergreen State" },
  WY: { bg: "linear-gradient(180deg,#cde3f5 0%,#f7e0b8 100%)", text: "#5a3a20", slogan: "Forever West" },
  // Canada
  AB: { bg: "#fdfdf8", text: "#b02a30", slogan: "Wild Rose Country" },
  BC: { bg: "#fdfdf8", text: "#17335e", slogan: "Beautiful British Columbia" },
  MB: { bg: "#fdfdf8", text: "#17335e", slogan: "Friendly Manitoba" },
  NB: { bg: "#fdfdf8", text: "#17335e", slogan: "Picture Province" },
  NL: { bg: "#fdfdf8", text: "#17335e", slogan: "A World of Difference" },
  NS: { bg: "linear-gradient(180deg,#fdfdf8 0%,#cde3f5 100%)", text: "#17335e", slogan: "Canada's Ocean Playground" },
  NT: { bg: "linear-gradient(180deg,#cde3f5 0%,#fdfdf8 100%)", text: "#17335e", slogan: "Spectacular" },
  NU: { bg: "#fdfdf8", text: "#17335e", slogan: "Explore Canada's Arctic" },
  ON: { bg: "#fdfdf8", text: "#17335e", slogan: "Yours To Discover" },
  PE: { bg: "linear-gradient(180deg,#cfe8cf 0%,#f7e0b8 100%)", text: "#1a5632", slogan: "Birthplace of Confederation" },
  QC: { bg: "#fdfdf8", text: "#1d4f91", slogan: "Je me souviens" },
  SK: { bg: "linear-gradient(180deg,#fdfdf8 0%,#cfe0cf 100%)", text: "#1a5632", slogan: "Land of Living Skies" },
  YT: { bg: "#fdfdf8", text: "#17335e", slogan: "The Klondike" },
};

const GROUP_LABEL = { ne: "Northeast", south: "South", mw: "Midwest", west: "West", ca: "Canada" };

// Photos live in public/plates/<CODE>.webp, so they are served from the site root.
// Codes with no photo yet (currently just DC) fall back to the drawn plate above.
const PLATE_PHOTO_BASE = "/plates";
const NO_PHOTO = new Set(["DC"]);

const BOARD_KEY = "plate-board-name";

// The board name is the whole identity model: whoever knows it can open that
// board. Match the server's normalization so the two agree on the key.
export function normalizeBoardName(raw) {
  return String(raw || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

function readBoardFromUrl() {
  if (typeof window === "undefined") return "";
  return normalizeBoardName(new URLSearchParams(window.location.search).get("board"));
}

function rememberBoard(name) {
  try {
    window.localStorage.setItem(BOARD_KEY, name);
  } catch {
    // Private browsing — the URL still carries the board name.
  }
  const url = new URL(window.location.href);
  url.searchParams.set("board", name);
  window.history.replaceState({}, "", url);
}

function recallBoard() {
  try {
    return normalizeBoardName(window.localStorage.getItem(BOARD_KEY));
  } catch {
    return "";
  }
}

// Phone photos are far larger than the scanner needs and would blow the request
// body limit, so shrink before upload. Cuts cost and latency too.
async function fileToScaledJpeg(file, maxWidth = 1400) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  return { image: dataUrl.split(",")[1], mediaType: "image/jpeg" };
}

export default function LicensePlateHunt() {
  const [spotted, setSpotted] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [board, setBoard] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [syncState, setSyncState] = useState("idle"); // idle | saving | saved | error
  const saveTimer = useRef(null);
  const pending = useRef(null);
  const boardRef = useRef("");
  // JSON of the board as the server last confirmed it, so we don't save back
  // what we just loaded.
  const syncedSnapshot = useRef(null);
  const [tab, setTab] = useState("us");
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [detection, setDetection] = useState(null);
  const [photoFailed, setPhotoFailed] = useState({});
  const fileInputRef = useRef(null);

  // Pick up a board from the shared link first, then from this device.
  useEffect(() => {
    const initial = readBoardFromUrl() || recallBoard();
    if (initial) openBoard(initial);
    else setLoaded(true);
    // openBoard is stable for the life of the component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openBoard = useCallback(async (rawName) => {
    const name = normalizeBoardName(rawName);
    if (name.length < 3) return;
    setLoaded(false);
    setBoard(name);
    rememberBoard(name);
    try {
      const res = await fetch(`/api/board?board=${encodeURIComponent(name)}`);
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not load");
      const data = await res.json();
      const loadedSpotted = data.spotted || {};
      syncedSnapshot.current = JSON.stringify(loadedSpotted);
      setSpotted(loadedSpotted);
      setSyncState("saved");
    } catch (e) {
      console.error("Could not load board", e);
      setSyncState("error");
    } finally {
      setLoaded(true);
    }
  }, []);

  // Flush at most once per second so a burst of taps is one write.
  const scheduleSave = useCallback((next) => {
    pending.current = next;
    setSyncState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const payload = pending.current;
      try {
        const res = await fetch("/api/board", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ board: boardRef.current, spotted: payload }),
        });
        if (!res.ok) throw new Error("save failed");
        syncedSnapshot.current = JSON.stringify(payload);
        setSyncState("saved");
      } catch (e) {
        console.error("Could not save progress", e);
        setSyncState("error");
      }
    }, 800);
  }, []);

  // Keep the latest board name reachable from the debounced save.
  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => () => saveTimer.current && clearTimeout(saveTimer.current), []);

  // Saving is a side effect of `spotted` changing — never something a state
  // updater does, or rapid taps drop each other's writes.
  useEffect(() => {
    if (!board || !loaded) return;
    const snapshot = JSON.stringify(spotted);
    if (snapshot === syncedSnapshot.current) return;
    scheduleSave(spotted);
  }, [spotted, board, loaded, scheduleSave]);

  function toggle(code) {
    setSpotted((current) => {
      const next = { ...current };
      if (next[code]) delete next[code];
      else next[code] = Date.now();
      return next;
    });
  }

  function markDetected(code) {
    setSpotted((current) => ({ ...current, [code]: Date.now() }));
    setDetection((d) => (d ? { ...d, marked: true } : d));
  }

  function switchBoard() {
    setBoard("");
    setSpotted({});
    setNameDraft("");
    setSyncState("idle");
    try {
      window.localStorage.removeItem(BOARD_KEY);
    } catch {
      // nothing to clear
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("board");
    window.history.replaceState({}, "", url);
  }

  async function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setScanError(null);
    setDetection(null);
    setScanning(true);
    try {
      const { image, mediaType } = await fileToScaledJpeg(file);
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, mediaType }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong scanning that photo.");

      if (!data.found) {
        setDetection({ found: false, reasoning: data.reasoning });
      } else {
        setDetection({
          found: true,
          code: data.code,
          name: data.name,
          country: data.country,
          confidence: data.confidence,
          reasoning: data.reasoning,
          alreadySpotted: !!spotted[data.code],
          marked: false,
        });
      }
    } catch (err) {
      setScanError(err.message || "Something went wrong scanning that photo.");
    } finally {
      setScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const list = tab === "us" ? US : CA;
  // With a search query, look across both countries so e.g. "Ontario" matches from the US tab.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return ALL.filter((r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q));
  }, [list, query]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach((r) => {
      g[r.group] = g[r.group] || [];
      g[r.group].push(r);
    });
    Object.values(g).forEach((arr) => arr.sort((a, b) => a.name.localeCompare(b.name)));
    return g;
  }, [filtered]);

  const usCount = US.filter((r) => spotted[r.code]).length;
  const caCount = CA.filter((r) => spotted[r.code]).length;
  const totalCount = usCount + caCount;

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }
        .app {
          min-height: 100vh;
          background: #1B1D1F;
          background-image:
            repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px);
          color: #F3F1EA;
          font-family: 'IBM Plex Mono', monospace;
          padding-bottom: 60px;
        }
        .hero {
          padding: 48px 24px 28px;
          text-align: center;
          border-bottom: 3px dashed #F4B942;
          position: relative;
        }
        .hero-eyebrow {
          font-size: 12px;
          letter-spacing: 0.35em;
          color: #D9A441;
          margin-bottom: 10px;
        }
        .hero h1 {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          font-size: clamp(36px, 8vw, 72px);
          margin: 0;
          line-height: 0.95;
          color: #F3F1EA;
        }
        .hero h1 span { color: #F4B942; }
        .hero p {
          max-width: 480px;
          margin: 14px auto 0;
          color: #9aa0a3;
          font-size: 14px;
          line-height: 1.5;
        }
        .odometer-row {
          display: flex;
          justify-content: center;
          gap: 14px;
          margin-top: 28px;
          flex-wrap: wrap;
        }
        .odometer {
          background: #101213;
          border: 2px solid #33373a;
          border-radius: 6px;
          padding: 10px 18px;
          min-width: 100px;
        }
        .odometer .digits {
          font-family: 'IBM Plex Mono', monospace;
          font-variant-numeric: tabular-nums;
          font-size: 28px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #F4B942;
        }
        .odometer .label {
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #7b8082;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .board-gate {
          max-width: 520px;
          margin: 40px auto 0;
          padding: 26px 24px;
          border: 2px dashed #4a4f52;
          border-radius: 10px;
          background: #202325;
          text-align: center;
        }
        .board-gate h2 {
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 20px;
          margin: 0 0 8px;
          color: #F3F1EA;
        }
        .board-gate p {
          font-size: 13px;
          line-height: 1.5;
          color: #9aa0a3;
          margin: 0 0 18px;
        }
        .board-form {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .board-form .scan-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .board-hint {
          display: block;
          margin-top: 12px;
          font-size: 11px;
          color: #6b7072;
        }

        .board-bar {
          max-width: 960px;
          margin: 26px auto 0;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 12px;
          color: #7b8082;
        }
        .board-id strong { color: #F4B942; font-weight: 600; }
        .sync { margin-left: auto; letter-spacing: 0.05em; }
        .sync-saving { color: #D9A441; }
        .sync-saved { color: #3B6E4F; }
        .sync-error { color: #e2705a; }
        .board-switch {
          background: transparent;
          border: 1px solid #33373a;
          color: #9aa0a3;
          border-radius: 5px;
          padding: 4px 10px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          cursor: pointer;
        }
        .board-switch:hover { border-color: #4a4f52; color: #F3F1EA; }

        .scan-panel {
          max-width: 640px;
          margin: 32px auto 0;
          padding: 0 24px;
        }
        .scan-box {
          border: 2px dashed #4a4f52;
          border-radius: 10px;
          background: #202325;
          padding: 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          text-align: center;
        }
        .scan-box .icon {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: #F4B942;
          color: #1B1D1F;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .scan-box .copy { text-align: left; }
        .scan-box .copy strong {
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 16px;
          display: block;
        }
        .scan-box .copy span { font-size: 12px; color: #9aa0a3; }
        .scan-btn {
          background: #F4B942;
          color: #1B1D1F;
          border: none;
          border-radius: 6px;
          padding: 10px 18px;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .scan-btn:disabled { opacity: 0.6; cursor: wait; }
        .scan-status { text-align: center; margin-top: 12px; font-size: 13px; color: #D9A441; }
        .scan-error { text-align: center; margin-top: 12px; font-size: 13px; color: #e2705a; }

        .detection {
          margin-top: 16px;
          border-radius: 10px;
          border: 2px solid #F4B942;
          background: #232628;
          padding: 18px;
          text-align: center;
        }
        .detection .verdict {
          font-family: 'Oswald', sans-serif;
          font-size: 22px;
          text-transform: uppercase;
        }
        .detection .conf {
          display: inline-block;
          margin: 6px 0 10px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9aa0a3;
        }
        .detection .reasoning { font-size: 12px; color: #9aa0a3; margin-bottom: 14px; }
        .detection-actions { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
        .detection-actions button {
          border-radius: 6px;
          padding: 8px 14px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .btn-mark { background: #3B6E4F; color: #F3F1EA; border: none; }
        .btn-dismiss { background: transparent; color: #9aa0a3; border: 1px solid #4a4f52; }
        .btn-mark:disabled { opacity: 0.7; cursor: default; }

        .controls {
          max-width: 960px;
          margin: 40px auto 0;
          padding: 0 24px;
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .tabs { display: flex; gap: 8px; }
        .tab-btn {
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          background: transparent;
          border: 2px solid #33373a;
          color: #9aa0a3;
          padding: 8px 18px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        .tab-btn.active { border-color: #F4B942; color: #F4B942; }
        .search-input {
          background: #101213;
          border: 2px solid #33373a;
          border-radius: 6px;
          color: #F3F1EA;
          padding: 8px 12px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          min-width: 200px;
        }
        .search-input::placeholder { color: #6b7072; }

        .progress-wrap { max-width: 960px; margin: 18px auto 0; padding: 0 24px; }
        .progress-bar {
          height: 8px;
          background: #101213;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #33373a;
        }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #D9A441, #F4B942); }

        .group-block { max-width: 960px; margin: 34px auto 0; padding: 0 24px; }
        .group-title {
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 13px;
          color: #7b8082;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .group-title::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #33373a;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
        }

        .plate-cell {
          cursor: pointer;
          user-select: none;
          transition: transform 0.15s ease;
        }
        .plate-cell:hover { transform: translateY(-3px) rotate(-0.5deg); }
        .plate-cell:focus-visible { outline: 3px solid #F4B942; outline-offset: 4px; border-radius: 9px; }

        .plate {
          position: relative;
          border-radius: 9px;
          aspect-ratio: 2 / 1;
          overflow: hidden;
          background: #101213;
          border: 3px solid rgba(255,255,255,0.15);
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          transition: box-shadow 0.15s ease, border-color 0.15s ease;
        }
        .plate-photo {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .plate-caption {
          margin-top: 7px;
          text-align: center;
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 11px;
          line-height: 1.2;
          color: #6f7476;
          transition: color 0.15s ease;
        }
        .plate-cell.is-spotted .plate-caption { color: #F4B942; }

        /* Drawn plate, used only for codes that have no photo yet. */
        .plate-fallback {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .plate .bolt {
          position: absolute;
          top: 7px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: rgba(0,0,0,0.35);
        }
        .plate .bolt.l { left: 8px; }
        .plate .bolt.r { right: 8px; }
        .plate .code-tag {
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.25em;
          opacity: 0.65;
        }
        .plate .plate-name {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: center;
          line-height: 1.05;
          max-width: 92%;
          text-shadow: 0 1px 0 rgba(255,255,255,0.3), 0 -1px 1px rgba(0,0,0,0.25);
        }
        .plate .slogan {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          font-size: 8px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          opacity: 0.8;
        }
        /* Dim the artwork only, so the frame and stamp stay crisp. */
        .plate.dimmed .plate-photo,
        .plate.dimmed .plate-fallback {
          filter: grayscale(0.95) brightness(0.5) contrast(0.9);
        }
        .plate-cell:hover .plate.dimmed .plate-photo,
        .plate-cell:hover .plate.dimmed .plate-fallback {
          filter: grayscale(0.55) brightness(0.75);
        }
        .plate .stamp {
          position: absolute;
          top: 8px;
          right: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #F4B942;
          background: rgba(16,18,19,0.88);
          border: 1px solid #F4B942;
          border-radius: 3px;
          padding: 2px 5px;
          transform: rotate(6deg);
        }

        .footnote {
          max-width: 960px;
          margin: 40px auto 0;
          padding: 0 24px;
          font-size: 11px;
          color: #5f6466;
          text-align: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .plate-cell { transition: none; }
          .plate-cell:hover { transform: none; }
        }
      `}</style>

      <div className="hero">
        <div className="hero-eyebrow">ROAD TRIP LOGBOOK</div>
        <h1>License Plate <span>Hunt</span></h1>
        <p>Spot a plate, tap the state or province, watch it light up. Snap a photo of one you can't place and let the scanner call it.</p>
        <div className="odometer-row">
          <div className="odometer">
            <div className="digits">{pad(usCount)}/51</div>
            <div className="label">United States</div>
          </div>
          <div className="odometer">
            <div className="digits">{pad(caCount)}/13</div>
            <div className="label">Canada</div>
          </div>
          <div className="odometer">
            <div className="digits">{pad(totalCount)}/64</div>
            <div className="label">Total spotted</div>
          </div>
        </div>
      </div>

      {!board && (
        <div className="board-gate">
          <h2>Start your board</h2>
          <p>
            Pick a name for your board. Anyone who opens the same link — or types the same
            name — sees that board, so give each person their own.
          </p>
          <form
            className="board-form"
            onSubmit={(e) => {
              e.preventDefault();
              openBoard(nameDraft);
            }}
          >
            <input
              className="search-input"
              placeholder="e.g. dan-road-trip"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              maxLength={32}
              autoFocus
            />
            <button className="scan-btn" type="submit" disabled={normalizeBoardName(nameDraft).length < 3}>
              Open board
            </button>
          </form>
          <span className="board-hint">Letters, numbers and dashes. At least 3 characters.</span>
        </div>
      )}

      {board && (
        <>
          <div className="board-bar">
            <span className="board-id">
              Board: <strong>{board}</strong>
            </span>
            <span className={`sync sync-${syncState}`}>
              {syncState === "saving" && "Saving…"}
              {syncState === "saved" && "Saved"}
              {syncState === "error" && "Offline — changes not saved"}
            </span>
            <button className="board-switch" onClick={switchBoard}>Switch board</button>
          </div>

        <div className="scan-panel">
          <div className="scan-box">
            <div className="icon">◎</div>
            <div className="copy">
              <strong>Scan a plate</strong>
              <span>Upload a photo and we'll try to identify it</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: "none" }}
              id="plate-upload"
            />
            <button
              className="scan-btn"
              disabled={scanning}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              {scanning ? "Scanning…" : "Choose Photo"}
            </button>
          </div>
          {scanning && <div className="scan-status">Reading the plate…</div>}
          {scanError && <div className="scan-error">{scanError}</div>}

          {detection && detection.found && (
            <div className="detection">
              <div className="verdict">{detection.name} ({detection.code})</div>
              <div className="conf">{detection.confidence} confidence</div>
              <div className="reasoning">{detection.reasoning}</div>
              <div className="detection-actions">
                {detection.alreadySpotted || detection.marked ? (
                  <span style={{ fontSize: 12, color: "#3B6E4F" }}>✓ Already on your board</span>
                ) : (
                  <button className="btn-mark" onClick={() => markDetected(detection.code)}>
                    Mark as spotted
                  </button>
                )}
                <button className="btn-dismiss" onClick={() => setDetection(null)}>Dismiss</button>
              </div>
            </div>
          )}
          {detection && !detection.found && (
            <div className="detection">
              <div className="verdict">Couldn't place it</div>
              <div className="reasoning">{detection.reasoning || "Try a clearer or closer photo of the plate."}</div>
              <div className="detection-actions">
                <button className="btn-dismiss" onClick={() => setDetection(null)}>Dismiss</button>
              </div>
            </div>
          )}
        </div>

        <div className="controls">
          <div className="tabs">
            <button className={`tab-btn ${tab === "us" ? "active" : ""}`} onClick={() => setTab("us")}>United States</button>
            <button className={`tab-btn ${tab === "ca" ? "active" : ""}`} onClick={() => setTab("ca")}>Canada</button>
          </div>
          <input
            className="search-input"
            placeholder="Search by name or code…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="progress-wrap">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((tab === "us" ? usCount / 51 : caCount / 13) * 100).toFixed(1)}%` }}
            />
          </div>
        </div>

        {["mw", "ne", "south", "west", "ca"]
          .filter((groupKey) => grouped[groupKey])
          .map((groupKey) => (
            <div className="group-block" key={groupKey}>
              <div className="group-title">{GROUP_LABEL[groupKey]}</div>
              <div className="grid">
                {grouped[groupKey].map((r) => {
                  const isSpotted = !!spotted[r.code];
                  const design = PLATE_STYLES[r.code];
                  const hasPhoto = !NO_PHOTO.has(r.code) && !photoFailed[r.code];
                  const nameSize = r.name.length > 18 ? 12 : r.name.length > 12 ? 14 : r.name.length > 8 ? 17 : 21;
                  return (
                    <div
                      key={r.code}
                      className={`plate-cell ${isSpotted ? "is-spotted" : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSpotted}
                      aria-label={`${r.name}${isSpotted ? ", spotted" : ", not spotted yet"}`}
                      onClick={() => toggle(r.code)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggle(r.code)}
                    >
                      <div
                        className={`plate ${isSpotted ? "" : "dimmed"}`}
                        style={{ borderColor: isSpotted ? "rgba(244,185,66,0.55)" : "rgba(255,255,255,0.12)" }}
                      >
                        {hasPhoto ? (
                          <img
                            className="plate-photo"
                            src={`${PLATE_PHOTO_BASE}/${r.code}.webp`}
                            alt=""
                            width={480}
                            height={238}
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            onError={() => setPhotoFailed((f) => ({ ...f, [r.code]: true }))}
                          />
                        ) : (
                          <div
                            className="plate-fallback"
                            style={{ background: design.bg, color: design.text }}
                          >
                            <div className="bolt l" />
                            <div className="bolt r" />
                            <div className="code-tag">{r.code}</div>
                            <div className="plate-name" style={{ fontSize: nameSize }}>{r.name}</div>
                            {design.slogan && <div className="slogan">{design.slogan}</div>}
                          </div>
                        )}
                        {isSpotted && <div className="stamp">Spotted</div>}
                      </div>
                      <div className="plate-caption">{r.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        </>
      )}

      <div className="footnote">
        {!loaded
          ? "Loading your board…"
          : board
            ? "Progress saves to your board. Bookmark this link or reopen it with the same board name."
            : "Name a board to start tracking."}
      </div>
    </div>
  );
}
