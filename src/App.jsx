import { useState, useRef, useCallback, useMemo, useEffect } from "react";

const FIREBASE_CONFIG = {
  databaseURL: "https://mc-ds-timeline-default-rtdb.firebaseio.com",
};
const DB_PATH = "/timeline_v1";
const fbUrl = (path = "") => `${FIREBASE_CONFIG.databaseURL}${DB_PATH}${path}.json`;
async function fbGet(path = "") { const r = await fetch(fbUrl(path)); if (!r.ok) return null; return r.json(); }
async function fbSet(path, data) { await fetch(fbUrl(path), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); }

const CLOUD_NAME = "dwwgrh36c";
const UPLOAD_PRESET = "mc_ds_timeline";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
async function uploadToCloudinary(file) {
  const fd = new FormData(); fd.append("file", file); fd.append("upload_preset", UPLOAD_PRESET); fd.append("folder", "mc_ds_timeline");
  const r = await fetch(CLOUDINARY_URL, { method: "POST", body: fd }); const data = await r.json();
  return { url: data.secure_url, thumb: data.secure_url.replace("/upload/", "/upload/w_300,c_fill/") };
}

const DEFAULT_EVENT_TYPES = {
  joined_team: { icon: "🏢", label: "Joined Team", color: "#3b82f6" },
  paper: { icon: "📝", label: "Publication", color: "#f59e0b" },
  award: { icon: "🏆", label: "Award", color: "#ef4444" },
  marriage: { icon: "💒", label: "Marriage", color: "#ec4899" },
  child: { icon: "🍼", label: "Child Born", color: "#a78bfa" },
  relocation: { icon: "✈️", label: "Relocation", color: "#14b8a6" },
  speaking: { icon: "🎙️", label: "Speaking Event", color: "#f97316" },
  book: { icon: "📖", label: "Book Published", color: "#8b5cf6" },
  patent: { icon: "⚗️", label: "Patent", color: "#06b6d4" },
  teaching: { icon: "🎓", label: "Teaching", color: "#2563eb" },
  skiing: { icon: "⛷️", label: "Skiing First Time", color: "#38bdf8" },
  new_country: { icon: "🌎", label: "Visited New Country", color: "#10b981" },
  phd: { icon: "🎓", label: "PhD", color: "#7c3aed" },
  other: { icon: "📌", label: "Other", color: "#9ca3af" },
};

const KNOWN_JOINS = { "Brian Vaughan": "2013-08", "Jason Lu": "2014-08", "Ankur Gupta": "2015-10", "Michael Catalano": "2016-01", "Ajay Dadheech": "2016-08", "Anuj Gupta": "2016-08" };
const INITIAL_TEAM = ["Achal Sharma", "Aditya Prabhakaron", "Ajay Dadheech", "Ankur Gupta", "Anuj Gupta", "Bharat Singh", "Brian Dailey", "Brian Vaughan", "Charlene Ulrich", "Diego Solis", "Doug Rank", "Esteban", "Haley Sorensen", "Hao-Li Huang", "Jason Lu", "Jonathan Hahn", "June Seo", "Leah Ellis-Clemons", "Mayank Lal", "Mayank Seth", "Megha Mital", "Michael Catalano", "Muskan Poddar", "Neta", "Noah Wendland", "Nupur", "Pradeep Singh Gaur", "Angela Guo", "Ramnath K", "Revati Joshi", "Samvit Mukhopadhyay", "Snigdha Bhardwaj", "Sowjanya", "Sreelekshmy S", "Venkata Gunda", "Vinay Garg", "William Gills", "Xuanyang Lin"];
const PALETTE = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9", "#14b8a6", "#f97316", "#84cc16", "#a855f7", "#06b6d4", "#e11d48", "#059669", "#d946ef", "#0284c7", "#65a30d", "#dc2626", "#7c3aed", "#ea580c"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getInitials(name) { const p = name.trim().split(/\s+/); return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase(); }
function randomJoinDate(seed) { return `${2017 + (seed % 7)}-${String(1 + (seed * 7 + 3) % 12).padStart(2, "0")}`; }
function seedData() {
  return [...INITIAL_TEAM].sort((a, b) => a.localeCompare(b)).map((name, i) => {
    const joinDate = KNOWN_JOINS[name] || randomJoinDate(i);
    const evts = [{ id: `e${i}_0`, date: joinDate, type: "joined_team", label: "Joined WWT MC DS Team", photos: [] }];
    const h = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const [jy, jm] = joinDate.split("-").map(Number);
    if (h % 3 === 0) evts.push({ id: `e${i}_1`, date: `${jy + 2}-${String(((jm + 4) % 12) + 1).padStart(2, "0")}`, type: "new_country", label: "Visited new country", photos: [] });
    if (h % 4 === 1) evts.push({ id: `e${i}_2`, date: `${jy + 3}-${String(((jm + 7) % 12) + 1).padStart(2, "0")}`, type: "skiing", label: "First skiing trip", photos: [] });
    if (h % 5 === 2) evts.push({ id: `e${i}_3`, date: `${jy + 1}-${String(((jm + 2) % 12) + 1).padStart(2, "0")}`, type: "speaking", label: "Spoke at conference", photos: [] });
    if (h % 6 === 0) evts.push({ id: `e${i}_4`, date: `${jy + 4}-${String(((jm + 9) % 12) + 1).padStart(2, "0")}`, type: "marriage", label: "Got married", photos: [] });
    if (h % 7 === 3) evts.push({ id: `e${i}_5`, date: `${jy + 3}-06`, type: "award", label: "Team Excellence Award", photos: [] });
    return { id: `p_${i}`, name, initials: getInitials(name), events: evts.sort((a, b) => a.date.localeCompare(b.date)) };
  });
}

