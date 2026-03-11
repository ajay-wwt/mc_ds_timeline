import { useState, useRef, useCallback, useMemo, useEffect } from "react";
const WWT_LOGO="data:image/png;base64,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";

const FIREBASE_CONFIG = { databaseURL: "https://mc-ds-timeline-default-rtdb.firebaseio.com" };
const DB_PATH = "/timeline_v1";
const fbUrl = (path = "") => `${FIREBASE_CONFIG.databaseURL}${DB_PATH}${path}.json`;
async function fbGet(path = "") { const r = await fetch(fbUrl(path)); if (!r.ok) return null; return r.json(); }
async function fbSet(path, data) { await fetch(fbUrl(path), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); }

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
  const BASE_MONTH_W=22*zoomLevel;const ROW_H=56;const HEADER_H=56;const SIDEBAR_W=sidebarOpen?260:48;const ICON_SIZE=32;
  const allTypes=useMemo(()=>({...DEFAULT_EVENT_TYPES,...customTypes}),[customTypes]);
  const activeTooltip=pinnedEvent||hoveredEvent;
  const IS=useMemo(()=>({width:"100%",padding:"9px 12px",background:th.inputBg,border:`1px solid ${th.inputBorder}`,borderRadius:8,color:th.textBright,fontSize:13,outline:"none",fontFamily:"inherit"}),[th]);
  const LS=useMemo(()=>({display:"block",fontSize:11,color:th.textMuted,marginBottom:4,marginTop:12,textTransform:"uppercase",letterSpacing:"0.06em"}),[th]);

  const layoutEngine=useMemo(()=>{const yd={};let rx=0;for(let y=START_YEAR;y<=END_YEAR;y++){const mw=y===focusYear?BASE_MONTH_W*focusMultiplier:BASE_MONTH_W;yd[y]={x:rx,monthWidth:mw};rx+=12*mw;}return{yearData:yd,totalWidth:rx,getX:(ds)=>{const[y,m]=ds.split("-").map(Number);const d=yd[y];return d?d.x+(m-1)*d.monthWidth:0;},getYearX:(y)=>yd[y]?.x||0,getMonthW:(y)=>yd[y]?.monthWidth||BASE_MONTH_W};},[focusYear,focusMultiplier,BASE_MONTH_W]);
  const{totalWidth:timelineWidth,getX,getYearX,getMonthW}=layoutEngine;

  useEffect(()=>{(async()=>{try{const data=await fbGet();if(data&&data.people){setPeople(data.people);setCustomTypes(data.customTypes||{});setSyncStatus("synced");}else{const ini=seedData();setPeople(ini);await fbSet("",{people:ini,customTypes:{}});setSyncStatus("synced");}}catch(e){console.error("Firebase load failed:",e);try{const raw=localStorage.getItem("mc-ds-timeline-v5");if(raw){const p=JSON.parse(raw);setPeople(p.people||seedData());setCustomTypes(p.customTypes||{});}else setPeople(seedData());}catch{setPeople(seedData());}setSyncStatus("offline");}setIsLoading(false);})();},[]);
  const saveToFirebase=useCallback((ppl,ct)=>{if(saveTimeout.current)clearTimeout(saveTimeout.current);saveTimeout.current=setTimeout(async()=>{setSyncStatus("saving");try{await fbSet("",{people:ppl,customTypes:ct});setSyncStatus("synced");}catch{try{localStorage.setItem("mc-ds-timeline-v5",JSON.stringify({people:ppl,customTypes:ct}));}catch{}setSyncStatus("offline");}},600);},[]);
  const updatePeople=(updater)=>{setPeople(prev=>{const next=typeof updater==="function"?updater(prev):updater;saveToFirebase(next,customTypes);return next;});};
  const updateCustomTypes=(updater)=>{setCustomTypes(prev=>{const next=typeof updater==="function"?updater(prev):updater;saveToFirebase(people,next);return next;});};
  const addPhotoToEvent=(pid,eid,photoData)=>{updatePeople(prev=>prev.map(p=>p.id===pid?{...p,events:p.events.map(e=>e.id===eid?{...e,photos:[...(e.photos||[]),photoData]}:e)}:p));};

  const filtered=useMemo(()=>{if(!people)return[];let list=people;if(searchQuery){const q=searchQuery.toLowerCase();list=list.filter(s=>s.name.toLowerCase().includes(q));}if(activeFilters.size>0)list=list.filter(s=>s.events.some(e=>activeFilters.has(e.type)));return list;},[people,searchQuery,activeFilters]);
  const handleBodyScroll=useCallback(()=>{if(isSyncing.current)return;isSyncing.current=true;const el=bodyScrollRef.current;if(el){if(headerScrollRef.current)headerScrollRef.current.scrollLeft=el.scrollLeft;if(sidebarBodyRef.current)sidebarBodyRef.current.scrollTop=el.scrollTop;setScrollLeft(el.scrollLeft);}requestAnimationFrame(()=>{isSyncing.current=false;});},[]);
  const handleSidebarScroll=useCallback(()=>{if(isSyncing.current)return;isSyncing.current=true;if(sidebarBodyRef.current&&bodyScrollRef.current)bodyScrollRef.current.scrollTop=sidebarBodyRef.current.scrollTop;requestAnimationFrame(()=>{isSyncing.current=false;});},[]);
  const toggleFilter=(type)=>{setActiveFilters(prev=>{const n=new Set(prev);n.has(type)?n.delete(type):n.add(type);return n;});};
  const openAddEvent=(person)=>{setAddTarget(person);setNewEventType("joined_team");setNewEventYear(2026);setNewEventMonth(1);setNewEventLabel("");setNewEventOtherTitle("");setAddEventError("");setNewEventPhotos([]);setShowAddEventModal(true);};
  const submitEvent=()=>{if(!addTarget)return;if(newEventType==="joined_team"&&addTarget.events.some(e=>e.type==="joined_team")){setAddEventError("Only one \"Joined Team\" event allowed.");return;}setAddEventError("");const date=`${newEventYear}-${String(newEventMonth).padStart(2,"0")}`;const label=newEventType==="other"?(newEventOtherTitle||"Other event"):(newEventLabel||allTypes[newEventType]?.label||"Event");updatePeople(prev=>prev.map(p=>p.id===addTarget.id?{...p,events:[...p.events,{id:nextEid(),date,type:newEventType,label,photos:newEventPhotos}].sort((a,b)=>a.date.localeCompare(b.date))}:p));setShowAddEventModal(false);};
  const deleteEvent=(pid,eid)=>{updatePeople(prev=>prev.map(p=>p.id===pid?{...p,events:p.events.filter(e=>e.id!==eid)}:p));setDeleteConfirm(null);setPinnedEvent(null);setHoveredEvent(null);};
  const addPerson=()=>{const name=newPersonName.trim();if(!name)return;updatePeople(prev=>{if(prev.find(p=>p.name.toLowerCase()===name.toLowerCase()))return prev;return[...prev,{id:`p_${Date.now()}`,name,initials:getInitials(name),events:[]}].sort((a,b)=>a.name.localeCompare(b.name));});setNewPersonName("");setShowAddPersonModal(false);};
  const submitCustomType=()=>{const key=newCustom.key.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"");if(!key||!newCustom.label)return;updateCustomTypes(prev=>({...prev,[key]:{icon:newCustom.icon,label:newCustom.label,color:newCustom.color}}));setShowCustomTypeModal(false);setNewCustom({key:"",label:"",icon:"⭐",color:"#f59e0b"});};

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
