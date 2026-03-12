import { useState, useRef, useCallback, useMemo, useEffect } from "react";
const WWT_LOGO="data:image/png;base64,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";

const FIREBASE_CONFIG = { databaseURL: "https://mc-ds-timeline-default-rtdb.firebaseio.com" };
const DB_PATH = "/timeline_v1";
const fbUrl = (path = "") => `${FIREBASE_CONFIG.databaseURL}${DB_PATH}${path}.json`;
async function fbGet(path = "") { const r = await fetch(fbUrl(path)); if (!r.ok) return null; return r.json(); }
async function fbSet(path, data) { await fetch(fbUrl(path), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); }
async function fbPatch(path, data) { await fetch(fbUrl(path), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); }

const CLOUD_NAME = "dwwgrh36c"; const UPLOAD_PRESET = "mc_ds_timeline";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
async function uploadToCloudinary(file) {
  const fd = new FormData(); fd.append("file", file); fd.append("upload_preset", UPLOAD_PRESET); fd.append("folder", "mc_ds_timeline");
  const r = await fetch(CLOUDINARY_URL, { method: "POST", body: fd }); const data = await r.json();
  return { url: data.secure_url, thumb: data.secure_url.replace("/upload/", "/upload/w_300,c_fill/") };
}

/* ═══ THEMES ═══ */
const THEMES = {
  dark: {
    bg: "#0c1021", bgAlt: "#0b0f1e", bgCard: "#141b30", bgCardAlt: "#111827",
    barBg: "linear-gradient(90deg,#0e1225,#111833)", barBorder: "#1a2744",
    text: "#d1d5db", textBright: "#e5e7eb", textMuted: "#6b7280", textDim: "#4b5563",
    accent: "#3b82f6", accentLight: "#93c5fd", accentBg: "rgba(59,130,246,0.12)",
    inputBg: "rgba(255,255,255,0.04)", inputBorder: "#1e293b",
    rowOdd: "rgba(255,255,255,0.008)", rowHover: "rgba(59,130,246,0.04)",
    gridLine: "#111936", yearColor: "#3b82f6",
    focusBg: "rgba(245,158,11,0.02)", focusBorder: "rgba(245,158,11,0.15)", focusGrid: "rgba(245,158,11,0.06)",
    focusAccent: "#fbbf24", focusText: "#92713a", focusBtnBg: "rgba(245,158,11,0.06)", focusBtnBorder: "rgba(245,158,11,0.25)",
    scrollThumb: "#1e293b", scrollTrack: "#0c1021",
    modalBg: "linear-gradient(135deg,#141b30,#111827)", modalBorder: "#1e3a5f",
    tooltipBg: "#141b30", pipBgAlpha: "14", pipBorderAlpha: "55", pipActiveAlpha: "30", pipActiveBorderAlpha: "cc",
    logoBg: "linear-gradient(135deg,#3b82f6,#6366f1)", logoText: "#fff",
    selectOptBg: "#141b30",
    green: "#10b981", greenLight: "#6ee7b7", greenBg: "rgba(16,185,129,0.1)",
    red: "#ef4444", redBg: "rgba(239,68,68,0.08)", redBorder: "rgba(239,68,68,0.25)",
    filterBg: "rgba(255,255,255,0.02)",
  },
  wwt: {
    bg: "#f5f6f8", bgAlt: "#ffffff", bgCard: "#ffffff", bgCardAlt: "#f9fafb",
    barBg: "linear-gradient(90deg,#ffffff,#f8f9fb)", barBorder: "#e2e4e9",
    text: "#374151", textBright: "#111827", textMuted: "#6b7280", textDim: "#9ca3af",
    accent: "#c8102e", accentLight: "#c8102e", accentBg: "rgba(200,16,46,0.08)",
    inputBg: "#f3f4f6", inputBorder: "#d1d5db",
    rowOdd: "rgba(0,0,0,0.015)", rowHover: "rgba(200,16,46,0.03)",
    gridLine: "#e5e7eb", yearColor: "#c8102e",
    focusBg: "rgba(200,16,46,0.03)", focusBorder: "rgba(200,16,46,0.15)", focusGrid: "rgba(200,16,46,0.08)",
    focusAccent: "#c8102e", focusText: "#991b1b", focusBtnBg: "rgba(200,16,46,0.05)", focusBtnBorder: "rgba(200,16,46,0.2)",
    scrollThumb: "#cbd5e1", scrollTrack: "#f5f6f8",
    modalBg: "linear-gradient(135deg,#ffffff,#f9fafb)", modalBorder: "#d1d5db",
    tooltipBg: "#ffffff", pipBgAlpha: "18", pipBorderAlpha: "66", pipActiveAlpha: "25", pipActiveBorderAlpha: "cc",
    logoBg: "linear-gradient(135deg,#c8102e,#1b1b3a)", logoText: "#fff",
    selectOptBg: "#ffffff",
    green: "#059669", greenLight: "#059669", greenBg: "rgba(5,150,105,0.08)",
    red: "#dc2626", redBg: "rgba(220,38,38,0.06)", redBorder: "rgba(220,38,38,0.2)",
    filterBg: "rgba(0,0,0,0.02)",
  }
};

const DEFAULT_EVENT_TYPES = {
  joined_team:{icon:"🏢",label:"Joined Team",color:"#3b82f6"},paper:{icon:"📝",label:"Publication",color:"#f59e0b"},award:{icon:"🏆",label:"Award",color:"#ef4444"},
  marriage:{icon:"💒",label:"Marriage",color:"#ec4899"},child:{icon:"🍼",label:"Child Born",color:"#a78bfa"},relocation:{icon:"✈️",label:"Relocation",color:"#14b8a6"},
  speaking:{icon:"🎙️",label:"Speaking Event",color:"#f97316"},book:{icon:"📖",label:"Book Published",color:"#8b5cf6"},patent:{icon:"⚗️",label:"Patent",color:"#06b6d4"},
  teaching:{icon:"🎓",label:"Teaching",color:"#2563eb"},skiing:{icon:"⛷️",label:"Skiing First Time",color:"#38bdf8"},new_country:{icon:"🌎",label:"Visited New Country",color:"#10b981"},
  phd:{icon:"🎓",label:"PhD",color:"#7c3aed"},other:{icon:"📌",label:"Other",color:"#9ca3af"},
};