const START_YEAR = 2013; const END_YEAR = 2026;
let eidCounter = Date.now(); function nextEid() { return `e_${eidCounter++}`; }

function DatePicker({ year, month, onChangeYear, onChangeMonth }) {
  const yrs = []; for (let y = 2013; y <= 2026; y++) yrs.push(y);
  return (<div style={{ display: "flex", gap: 8 }}>
    <select value={year} onChange={e => onChangeYear(Number(e.target.value))} style={{ ...inputStyle, flex: 1 }}>{yrs.map(y => <option key={y} value={y}>{y}</option>)}</select>
    <select value={month} onChange={e => onChangeMonth(Number(e.target.value))} style={{ ...inputStyle, flex: 1 }}>{MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}</select>
  </div>);
}

function PhotoCarousel({ photos, onAdd, personName, eventLabel }) {
  const [idx, setIdx] = useState(0); const [fs, setFs] = useState(null); const [uploading, setUploading] = useState(false); const fileRef = useRef(null);
  const handleUpload = async (e) => { const file = e.target.files?.[0]; if (!file) return; setUploading(true); try { const r = await uploadToCloudinary(file); onAdd(r); } catch (err) { console.error(err); } setUploading(false); if (fileRef.current) fileRef.current.value = ""; };
  const si = photos.length > 0 ? Math.min(idx, photos.length - 1) : 0;
  return (<>
    <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8 }}>
      {photos.length > 0 ? (<div>
        <div style={{ position: "relative", width: "100%", height: 140, borderRadius: 8, overflow: "hidden", background: "#0a0e1a", marginBottom: 6 }}>
          <img src={photos[si]?.url} alt={`${personName}`} onClick={() => setFs(photos[si]?.url)} style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "zoom-in" }} />
          {photos.length > 1 && (<>
            <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + photos.length) % photos.length); }} style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % photos.length); }} style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          </>)}
          <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
            {photos.map((_, i) => (<div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === si ? "#fff" : "rgba(255,255,255,0.3)", cursor: "pointer" }} onClick={e => { e.stopPropagation(); setIdx(i); }} />))}
          </div>
          <div style={{ position: "absolute", top: 4, right: 4, fontSize: 9, background: "rgba(0,0,0,0.5)", color: "#fff", borderRadius: 4, padding: "2px 6px" }}>Click to enlarge</div>
        </div>
        <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4 }}>
          {photos.map((p, i) => (<img key={i} src={p.thumb || p.url} onClick={e => { e.stopPropagation(); setIdx(i); }} style={{ width: 36, height: 36, borderRadius: 4, objectFit: "cover", cursor: "pointer", border: i === si ? "2px solid #3b82f6" : "2px solid transparent", opacity: i === si ? 1 : 0.6, flexShrink: 0 }} />))}
        </div>
      </div>) : (<div style={{ fontSize: 11, color: "#4b5563", textAlign: "center", padding: "8px 0" }}>No photos yet</div>)}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
      <button onClick={e => { e.stopPropagation(); fileRef.current?.click(); }} disabled={uploading} style={{ marginTop: 6, padding: "5px 0", fontSize: 11, borderRadius: 6, cursor: uploading ? "wait" : "pointer", fontFamily: "inherit", width: "100%", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        {uploading ? "⏳ Uploading..." : "📷 Add Photo"}
      </button>
    </div>
    {fs && (<div onClick={() => setFs(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, cursor: "zoom-out" }}>
      <img src={fs} style={{ maxWidth: "92vw", maxHeight: "92vh", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }} />
      <button onClick={() => setFs(null)} style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
    </div>)}
  </>);
}