const KNOWN_JOINS={"Brian Vaughan":"2013-08","Jason Lu":"2014-08","Ankur Gupta":"2015-10","Michael Catalano":"2016-01","Ajay Dadheech":"2016-08","Anuj Gupta":"2016-08"};
const INITIAL_TEAM=["Achal Sharma","Aditya Prabhakaron","Ajay Dadheech","Ankur Gupta","Anuj Gupta","Bharat Singh","Brian Dailey","Brian Vaughan","Charlene Ulrich","Diego Solis","Doug Rank","Esteban","Haley Sorensen","Hao-Li Huang","Jason Lu","Jonathan Hahn","June Seo","Leah Ellis-Clemons","Mayank Lal","Mayank Seth","Megha Mital","Michael Catalano","Muskan Poddar","Neta","Noah Wendland","Nupur","Pradeep Singh Gaur","Angela Guo","Ramnath K","Revati Joshi","Samvit Mukhopadhyay","Snigdha Bhardwaj","Sowjanya","Sreelekshmy S","Venkata Gunda","Vinay Garg","William Gills","Xuanyang Lin"];
const PALETTE=["#6366f1","#ec4899","#10b981","#f59e0b","#ef4444","#8b5cf6","#0ea5e9","#14b8a6","#f97316","#84cc16","#a855f7","#06b6d4","#e11d48","#059669","#d946ef","#0284c7","#65a30d","#dc2626","#7c3aed","#ea580c"];
const MONTH_NAMES=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getInitials(name){const p=name.trim().split(/\s+/);return p.length>=2?(p[0][0]+p[p.length-1][0]).toUpperCase():name.slice(0,2).toUpperCase();}
function randomJoinDate(seed){return `${2017+(seed%7)}-${String(1+(seed*7+3)%12).padStart(2,"0")}`;}
function seedData(){
  return[...INITIAL_TEAM].sort((a,b)=>a.localeCompare(b)).map((name,i)=>{
    const joinDate=KNOWN_JOINS[name]||randomJoinDate(i);
    const evts=[{id:`e${i}_0`,date:joinDate,type:"joined_team",label:"Joined WWT MC DS Team",photos:[]}];
    const h=name.split("").reduce((a,c)=>a+c.charCodeAt(0),0);const[jy,jm]=joinDate.split("-").map(Number);
    if(h%3===0)evts.push({id:`e${i}_1`,date:`${jy+2}-${String(((jm+4)%12)+1).padStart(2,"0")}`,type:"new_country",label:"Visited new country",photos:[]});
    if(h%4===1)evts.push({id:`e${i}_2`,date:`${jy+3}-${String(((jm+7)%12)+1).padStart(2,"0")}`,type:"skiing",label:"First skiing trip",photos:[]});
    if(h%5===2)evts.push({id:`e${i}_3`,date:`${jy+1}-${String(((jm+2)%12)+1).padStart(2,"0")}`,type:"speaking",label:"Spoke at conference",photos:[]});
    if(h%6===0)evts.push({id:`e${i}_4`,date:`${jy+4}-${String(((jm+9)%12)+1).padStart(2,"0")}`,type:"marriage",label:"Got married",photos:[]});
    if(h%7===3)evts.push({id:`e${i}_5`,date:`${jy+3}-06`,type:"award",label:"Team Excellence Award",photos:[]});
    return{id:`p_${i}`,name,initials:getInitials(name),events:evts.sort((a,b)=>a.date.localeCompare(b.date))};
  });
}

function arrayToMap(arr){const m={};(arr||[]).forEach(p=>{m[p.id]=p;});return m;}
function mapToArray(m){return Object.values(m||{}).filter(p=>p&&p.name).map(p=>({...p,events:p.events||[],initials:p.initials||getInitials(p.name)})).sort((a,b)=>a.name.localeCompare(b.name));}
const START_YEAR=2013;const END_YEAR=2026;let eidCounter=Date.now();function nextEid(){return`e_${eidCounter++}`;}

function DatePicker({year,month,onChangeYear,onChangeMonth,th}){
  const yrs=[];for(let y=2013;y<=2026;y++)yrs.push(y);
  const is={width:"100%",padding:"9px 12px",background:th.inputBg,border:`1px solid ${th.inputBorder}`,borderRadius:8,color:th.textBright,fontSize:13,outline:"none",fontFamily:"inherit"};
  return(<div style={{display:"flex",gap:8}}><select value={year} onChange={e=>onChangeYear(Number(e.target.value))} style={{...is,flex:1}}>{yrs.map(y=><option key={y} value={y}>{y}</option>)}</select><select value={month} onChange={e=>onChangeMonth(Number(e.target.value))} style={{...is,flex:1}}>{MONTH_NAMES.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select></div>);
}

function PhotoCarousel({photos,onAdd,personName,th}){
  const[idx,setIdx]=useState(0);const[fs,setFs]=useState(null);const[uploading,setUploading]=useState(false);const fileRef=useRef(null);
  const handleUpload=async(e)=>{const file=e.target.files?.[0];if(!file)return;setUploading(true);try{const r=await uploadToCloudinary(file);onAdd(r);}catch(err){console.error(err);}setUploading(false);if(fileRef.current)fileRef.current.value="";};
  const si=photos.length>0?Math.min(idx,photos.length-1):0;
  return(<>
    <div style={{marginTop:10,borderTop:`1px solid ${th.inputBorder}`,paddingTop:8}}>
      {photos.length>0?(<div>
        <div style={{position:"relative",width:"100%",height:140,borderRadius:8,overflow:"hidden",background:th.bg,marginBottom:6}}>
          <img src={photos[si]?.url} alt={personName} onClick={()=>setFs(photos[si]?.url)} style={{width:"100%",height:"100%",objectFit:"cover",cursor:"zoom-in"}}/>
          {photos.length>1&&(<><button onClick={e=>{e.stopPropagation();setIdx(i=>(i-1+photos.length)%photos.length);}} style={{position:"absolute",left:4,top:"50%",transform:"translateY(-50%)",width:24,height:24,borderRadius:"50%",background:"rgba(0,0,0,0.6)",border:"none",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <button onClick={e=>{e.stopPropagation();setIdx(i=>(i+1)%photos.length);}} style={{position:"absolute",right:4,top:"50%",transform:"translateY(-50%)",width:24,height:24,borderRadius:"50%",background:"rgba(0,0,0,0.6)",border:"none",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button></>)}
          <div style={{position:"absolute",bottom:4,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4}}>{photos.map((_,i)=>(<div key={i} style={{width:6,height:6,borderRadius:"50%",background:i===si?"#fff":"rgba(255,255,255,0.3)",cursor:"pointer"}} onClick={e=>{e.stopPropagation();setIdx(i);}}/>))}</div>
          <div style={{position:"absolute",top:4,right:4,fontSize:9,background:"rgba(0,0,0,0.5)",color:"#fff",borderRadius:4,padding:"2px 6px"}}>Click to enlarge</div>
        </div>
        <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:4}}>{photos.map((p,i)=>(<img key={i} src={p.thumb||p.url} onClick={e=>{e.stopPropagation();setIdx(i);}} style={{width:36,height:36,borderRadius:4,objectFit:"cover",cursor:"pointer",border:i===si?`2px solid ${th.accent}`:"2px solid transparent",opacity:i===si?1:0.6,flexShrink:0}}/>))}</div>
      </div>):(<div style={{fontSize:11,color:th.textDim,textAlign:"center",padding:"8px 0"}}>No photos yet</div>)}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{display:"none"}}/>
      <button onClick={e=>{e.stopPropagation();fileRef.current?.click();}} disabled={uploading} style={{marginTop:6,padding:"5px 0",fontSize:11,borderRadius:6,cursor:uploading?"wait":"pointer",fontFamily:"inherit",width:"100%",background:th.accentBg,border:`1px solid ${th.accent}44`,color:th.accent,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>{uploading?"⏳ Uploading...":"📷 Add Photo"}</button>
    </div>
    {fs&&(<div onClick={()=>setFs(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,cursor:"zoom-out"}}>
      <img src={fs} style={{maxWidth:"92vw",maxHeight:"92vh",borderRadius:8,boxShadow:"0 20px 60px rgba(0,0,0,0.8)"}}/>
      <button onClick={()=>setFs(null)} style={{position:"absolute",top:20,right:20,width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
    </div>)}
  </>);
}

export default function MCDSTimeline(){
  const[theme,setTheme]=useState(()=>{try{return localStorage.getItem("mc-ds-theme")||"dark";}catch{return"dark";}});
  const th=THEMES[theme]||THEMES.dark;
  useEffect(()=>{try{localStorage.setItem("mc-ds-theme",theme);}catch{}},[theme]);

  const[people,setPeople]=useState(null);const[customTypes,setCustomTypes]=useState({});
  const[sidebarOpen,setSidebarOpen]=useState(true);const[pinnedEvent,setPinnedEvent]=useState(null);const[hoveredEvent,setHoveredEvent]=useState(null);
  const[zoomLevel,setZoomLevel]=useState(1.2);const[focusYear,setFocusYear]=useState(2026);const[focusMultiplier,setFocusMultiplier]=useState(4);
  const[searchQuery,setSearchQuery]=useState("");const[activeFilters,setActiveFilters]=useState(new Set());const[showFilterPanel,setShowFilterPanel]=useState(false);
  const[showAddEventModal,setShowAddEventModal]=useState(false);const[showAddPersonModal,setShowAddPersonModal]=useState(false);const[showCustomTypeModal,setShowCustomTypeModal]=useState(false);
  const[addTarget,setAddTarget]=useState(null);const[newEventType,setNewEventType]=useState("joined_team");const[newEventYear,setNewEventYear]=useState(2026);const[newEventMonth,setNewEventMonth]=useState(1);
  const[newEventLabel,setNewEventLabel]=useState("");const[newEventOtherTitle,setNewEventOtherTitle]=useState("");const[addEventError,setAddEventError]=useState("");const[newEventPhotos,setNewEventPhotos]=useState([]);const[newEventUploading,setNewEventUploading]=useState(false);
  const[newPersonName,setNewPersonName]=useState("");const[newCustom,setNewCustom]=useState({key:"",label:"",icon:"⭐",color:"#f59e0b"});
  const[scrollLeft,setScrollLeft]=useState(0);const[deleteConfirm,setDeleteConfirm]=useState(null);const[isLoading,setIsLoading]=useState(true);const[syncStatus,setSyncStatus]=useState("loading");

  const bodyScrollRef=useRef(null);const sidebarBodyRef=useRef(null);const headerScrollRef=useRef(null);const isSyncing=useRef(false);const saveTimeout=useRef(null);
  const savePersonDebounce=useRef({});const savingPersons=useRef(new Set());
  const BASE_MONTH_W=22*zoomLevel;const ROW_H=56;const HEADER_H=56;const SIDEBAR_W=sidebarOpen?260:48;const ICON_SIZE=32;
  const allTypes=useMemo(()=>({...DEFAULT_EVENT_TYPES,...customTypes}),[customTypes]);
  const activeTooltip=pinnedEvent||hoveredEvent;
  const IS=useMemo(()=>({width:"100%",padding:"9px 12px",background:th.inputBg,border:`1px solid ${th.inputBorder}`,borderRadius:8,color:th.textBright,fontSize:13,outline:"none",fontFamily:"inherit"}),[th]);
  const LS=useMemo(()=>({display:"block",fontSize:11,color:th.textMuted,marginBottom:4,marginTop:12,textTransform:"uppercase",letterSpacing:"0.06em"}),[th]);

  const layoutEngine=useMemo(()=>{const yd={};let rx=0;for(let y=START_YEAR;y<=END_YEAR;y++){const mw=y===focusYear?BASE_MONTH_W*focusMultiplier:BASE_MONTH_W;yd[y]={x:rx,monthWidth:mw};rx+=12*mw;}return{yearData:yd,totalWidth:rx,getX:(ds)=>{const[y,m]=ds.split("-").map(Number);const d=yd[y];return d?d.x+(m-1)*d.monthWidth:0;},getYearX:(y)=>yd[y]?.x||0,getMonthW:(y)=>yd[y]?.monthWidth||BASE_MONTH_W};},[focusYear,focusMultiplier,BASE_MONTH_W]);
  const{totalWidth:timelineWidth,getX,getYearX,getMonthW}=layoutEngine;

  useEffect(()=>{(async()=>{try{const data=await fbGet();if(data&&data.people){if(Array.isArray(data.people)){const clean=data.people.filter(p=>p&&p.name).map(p=>({...p,events:p.events||[],initials:p.initials||getInitials(p.name)}));const map=arrayToMap(clean);await fbSet("/people",map);setPeople(clean);}else{setPeople(mapToArray(data.people));}setCustomTypes(data.customTypes||{});setSyncStatus("synced");}else{const ini=seedData();const map=arrayToMap(ini);setPeople(ini);await fbSet("",{people:map,customTypes:{}});setSyncStatus("synced");}}catch(e){console.error("Firebase load failed:",e);try{const raw=localStorage.getItem("mc-ds-timeline-v5");if(raw){const p=JSON.parse(raw);setPeople(p.people||seedData());setCustomTypes(p.customTypes||{});}else setPeople(seedData());}catch{setPeople(seedData());}setSyncStatus("offline");}setIsLoading(false);})();},[]);
  useEffect(()=>{const es=new EventSource(`${FIREBASE_CONFIG.databaseURL}${DB_PATH}.json`);let skipNext=true;es.addEventListener('put',(e)=>{if(skipNext){skipNext=false;return;}try{const{path,data}=JSON.parse(e.data);if(path==='/'){if(data&&data.people)setPeople(mapToArray(data.people));if(data)setCustomTypes(data.customTypes||{});}else if(path.startsWith('/people/')){const personId=path.split('/')[2];if(savingPersons.current.has(personId))return;if(data!==null&&data.name){const safe={...data,events:data.events||[],initials:data.initials||getInitials(data.name)};setPeople(prev=>{const exists=prev.find(p=>p.id===personId);if(exists)return prev.map(p=>p.id===personId?safe:p);return[...prev,safe].sort((a,b)=>a.name.localeCompare(b.name));});}else{setPeople(prev=>prev.filter(p=>p.id!==personId));}}else if(path==='/customTypes'){setCustomTypes(data||{});}}catch(err){console.error('SSE error:',err);}});es.onerror=()=>{console.error('SSE connection lost');};return()=>es.close();},[]);
  const savePersonToFirebase=useCallback((personId,personData)=>{if(savePersonDebounce.current[personId])clearTimeout(savePersonDebounce.current[personId]);savingPersons.current.add(personId);savePersonDebounce.current[personId]=setTimeout(async()=>{setSyncStatus("saving");try{await fbSet(`/people/${personId}`,personData);setSyncStatus("synced");}catch{setSyncStatus("offline");}savingPersons.current.delete(personId);},400);},[]);
  const saveCustomTypesToFirebase=useCallback((ct)=>{if(saveTimeout.current)clearTimeout(saveTimeout.current);saveTimeout.current=setTimeout(async()=>{setSyncStatus("saving");try{await fbSet("/customTypes",ct);setSyncStatus("synced");}catch{setSyncStatus("offline");}},400);},[]);
  const updatePerson=(personId,updater)=>{setPeople(prev=>prev.map(p=>{if(p.id!==personId)return p;const updated=typeof updater==="function"?updater(p):updater;savePersonToFirebase(personId,updated);return updated;}));};
  const addPhotoToEvent=(pid,eid,photoData)=>{updatePerson(pid,p=>({...p,events:p.events.map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),photoData]}:e)}));};

  const filtered=useMemo(()=>{if(!people)return[];let list=people;if(searchQuery){const q=searchQuery.toLowerCase();list=list.filter(s=>s.name.toLowerCase().includes(q));}if(activeFilters.size>0)list=list.filter(s=>s.events.some(e=>activeFilters.has(e.type)));return list;},[people,searchQuery,activeFilters]);
  const handleBodyScroll=useCallback(()=>{if(isSyncing.current)return;isSyncing.current=true;const el=bodyScrollRef.current;if(el){if(headerScrollRef.current)headerScrollRef.current.scrollLeft=el.scrollLeft;if(sidebarBodyRef.current)sidebarBodyRef.current.scrollTop=el.scrollTop;setScrollLeft(el.scrollLeft);}requestAnimationFrame(()=>{isSyncing.current=false;});},[]);
  const handleSidebarScroll=useCallback(()=>{if(isSyncing.current)return;isSyncing.current=true;if(sidebarBodyRef.current&&bodyScrollRef.current)bodyScrollRef.current.scrollTop=sidebarBodyRef.current.scrollTop;requestAnimationFrame(()=>{isSyncing.current=false;});},[]);
  const toggleFilter=(type)=>{setActiveFilters(prev=>{const n=new Set(prev);n.has(type)?n.delete(type):n.add(type);return n;});};
  const openAddEvent=(person)=>{setAddTarget(person);setNewEventType("joined_team");setNewEventYear(2026);setNewEventMonth(1);setNewEventLabel("");setNewEventOtherTitle("");setAddEventError("");setNewEventPhotos([]);setShowAddEventModal(true);};
  const submitEvent=()=>{if(!addTarget)return;if(newEventType==="joined_team"&&addTarget.events.some(e=>e.type==="joined_team")){setAddEventError("Only one \"Joined Team\" event allowed.");return;}setAddEventError("");const date=`${newEventYear}-${String(newEventMonth).padStart(2,"0")}`;const label=newEventType==="other"?(newEventOtherTitle||"Other event"):(newEventLabel||allTypes[newEventType]?.label||"Event");updatePerson(addTarget.id,p=>({...p,events:[...p.events,{id:nextEid(),date,type:newEventType,label,photos:newEventPhotos}].sort((a,b)=>a.date.localeCompare(b.date))}));setShowAddEventModal(false);};
  const deleteEvent=(pid,eid)=>{updatePerson(pid,p=>({...p,events:p.events.filter(e=>e.id!==eid)}));setDeleteConfirm(null);setPinnedEvent(null);setHoveredEvent(null);};
  const addPerson=()=>{const name=newPersonName.trim();if(!name)return;setPeople(prev=>{if(prev.find(p=>p.name.toLowerCase()===name.toLowerCase()))return prev;const newP={id:`p_${Date.now()}`,name,initials:getInitials(name),events:[]};savePersonToFirebase(newP.id,newP);return[...prev,newP].sort((a,b)=>a.name.localeCompare(b.name));});setNewPersonName("");setShowAddPersonModal(false);};
  const submitCustomType=()=>{const key=newCustom.key.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"");if(!key||!newCustom.label)return;setCustomTypes(prev=>{const next={...prev,[key]:{icon:newCustom.icon,label:newCustom.label,color:newCustom.color}};saveCustomTypesToFirebase(next);return next;});setShowCustomTypeModal(false);setNewCustom({key:"",label:"",icon:"⭐",color:"#f59e0b"});};

  const years=[];for(let y=START_YEAR;y<=END_YEAR;y++)years.push(y);
  const getCollapsedEvents=(events)=>{const visible=[],collapsed=[];for(const ev of events){if(activeFilters.size>0&&!activeFilters.has(ev.type))continue;if(getX(ev.date)-scrollLeft<-(ICON_SIZE/2))collapsed.push(ev);else visible.push(ev);}return{visible,collapsed};};
  const handleTimelineBgClick=(e)=>{if(e.target===e.currentTarget||e.target.classList.contains("row-hover")){setPinnedEvent(null);setDeleteConfirm(null);}};
  const jumpToFocusYear=()=>{if(bodyScrollRef.current)bodyScrollRef.current.scrollLeft=Math.max(0,getYearX(focusYear)-20);};

  if(isLoading)return(<div style={{width:"100%",height:"100vh",background:th.bg,display:"flex",alignItems:"center",justifyContent:"center",color:th.textMuted,fontFamily:"'DM Sans',sans-serif"}}><div style={{textAlign:"center"}}><div style={{fontSize:32,marginBottom:12}}>🏢</div><div style={{fontSize:14}}>Loading timeline...</div></div></div>);

  const syncDot=syncStatus==="synced"?th.green:syncStatus==="saving"?"#f59e0b":th.red;
  const syncLabel=syncStatus==="synced"?"Synced":syncStatus==="saving"?"Saving...":"Offline";
  const zBS={width:28,height:28,background:th.inputBg,border:`1px solid ${th.inputBorder}`,borderRadius:6,color:th.textMuted,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"};
  const overlayS={position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000};
  const modalS={background:th.modalBg,border:`1px solid ${th.modalBorder}`,borderRadius:16,padding:28,width:420,maxWidth:"90vw",boxShadow:"0 24px 64px rgba(0,0,0,0.3)"};
  const cancelS={flex:1,padding:"10px",background:th.inputBg,border:`1px solid ${th.inputBorder}`,borderRadius:10,color:th.textMuted,fontSize:13,cursor:"pointer",fontFamily:"inherit"};
  const submitS={flex:1,padding:"10px",border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:600,fontFamily:"inherit"};

  return(
    <div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:th.bg,fontFamily:"'DM Sans','Nunito',sans-serif",color:th.text,overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700&display=swap');*{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:${th.scrollThumb} ${th.scrollTrack}}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:${th.scrollTrack}}::-webkit-scrollbar-thumb{background:${th.scrollThumb};border-radius:3px}.row-hover:hover{background:${th.rowHover}!important}.event-pip{transition:transform .18s ease,box-shadow .18s ease;cursor:pointer}.event-pip:hover{transform:scale(1.18)!important}.sidebar-row:hover .add-btn{opacity:1!important}.modal-overlay{animation:fadeIn .15s ease}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}.modal-card{animation:slideUp .2s ease}.collapsed-stack-item{transition:all .35s cubic-bezier(.34,1.56,.64,1)}select option{background:${th.selectOptBg};color:${th.textBright}}`}</style>

      {/* TOP BAR */}
      <div style={{display:"flex",alignItems:"center",padding:"10px 16px",background:th.barBg,borderBottom:`1px solid ${th.barBorder}`,gap:10,zIndex:30,flexShrink:0,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src={WWT_LOGO} alt="WWT" style={{width:36,height:36,borderRadius:6,objectFit:"contain"}} />
          <div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:th.textBright}}>MC Data Scientists Team</div>
          <div style={{fontSize:10,color:th.textMuted,marginTop:-1,display:"flex",alignItems:"center",gap:6}}>WWT MC · {filtered.length} members <span style={{display:"inline-flex",alignItems:"center",gap:3,marginLeft:4}}><span style={{width:6,height:6,borderRadius:"50%",background:syncDot,display:"inline-block"}}/><span style={{fontSize:9,color:syncDot}}>{syncLabel}</span></span></div></div>
        </div>
        <div style={{flex:1,minWidth:20}}/>

        {/* Theme Toggle */}
        <button onClick={()=>setTheme(t=>t==="dark"?"wwt":"dark")} style={{padding:"5px 10px",background:th.inputBg,border:`1px solid ${th.inputBorder}`,borderRadius:8,color:th.textMuted,fontSize:11,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>
          {theme==="dark"?"☀️ WWT Light":"🌙 Dark"}
        </button>

        {/* Focus */}
        <div style={{display:"flex",alignItems:"center",gap:6,background:th.focusBtnBg,border:`1px solid ${th.focusBtnBorder}`,borderRadius:8,padding:"4px 10px"}}>
          <span style={{fontSize:11,color:th.focusAccent,fontWeight:600}}>🔎 Focus</span>
          <select value={focusYear} onChange={e=>setFocusYear(Number(e.target.value))} style={{background:"transparent",border:"none",color:th.focusAccent,fontSize:12,fontWeight:700,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>{years.map(y=><option key={y} value={y} style={{background:th.selectOptBg}}>{y}</option>)}<option value={0} style={{background:th.selectOptBg}}>None</option></select>
          <div style={{display:"flex",alignItems:"center",gap:2}}>{[2,3,4,5].map(m=>(<button key={m} onClick={()=>setFocusMultiplier(m)} style={{width:22,height:22,borderRadius:4,fontSize:10,fontWeight:600,background:focusMultiplier===m?`${th.focusAccent}22`:"transparent",border:focusMultiplier===m?`1px solid ${th.focusAccent}`:"1px solid transparent",color:focusMultiplier===m?th.focusAccent:th.textMuted,cursor:"pointer"}}>{m}x</button>))}</div>
          <button onClick={jumpToFocusYear} style={{background:`${th.focusAccent}18`,border:`1px solid ${th.focusAccent}44`,borderRadius:4,color:th.focusAccent,fontSize:10,padding:"3px 8px",cursor:"pointer",fontFamily:"inherit"}}>Go →</button>
        </div>

        <div style={{position:"relative",width:160}}><input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search..." style={{width:"100%",padding:"7px 12px 7px 30px",background:th.inputBg,border:`1px solid ${th.inputBorder}`,borderRadius:8,color:th.text,fontSize:12,outline:"none",fontFamily:"inherit"}}/><span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontSize:13,opacity:0.3}}>🔍</span></div>
        <button onClick={()=>setShowAddPersonModal(true)} style={{padding:"7px 10px",background:th.greenBg,border:`1px solid ${th.green}`,borderRadius:8,color:th.greenLight,fontSize:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>＋ Member</button>
        <button onClick={()=>setShowFilterPanel(!showFilterPanel)} style={{padding:"7px 10px",background:showFilterPanel?th.accentBg:th.inputBg,border:`1px solid ${showFilterPanel?th.accent:th.inputBorder}`,borderRadius:8,color:th.accentLight,fontSize:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>▾ Filters{activeFilters.size>0&&<span style={{background:th.accent,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10}}>{activeFilters.size}</span>}</button>
        <div style={{display:"flex",alignItems:"center",gap:4}}><button onClick={()=>setZoomLevel(z=>Math.max(0.5,z-0.2))} style={zBS}>−</button><span style={{fontSize:11,color:th.textMuted,width:36,textAlign:"center"}}>{Math.round(zoomLevel*100)}%</span><button onClick={()=>setZoomLevel(z=>Math.min(3,z+0.2))} style={zBS}>+</button></div>
      </div>

      {/* FILTER PANEL */}
      {showFilterPanel&&(<div style={{padding:"10px 20px",background:th.bgAlt,borderBottom:`1px solid ${th.barBorder}`,display:"flex",flexWrap:"wrap",gap:6,zIndex:25,flexShrink:0,alignItems:"center"}}>
        {Object.entries(allTypes).map(([key,t])=>(<button key={key} onClick={()=>toggleFilter(key)} style={{padding:"5px 12px",background:activeFilters.has(key)?`${t.color}18`:th.filterBg,border:`1px solid ${activeFilters.has(key)?t.color:th.inputBorder}`,borderRadius:20,color:activeFilters.has(key)?t.color:th.textMuted,fontSize:11,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:14}}>{t.icon}</span> {t.label}</button>))}
        <button onClick={()=>setShowCustomTypeModal(true)} style={{padding:"5px 12px",background:th.accentBg,border:`1px dashed ${th.accent}`,borderRadius:20,color:th.accent,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>＋ Custom Type</button>
        {activeFilters.size>0&&<button onClick={()=>setActiveFilters(new Set())} style={{padding:"5px 12px",background:th.redBg,border:`1px solid ${th.redBorder}`,borderRadius:20,color:th.red,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✕ Clear</button>}
      </div>)}

      {/* MAIN */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* SIDEBAR */}
        <div style={{width:SIDEBAR_W,transition:"width .25s ease",background:th.bgAlt,borderRight:`1px solid ${th.barBorder}`,display:"flex",flexDirection:"column",flexShrink:0,zIndex:20}}>
          <div style={{height:HEADER_H,display:"flex",alignItems:"center",justifyContent:sidebarOpen?"space-between":"center",padding:sidebarOpen?"0 14px":"0",borderBottom:`1px solid ${th.barBorder}`,flexShrink:0}}>
            {sidebarOpen&&<span style={{fontSize:11,color:th.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>Team Member</span>}
            <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:"transparent",border:"none",color:th.accent,cursor:"pointer",fontSize:16,padding:4}}>{sidebarOpen?"◀":"▶"}</button>
          </div>
          <div ref={sidebarBodyRef} onScroll={handleSidebarScroll} style={{flex:1,overflowY:"auto",overflowX:"hidden"}}>
            {filtered.map(s=>(<div key={s.id} className="sidebar-row" style={{height:ROW_H,display:"flex",alignItems:"center",padding:sidebarOpen?"0 10px":"0 6px",gap:8,borderBottom:`1px solid ${th.inputBorder}22`,flexShrink:0}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:`${PALETTE[s.name.length%PALETTE.length]}18`,border:`2px solid ${PALETTE[s.name.length%PALETTE.length]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:PALETTE[s.name.length%PALETTE.length],flexShrink:0}}>{s.initials}</div>
              {sidebarOpen&&<div style={{flex:1,minWidth:0,overflow:"hidden"}}><div style={{fontSize:12.5,fontWeight:600,color:th.textBright,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div><div style={{fontSize:10,color:th.textDim}}>{s.events.length} event{s.events.length!==1?"s":""}</div></div>}
              {sidebarOpen&&<button className="add-btn" onClick={()=>openAddEvent(s)} title="Add event" style={{opacity:0,transition:"opacity .15s",width:24,height:24,borderRadius:6,background:th.accentBg,border:`1px solid ${th.accent}`,color:th.accent,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>＋</button>}
            </div>))}
          </div>
        </div>

        {/* TIMELINE */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div ref={headerScrollRef} style={{height:HEADER_H,overflowX:"hidden",overflowY:"hidden",borderBottom:`1px solid ${th.barBorder}`,flexShrink:0,background:th.bgAlt}}>
            <div style={{width:timelineWidth,height:"100%",position:"relative"}}>
              {years.map(y=>{const yx=getYearX(y),mw=getMonthW(y),isFocus=y===focusYear;return(<div key={y}>
                {isFocus&&<div style={{position:"absolute",left:yx,top:0,width:12*mw,height:"100%",background:th.focusBg,borderLeft:`1px solid ${th.focusBorder}`,borderRight:`1px solid ${th.focusBorder}`}}/>}
                <div style={{position:"absolute",left:yx+4,top:8,fontSize:isFocus?14:13,fontWeight:700,color:isFocus?th.focusAccent:th.yearColor,fontFamily:"'Outfit',sans-serif"}}>{y}</div>
                {(zoomLevel>=0.8||isFocus)&&Array.from({length:12},(_,m)=>{const mx=yx+m*mw;return(<div key={m}>{(isFocus||zoomLevel>=1.2)&&<div style={{position:"absolute",left:mx+3,top:28,fontSize:isFocus?11:9,color:isFocus?th.focusText:th.textDim,fontWeight:isFocus?600:400}}>{MONTH_NAMES[m]}</div>}<div style={{position:"absolute",left:mx,top:44,width:1,height:10,background:m===0?(isFocus?th.focusBorder:th.gridLine):th.gridLine+"44"}}/></div>);})}
              </div>);})}
            </div>
          </div>

          <div ref={bodyScrollRef} onScroll={handleBodyScroll} onClick={handleTimelineBgClick} style={{flex:1,overflow:"auto"}}>
            <div style={{width:timelineWidth,height:filtered.length*ROW_H,position:"relative"}}>
              {years.map(y=>{const yx=getYearX(y),isFocus=y===focusYear;return(<div key={`g${y}`}>
                <div style={{position:"absolute",left:yx,top:0,width:1,height:"100%",background:isFocus?th.focusBorder:th.gridLine,pointerEvents:"none"}}/>
                {isFocus&&<div style={{position:"absolute",left:yx,top:0,width:12*getMonthW(y),height:"100%",background:th.focusBg,pointerEvents:"none"}}/>}
                {isFocus&&Array.from({length:11},(_,m)=><div key={m} style={{position:"absolute",left:yx+(m+1)*getMonthW(y),top:0,width:1,height:"100%",background:th.focusGrid,pointerEvents:"none"}}/>)}
              </div>);})}

              {filtered.map((s,ri)=>{
                const{visible,collapsed}=getCollapsedEvents(s.events);const pColor=PALETTE[s.name.length%PALETTE.length];
                return(<div key={s.id} className="row-hover" style={{position:"absolute",top:ri*ROW_H,left:0,width:"100%",height:ROW_H,borderBottom:`1px solid ${th.inputBorder}22`,background:ri%2===0?"transparent":th.rowOdd}}>
                  {(()=>{const allVis=activeFilters.size>0?s.events.filter(e=>activeFilters.has(e.type)):s.events;if(allVis.length<2)return null;const hasC=collapsed.length>0,lastE=visible.length>0?visible[visible.length-1]:null;if(!hasC&&visible.length<2)return null;if(hasC&&!lastE)return null;const x1=hasC?scrollLeft+52:getX(visible[0].date)+ICON_SIZE/2,x2=lastE?getX(lastE.date):x1,w=Math.max(0,x2-x1);return w>0?<div style={{position:"absolute",left:x1,top:ROW_H/2,width:w,height:2,borderRadius:1,background:`linear-gradient(90deg,${pColor}55,${pColor}20)`}}/>:null;})()}
                  {collapsed.length>0&&(<div style={{position:"sticky",left:0,top:0,width:52,height:ROW_H,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,float:"left"}}><div style={{position:"relative",width:40,height:40}}>
                    {collapsed.slice(-3).map((ev,ci)=>{const t=allTypes[ev.type]||allTypes.other;return<div key={ev.id||ci} className="collapsed-stack-item" style={{position:"absolute",left:ci*6,top:ci*4,width:28,height:28,borderRadius:8,background:`${t.color}25`,border:`1.5px solid ${t.color}88`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}}>{t.icon}</div>;})}
                    <div style={{position:"absolute",bottom:-2,right:-4,background:th.accent,color:"#fff",fontSize:9,fontWeight:700,borderRadius:10,padding:"1px 5px",minWidth:16,textAlign:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.2)"}}>{collapsed.length}</div>
                  </div></div>)}

                  {visible.map(ev=>{const t=allTypes[ev.type]||allTypes.other;const x=getX(ev.date);const isActive=activeTooltip?.sid===s.id&&activeTooltip?.eid===ev.id;const isPinned=pinnedEvent?.sid===s.id&&pinnedEvent?.eid===ev.id;const hasPhotos=ev.photos&&ev.photos.length>0;
                    const firstThumb=hasPhotos?(ev.photos[0].thumb||ev.photos[0].url):null;
                    const tooltipAbove=ri>=4;const tooltipPos=tooltipAbove?{bottom:ICON_SIZE+8}:{top:ICON_SIZE+8};
                    return(<div key={ev.id} onMouseEnter={()=>{if(!pinnedEvent)setHoveredEvent({sid:s.id,eid:ev.id});}} onMouseLeave={()=>{if(!pinnedEvent)setHoveredEvent(null);}}
                      onClick={e=>{e.stopPropagation();if(isPinned){setPinnedEvent(null);setDeleteConfirm(null);}else{setPinnedEvent({sid:s.id,eid:ev.id});setHoveredEvent(null);setDeleteConfirm(null);}}}
                      className="event-pip" style={{position:"absolute",left:x-ICON_SIZE/2,top:ROW_H/2-ICON_SIZE/2,width:ICON_SIZE,height:ICON_SIZE,borderRadius:10,background:firstThumb?"transparent":isActive?`${t.color}${th.pipActiveAlpha}`:`${t.color}${th.pipBgAlpha}`,border:`2px solid ${t.color}${isActive?th.pipActiveBorderAlpha:th.pipBorderAlpha}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,zIndex:isActive?100:1,boxShadow:isActive?`0 0 20px ${t.color}44,0 4px 12px rgba(0,0,0,0.2)`:"none"}}>
                      {firstThumb?<div style={{position:"absolute",inset:0,borderRadius:8,overflow:"hidden"}}><img src={firstThumb} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>:t.icon}
                      {isActive&&(<div onClick={e=>e.stopPropagation()} style={{position:"absolute",...tooltipPos,left:"50%",transform:"translateX(-50%)",background:th.tooltipBg,border:`1px solid ${t.color}55`,borderRadius:10,padding:"10px 14px",whiteSpace:"nowrap",zIndex:1000,minWidth:220,maxWidth:320,boxShadow:`0 12px 40px rgba(0,0,0,0.25),0 0 16px ${t.color}15`}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:16}}>{t.icon}</span><span style={{fontSize:12,fontWeight:700,color:t.color}}>{t.label}</span></div>
                        <div style={{fontSize:12,color:th.textBright,fontWeight:500}}>{s.name}</div>
                        <div style={{fontSize:11,color:th.textMuted,marginTop:2,whiteSpace:"normal"}}>{ev.label}</div>
                        <div style={{fontSize:10,color:th.textDim,marginTop:4,fontFamily:"monospace"}}>{ev.date}</div>
                        {isPinned&&<PhotoCarousel photos={ev.photos||[]} personName={s.name} onAdd={(pd)=>addPhotoToEvent(s.id,ev.id,pd)} th={th}/>}
                        <button onClick={e=>{e.stopPropagation();deleteConfirm?.eid===ev.id?deleteEvent(s.id,ev.id):setDeleteConfirm({sid:s.id,eid:ev.id});}} style={{marginTop:8,padding:"5px 10px",fontSize:11,borderRadius:6,cursor:"pointer",fontFamily:"inherit",width:"100%",background:deleteConfirm?.eid===ev.id?`${th.red}33`:th.redBg,border:`1px solid ${deleteConfirm?.eid===ev.id?th.red:th.redBorder}`,color:deleteConfirm?.eid===ev.id?th.red:th.red}}>{deleteConfirm?.eid===ev.id?"Confirm delete?":"🗑 Delete event"}</button>
                        {isPinned&&<div style={{fontSize:9,color:th.textDim,marginTop:6,textAlign:"center"}}>Click icon again to close</div>}
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
      <div style={{padding:"8px 20px",background:th.bgAlt,borderTop:`1px solid ${th.barBorder}`,display:"flex",gap:16,overflowX:"auto",flexShrink:0,alignItems:"center"}}>
        <span style={{fontSize:10,color:th.textDim,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,flexShrink:0}}>Legend</span>
        {Object.entries(allTypes).map(([key,t])=>(<div key={key} style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}><span style={{fontSize:15}}>{t.icon}</span><span style={{fontSize:11,color:t.color,fontWeight:500}}>{t.label}</span></div>))}
      </div>

      {/* ADD EVENT MODAL */}
      {showAddEventModal&&addTarget&&(<div className="modal-overlay" onClick={()=>setShowAddEventModal(false)} style={overlayS}><div className="modal-card" onClick={e=>e.stopPropagation()} style={modalS}>
        <div style={{fontSize:16,fontWeight:700,color:th.textBright,marginBottom:4,fontFamily:"'Outfit',sans-serif"}}>Add Life Event</div>
        <div style={{fontSize:12,color:th.textMuted,marginBottom:20}}>for {addTarget.name}</div>
        <label style={LS}>Event Type</label>
        <select value={newEventType} onChange={e=>{setNewEventType(e.target.value);setAddEventError("");}} style={IS}>{Object.entries(allTypes).map(([k,t])=><option key={k} value={k}>{t.icon} {t.label}</option>)}</select>
        {addEventError&&<div style={{fontSize:11,color:th.red,marginTop:6,padding:"6px 10px",background:th.redBg,borderRadius:6,border:`1px solid ${th.redBorder}`}}>{addEventError}</div>}
        {newEventType==="other"&&(<><label style={LS}>Event Title *</label><input type="text" value={newEventOtherTitle} onChange={e=>setNewEventOtherTitle(e.target.value)} placeholder="e.g. Ran a marathon..." style={IS}/></>)}
        <label style={LS}>Date</label>
        <DatePicker year={newEventYear} month={newEventMonth} onChangeYear={setNewEventYear} onChangeMonth={setNewEventMonth} th={th}/>
        {newEventType!=="other"&&(<><label style={LS}>Description (optional)</label><input type="text" value={newEventLabel} onChange={e=>setNewEventLabel(e.target.value)} placeholder="Optional details..." style={IS}/></>)}
        <label style={LS}>Photos (optional)</label>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          {newEventPhotos.map((p,i)=>(<div key={i} style={{position:"relative",width:48,height:48,borderRadius:6,overflow:"hidden",border:`1px solid ${th.inputBorder}`}}>
            <img src={p.thumb||p.url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <button onClick={()=>setNewEventPhotos(prev=>prev.filter((_,j)=>j!==i))} style={{position:"absolute",top:1,right:1,width:16,height:16,borderRadius:"50%",background:"rgba(0,0,0,0.7)",border:"none",color:"#fff",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>✕</button>
          </div>))}
          <label style={{width:48,height:48,borderRadius:6,border:`1px dashed ${th.accent}`,background:th.accentBg,display:"flex",alignItems:"center",justifyContent:"center",cursor:newEventUploading?"wait":"pointer",fontSize:newEventUploading?11:20,color:th.accent}}>
            {newEventUploading?"⏳":"+"}
            <input type="file" accept="image/*" style={{display:"none"}} onChange={async(e)=>{const file=e.target.files?.[0];if(!file)return;setNewEventUploading(true);try{const r=await uploadToCloudinary(file);setNewEventPhotos(prev=>[...prev,r]);}catch(err){console.error(err);}setNewEventUploading(false);e.target.value="";}}/>
          </label>
        </div>
        <div style={{display:"flex",gap:10,marginTop:20}}><button onClick={()=>setShowAddEventModal(false)} style={cancelS}>Cancel</button><button onClick={submitEvent} style={{...submitS,background:th.accent,cursor:"pointer"}}>Add Event</button></div>
      </div></div>)}

      {/* ADD PERSON MODAL */}
      {showAddPersonModal&&(<div className="modal-overlay" onClick={()=>setShowAddPersonModal(false)} style={overlayS}><div className="modal-card" onClick={e=>e.stopPropagation()} style={modalS}>
        <div style={{fontSize:16,fontWeight:700,color:th.textBright,marginBottom:16,fontFamily:"'Outfit',sans-serif"}}>Add Team Member</div>
        <label style={LS}>Full Name</label>
        <input type="text" value={newPersonName} onChange={e=>setNewPersonName(e.target.value)} placeholder="e.g. Jane Smith" style={IS} onKeyDown={e=>e.key==="Enter"&&addPerson()}/>
        <div style={{fontSize:10,color:th.textDim,marginTop:6}}>Auto-sorted alphabetically</div>
        <div style={{display:"flex",gap:10,marginTop:20}}><button onClick={()=>setShowAddPersonModal(false)} style={cancelS}>Cancel</button><button onClick={addPerson} disabled={!newPersonName.trim()} style={{...submitS,background:newPersonName.trim()?th.green:th.inputBorder,cursor:newPersonName.trim()?"pointer":"not-allowed"}}>Add Member</button></div>
      </div></div>)}

      {/* CUSTOM TYPE MODAL */}
      {showCustomTypeModal&&(<div className="modal-overlay" onClick={()=>setShowCustomTypeModal(false)} style={overlayS}><div className="modal-card" onClick={e=>e.stopPropagation()} style={modalS}>
        <div style={{fontSize:16,fontWeight:700,color:th.textBright,marginBottom:20,fontFamily:"'Outfit',sans-serif"}}>Create Custom Event Type</div>
        <label style={LS}>Type Key</label><input type="text" value={newCustom.key} onChange={e=>setNewCustom({...newCustom,key:e.target.value})} placeholder="e.g. marathon" style={IS}/>
        <label style={LS}>Display Label</label><input type="text" value={newCustom.label} onChange={e=>setNewCustom({...newCustom,label:e.target.value})} placeholder="e.g. Ran a Marathon" style={IS}/>
        <label style={LS}>Icon</label>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>{["⭐","🏔️","🎯","🎵","🏃","🎨","🍕","🐶","🏠","📸","🧘","🎮","🚗","🌸","💡","🔥"].map(em=>(<button key={em} onClick={()=>setNewCustom({...newCustom,icon:em})} style={{width:36,height:36,borderRadius:8,fontSize:18,background:newCustom.icon===em?th.accentBg:th.inputBg,border:newCustom.icon===em?`2px solid ${th.accent}`:`1px solid ${th.inputBorder}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{em}</button>))}</div>
        <label style={LS}>Color</label>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>{["#3b82f6","#ef4444","#10b981","#f59e0b","#ec4899","#8b5cf6","#14b8a6","#f97316","#06b6d4","#84cc16"].map(c=>(<button key={c} onClick={()=>setNewCustom({...newCustom,color:c})} style={{width:28,height:28,borderRadius:"50%",background:c,border:newCustom.color===c?"3px solid "+th.textBright:"2px solid transparent",cursor:"pointer"}}/>))}</div>
        <div style={{display:"flex",gap:10,marginTop:10}}><button onClick={()=>setShowCustomTypeModal(false)} style={cancelS}>Cancel</button><button onClick={submitCustomType} disabled={!newCustom.key||!newCustom.label} style={{...submitS,background:(newCustom.key&&newCustom.label)?th.accent:th.inputBorder,cursor:(newCustom.key&&newCustom.label)?"pointer":"not-allowed"}}>Create Type</button></div>
      </div></div>)}
    </div>
  );
}