export default function MCDSTimeline() {
  const [people, setPeople] = useState(null); const [customTypes, setCustomTypes] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true); const [pinnedEvent, setPinnedEvent] = useState(null); const [hoveredEvent, setHoveredEvent] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1.2); const [focusYear, setFocusYear] = useState(2026); const [focusMultiplier, setFocusMultiplier] = useState(4);
  const [searchQuery, setSearchQuery] = useState(""); const [activeFilters, setActiveFilters] = useState(new Set()); const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false); const [showAddPersonModal, setShowAddPersonModal] = useState(false); const [showCustomTypeModal, setShowCustomTypeModal] = useState(false);
  const [addTarget, setAddTarget] = useState(null); const [newEventType, setNewEventType] = useState("joined_team"); const [newEventYear, setNewEventYear] = useState(2026); const [newEventMonth, setNewEventMonth] = useState(1);
  const [newEventLabel, setNewEventLabel] = useState(""); const [newEventOtherTitle, setNewEventOtherTitle] = useState(""); const [addEventError, setAddEventError] = useState(""); const [newEventPhotos, setNewEventPhotos] = useState([]); const [newEventUploading, setNewEventUploading] = useState(false);
  const [newPersonName, setNewPersonName] = useState(""); const [newCustom, setNewCustom] = useState({ key: "", label: "", icon: "⭐", color: "#f59e0b" });
  const [scrollLeft, setScrollLeft] = useState(0); const [deleteConfirm, setDeleteConfirm] = useState(null); const [isLoading, setIsLoading] = useState(true); const [syncStatus, setSyncStatus] = useState("loading");

  const bodyScrollRef = useRef(null); const sidebarBodyRef = useRef(null); const headerScrollRef = useRef(null); const isSyncing = useRef(false); const saveTimeout = useRef(null);
  const BASE_MONTH_W = 22 * zoomLevel; const ROW_H = 56; const HEADER_H = 56; const SIDEBAR_W = sidebarOpen ? 260 : 48; const ICON_SIZE = 32;
  const allTypes = useMemo(() => ({ ...DEFAULT_EVENT_TYPES, ...customTypes }), [customTypes]);
  const activeTooltip = pinnedEvent || hoveredEvent;

  const layoutEngine = useMemo(() => {
    const yd = {}; let rx = 0;
    for (let y = START_YEAR; y <= END_YEAR; y++) { const mw = y === focusYear ? BASE_MONTH_W * focusMultiplier : BASE_MONTH_W; yd[y] = { x: rx, monthWidth: mw }; rx += 12 * mw; }
    return { yearData: yd, totalWidth: rx, getX: (ds) => { const [y, m] = ds.split("-").map(Number); const d = yd[y]; return d ? d.x + (m - 1) * d.monthWidth : 0; }, getYearX: (y) => yd[y]?.x || 0, getMonthW: (y) => yd[y]?.monthWidth || BASE_MONTH_W };
  }, [focusYear, focusMultiplier, BASE_MONTH_W]);
  const { totalWidth: timelineWidth, getX, getYearX, getMonthW } = layoutEngine;

  useEffect(() => { (async () => { try { const data = await fbGet(); if (data && data.people) { setPeople(data.people); setCustomTypes(data.customTypes || {}); setSyncStatus("synced"); } else { const ini = seedData(); setPeople(ini); await fbSet("", { people: ini, customTypes: {} }); setSyncStatus("synced"); } } catch (e) { console.error("Firebase load failed:", e); try { const raw = localStorage.getItem("mc-ds-timeline-v5"); if (raw) { const p = JSON.parse(raw); setPeople(p.people || seedData()); setCustomTypes(p.customTypes || {}); } else setPeople(seedData()); } catch { setPeople(seedData()); } setSyncStatus("offline"); } setIsLoading(false); })(); }, []);

  const saveToFirebase = useCallback((ppl, ct) => { if (saveTimeout.current) clearTimeout(saveTimeout.current); saveTimeout.current = setTimeout(async () => { setSyncStatus("saving"); try { await fbSet("", { people: ppl, customTypes: ct }); setSyncStatus("synced"); } catch { try { localStorage.setItem("mc-ds-timeline-v5", JSON.stringify({ people: ppl, customTypes: ct })); } catch { } setSyncStatus("offline"); } }, 600); }, []);
  const updatePeople = (updater) => { setPeople(prev => { const next = typeof updater === "function" ? updater(prev) : updater; saveToFirebase(next, customTypes); return next; }); };
  const updateCustomTypes = (updater) => { setCustomTypes(prev => { const next = typeof updater === "function" ? updater(prev) : updater; saveToFirebase(people, next); return next; }); };
  const addPhotoToEvent = (pid, eid, photoData) => { updatePeople(prev => prev.map(p => p.id === pid ? { ...p, events: p.events.map(e => e.id === eid ? { ...e, photos: [...(e.photos || []), photoData] } : e) } : p)); };

  const filtered = useMemo(() => { if (!people) return []; let list = people; if (searchQuery) { const q = searchQuery.toLowerCase(); list = list.filter(s => s.name.toLowerCase().includes(q)); } if (activeFilters.size > 0) list = list.filter(s => s.events.some(e => activeFilters.has(e.type))); return list; }, [people, searchQuery, activeFilters]);

  const handleBodyScroll = useCallback(() => { if (isSyncing.current) return; isSyncing.current = true; const el = bodyScrollRef.current; if (el) { if (headerScrollRef.current) headerScrollRef.current.scrollLeft = el.scrollLeft; if (sidebarBodyRef.current) sidebarBodyRef.current.scrollTop = el.scrollTop; setScrollLeft(el.scrollLeft); } requestAnimationFrame(() => { isSyncing.current = false; }); }, []);
  const handleSidebarScroll = useCallback(() => { if (isSyncing.current) return; isSyncing.current = true; if (sidebarBodyRef.current && bodyScrollRef.current) bodyScrollRef.current.scrollTop = sidebarBodyRef.current.scrollTop; requestAnimationFrame(() => { isSyncing.current = false; }); }, []);

  const toggleFilter = (type) => { setActiveFilters(prev => { const n = new Set(prev); n.has(type) ? n.delete(type) : n.add(type); return n; }); };
  const openAddEvent = (person) => { setAddTarget(person); setNewEventType("joined_team"); setNewEventYear(2026); setNewEventMonth(1); setNewEventLabel(""); setNewEventOtherTitle(""); setAddEventError(""); setNewEventPhotos([]); setShowAddEventModal(true); };
  const submitEvent = () => { if (!addTarget) return; if (newEventType === "joined_team" && addTarget.events.some(e => e.type === "joined_team")) { setAddEventError("This person already has a \"Joined Team\" event."); return; } setAddEventError(""); const date = `${newEventYear}-${String(newEventMonth).padStart(2, "0")}`; const label = newEventType === "other" ? (newEventOtherTitle || "Other event") : (newEventLabel || allTypes[newEventType]?.label || "Event"); updatePeople(prev => prev.map(p => p.id === addTarget.id ? { ...p, events: [...p.events, { id: nextEid(), date, type: newEventType, label, photos: newEventPhotos }].sort((a, b) => a.date.localeCompare(b.date)) } : p)); setShowAddEventModal(false); };
  const deleteEvent = (pid, eid) => { updatePeople(prev => prev.map(p => p.id === pid ? { ...p, events: p.events.filter(e => e.id !== eid) } : p)); setDeleteConfirm(null); setPinnedEvent(null); setHoveredEvent(null); };
  const addPerson = () => { const name = newPersonName.trim(); if (!name) return; updatePeople(prev => { if (prev.find(p => p.name.toLowerCase() === name.toLowerCase())) return prev; return [...prev, { id: `p_${Date.now()}`, name, initials: getInitials(name), events: [] }].sort((a, b) => a.name.localeCompare(b.name)); }); setNewPersonName(""); setShowAddPersonModal(false); };
  const submitCustomType = () => { const key = newCustom.key.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""); if (!key || !newCustom.label) return; updateCustomTypes(prev => ({ ...prev, [key]: { icon: newCustom.icon, label: newCustom.label, color: newCustom.color } })); setShowCustomTypeModal(false); setNewCustom({ key: "", label: "", icon: "⭐", color: "#f59e0b" }); };

  const years = []; for (let y = START_YEAR; y <= END_YEAR; y++)years.push(y);
  const getCollapsedEvents = (events) => { const visible = [], collapsed = []; for (const ev of events) { if (activeFilters.size > 0 && !activeFilters.has(ev.type)) continue; if (getX(ev.date) - scrollLeft < -(ICON_SIZE / 2)) collapsed.push(ev); else visible.push(ev); } return { visible, collapsed }; };
  const handleTimelineBgClick = (e) => { if (e.target === e.currentTarget || e.target.classList.contains("row-hover")) { setPinnedEvent(null); setDeleteConfirm(null); } };
  const jumpToFocusYear = () => { if (bodyScrollRef.current) bodyScrollRef.current.scrollLeft = Math.max(0, getYearX(focusYear) - 20); };

  if (isLoading) return (<div style={{ width: "100%", height: "100vh", background: "#0c1021", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontFamily: "'DM Sans',sans-serif" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 32, marginBottom: 12 }}>🏢</div><div style={{ fontSize: 14 }}>Loading timeline...</div></div></div>);

  const syncDot = syncStatus === "synced" ? "#10b981" : syncStatus === "saving" ? "#f59e0b" : "#ef4444";
  const syncLabel = syncStatus === "synced" ? "Synced" : syncStatus === "saving" ? "Saving..." : "Offline";

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: "#0c1021", fontFamily: "'DM Sans','Nunito',sans-serif", color: "#d1d5db", overflow: "hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700&display=swap');*{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:#1e293b #0c1021}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#0c1021}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px}.row-hover:hover{background:rgba(59,130,246,0.04)!important}.event-pip{transition:transform .18s ease,box-shadow .18s ease;cursor:pointer}.event-pip:hover{transform:scale(1.18)!important}.sidebar-row:hover .add-btn{opacity:1!important}.modal-overlay{animation:fadeIn .15s ease}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}.modal-card{animation:slideUp .2s ease}.collapsed-stack-item{transition:all .35s cubic-bezier(.34,1.56,.64,1)}select option{background:#141b30;color:#e5e7eb}`}</style>

      {/* TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", background: "linear-gradient(90deg,#0e1225,#111833)", borderBottom: "1px solid #1a2744", gap: 10, zIndex: 30, flexShrink: 0, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>W</div>
          <div><div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: "#e5e7eb" }}>MC Data Scientists Team</div>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: -1, display: "flex", alignItems: "center", gap: 6 }}>WWT MC · {filtered.length} members <span style={{ display: "inline-flex", alignItems: "center", gap: 3, marginLeft: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: syncDot, display: "inline-block" }} /><span style={{ fontSize: 9, color: syncDot }}>{syncLabel}</span></span></div></div>
        </div>
        <div style={{ flex: 1, minWidth: 20 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8, padding: "4px 10px" }}>
          <span style={{ fontSize: 11, color: "#fbbf24", fontWeight: 600 }}>🔎 Focus</span>
          <select value={focusYear} onChange={e => setFocusYear(Number(e.target.value))} style={{ background: "transparent", border: "none", color: "#fbbf24", fontSize: 12, fontWeight: 700, fontFamily: "inherit", outline: "none", cursor: "pointer" }}>{years.map(y => <option key={y} value={y} style={{ background: "#141b30" }}>{y}</option>)}<option value={0} style={{ background: "#141b30" }}>None</option></select>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>{[2, 3, 4, 5].map(m => (<button key={m} onClick={() => setFocusMultiplier(m)} style={{ width: 22, height: 22, borderRadius: 4, fontSize: 10, fontWeight: 600, background: focusMultiplier === m ? "rgba(245,158,11,0.2)" : "transparent", border: focusMultiplier === m ? "1px solid #f59e0b" : "1px solid transparent", color: focusMultiplier === m ? "#fbbf24" : "#6b7280", cursor: "pointer" }}>{m}x</button>))}</div>
          <button onClick={jumpToFocusYear} style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 4, color: "#fbbf24", fontSize: 10, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}>Go →</button>
        </div>
        <div style={{ position: "relative", width: 160 }}><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." style={{ width: "100%", padding: "7px 12px 7px 30px", background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", borderRadius: 8, color: "#d1d5db", fontSize: 12, outline: "none", fontFamily: "inherit" }} /><span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 13, opacity: 0.3 }}>🔍</span></div>
        <button onClick={() => setShowAddPersonModal(true)} style={{ padding: "7px 10px", background: "rgba(16,185,129,0.1)", border: "1px solid #10b981", borderRadius: 8, color: "#6ee7b7", fontSize: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>＋ Member</button>
        <button onClick={() => setShowFilterPanel(!showFilterPanel)} style={{ padding: "7px 10px", background: showFilterPanel ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${showFilterPanel ? "#3b82f6" : "#1e293b"}`, borderRadius: 8, color: "#93c5fd", fontSize: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>▾ Filters{activeFilters.size > 0 && <span style={{ background: "#3b82f6", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 10 }}>{activeFilters.size}</span>}</button>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><button onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.2))} style={zoomBtnStyle}>−</button><span style={{ fontSize: 11, color: "#6b7280", width: 36, textAlign: "center" }}>{Math.round(zoomLevel * 100)}%</span><button onClick={() => setZoomLevel(z => Math.min(3, z + 0.2))} style={zoomBtnStyle}>+</button></div>
      </div>

      {/* FILTER PANEL */}
      {showFilterPanel && (<div style={{ padding: "10px 20px", background: "#0d1328", borderBottom: "1px solid #1a2744", display: "flex", flexWrap: "wrap", gap: 6, zIndex: 25, flexShrink: 0, alignItems: "center" }}>
        {Object.entries(allTypes).map(([key, t]) => (<button key={key} onClick={() => toggleFilter(key)} style={{ padding: "5px 12px", background: activeFilters.has(key) ? `${t.color}18` : "rgba(255,255,255,0.02)", border: `1px solid ${activeFilters.has(key) ? t.color : "#1e293b"}`, borderRadius: 20, color: activeFilters.has(key) ? t.color : "#6b7280", fontSize: 11, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}><span style={{ fontSize: 14 }}>{t.icon}</span> {t.label}</button>))}
        <button onClick={() => setShowCustomTypeModal(true)} style={{ padding: "5px 12px", background: "rgba(59,130,246,0.08)", border: "1px dashed #3b82f6", borderRadius: 20, color: "#60a5fa", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>＋ Custom Type</button>
        {activeFilters.size > 0 && <button onClick={() => setActiveFilters(new Set())} style={{ padding: "5px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 20, color: "#ef4444", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>✕ Clear</button>}
      </div>)}

      {/* MAIN */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR */}
        <div style={{ width: SIDEBAR_W, transition: "width .25s ease", background: "#0b0f1e", borderRight: "1px solid #1a2744", display: "flex", flexDirection: "column", flexShrink: 0, zIndex: 20 }}>
          <div style={{ height: HEADER_H, display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "space-between" : "center", padding: sidebarOpen ? "0 14px" : "0", borderBottom: "1px solid #1a2744", flexShrink: 0 }}>
            {sidebarOpen && <span style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Team Member</span>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "transparent", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 16, padding: 4 }}>{sidebarOpen ? "◀" : "▶"}</button>
          </div>
          <div ref={sidebarBodyRef} onScroll={handleSidebarScroll} style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            {filtered.map(s => (<div key={s.id} className="sidebar-row" style={{ height: ROW_H, display: "flex", alignItems: "center", padding: sidebarOpen ? "0 10px" : "0 6px", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.02)", flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${PALETTE[s.name.length % PALETTE.length]}18`, border: `2px solid ${PALETTE[s.name.length % PALETTE.length]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: PALETTE[s.name.length % PALETTE.length], flexShrink: 0 }}>{s.initials}</div>
              {sidebarOpen && <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}><div style={{ fontSize: 12.5, fontWeight: 600, color: "#e5e7eb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div><div style={{ fontSize: 10, color: "#4b5563" }}>{s.events.length} event{s.events.length !== 1 ? "s" : ""}</div></div>}
              {sidebarOpen && <button className="add-btn" onClick={() => openAddEvent(s)} title="Add event" style={{ opacity: 0, transition: "opacity .15s", width: 24, height: 24, borderRadius: 6, background: "rgba(59,130,246,0.1)", border: "1px solid #3b82f6", color: "#60a5fa", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>＋</button>}
            </div>))}
          </div>
        </div>

        {/* TIMELINE */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div ref={headerScrollRef} style={{ height: HEADER_H, overflowX: "hidden", overflowY: "hidden", borderBottom: "1px solid #1a2744", flexShrink: 0, background: "#0b0f1e" }}>
            <div style={{ width: timelineWidth, height: "100%", position: "relative" }}>
              {years.map(y => {
                const yx = getYearX(y), mw = getMonthW(y), isFocus = y === focusYear; return (<div key={y}>
                  {isFocus && <div style={{ position: "absolute", left: yx, top: 0, width: 12 * mw, height: "100%", background: "rgba(245,158,11,0.04)", borderLeft: "1px solid rgba(245,158,11,0.15)", borderRight: "1px solid rgba(245,158,11,0.15)" }} />}
                  <div style={{ position: "absolute", left: yx + 4, top: 8, fontSize: isFocus ? 14 : 13, fontWeight: 700, color: isFocus ? "#fbbf24" : "#3b82f6", fontFamily: "'Outfit',sans-serif" }}>{y}</div>
                  {(zoomLevel >= 0.8 || isFocus) && Array.from({ length: 12 }, (_, m) => { const mx = yx + m * mw; return (<div key={m}>{(isFocus || zoomLevel >= 1.2) && <div style={{ position: "absolute", left: mx + 3, top: 28, fontSize: isFocus ? 11 : 9, color: isFocus ? "#92713a" : "#374151", fontWeight: isFocus ? 600 : 400 }}>{MONTH_NAMES[m]}</div>}<div style={{ position: "absolute", left: mx, top: 44, width: 1, height: 10, background: m === 0 ? (isFocus ? "rgba(245,158,11,0.3)" : "#1e3a5f") : "rgba(255,255,255,0.03)" }} /></div>); })}
                </div>);
              })}
            </div>
          </div>

          <div ref={bodyScrollRef} onScroll={handleBodyScroll} onClick={handleTimelineBgClick} style={{ flex: 1, overflow: "auto" }}>
            <div style={{ width: timelineWidth, height: filtered.length * ROW_H, position: "relative" }}>
              {years.map(y => {
                const yx = getYearX(y), isFocus = y === focusYear; return (<div key={`g${y}`}>
                  <div style={{ position: "absolute", left: yx, top: 0, width: 1, height: "100%", background: isFocus ? "rgba(245,158,11,0.15)" : "#111936", pointerEvents: "none" }} />
                  {isFocus && <div style={{ position: "absolute", left: yx, top: 0, width: 12 * getMonthW(y), height: "100%", background: "rgba(245,158,11,0.02)", pointerEvents: "none" }} />}
                  {isFocus && Array.from({ length: 11 }, (_, m) => <div key={m} style={{ position: "absolute", left: yx + (m + 1) * getMonthW(y), top: 0, width: 1, height: "100%", background: "rgba(245,158,11,0.06)", pointerEvents: "none" }} />)}
                </div>);
              })}

              {filtered.map((s, ri) => {
                const { visible, collapsed } = getCollapsedEvents(s.events); const pColor = PALETTE[s.name.length % PALETTE.length];
                return (<div key={s.id} className="row-hover" style={{ position: "absolute", top: ri * ROW_H, left: 0, width: "100%", height: ROW_H, borderBottom: "1px solid rgba(255,255,255,0.02)", background: ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.008)" }}>
                  {(() => { const allVis = activeFilters.size > 0 ? s.events.filter(e => activeFilters.has(e.type)) : s.events; if (allVis.length < 2) return null; const hasC = collapsed.length > 0, lastE = visible.length > 0 ? visible[visible.length - 1] : null; if (!hasC && visible.length < 2) return null; if (hasC && !lastE) return null; const x1 = hasC ? scrollLeft + 52 : getX(visible[0].date) + ICON_SIZE / 2, x2 = lastE ? getX(lastE.date) : x1, w = Math.max(0, x2 - x1); return w > 0 ? <div style={{ position: "absolute", left: x1, top: ROW_H / 2, width: w, height: 2, borderRadius: 1, background: `linear-gradient(90deg,${pColor}55,${pColor}20)` }} /> : null; })()}

                  {collapsed.length > 0 && (<div style={{ position: "sticky", left: 0, top: 0, width: 52, height: ROW_H, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, float: "left" }}><div style={{ position: "relative", width: 40, height: 40 }}>
                    {collapsed.slice(-3).map((ev, ci) => { const t = allTypes[ev.type] || allTypes.other; return <div key={ev.id || ci} className="collapsed-stack-item" style={{ position: "absolute", left: ci * 6, top: ci * 4, width: 28, height: 28, borderRadius: 8, background: `${t.color}25`, border: `1.5px solid ${t.color}88`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{t.icon}</div>; })}
                    <div style={{ position: "absolute", bottom: -2, right: -4, background: "#3b82f6", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "1px 5px", minWidth: 16, textAlign: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }}>{collapsed.length}</div>
                  </div></div>)}

                  {visible.map(ev => {
                    const t = allTypes[ev.type] || allTypes.other; const x = getX(ev.date); const isActive = activeTooltip?.sid === s.id && activeTooltip?.eid === ev.id; const isPinned = pinnedEvent?.sid === s.id && pinnedEvent?.eid === ev.id; const hasPhotos = ev.photos && ev.photos.length > 0;
                    const firstThumb = hasPhotos ? (ev.photos[0].thumb || ev.photos[0].url) : null;
                    const tooltipAbove = ri >= 4;
                    const tooltipPos = tooltipAbove ? { bottom: ICON_SIZE + 8 } : { top: ICON_SIZE + 8 };
                    return (<div key={ev.id} onMouseEnter={() => { if (!pinnedEvent) setHoveredEvent({ sid: s.id, eid: ev.id }); }} onMouseLeave={() => { if (!pinnedEvent) setHoveredEvent(null); }}
                      onClick={e => { e.stopPropagation(); if (isPinned) { setPinnedEvent(null); setDeleteConfirm(null); } else { setPinnedEvent({ sid: s.id, eid: ev.id }); setHoveredEvent(null); setDeleteConfirm(null); } }}
                      className="event-pip" style={{ position: "absolute", left: x - ICON_SIZE / 2, top: ROW_H / 2 - ICON_SIZE / 2, width: ICON_SIZE, height: ICON_SIZE, borderRadius: 10, background: firstThumb ? "transparent" : isActive ? `${t.color}30` : `${t.color}14`, border: `2px solid ${t.color}${isActive ? "cc" : "55"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, zIndex: isActive ? 100 : 1, boxShadow: isActive ? `0 0 20px ${t.color}44,0 4px 12px rgba(0,0,0,0.4)` : "none" }}>
                      {firstThumb ? <div style={{ position: "absolute", inset: 0, borderRadius: 8, overflow: "hidden" }}><img src={firstThumb} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div> : t.icon}
                      {isActive && (<div onClick={e => e.stopPropagation()} style={{ position: "absolute", ...tooltipPos, left: "50%", transform: "translateX(-50%)", background: "#141b30", border: `1px solid ${t.color}55`, borderRadius: 10, padding: "10px 14px", whiteSpace: "nowrap", zIndex: 1000, minWidth: 220, maxWidth: 320, boxShadow: `0 12px 40px rgba(0,0,0,0.6),0 0 16px ${t.color}15` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><span style={{ fontSize: 16 }}>{t.icon}</span><span style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.label}</span></div>
                        <div style={{ fontSize: 12, color: "#e5e7eb", fontWeight: 500 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, whiteSpace: "normal" }}>{ev.label}</div>
                        <div style={{ fontSize: 10, color: "#4b5563", marginTop: 4, fontFamily: "monospace" }}>{ev.date}</div>
                        {isPinned && <PhotoCarousel photos={ev.photos || []} personName={s.name} eventLabel={ev.label} onAdd={(pd) => addPhotoToEvent(s.id, ev.id, pd)} />}
                        <button onClick={e => { e.stopPropagation(); deleteConfirm?.eid === ev.id ? deleteEvent(s.id, ev.id) : setDeleteConfirm({ sid: s.id, eid: ev.id }); }} style={{ marginTop: 8, padding: "5px 10px", fontSize: 11, borderRadius: 6, cursor: "pointer", fontFamily: "inherit", width: "100%", background: deleteConfirm?.eid === ev.id ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.08)", border: `1px solid ${deleteConfirm?.eid === ev.id ? "#ef4444" : "rgba(239,68,68,0.25)"}`, color: deleteConfirm?.eid === ev.id ? "#fca5a5" : "#ef4444" }}>{deleteConfirm?.eid === ev.id ? "Confirm delete?" : "🗑 Delete event"}</button>
                        {isPinned && <div style={{ fontSize: 9, color: "#4b5563", marginTop: 6, textAlign: "center" }}>Click icon again to close</div>}
                      </div>)}
                    </div>);
                  })}
                </div>);
              })}
            </div>
          </div>
        </div>
      </div>

      {/* LEGEND */}
      <div style={{ padding: "8px 20px", background: "#0b0f1e", borderTop: "1px solid #1a2744", display: "flex", gap: 16, overflowX: "auto", flexShrink: 0, alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, flexShrink: 0 }}>Legend</span>
        {Object.entries(allTypes).map(([key, t]) => (<div key={key} style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}><span style={{ fontSize: 15 }}>{t.icon}</span><span style={{ fontSize: 11, color: t.color, fontWeight: 500 }}>{t.label}</span></div>))}
      </div>

      {/* ADD EVENT MODAL */}
      {showAddEventModal && addTarget && (<div className="modal-overlay" onClick={() => setShowAddEventModal(false)} style={overlayStyle}><div className="modal-card" onClick={e => e.stopPropagation()} style={modalStyle}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#e5e7eb", marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>Add Life Event</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>for {addTarget.name}</div>
        <label style={labelStyle}>Event Type</label>
        <select value={newEventType} onChange={e => { setNewEventType(e.target.value); setAddEventError(""); }} style={inputStyle}>{Object.entries(allTypes).map(([k, t]) => <option key={k} value={k}>{t.icon} {t.label}</option>)}</select>
        {addEventError && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 6, padding: "6px 10px", background: "rgba(239,68,68,0.08)", borderRadius: 6, border: "1px solid rgba(239,68,68,0.2)" }}>{addEventError}</div>}
        {newEventType === "other" && (<><label style={labelStyle}>Event Title *</label><input type="text" value={newEventOtherTitle} onChange={e => setNewEventOtherTitle(e.target.value)} placeholder="e.g. Ran a marathon..." style={inputStyle} /></>)}
        <label style={labelStyle}>Date</label>
        <DatePicker year={newEventYear} month={newEventMonth} onChangeYear={setNewEventYear} onChangeMonth={setNewEventMonth} />
        {newEventType !== "other" && (<><label style={labelStyle}>Description (optional)</label><input type="text" value={newEventLabel} onChange={e => setNewEventLabel(e.target.value)} placeholder="Optional details..." style={inputStyle} /></>)}
        <label style={labelStyle}>Photos (optional)</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {newEventPhotos.map((p, i) => (<div key={i} style={{ position: "relative", width: 48, height: 48, borderRadius: 6, overflow: "hidden", border: "1px solid #1e293b" }}>
            <img src={p.thumb || p.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button onClick={() => setNewEventPhotos(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: 1, right: 1, width: 16, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>✕</button>
          </div>))}
          <label style={{ width: 48, height: 48, borderRadius: 6, border: "1px dashed #3b82f6", background: "rgba(59,130,246,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: newEventUploading ? "wait" : "pointer", fontSize: newEventUploading ? 11 : 20, color: "#60a5fa" }}>
            {newEventUploading ? "⏳" : "+"}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setNewEventUploading(true); try { const r = await uploadToCloudinary(file); setNewEventPhotos(prev => [...prev, r]); } catch (err) { console.error(err); } setNewEventUploading(false); e.target.value = ""; }} />
          </label>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}><button onClick={() => setShowAddEventModal(false)} style={cancelBtnStyle}>Cancel</button><button onClick={submitEvent} style={{ ...submitBtnStyle, background: "#3b82f6", cursor: "pointer" }}>Add Event</button></div>
      </div></div>)}

      {/* ADD PERSON MODAL */}
      {showAddPersonModal && (<div className="modal-overlay" onClick={() => setShowAddPersonModal(false)} style={overlayStyle}><div className="modal-card" onClick={e => e.stopPropagation()} style={modalStyle}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#e5e7eb", marginBottom: 16, fontFamily: "'Outfit',sans-serif" }}>Add Team Member</div>
        <label style={labelStyle}>Full Name</label>
        <input type="text" value={newPersonName} onChange={e => setNewPersonName(e.target.value)} placeholder="e.g. Jane Smith" style={inputStyle} onKeyDown={e => e.key === "Enter" && addPerson()} />
        <div style={{ fontSize: 10, color: "#4b5563", marginTop: 6 }}>Auto-sorted alphabetically</div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}><button onClick={() => setShowAddPersonModal(false)} style={cancelBtnStyle}>Cancel</button><button onClick={addPerson} disabled={!newPersonName.trim()} style={{ ...submitBtnStyle, background: newPersonName.trim() ? "#10b981" : "#1e293b", cursor: newPersonName.trim() ? "pointer" : "not-allowed" }}>Add Member</button></div>
      </div></div>)}

      {/* CUSTOM TYPE MODAL */}
      {showCustomTypeModal && (<div className="modal-overlay" onClick={() => setShowCustomTypeModal(false)} style={overlayStyle}><div className="modal-card" onClick={e => e.stopPropagation()} style={modalStyle}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#e5e7eb", marginBottom: 20, fontFamily: "'Outfit',sans-serif" }}>Create Custom Event Type</div>
        <label style={labelStyle}>Type Key</label><input type="text" value={newCustom.key} onChange={e => setNewCustom({ ...newCustom, key: e.target.value })} placeholder="e.g. marathon" style={inputStyle} />
        <label style={labelStyle}>Display Label</label><input type="text" value={newCustom.label} onChange={e => setNewCustom({ ...newCustom, label: e.target.value })} placeholder="e.g. Ran a Marathon" style={inputStyle} />
        <label style={labelStyle}>Icon</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>{["⭐", "🏔️", "🎯", "🎵", "🏃", "🎨", "🍕", "🐶", "🏠", "📸", "🧘", "🎮", "🚗", "🌸", "💡", "🔥"].map(em => (<button key={em} onClick={() => setNewCustom({ ...newCustom, icon: em })} style={{ width: 36, height: 36, borderRadius: 8, fontSize: 18, background: newCustom.icon === em ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.03)", border: newCustom.icon === em ? "2px solid #3b82f6" : "1px solid #1e293b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{em}</button>))}</div>
        <label style={labelStyle}>Color</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>{["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316", "#06b6d4", "#84cc16"].map(c => (<button key={c} onClick={() => setNewCustom({ ...newCustom, color: c })} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: newCustom.color === c ? "3px solid #fff" : "2px solid transparent", cursor: "pointer" }} />))}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}><button onClick={() => setShowCustomTypeModal(false)} style={cancelBtnStyle}>Cancel</button><button onClick={submitCustomType} disabled={!newCustom.key || !newCustom.label} style={{ ...submitBtnStyle, background: (newCustom.key && newCustom.label) ? "#3b82f6" : "#1e293b", cursor: (newCustom.key && newCustom.label) ? "pointer" : "not-allowed" }}>Create Type</button></div>
      </div></div>)}
    </div>
  );
}

const zoomBtnStyle = { width: 28, height: 28, background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", borderRadius: 6, color: "#9ca3af", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" };
const labelStyle = { display: "block", fontSize: 11, color: "#6b7280", marginBottom: 4, marginTop: 12, textTransform: "uppercase", letterSpacing: "0.06em" };
const inputStyle = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", borderRadius: 8, color: "#e5e7eb", fontSize: 13, outline: "none", fontFamily: "inherit" };
const overlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalStyle = { background: "linear-gradient(135deg,#141b30,#111827)", border: "1px solid #1e3a5f", borderRadius: 16, padding: 28, width: 420, maxWidth: "90vw", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" };
const cancelBtnStyle = { flex: 1, padding: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", borderRadius: 10, color: "#9ca3af", fontSize: 13, cursor: "pointer", fontFamily: "inherit" };
const submitBtnStyle = { flex: 1, padding: "10px", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "inherit" };
