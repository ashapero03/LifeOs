import React, { useState, useRef, useReducer, useEffect } from "react";

/* ============================================================
   CONSTANTS
   ============================================================ */
const LAW_SCHEDULE = {
  Monday: [
    { name: "Criminal Law", time: "8:30 AM", startHour: 8.5, duration: 85, room: "Room 471", color: "#ef4444" },
  ],
  Tuesday: [
    { name: "Advocacy", time: "10:30 AM", startHour: 10.5, duration: 110, room: "Room 325", color: "#f59e0b" },
    { name: "Property", time: "1:30 PM", startHour: 13.5, duration: 110, room: "Room 472", color: "#22c55e" },
    { name: "Con Law & Reg State", time: "3:30 PM", startHour: 15.5, duration: 115, room: "Room 472", color: "#3b82f6" },
  ],
  Wednesday: [
    { name: "Criminal Law", time: "8:30 AM", startHour: 8.5, duration: 85, room: "Room 471", color: "#ef4444" },
  ],
  Thursday: [
    { name: "Property", time: "1:30 PM", startHour: 13.5, duration: 110, room: "Room 472", color: "#22c55e" },
    { name: "Con Law & Reg State", time: "3:30 PM", startHour: 15.5, duration: 115, room: "Room 472", color: "#3b82f6" },
  ],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

const MUSCLE_MAP = {
  "Bench Press": ["Chest", "Triceps", "Front Delts"],
  "Incline Press": ["Upper Chest", "Front Delts", "Triceps"],
  "Overhead Press": ["Front Delts", "Triceps"],
  "Tricep Pushdown": ["Triceps"],
  "Lateral Raise": ["Side Delts"],
  "Chest Fly": ["Chest"],
  "Dips": ["Chest", "Triceps"],
  "Deadlift": ["Hamstrings", "Glutes", "Lower Back", "Traps"],
  "Squat": ["Quads", "Glutes", "Hamstrings"],
  "Leg Press": ["Quads", "Glutes"],
  "Romanian Deadlift": ["Hamstrings", "Glutes"],
  "Leg Curl": ["Hamstrings"],
  "Leg Extension": ["Quads"],
  "Calf Raise": ["Calves"],
  "Pull-up": ["Lats", "Biceps", "Rear Delts"],
  "Barbell Row": ["Lats", "Rear Delts", "Biceps", "Traps"],
  "Cable Row": ["Lats", "Rear Delts", "Biceps"],
  "Lat Pulldown": ["Lats", "Biceps"],
  "Face Pull": ["Rear Delts", "Traps"],
  "Bicep Curl": ["Biceps"],
  "Hammer Curl": ["Biceps"],
};

// Upgrades are earned cosmetics & real-life rewards — nothing that skips work
const UPGRADES = [
  // ── Tier 1: Early Wins (500–1200 XP) ──
  { id: 1, name: "New Workout Fit", desc: "Earned: buy yourself new gym clothes. You showed up enough to deserve them.", cost: 500, icon: "👟", tier: 1, category: "real" },
  { id: 2, name: "Night Out Pass", desc: "Earned: guilt-free night out with friends. You put in the work this week.", cost: 800, icon: "🍻", tier: 1, category: "real" },
  { id: 3, name: "Fancy Meal", desc: "Earned: go eat somewhere nice, alone or with someone. You've been grinding.", cost: 600, icon: "🥩", tier: 1, category: "real" },
  { id: 4, name: "New Book / Playlist", desc: "Earned: buy that book or album you've been eyeing. Treat your mind.", cost: 400, icon: "🎧", tier: 1, category: "real" },
  // ── Tier 2: Mid-Tier (1500–2500 XP) ──
  { id: 5, name: "New Supplement Stack", desc: "Earned: restock your pre-workout, protein, or creatine. Fuel the machine.", cost: 1500, icon: "💊", tier: 2, category: "real" },
  { id: 6, name: "Spa / Recovery Day", desc: "Earned: book a massage, sauna session, or full rest day — guilt-free.", cost: 1800, icon: "🛁", tier: 2, category: "real" },
  { id: 7, name: "New Kicks", desc: "Earned: buy yourself a fresh pair of sneakers. You actually did the work.", cost: 2500, icon: "👟", tier: 2, category: "real" },
  { id: 8, name: "Weekend Trip", desc: "Earned: plan a weekend away. You kept your streak, hit your goals. Go recharge.", cost: 2200, icon: "✈️", tier: 2, category: "real" },
  // ── Tier 3: Prestige (3000+ XP, level-gated) ──
  { id: 9, name: "New Tech", desc: "Earned: buy that piece of tech you've been holding off on. You've earned it.", cost: 4000, icon: "💻", tier: 3, category: "real", minLevel: 5 },
  { id: 10, name: "Wardrobe Refresh", desc: "Earned: go get actual new clothes. Not just gym stuff — dress like the person you're becoming.", cost: 5000, icon: "👔", tier: 3, category: "real", minLevel: 7 },
  // ── App Cosmetics (titles & themes) ──
  { id: 11, name: "Title: The Grind", desc: "Display title unlocked. Shown on your dashboard.", cost: 300, icon: "⚡", tier: 1, category: "cosmetic" },
  { id: 12, name: "Title: Night Scholar", desc: "Display title for those late-night study sessions.", cost: 700, icon: "🌙", tier: 1, category: "cosmetic" },
  { id: 13, name: "Title: 1L Warrior", desc: "You survived first year. Wear it.", cost: 1200, icon: "⚖️", tier: 2, category: "cosmetic", minLevel: 3 },
  { id: 14, name: "Title: Iron Discipline", desc: "For the ones who actually show up every day.", cost: 3500, icon: "🔱", tier: 3, category: "cosmetic", minLevel: 6 },
];

const INIT = {
  xp: 320, level: 1,
  unlockedUpgrades: [],
  tasks: [
    { id: 1, text: "Read Contracts ch. 4-5", category: "school", done: false },
    { id: 2, text: "Draft legal brief outline", category: "school", done: true },
    { id: 3, text: "Review internship application", category: "work", done: false },
    { id: 4, text: "Grocery run", category: "personal", done: false },
  ],
  workouts: [
    { id: 1, date: "2025-03-01", type: "Push", exercises: [{ name: "Bench Press", sets: 4, reps: 8, weight: 185 }, { name: "Overhead Press", sets: 3, reps: 10, weight: 115 }, { name: "Tricep Pushdown", sets: 3, reps: 12, weight: 60 }] },
    { id: 2, date: "2025-03-03", type: "Pull", exercises: [{ name: "Pull-up", sets: 4, reps: 8, weight: 0 }, { name: "Barbell Row", sets: 4, reps: 8, weight: 155 }, { name: "Bicep Curl", sets: 3, reps: 12, weight: 40 }] },
    { id: 3, date: "2025-03-05", type: "Legs", exercises: [{ name: "Squat", sets: 4, reps: 6, weight: 225 }, { name: "Romanian Deadlift", sets: 3, reps: 10, weight: 155 }, { name: "Leg Press", sets: 3, reps: 12, weight: 320 }] },
    { id: 4, date: "2025-03-07", type: "Push", exercises: [{ name: "Bench Press", sets: 4, reps: 8, weight: 190 }, { name: "Incline Press", sets: 3, reps: 10, weight: 145 }, { name: "Lateral Raise", sets: 3, reps: 15, weight: 25 }] },
  ],
  cookbook: [
    { id: 1, name: "Chicken & Rice Bowl", type: "lunch", time: 25, ingredients: ["2 chicken breasts", "1 cup rice", "olive oil", "garlic", "paprika", "salt & pepper"], restaurant: false },
    { id: 2, name: "Protein Oats", type: "breakfast", time: 10, ingredients: ["1 cup oats", "1 scoop protein powder", "banana", "almond milk", "honey", "blueberries"], restaurant: false },
    { id: 3, name: "Chipotle Bowl", type: "lunch", time: 0, ingredients: ["White rice", "Black beans", "Grilled chicken", "Guacamole", "Salsa", "Sour cream"], restaurant: true },
    { id: 4, name: "Steak & Eggs", type: "breakfast", time: 15, ingredients: ["6oz sirloin", "3 eggs", "butter", "salt & pepper", "hot sauce"], restaurant: false },
    { id: 5, name: "Pasta Bolognese", type: "dinner", time: 40, ingredients: ["pasta", "ground beef", "tomato sauce", "garlic", "onion", "parmesan"], restaurant: false },
  ],
  sleepHistory: [
    { date: "Feb 28", hours: 7 }, { date: "Mar 1", hours: 7.5 }, { date: "Mar 2", hours: 6 },
    { date: "Mar 3", hours: 8 }, { date: "Mar 4", hours: 5.5 }, { date: "Mar 5", hours: 7 },
    { date: "Mar 6", hours: 6.5 }, { date: "Mar 7", hours: 8 },
  ],
  currentStreak: 5, longestStreak: 12,
  streakLogs: [
    { date: "2025-03-01", clean: true }, { date: "2025-03-02", clean: true },
    { date: "2025-03-03", clean: true }, { date: "2025-03-04", clean: false },
    { date: "2025-03-05", clean: true }, { date: "2025-03-06", clean: true },
    { date: "2025-03-07", clean: true },
  ],
  wakeUpTime: "7:00 AM",
  calEvents: [
    { id: 1, day: "Monday", title: "Morning Run", startHour: 6.5, duration: 60, color: "#22c55e", type: "gym" },
    { id: 2, day: "Monday", title: "Contracts Reading", startHour: 12, duration: 90, color: "#3b82f6", type: "school" },
    { id: 3, day: "Tuesday", title: "Gym — Push Day", startHour: 7, duration: 75, color: "#22c55e", type: "gym" },
    { id: 4, day: "Tuesday", title: "Law Review Work", startHour: 19, duration: 90, color: "#a855f7", type: "work" },
    { id: 5, day: "Wednesday", title: "Property Reading", startHour: 11, duration: 60, color: "#22c55e", type: "school" },
    { id: 6, day: "Thursday", title: "Gym — Legs", startHour: 7, duration: 75, color: "#22c55e", type: "gym" },
    { id: 7, day: "Thursday", title: "Internship Apps", startHour: 19, duration: 60, color: "#f59e0b", type: "work" },
  ],
  cancelledClasses: [],
  brainDump: [],
  habits: [
    { id: 1, name: "Make Bed", icon: "🛏️", color: "#f59e0b", completedDates: [] },
    { id: 2, name: "Bottle #1 (24oz)", icon: "💧", color: "#3b82f6", completedDates: [] },
    { id: 3, name: "Bottle #2 (24oz)", icon: "💧", color: "#3b82f6", completedDates: [] },
    { id: 4, name: "Bottle #3 (24oz)", icon: "💧", color: "#3b82f6", completedDates: [] },
    { id: 5, name: "Bottle #4 (24oz)", icon: "💧", color: "#3b82f6", completedDates: [] },
  ],
  adderallLog: [
    { id: 1, date: "2025-03-07", erTime: "08:00", irTime: "13:30", erMins: 480, notes: "" },
    { id: 2, date: "2025-03-06", erTime: "08:15", irTime: "14:00", erMins: 495, notes: "Took IR a bit late" },
  ],
  achievements: [],
  equippedTitle: null,
  mainQuest: null,
  intentions: [],
  moodLog: [],
  exams: [
    { id: 1, course: "Criminal Law", date: "2025-04-28", color: "#ef4444", outlineProgress: 0 },
    { id: 2, course: "Property", date: "2025-04-30", color: "#22c55e", outlineProgress: 0 },
    { id: 3, course: "Con Law & Reg State", date: "2025-05-02", color: "#3b82f6", outlineProgress: 0 },
  ],
};

/* ============================================================
   REDUCER
   ============================================================ */
function getXPNeeded(level) { return level * 500; }

function applyXP(state, xpGain) {
  let xp = state.xp + xpGain;
  let level = state.level;
  while (xp >= getXPNeeded(level)) { xp -= getXPNeeded(level); level++; }
  return { xp, level };
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TASK": return { ...state, tasks: [...state.tasks, action.task] };
    case "COMPLETE_TASK": return { ...applyXP(state, 40), tasks: state.tasks.map(t => t.id === action.id ? { ...t, done: true } : t) };
    case "ADD_WORKOUT": return { ...applyXP(state, 150), workouts: [...state.workouts, action.workout] };
    case "ADD_MEAL": return { ...state, cookbook: [...state.cookbook, action.meal] };
    case "LOG_SLEEP": {
      const xpGain = action.hours >= 8 ? 100 : action.hours >= 7 ? 50 : 20;
      return { ...applyXP(state, xpGain), sleepHistory: [...state.sleepHistory, { date: action.date, hours: action.hours }] };
    }
    case "SET_WAKE_TIME": return { ...state, wakeUpTime: action.time };
    case "STREAK_CHECKIN": {
      const ns = state.currentStreak + 1;
      return { ...applyXP(state, 200), currentStreak: ns, longestStreak: Math.max(state.longestStreak, ns), streakLogs: [...state.streakLogs, { date: new Date().toISOString().split("T")[0], clean: true }] };
    }
    case "BREAK_STREAK": return { ...state, currentStreak: 0, streakLogs: [...state.streakLogs, { date: new Date().toISOString().split("T")[0], clean: false }] };
    case "UNLOCK_UPGRADE": {
      const totalXP = (state.level - 1) * 500 + state.xp;
      if (totalXP < action.cost || state.unlockedUpgrades.includes(action.id)) return state;
      let xp = state.xp - action.cost;
      let level = state.level;
      while (xp < 0 && level > 1) { level--; xp += getXPNeeded(level); }
      xp = Math.max(0, xp);
      return { ...state, xp, level, unlockedUpgrades: [...state.unlockedUpgrades, action.id] };
    }
    case "ADD_BRAIN_DUMP": return { ...state, brainDump: [...state.brainDump, action.item] };
    case "DELETE_BRAIN_DUMP": return { ...state, brainDump: state.brainDump.filter(i => i.id !== action.id) };
    case "CONVERT_DUMP_TO_TASK": {
      const item = state.brainDump.find(i => i.id === action.id);
      if (!item) return state;
      return { ...state, brainDump: state.brainDump.filter(i => i.id !== action.id), tasks: [...state.tasks, { id: Date.now(), text: item.text, category: action.category || "other", done: false }] };
    }
    case "TOGGLE_HABIT": {
      const today = new Date().toISOString().split("T")[0];
      return { ...state, habits: state.habits.map(h => {
        if (h.id !== action.id) return h;
        const already = h.completedDates.includes(today);
        const newDates = already ? h.completedDates.filter(d => d !== today) : [...h.completedDates, today];
        return { ...h, completedDates: newDates };
      })};
    }
    case "ADD_HABIT": return { ...state, habits: [...state.habits, action.habit] };
    case "LOG_ADDERALL": {
      // Compute latest safe IR time: XR wears off after ~10h, IR needs 4h before sleep
      // We store erTimeMinutes so CalendarSection can draw the cutoff line
      const [erH, erM] = action.entry.erTime.split(":").map(Number);
      const erMins = erH * 60 + erM;
      // Latest IR = bedtime - 6h (IR needs 4-5h to clear; give buffer)
      // We just store erTime so calendar can calculate
      return { ...state, adderallLog: [...state.adderallLog, { ...action.entry, erMins }] };
    }
    case "UNLOCK_ACHIEVEMENT": {
      if (state.achievements.includes(action.id)) return state;
      return { ...applyXP(state, action.bonus || 0), achievements: [...state.achievements, action.id] };
    }
    case "EQUIP_TITLE": return { ...state, equippedTitle: action.title };
    case "ADD_CAL_EVENT": return { ...state, calEvents: [...state.calEvents, action.event] };
    case "REMOVE_CAL_EVENT": return { ...state, calEvents: state.calEvents.filter(e => e.id !== action.id) };
    case "CANCEL_CLASS": return { ...state, cancelledClasses: [...state.cancelledClasses, action.key] };
    case "RESTORE_CLASS": return { ...state, cancelledClasses: state.cancelledClasses.filter(k => k !== action.key) };
    case "SET_MAIN_QUEST": return { ...state, mainQuest: action.quest };
    case "COMPLETE_MAIN_QUEST": return { ...applyXP(state, 300), mainQuest: { ...state.mainQuest, done: true } };
    case "ADD_INTENTION": return { ...state, intentions: [...state.intentions, action.entry] };
    case "LOG_MOOD": return { ...state, moodLog: [...state.moodLog, action.entry] };
    case "UPDATE_EXAM_PROGRESS": return { ...state, exams: state.exams.map(e => e.id === action.id ? { ...e, outlineProgress: action.progress } : e) };
    case "ADD_EXAM": return { ...state, exams: [...state.exams, action.exam] };
    default: return state;
  }
}

/* ============================================================
   HELPERS
   ============================================================ */
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const getDayName = () => DAYS[new Date().getDay()];
const totalXP = (s) => (s.level - 1) * 500 + s.xp;

function fmt24(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${dh}:${m.toString().padStart(2,"0")} ${ampm}`;
}


/* ============================================================
   PURE SVG CHART COMPONENTS (no external dependencies)
   ============================================================ */

function SvgBarChart({ data, dataKey, colorFn, height = 160, yMax, xKey = "date", formatX }) {
  const [tooltip, setTooltip] = React.useState(null);
  if (!data || !data.length) return null;
  const W = 600; const H = height; const PL = 28; const PB = 24; const PT = 8; const PR = 8;
  const cW = W - PL - PR; const cH = H - PB - PT;
  const max = yMax || Math.max(...data.map(d => d[dataKey] || 0)) * 1.15 || 1;
  const barW = Math.max(4, cW / data.length * 0.6);
  const gap = cW / data.length;
  const yTicks = [0, Math.round(max * 0.5), Math.round(max)];
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }} preserveAspectRatio="none">
        {yTicks.map(t => {
          const y = PT + cH - (t / max) * cH;
          return <g key={t}>
            <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="#1e1e3e" strokeWidth="1" />
            <text x={PL - 4} y={y + 3} textAnchor="end" fill="#44446a" fontSize="10">{t}</text>
          </g>;
        })}
        {data.map((d, i) => {
          const val = d[dataKey] || 0;
          const bH = (val / max) * cH;
          const x = PL + i * gap + gap / 2 - barW / 2;
          const y = PT + cH - bH;
          const color = colorFn ? colorFn(d, i) : "#a855f7";
          const label = formatX ? formatX(d[xKey]) : d[xKey];
          return (
            <g key={i} onMouseEnter={() => setTooltip({ x: x + barW/2, y, val, label })} onMouseLeave={() => setTooltip(null)}>
              <rect x={x} y={y} width={barW} height={Math.max(bH, 2)} rx="4" fill={color} opacity="0.9" />
              <text x={x + barW/2} y={H - 6} textAnchor="middle" fill="#44446a" fontSize="9">{label}</text>
            </g>
          );
        })}
      </svg>
      {tooltip && (
        <div style={{ position: "absolute", top: tooltip.y, left: `${(tooltip.x / 600) * 100}%`, transform: "translate(-50%, -110%)", background: "#141428", border: "1px solid #3b82f622", borderRadius: 8, padding: "5px 10px", color: "#e0e0ff", fontSize: 12, pointerEvents: "none", whiteSpace: "nowrap", zIndex: 10 }}>
          {tooltip.label}: <strong>{tooltip.val}</strong>
        </div>
      )}
    </div>
  );
}

function SvgLineChart({ data, lines, height = 160, yDomain = [0, 5], xKey = "date", formatX }) {
  const [tooltip, setTooltip] = React.useState(null);
  if (!data || !data.length) return null;
  const W = 600; const H = height; const PL = 28; const PB = 24; const PT = 8; const PR = 8;
  const cW = W - PL - PR; const cH = H - PB - PT;
  const [yMin, yMax] = yDomain;
  const xStep = cW / (data.length - 1 || 1);
  const toY = v => PT + cH - ((v - yMin) / (yMax - yMin)) * cH;
  const toX = i => PL + i * xStep;
  const yTicks = [yMin, Math.round((yMin + yMax) / 2), yMax];
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }} preserveAspectRatio="none">
        {yTicks.map(t => (
          <g key={t}>
            <line x1={PL} x2={W - PR} y1={toY(t)} y2={toY(t)} stroke="#1e1e3e" strokeWidth="1" />
            <text x={PL - 4} y={toY(t) + 3} textAnchor="end" fill="#44446a" fontSize="10">{t}</text>
          </g>
        ))}
        {lines.map(({ key, color }) => {
          const pts = data.map((d, i) => `${toX(i)},${toY(d[key] || 0)}`).join(" ");
          return <polyline key={key} points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />;
        })}
        {data.map((d, i) => {
          const label = formatX ? formatX(d[xKey]) : d[xKey];
          return <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fill="#33336a" fontSize="9">{label}</text>;
        })}
        {/* Hover zones */}
        {data.map((d, i) => (
          <rect key={i} x={toX(i) - xStep/2} y={PT} width={xStep} height={cH} fill="transparent"
            onMouseEnter={() => setTooltip({ x: toX(i), vals: lines.map(l => ({ key: l.key, color: l.color, val: d[l.key] })), label: formatX ? formatX(d[xKey]) : d[xKey] })}
            onMouseLeave={() => setTooltip(null)} />
        ))}
      </svg>
      {tooltip && (
        <div style={{ position: "absolute", top: 10, left: `${(tooltip.x / 600) * 100}%`, transform: "translateX(-50%)", background: "#141428", border: "1px solid #3b82f622", borderRadius: 8, padding: "6px 12px", color: "#e0e0ff", fontSize: 11, pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap" }}>
          <div style={{ color: "#44446a", marginBottom: 4 }}>{tooltip.label}</div>
          {tooltip.vals.map(v => <div key={v.key} style={{ color: v.color }}>{v.key}: {v.val}</div>)}
        </div>
      )}
    </div>
  );
}

function SvgRadarChart({ data, dataKey, size = 260 }) {
  if (!data || !data.length) return null;
  const cx = size / 2; const cy = size / 2; const r = size * 0.38;
  const n = data.length;
  const max = Math.max(...data.map(d => d[dataKey] || 0)) || 1;
  const angle = (i) => (i / n) * 2 * Math.PI - Math.PI / 2;
  const pt = (i, radius) => ({ x: cx + radius * Math.cos(angle(i)), y: cy + radius * Math.sin(angle(i)) });
  const rings = [0.25, 0.5, 0.75, 1];
  return (
    <svg width={size} height={size} style={{ maxWidth: "100%" }}>
      {rings.map(pct => (
        <polygon key={pct} points={data.map((_, i) => { const p = pt(i, r * pct); return `${p.x},${p.y}`; }).join(" ")} fill="none" stroke="#1e1e3e" strokeWidth="1" />
      ))}
      {data.map((_, i) => { const p = pt(i, r); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#1e1e3e" strokeWidth="1" />; })}
      <polygon points={data.map((d, i) => { const p = pt(i, r * ((d[dataKey] || 0) / max)); return `${p.x},${p.y}`; }).join(" ")} fill="#22c55e" fillOpacity="0.18" stroke="#22c55e" strokeWidth="2.5" />
      {data.map((d, i) => {
        const labelR = r + 18;
        const lp = pt(i, labelR);
        return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fill="#8888aa" fontSize="11">{d.m}</text>;
      })}
    </svg>
  );
}

function SvgPieChart({ data, size = 120 }) {
  if (!data || !data.length) return null;
  const cx = size / 2; const cy = size / 2;
  const outerR = size * 0.46; const innerR = size * 0.25;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let startAngle = -Math.PI / 2;
  const slices = data.map(d => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const endAngle = startAngle + sweep;
    const s = { ...d, startAngle, endAngle };
    startAngle = endAngle;
    return s;
  });
  const arc = (s) => {
    const x1 = cx + outerR * Math.cos(s.startAngle); const y1 = cy + outerR * Math.sin(s.startAngle);
    const x2 = cx + outerR * Math.cos(s.endAngle); const y2 = cy + outerR * Math.sin(s.endAngle);
    const ix1 = cx + innerR * Math.cos(s.endAngle); const iy1 = cy + innerR * Math.sin(s.endAngle);
    const ix2 = cx + innerR * Math.cos(s.startAngle); const iy2 = cy + innerR * Math.sin(s.startAngle);
    const large = s.endAngle - s.startAngle > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${outerR},${outerR} 0 ${large} 1 ${x2},${y2} L${ix1},${iy1} A${innerR},${innerR} 0 ${large} 0 ${ix2},${iy2} Z`;
  };
  return (
    <svg width={size} height={size}>
      {slices.map((s, i) => <path key={i} d={arc(s)} fill={s.color} opacity="0.9" />)}
    </svg>
  );
}

function calcBedtime(wakeUp) {
  const [time, period] = wakeUp.split(" ");
  const [h, m] = time.split(":").map(Number);
  let hour24 = period === "PM" && h !== 12 ? h + 12 : period === "AM" && h === 12 ? 0 : h;
  const wakeMin = hour24 * 60 + m;
  const bedMin = ((wakeMin - 480) % 1440 + 1440) % 1440;
  const bh = Math.floor(bedMin / 60);
  const bm = bedMin % 60;
  const dh = bh > 12 ? bh - 12 : bh === 0 ? 12 : bh;
  return `${dh}:${bm.toString().padStart(2,"0")} ${bh >= 12 ? "PM" : "AM"}`;
}

/* ============================================================
   MINI COMPONENTS
   ============================================================ */
const XPBar = ({ xp, level }) => {
  const pct = Math.min((xp / getXPNeeded(level)) * 100, 100);
  return (
    <div style={{ background: "#0f0f1e", borderRadius: 8, height: 10, overflow: "hidden", border: "1px solid #1e1e3e" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)", borderRadius: 8, transition: "width 0.6s ease", boxShadow: "0 0 10px #a855f7aa" }} />
    </div>
  );
};

const Chip = ({ children, color = "#a855f7", size = "sm" }) => (
  <span style={{ background: `${color}20`, color, border: `1px solid ${color}44`, borderRadius: 6, padding: size === "sm" ? "2px 9px" : "4px 14px", fontSize: size === "sm" ? 10 : 12, fontWeight: 800, letterSpacing: 0.8, display: "inline-block" }}>{children}</span>
);

const Card = ({ children, accent = "#a855f7", style = {} }) => (
  <div style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: `1px solid ${accent}28`, borderRadius: 18, padding: 22, ...style }}>{children}</div>
);

const SectionTitle = ({ icon, title, sub }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 30 }}>{icon}</span>
      <div>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif", color: "#f0f0ff", letterSpacing: 3, textTransform: "uppercase" }}>{title}</h2>
        {sub && <div style={{ fontSize: 12, color: "#55558a", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
    <div style={{ height: 2, marginTop: 14, background: "linear-gradient(90deg, #7c3aed, #a855f7, transparent)", borderRadius: 2 }} />
  </div>
);

const StatTile = ({ icon, label, value, color = "#a855f7", sub }) => (
  <div style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: `1px solid ${color}25`, borderRadius: 16, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", right: -10, top: -10, fontSize: 52, opacity: 0.06 }}>{icon}</div>
    <div style={{ fontSize: 26 }}>{icon}</div>
    <div style={{ fontSize: 12, color: "#55558a", marginTop: 6 }}>{label}</div>
    <div style={{ fontSize: 30, fontWeight: 900, color, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1.1 }}>{value}</div>
    {sub && <div style={{ fontSize: 10, color: "#44446a", marginTop: 2 }}>{sub}</div>}
  </div>
);

const TabBtn = ({ active, onClick, children, accent = "#a855f7" }) => (
  <button onClick={onClick} style={{ background: active ? `${accent}22` : "transparent", color: active ? accent : "#55558a", border: `1px solid ${active ? accent+"55" : "#1e1e3e"}`, borderRadius: 10, padding: "8px 18px", fontWeight: 700, cursor: "pointer", fontSize: 12, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1, textTransform: "uppercase", transition: "all 0.15s" }}>{children}</button>
);

const Input = ({ value, onChange, placeholder, type = "text", style = {} }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{ background: "#0a0a18", border: "1px solid #1e1e3e", color: "#e0e0ff", borderRadius: 9, padding: "9px 12px", fontSize: 13, width: "100%", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif", outline: "none", ...style }} />
);

const Select = ({ value, onChange, children, style = {} }) => (
  <select value={value} onChange={onChange} style={{ background: "#0a0a18", border: "1px solid #1e1e3e", color: "#e0e0ff", borderRadius: 9, padding: "9px 12px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", ...style }}>{children}</select>
);

const Btn = ({ onClick, children, color = "#a855f7", style = {}, variant = "solid" }) => (
  <button onClick={onClick} style={{ background: variant === "solid" ? `linear-gradient(135deg, ${color}, ${color}cc)` : `${color}18`, color: variant === "solid" ? "#fff" : color, border: variant === "solid" ? "none" : `1px solid ${color}44`, borderRadius: 10, padding: "9px 20px", fontWeight: 800, cursor: "pointer", fontSize: 13, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1, textTransform: "uppercase", transition: "all 0.15s", ...style }}>{children}</button>
);

/* ============================================================
   SECTION: DASHBOARD
   ============================================================ */
function Dashboard({ state, dispatch }) {
  const day = getDayName();
  const classes = LAW_SCHEDULE[day] || [];
  const pendingTasks = state.tasks.filter(t => !t.done);
  const doneTasks = state.tasks.filter(t => t.done);
  const [newTask, setNewTask] = useState("");
  const [taskCat, setTaskCat] = useState("school");
  const needed = getXPNeeded(state.level);
  const pct = Math.round((state.xp / needed) * 100);
  const avg = state.sleepHistory.length ? (state.sleepHistory.reduce((a,b) => a+b.hours, 0) / state.sleepHistory.length).toFixed(1) : 0;

  const catColors = { school: "#3b82f6", gym: "#22c55e", work: "#f59e0b", personal: "#ec4899", other: "#8b5cf6" };
  const catIcons = { school: "📚", gym: "💪", work: "💼", personal: "🙋", other: "✨" };

  const addTask = () => {
    if (!newTask.trim()) return;
    dispatch({ type: "ADD_TASK", task: { id: Date.now(), text: newTask, category: taskCat, done: false } });
    setNewTask("");
  };

  const last = state.workouts[state.workouts.length - 1];
  const typeColors = { Push: "#a855f7", Pull: "#3b82f6", Legs: "#22c55e" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #100820 0%, #0d0d1c 60%, #081408 100%)", border: "1px solid #2a1060", borderRadius: 22, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, background: "radial-gradient(circle, #7c3aed1a, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "#55558a", letterSpacing: 4, fontFamily: "'Rajdhani',sans-serif" }}>WELCOME BACK · YOUR JOURNEY CONTINUES</div>
            <h1 style={{ margin: "6px 0 10px", fontSize: 38, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif", color: "#f0f0ff", letterSpacing: 2 }}>
              {day}, <span style={{ color: "#a855f7" }}>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </h1>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Chip color="#a855f7" size="md">LVL {state.level}</Chip>
              <Chip color="#ef4444" size="md">🔥 {state.currentStreak} DAY STREAK</Chip>
              <Chip color="#f59e0b" size="md">{state.xp}/{needed} XP</Chip>
              <Chip color="#22c55e" size="md">💤 {avg}H AVG SLEEP</Chip>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 70, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1, background: "linear-gradient(135deg, #a855f7, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{state.level}</div>
            <div style={{ fontSize: 10, color: "#55558a", letterSpacing: 3 }}>LEVEL</div>
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#44446a", marginBottom: 7 }}>
            <span>XP to Level {state.level + 1}</span><span>{pct}% complete</span>
          </div>
          <XPBar xp={state.xp} level={state.level} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14 }}>
        <StatTile icon="⚡" label="Total XP" value={totalXP(state)} color="#a855f7" />
        <StatTile icon="🔥" label="Streak" value={`${state.currentStreak}d`} color="#ef4444" />
        <StatTile icon="💪" label="Workouts" value={state.workouts.length} color="#22c55e" />
        <StatTile icon="✅" label="Tasks Done" value={doneTasks.length} color="#f59e0b" />
        <StatTile icon="🍽️" label="Recipes" value={state.cookbook.length} color="#ec4899" />
        <StatTile icon="📅" label="Best Streak" value={`${state.longestStreak}d`} color="#3b82f6" />
      </div>

      {/* Schedule + Tasks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Law Classes */}
        <Card accent="#3b82f6">
          <div style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 16 }}>📚 TODAY'S LAW SCHEDULE</div>
          {classes.length === 0 ? (
            <div style={{ color: "#44446a", fontSize: 13, padding: "20px 0", textAlign: "center" }}>
              <div style={{ fontSize: 32 }}>🎉</div>
              <div style={{ marginTop: 8 }}>No classes today — use this time wisely!</div>
            </div>
          ) : classes.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 12, padding: "12px 14px", background: "#3b82f611", borderRadius: 12, border: "1px solid #3b82f622" }}>
              <div style={{ background: c.color || "#3b82f6", color: "#fff", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 900, whiteSpace: "nowrap", alignSelf: "flex-start" }}>{c.time}</div>
              <div>
                <div style={{ fontWeight: 700, color: "#e0e0ff", fontSize: 14 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#55558a", marginTop: 2 }}>{c.room} · {c.duration} min</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Tasks */}
        <Card accent="#f59e0b">
          <div style={{ fontSize: 11, color: "#f59e0b", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 14 }}>⚡ TODAY'S TASKS</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <Select value={taskCat} onChange={e => setTaskCat(e.target.value)} style={{ width: 110 }}>
              <option value="school">📚 School</option>
              <option value="gym">💪 Gym</option>
              <option value="work">💼 Work</option>
              <option value="personal">🙋 Personal</option>
              <option value="other">✨ Other</option>
            </Select>
            <Input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Add a task..." style={{ flex: 1 }} />
            <Btn onClick={addTask} color="#f59e0b" style={{ padding: "9px 16px", fontSize: 18 }}>+</Btn>
          </div>
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {pendingTasks.map(t => (
              <div key={t.id} onClick={() => dispatch({ type: "COMPLETE_TASK", id: t.id })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#f59e0b08", borderRadius: 10, marginBottom: 7, border: "1px solid #f59e0b15", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f59e0b14"}
                onMouseLeave={e => e.currentTarget.style.background = "#f59e0b08"}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${catColors[t.category]}`, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#e0e0ff", flex: 1 }}>{t.text}</span>
                <Chip color={catColors[t.category]}>{catIcons[t.category]}</Chip>
              </div>
            ))}
            {doneTasks.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", opacity: 0.35, marginBottom: 5 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>✓</div>
                <span style={{ fontSize: 12, color: "#6666aa", textDecoration: "line-through" }}>{t.text}</span>
              </div>
            ))}
            {state.tasks.length === 0 && <div style={{ color: "#44446a", fontSize: 13, textAlign: "center", padding: "16px 0" }}>All clear! Add your tasks for the day.</div>}
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card accent="#3b82f6">
          <div style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 16 }}>💤 SLEEP THIS WEEK</div>
          <SvgLineChart data={state.sleepHistory.slice(-7)} height={130} yDomain={[0,10]}
            lines={[{key:"hours",color:"#3b82f6"}]} formatX={d => d.slice(-3)} />
        </Card>

        <Card accent="#22c55e">
          <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 12 }}>💪 LAST WORKOUT: {last?.type?.toUpperCase()}</div>
          {last ? (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                <Chip color={typeColors[last.type]}>{last.type}</Chip>
                <span style={{ fontSize: 12, color: "#44446a" }}>{last.date}</span>
              </div>
              {last.exercises.map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < last.exercises.length-1 ? "1px solid #22c55e11" : "none" }}>
                  <span style={{ fontSize: 13, color: "#e0e0ff" }}>{e.name}</span>
                  <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>{e.sets}×{e.reps} {e.weight > 0 ? `@ ${e.weight}lbs` : "BW"}</span>
                </div>
              ))}
            </>
          ) : <div style={{ color: "#44446a", fontSize: 13 }}>No workouts yet — get after it!</div>}
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION: GYM
   ============================================================ */
function GymSection({ state, dispatch }) {
  const [tab, setTab] = useState("log");
  const [wType, setWType] = useState("Push");
  const [exs, setExs] = useState([{ name: "Bench Press", sets: 3, reps: 8, weight: 135 }]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const typeColors = { Push: "#a855f7", Pull: "#3b82f6", Legs: "#22c55e" };

  const updateEx = (i, f, v) => { const e = [...exs]; e[i][f] = v; setExs(e); };
  const removeEx = (i) => setExs(exs.filter((_, idx) => idx !== i));
  const addEx = () => setExs([...exs, { name: "Pull-up", sets: 3, reps: 8, weight: 0 }]);

  const save = () => {
    dispatch({ type: "ADD_WORKOUT", workout: { id: Date.now(), date, type: wType, exercises: exs } });
    setExs([{ name: "Bench Press", sets: 3, reps: 8, weight: 135 }]);
  };

  // Compute muscle volume
  const muscleSets = {};
  state.workouts.forEach(w => {
    w.exercises.forEach(ex => {
      (MUSCLE_MAP[ex.name] || []).forEach(m => { muscleSets[m] = (muscleSets[m] || 0) + ex.sets; });
    });
  });
  const muscleData = Object.entries(muscleSets).map(([m, s]) => ({ muscle: m, sets: s })).sort((a,b) => b.sets - a.sets);
  const radarMuscles = ["Chest","Lats","Quads","Hamstrings","Front Delts","Biceps","Triceps"];
  const radarData = radarMuscles.map(m => ({ m, sets: muscleSets[m] || 0 }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="💪" title="Gym Tracker" sub="Track every rep. Build the body you want." />

      <div style={{ display: "flex", gap: 8 }}>
        <TabBtn active={tab==="log"} onClick={() => setTab("log")} accent="#22c55e">📝 Log</TabBtn>
        <TabBtn active={tab==="history"} onClick={() => setTab("history")} accent="#22c55e">📅 History</TabBtn>
        <TabBtn active={tab==="volume"} onClick={() => setTab("volume")} accent="#22c55e">📊 Volume</TabBtn>
      </div>

      {tab === "log" && (
        <Card accent="#22c55e">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 2, marginBottom: 10 }}>WORKOUT TYPE</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Push","Pull","Legs"].map(t => (
                  <button key={t} onClick={() => setWType(t)} style={{ flex: 1, background: wType===t ? typeColors[t] : "#0a0a18", color: wType===t ? "#fff" : "#44446a", border: `1px solid ${wType===t ? typeColors[t] : "#1e1e3e"}`, borderRadius: 10, padding: "11px 0", fontWeight: 900, cursor: "pointer", fontSize: 14, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1, transition: "all 0.15s" }}>
                    {t==="Push"?"🏋️":t==="Pull"?"🔄":"🦵"} {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 2, marginBottom: 10 }}>DATE</div>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", background: "#0a0a18", border: "1px solid #1e1e3e", color: "#e0e0ff", borderRadius: 9, padding: "11px 12px", fontSize: 13, boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 2, marginBottom: 12 }}>EXERCISES</div>
          {exs.map((ex, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 90px 40px", gap: 8, marginBottom: 10, alignItems: "flex-end" }}>
              <div>
                {i===0 && <div style={{ fontSize: 9, color: "#44446a", marginBottom: 4 }}>EXERCISE</div>}
                <Select value={ex.name} onChange={e => updateEx(i,"name",e.target.value)} style={{ width: "100%", background: "#0a0a18", border: "1px solid #1e1e3e", borderRadius: 8, padding: "8px 10px", fontSize: 12 }}>
                  {Object.keys(MUSCLE_MAP).map(m => <option key={m}>{m}</option>)}
                </Select>
              </div>
              <div>
                {i===0 && <div style={{ fontSize: 9, color: "#44446a", marginBottom: 4 }}>SETS</div>}
                <Input type="number" value={ex.sets} onChange={e => updateEx(i,"sets",+e.target.value)} />
              </div>
              <div>
                {i===0 && <div style={{ fontSize: 9, color: "#44446a", marginBottom: 4 }}>REPS</div>}
                <Input type="number" value={ex.reps} onChange={e => updateEx(i,"reps",+e.target.value)} />
              </div>
              <div>
                {i===0 && <div style={{ fontSize: 9, color: "#44446a", marginBottom: 4 }}>WEIGHT (lbs)</div>}
                <Input type="number" value={ex.weight} onChange={e => updateEx(i,"weight",+e.target.value)} />
              </div>
              <button onClick={() => removeEx(i)} style={{ background: "#ef444418", color: "#ef4444", border: "1px solid #ef444428", borderRadius: 8, padding: "8px", cursor: "pointer", fontSize: 14, alignSelf: "flex-end" }}>✕</button>
            </div>
          ))}

          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Btn onClick={addEx} color="#22c55e" variant="outline">+ Add Exercise</Btn>
            <Btn onClick={save} color="#22c55e" style={{ fontWeight: 900 }}>💾 SAVE WORKOUT (+150 XP)</Btn>
          </div>
        </Card>
      )}

      {tab === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[...state.workouts].reverse().map((w, i) => (
            <Card key={i} accent={typeColors[w.type]}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <Chip color={typeColors[w.type]} size="md">{w.type.toUpperCase()}</Chip>
                  <span style={{ color: "#44446a", fontSize: 12, alignSelf: "center" }}>{w.date}</span>
                </div>
                <span style={{ fontSize: 12, color: "#44446a" }}>{w.exercises.length} exercises · {w.exercises.reduce((a,e)=>a+e.sets,0)} sets total</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                {w.exercises.map((e, j) => (
                  <div key={j} style={{ background: `${typeColors[w.type]}10`, borderRadius: 9, padding: "9px 12px" }}>
                    <div style={{ fontWeight: 700, color: "#e0e0ff", fontSize: 13 }}>{e.name}</div>
                    <div style={{ color: typeColors[w.type], fontSize: 12, marginTop: 2 }}>{e.sets}×{e.reps} {e.weight > 0 ? `@ ${e.weight}lbs` : "Bodyweight"}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "volume" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card accent="#22c55e">
            <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 18 }}>TOTAL SETS BY MUSCLE</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {muscleData.map((d, i) => {
                const maxSets = Math.max(...muscleData.map(x => x.sets), 1);
                const pct = (d.sets / maxSets) * 100;
                return (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 100, fontSize: 11, color: "#c0c0e0", textAlign: "right", flexShrink: 0 }}>{d.muscle}</div>
                    <div style={{ flex: 1, height: 18, background: "#0a0a18", borderRadius: 5, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: `hsl(${130 + i * 12}, 65%, ${55 - i*2}%)`, borderRadius: 5, transition: "width 0.3s" }} />
                    </div>
                    <div style={{ width: 24, fontSize: 11, color: "#44446a" }}>{d.sets}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card accent="#22c55e">
            <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 18 }}>MUSCLE BALANCE</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <SvgRadarChart data={radarData} dataKey="sets" size={260} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SECTION: MEALS
   ============================================================ */
function MealsSection({ state, dispatch }) {
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", type: "lunch", time: 20, ingredients: "", restaurant: false });

  const tColors = { breakfast: "#f59e0b", lunch: "#22c55e", dinner: "#3b82f6", snack: "#ec4899" };
  const tIcons = { breakfast: "🌅", lunch: "☀️", dinner: "🌙", snack: "🍎" };
  const filtered = filter === "all" ? state.cookbook : state.cookbook.filter(m => m.type === filter);

  const save = () => {
    if (!form.name.trim()) return;
    dispatch({ type: "ADD_MEAL", meal: { ...form, id: Date.now(), ingredients: form.ingredients.split(",").map(s=>s.trim()).filter(Boolean) } });
    setForm({ name: "", type: "lunch", time: 20, ingredients: "", restaurant: false });
    setShowAdd(false);
  };

  const counts = ["breakfast","lunch","dinner","snack"].map(t => ({ t, n: state.cookbook.filter(m=>m.type===t).length }));
  const pieData = counts.filter(c => c.n > 0).map(c => ({ name: c.t, value: c.n, color: tColors[c.t] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="🍽️" title="Cookbook" sub="Your personal meal collection" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 18, alignItems: "start" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {counts.map(({ t, n }) => (
            <div key={t} style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: `1px solid ${tColors[t]}28`, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 26 }}>{tIcons[t]}</span>
              <div><div style={{ fontWeight: 900, fontSize: 24, color: tColors[t], fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>{n}</div><div style={{ fontSize: 10, color: "#44446a" }}>{t}</div></div>
            </div>
          ))}
        </div>
        {pieData.length > 0 && (
          <div style={{ width: 120 }}>
            <SvgPieChart data={pieData} size={120} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all","breakfast","lunch","dinner","snack"].map(f => (
            <TabBtn key={f} active={filter===f} onClick={() => setFilter(f)} accent={tColors[f] || "#a855f7"}>
              {tIcons[f] || "🍽️"} {f}
            </TabBtn>
          ))}
        </div>
        <Btn onClick={() => setShowAdd(!showAdd)} color="#ec4899">+ Add Recipe</Btn>
      </div>

      {showAdd && (
        <Card accent="#ec4899">
          <div style={{ fontSize: 12, color: "#ec4899", fontWeight: 800, letterSpacing: 2, marginBottom: 18, fontFamily: "'Rajdhani',sans-serif" }}>NEW RECIPE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 6 }}>RECIPE NAME</div>
              <Input value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="e.g. Grilled Salmon" />
            </div>
            <div>
              <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 6 }}>MEAL TYPE</div>
              <Select value={form.type} onChange={e => setForm({...form,type:e.target.value})} style={{ width: "100%" }}>
                <option>breakfast</option><option>lunch</option><option>dinner</option><option>snack</option>
              </Select>
            </div>
            <div>
              <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 6 }}>COOK TIME (min)</div>
              <Input type="number" value={form.time} onChange={e => setForm({...form,time:+e.target.value})} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 6 }}>INGREDIENTS (comma separated)</div>
            <textarea value={form.ingredients} onChange={e => setForm({...form,ingredients:e.target.value})} placeholder="chicken breast, olive oil, garlic, lemon..." style={{ width: "100%", background: "#0a0a18", border: "1px solid #1e1e3e", color: "#e0e0ff", borderRadius: 9, padding: "10px 12px", fontSize: 13, minHeight: 80, boxSizing: "border-box", resize: "vertical", fontFamily: "'DM Sans',sans-serif" }} />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 18, fontSize: 13, color: "#e0e0ff" }}>
            <input type="checkbox" checked={form.restaurant} onChange={e => setForm({...form,restaurant:e.target.checked})} style={{ accentColor: "#ec4899" }} />
            🏪 This is a restaurant order
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={save} color="#ec4899">Save Recipe</Btn>
            <Btn onClick={() => setShowAdd(false)} color="#ec4899" variant="outline">Cancel</Btn>
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
        {filtered.map(meal => (
          <div key={meal.id} style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: `1px solid ${tColors[meal.type]}25`, borderRadius: 18, padding: 20, transition: "all 0.2s", cursor: "default" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${tColors[meal.type]}55`; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${tColors[meal.type]}25`; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#f0f0ff", marginBottom: 6 }}>{meal.name}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Chip color={tColors[meal.type]}>{meal.type.toUpperCase()}</Chip>
                  {meal.restaurant && <Chip color="#8b5cf6">RESTAURANT</Chip>}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: tColors[meal.type], fontFamily: "'Rajdhani',sans-serif" }}>{meal.time > 0 ? `${meal.time}m` : "🏪"}</div>
                {meal.time > 0 && <div style={{ fontSize: 9, color: "#44446a" }}>cook time</div>}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#44446a", marginBottom: 7, letterSpacing: 1 }}>INGREDIENTS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {meal.ingredients.map((ing, i) => (
                  <span key={i} style={{ background: `${tColors[meal.type]}12`, color: "#8888aa", border: `1px solid ${tColors[meal.type]}20`, borderRadius: 5, padding: "2px 8px", fontSize: 11 }}>{ing}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SECTION: SLEEP
   ============================================================ */
function SleepSection({ state, dispatch }) {
  const [hours, setHours] = useState(7.5);
  const [wake, setWake] = useState(state.wakeUpTime);
  const bedtime = calcBedtime(wake);
  const avg = state.sleepHistory.length ? (state.sleepHistory.reduce((a,b)=>a+b.hours,0)/state.sleepHistory.length).toFixed(1) : 0;

  const quality = (h) => h >= 8 ? { l: "Excellent", c: "#22c55e", xp: 100 }
    : h >= 7 ? { l: "Good", c: "#a3e635", xp: 50 }
    : h >= 6 ? { l: "Fair", c: "#f59e0b", xp: 25 }
    : { l: "Poor", c: "#ef4444", xp: 10 };

  const q = quality(hours);

  const log = () => {
    const d = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dispatch({ type: "LOG_SLEEP", hours, date: d });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="💤" title="Sleep Tracker" sub="Recovery is just as important as the grind" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Log */}
        <Card accent="#3b82f6">
          <div style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 22 }}>LOG LAST NIGHT</div>
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "#8888aa" }}>Hours of sleep</span>
              <span style={{ fontSize: 42, fontWeight: 900, color: q.c, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>{hours}h</span>
            </div>
            <input type="range" min={2} max={12} step={0.5} value={hours} onChange={e => setHours(+e.target.value)}
              style={{ width: "100%", appearance: "none", WebkitAppearance: "none", height: 8, background: `linear-gradient(90deg, ${q.c} ${((hours-2)/10)*100}%, #1e1e3e ${((hours-2)/10)*100}%)`, borderRadius: 4, outline: "none", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#33336a", marginTop: 6 }}>
              <span>2h</span><span>5h</span><span>8h ✓</span><span>10h</span><span>12h</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, background: `${q.c}15`, border: `1px solid ${q.c}30`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: q.c, fontFamily: "'Rajdhani',sans-serif" }}>{q.l}</div>
              <div style={{ fontSize: 10, color: "#44446a", marginTop: 2 }}>Quality</div>
            </div>
            <div style={{ flex: 1, background: "#f59e0b15", border: "1px solid #f59e0b30", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#f59e0b", fontFamily: "'Rajdhani',sans-serif" }}>+{q.xp}</div>
              <div style={{ fontSize: 10, color: "#44446a", marginTop: 2 }}>XP reward</div>
            </div>
          </div>

          <Btn onClick={log} color="#3b82f6" style={{ width: "100%", fontWeight: 900, padding: "12px 0" }}>💾 LOG SLEEP</Btn>
        </Card>

        {/* Bedtime */}
        <Card accent="#8b5cf6">
          <div style={{ fontSize: 11, color: "#8b5cf6", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 18 }}>BEDTIME CALCULATOR</div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, color: "#44446a", marginBottom: 8 }}>MY WAKE UP TIME</div>
            <Select value={wake} onChange={e => { setWake(e.target.value); dispatch({ type: "SET_WAKE_TIME", time: e.target.value }); }} style={{ width: "100%", fontSize: 14 }}>
              {["5:00 AM","5:30 AM","6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM"].map(t => <option key={t}>{t}</option>)}
            </Select>
          </div>

          <div style={{ background: "#8b5cf618", border: "1px solid #8b5cf630", borderRadius: 14, padding: "22px 0", textAlign: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 10, color: "#8b5cf6", letterSpacing: 3, marginBottom: 8 }}>GO TO SLEEP BY</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#f0f0ff", fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>{bedtime}</div>
            <div style={{ fontSize: 12, color: "#44446a", marginTop: 6 }}>for 8 hours of sleep</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div style={{ background: "#3b82f618", borderRadius: 10, padding: "12px 0", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#3b82f6", fontFamily: "'Rajdhani',sans-serif" }}>{avg}h</div>
              <div style={{ fontSize: 10, color: "#44446a" }}>Avg</div>
            </div>
            <div style={{ background: "#22c55e18", borderRadius: 10, padding: "12px 0", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#22c55e", fontFamily: "'Rajdhani',sans-serif" }}>{state.sleepHistory.filter(s=>s.hours>=7).length}</div>
              <div style={{ fontSize: 10, color: "#44446a" }}>Good nights</div>
            </div>
            <div style={{ background: "#ef444418", borderRadius: 10, padding: "12px 0", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#ef4444", fontFamily: "'Rajdhani',sans-serif" }}>{state.sleepHistory.filter(s=>s.hours<6).length}</div>
              <div style={{ fontSize: 10, color: "#44446a" }}>Poor nights</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card accent="#3b82f6">
        <div style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 18 }}>SLEEP HISTORY</div>
        <SvgBarChart data={state.sleepHistory} dataKey="hours" height={200} yMax={12}
          colorFn={e => e.hours>=8?"#22c55e":e.hours>=7?"#a3e635":e.hours>=6?"#f59e0b":"#ef4444"}
          formatX={d => d.slice(-3)} />
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 14 }}>
          {[["#22c55e","8h+ Excellent"],["#a3e635","7h Good"],["#f59e0b","6h Fair"],["#ef4444","<6h Poor"]].map(([c,l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#44446a" }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{l}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   SECTION: STREAK
   ============================================================ */
function StreakSection({ state, dispatch }) {
  const [modal, setModal] = useState(false);
  const milestones = [{ days: 1, icon: "🌱", l: "First Day" }, { days: 3, icon: "🔥", l: "3 Days" }, { days: 7, icon: "⚡", l: "1 Week" }, { days: 14, icon: "💪", l: "2 Weeks" }, { days: 30, icon: "🛡️", l: "1 Month" }, { days: 60, icon: "🏆", l: "2 Months" }, { days: 90, icon: "👑", l: "90 Days" }];
  const next = milestones.find(m => m.days > state.currentStreak) || milestones[milestones.length-1];
  const msgs = ["Every day is a victory. You are stronger than the urge.", "Your brain is rewiring right now. This discomfort IS the growth.", "Struggle is part of the path. You're still on it — that matters.", "The man you're becoming doesn't need this. Keep going."];
  const msg = msgs[state.currentStreak % msgs.length];

  const calendarData = state.streakLogs.slice(-28);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="🛡️" title="Freedom Tracker" sub="One day at a time. Every day counts." />

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #18080a, #0d0d1c)", border: "1px solid #ef444430", borderRadius: 22, padding: "36px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 30%, #ef44441a, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ fontSize: 10, color: "#ef4444", letterSpacing: 5, marginBottom: 6, fontFamily: "'Rajdhani',sans-serif" }}>DAYS FREE</div>
        <div style={{ fontSize: 110, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1, background: "linear-gradient(135deg, #ef4444, #f97316, #eab308)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{state.currentStreak}</div>
        <div style={{ fontSize: 16, color: "#6688aa", marginBottom: 24 }}>consecutive days</div>

        <div style={{ maxWidth: 480, margin: "0 auto 26px", background: "#ef444410", border: "1px solid #ef444420", borderRadius: 12, padding: "16px 22px" }}>
          <div style={{ fontSize: 14, color: "#e0e0ff", fontStyle: "italic", lineHeight: 1.6 }}>"{msg}"</div>
        </div>

        {/* Progress bar to next milestone */}
        <div style={{ maxWidth: 460, margin: "0 auto 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#44446a", marginBottom: 8 }}>
            <span>Progress to {next.days} days {next.icon}</span>
            <span>{state.currentStreak}/{next.days}</span>
          </div>
          <div style={{ background: "#1a1a2e", borderRadius: 8, height: 12, overflow: "hidden" }}>
            <div style={{ width: `${Math.min((state.currentStreak/next.days)*100, 100)}%`, height: "100%", background: "linear-gradient(90deg, #ef4444, #f97316, #eab308)", borderRadius: 8, transition: "width 0.6s", boxShadow: "0 0 12px #f97316aa" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <Btn onClick={() => dispatch({ type: "STREAK_CHECKIN" })} color="#22c55e" style={{ fontSize: 14, padding: "12px 28px" }}>✅ CHECK IN (+200 XP)</Btn>
          <Btn onClick={() => setModal(true)} color="#ef4444" variant="outline" style={{ fontSize: 13 }}>Report Relapse</Btn>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <StatTile icon="🏆" label="Best Streak" value={`${state.longestStreak}d`} color="#f59e0b" />
        <StatTile icon="✅" label="Total Clean Days" value={state.streakLogs.filter(l=>l.clean).length} color="#22c55e" />
        <StatTile icon="📊" label="Total Check-ins" value={state.streakLogs.length} color="#3b82f6" />
      </div>

      {/* Calendar grid */}
      {calendarData.length > 0 && (
        <Card accent="#ef4444">
          <div style={{ fontSize: 11, color: "#ef4444", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 18 }}>RECENT ACTIVITY</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {calendarData.map((d, i) => (
              <div key={i} title={d.date} style={{ width: 36, height: 36, borderRadius: 8, background: d.clean ? "#22c55e22" : "#ef444420", border: `1px solid ${d.clean ? "#22c55e44" : "#ef444430"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                {d.clean ? "✅" : "💔"}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Milestones */}
      <Card accent="#f59e0b">
        <div style={{ fontSize: 11, color: "#f59e0b", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 18 }}>MILESTONES</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
          {milestones.map(m => {
            const done = state.longestStreak >= m.days || state.currentStreak >= m.days;
            return (
              <div key={m.days} style={{ textAlign: "center", padding: "14px 6px", background: done ? "#f59e0b10" : "#0a0a18", border: `1px solid ${done ? "#f59e0b40" : "#1e1e3e"}`, borderRadius: 12, opacity: done ? 1 : 0.4 }}>
                <div style={{ fontSize: 26 }}>{m.icon}</div>
                <div style={{ fontSize: 10, color: done ? "#f59e0b" : "#44446a", fontWeight: 700, marginTop: 6 }}>{m.l}</div>
                {done && <div style={{ fontSize: 8, color: "#22c55e", marginTop: 3 }}>DONE</div>}
              </div>
            );
          })}
        </div>
      </Card>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "#000000dd", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
          <div style={{ background: "#0d0d1c", border: "1px solid #ef444444", borderRadius: 22, padding: "36px 32px", maxWidth: 400, textAlign: "center" }}>
            <div style={{ fontSize: 52 }}>💔</div>
            <h3 style={{ color: "#f0f0ff", margin: "14px 0 10px", fontFamily: "'Rajdhani',sans-serif", fontSize: 24 }}>This Takes Courage</h3>
            <p style={{ color: "#7777aa", fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>Acknowledging a slip is the first step back. Your progress isn't erased — your brain has already changed. This is just a reset, not a failure. Get back up.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Btn onClick={() => { dispatch({ type: "BREAK_STREAK" }); setModal(false); }} color="#ef4444">Reset & Start Again</Btn>
              <Btn onClick={() => setModal(false)} color="#ef4444" variant="outline">I'm Still Going</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SECTION: UPGRADES
   ============================================================ */
function UpgradesSection({ state, dispatch }) {
  const tx = totalXP(state);
  const [catFilter, setCatFilter] = useState("all");
  const tierColors = { 1: "#22c55e", 2: "#f59e0b", 3: "#ef4444" };
  const tierLabels = { 1: "Tier 1 · Early Wins", 2: "Tier 2 · Mid-Tier", 3: "Tier 3 · Prestige" };
  const catUpgrades = catFilter === "all" ? UPGRADES : UPGRADES.filter(u => u.category === catFilter);

  const equippedTitle = state.equippedTitle;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="🎮" title="Reward Store" sub="Real rewards you earn by showing up. No shortcuts." />

      <div style={{ background: "linear-gradient(135deg, #100820, #0d0d1c)", border: "1px solid #a855f730", borderRadius: 18, padding: "22px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "#55558a" }}>Your XP Balance</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#a855f7", fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>{tx.toLocaleString()} XP</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#55558a" }}>Level · Unlocked</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#f0f0ff", fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>
              {state.level} <span style={{ fontSize: 20, color: "#44446a" }}>· {state.unlockedUpgrades.length}</span>
            </div>
          </div>
        </div>
        {equippedTitle && (
          <div style={{ background: "#f59e0b18", border: "1px solid #f59e0b33", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#f59e0b" }}>
            ✨ Active title: <strong>{equippedTitle}</strong>
          </div>
        )}
        <div style={{ fontSize: 12, color: "#44446a", marginTop: equippedTitle ? 12 : 0, lineHeight: 1.6 }}>
          These are real rewards — things you actually buy yourself when you've earned enough XP. Nothing here skips your goals or makes the game easier. That's the point.
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["all","real","cosmetic"].map(f => (
          <TabBtn key={f} active={catFilter===f} onClick={() => setCatFilter(f)} accent="#a855f7">
            {f === "all" ? "ALL" : f === "real" ? "🎁 REAL REWARDS" : "✨ TITLES"}
          </TabBtn>
        ))}
      </div>

      {[1,2,3].map(tier => {
        const tierItems = catUpgrades.filter(u => u.tier === tier);
        if (!tierItems.length) return null;
        return (
          <div key={tier}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ height: 2, flex: 1, background: `${tierColors[tier]}44` }} />
              <span style={{ fontSize: 11, color: tierColors[tier], letterSpacing: 2, fontFamily: "'Rajdhani',sans-serif", fontWeight: 800 }}>{tierLabels[tier]}</span>
              <div style={{ height: 2, flex: 1, background: `${tierColors[tier]}44` }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
              {tierItems.map(u => {
                const owned = state.unlockedUpgrades.includes(u.id);
                const afford = tx >= u.cost;
                const levelLocked = u.minLevel && state.level < u.minLevel;
                const tColor = tierColors[tier];
                return (
                  <div key={u.id} style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: `2px solid ${owned ? tColor + "66" : levelLocked ? "#1e1e3e" : afford ? tColor + "33" : "#1e1e3e"}`, borderRadius: 18, padding: 22, position: "relative", overflow: "hidden", transition: "all 0.2s", opacity: levelLocked ? 0.4 : 1 }}>
                    {owned && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: tColor }} />}
                    {levelLocked && <div style={{ position: "absolute", top: 12, right: 12, background: "#1e1e3e", color: "#44446a", borderRadius: 6, padding: "2px 8px", fontSize: 9, fontWeight: 800 }}>LVL {u.minLevel} REQ</div>}
                    {owned && <div style={{ position: "absolute", top: 12, right: 12, background: tColor, color: "#000", borderRadius: 6, padding: "2px 10px", fontSize: 9, fontWeight: 900 }}>EARNED ✓</div>}
                    <div style={{ fontSize: 36, marginBottom: 10 }}>{u.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#f0f0ff", marginBottom: 6 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "#55558a", lineHeight: 1.6, marginBottom: 16 }}>{u.desc}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 900, fontSize: 18, color: afford && !owned ? tColor : "#44446a", fontFamily: "'Rajdhani',sans-serif" }}>{u.cost.toLocaleString()} XP</span>
                      {!owned && !levelLocked && (
                        <button onClick={() => afford && dispatch({ type: "UNLOCK_UPGRADE", id: u.id, cost: u.cost })}
                          style={{ background: afford ? `linear-gradient(135deg, ${tColor}, ${tColor}aa)` : "#1a1a2e", color: afford ? "#fff" : "#33336a", border: afford ? "none" : "1px solid #1e1e3e", borderRadius: 9, padding: "8px 16px", fontWeight: 800, cursor: afford ? "pointer" : "not-allowed", fontSize: 12, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1 }}>
                          {afford ? "UNLOCK" : "LOCKED"}
                        </button>
                      )}
                      {!owned && u.category === "cosmetic" && owned === false && state.unlockedUpgrades.includes(u.id) === false && (
                        <span />
                      )}
                      {owned && u.category === "cosmetic" && (
                        <button onClick={() => dispatch({ type: "EQUIP_TITLE", title: u.name === state.equippedTitle ? null : u.name })}
                          style={{ background: state.equippedTitle === u.name ? tColor : "#1a1a2e", color: state.equippedTitle === u.name ? "#000" : tColor, border: `1px solid ${tColor}55`, borderRadius: 9, padding: "6px 14px", fontWeight: 800, cursor: "pointer", fontSize: 11 }}>
                          {state.equippedTitle === u.name ? "EQUIPPED" : "EQUIP"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}


/* ============================================================
   SECTION: WORK HUB
   ============================================================ */
function WorkSection({ state, dispatch }) {
  const [tab, setTab] = useState("readings");

  // ---- READINGS ----
  const [readings, setReadings] = useState([
    { id: 1, course: "Criminal Law", title: "People v. Newton — mens rea analysis", due: "2025-03-10", pages: 18, estMins: 45, done: false },
    { id: 2, course: "Property", title: "Adverse Possession — cases ch. 4", due: "2025-03-11", pages: 22, estMins: 55, done: false },
    { id: 3, course: "Con Law & Reg State", title: "Chevron Doctrine & agency deference", due: "2025-03-12", pages: 30, estMins: 75, done: false },
    { id: 4, course: "Advocacy", title: "Opening statement structure — bench memo", due: "2025-03-13", pages: 12, estMins: 30, done: true },
  ]);
  const [showAddReading, setShowAddReading] = useState(false);
  const [newReading, setNewReading] = useState({ course: "Criminal Law", title: "", due: "", pages: 10, estMins: 30 });

  const addReading = () => {
    if (!newReading.title.trim()) return;
    setReadings(prev => [...prev, { ...newReading, id: Date.now(), done: false }]);
    setNewReading({ course: "Criminal Law", title: "", due: "", pages: 10, estMins: 30 });
    setShowAddReading(false);
  };
  const toggleReading = (id) => setReadings(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r));
  const updateReadingTime = (id, mins) => setReadings(prev => prev.map(r => r.id === id ? { ...r, estMins: mins } : r));

  // ---- PROJECTS ----
  const [projects, setProjects] = useState([
    { id: 1, name: "Law Review Note", desc: "First draft of student note on AI liability", progress: 35, color: "#3b82f6", estHours: 20 },
    { id: 2, name: "Moot Court Brief", desc: "Appellant brief — due end of month", progress: 60, color: "#a855f7", estHours: 15 },
    { id: 3, name: "Personal Portfolio Site", desc: "Build out professional portfolio", progress: 20, color: "#22c55e", estHours: 10 },
  ]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", desc: "", progress: 0, color: "#a855f7", estHours: 10 });

  const addProject = () => {
    if (!newProject.name.trim()) return;
    setProjects(prev => [...prev, { ...newProject, id: Date.now() }]);
    setNewProject({ name: "", desc: "", progress: 0, color: "#a855f7", estHours: 10 });
    setShowAddProject(false);
  };
  const updateProgress = (id, val) => setProjects(prev => prev.map(p => p.id === id ? { ...p, progress: val } : p));

  // ---- INTERNSHIPS ----
  const WEEKLY_GOAL = 5;
  const [applications, setApplications] = useState([
    { id: 1, firm: "Sullivan & Cromwell", type: "BigLaw", date: "2025-03-03", status: "submitted" },
    { id: 2, firm: "ACLU", type: "Public Interest", date: "2025-03-04", status: "interview" },
    { id: 3, firm: "DOJ Honors Program", type: "Government", date: "2025-03-06", status: "submitted" },
  ]);
  const [showAddApp, setShowAddApp] = useState(false);
  const [newApp, setNewApp] = useState({ firm: "", type: "BigLaw", status: "submitted" });

  const addApp = () => {
    if (!newApp.firm.trim()) return;
    setApplications(prev => [...prev, { ...newApp, id: Date.now(), date: new Date().toISOString().split("T")[0] }]);
    setNewApp({ firm: "", type: "BigLaw", status: "submitted" });
    setShowAddApp(false);
    dispatch({ type: "ADD_TASK", task: { id: Date.now(), text: `Applied to ${newApp.firm}`, category: "work", done: true } });
  };

  // calc this week's apps
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
  const weekApps = applications.filter(a => new Date(a.date) >= weekStart).length;
  const weekPct = Math.min((weekApps / WEEKLY_GOAL) * 100, 100);

  const courseColors = { "Criminal Law": "#ef4444", "Property": "#22c55e", "Con Law & Reg State": "#3b82f6", "Advocacy": "#f59e0b" };
  const statusColors = { submitted: "#3b82f6", interview: "#22c55e", rejected: "#ef4444", offer: "#f59e0b" };
  const statusIcons = { submitted: "📤", interview: "🎯", rejected: "❌", offer: "🏆" };

  const pendingReadings = readings.filter(r => !r.done);
  const totalEstMins = pendingReadings.reduce((a, r) => a + r.estMins, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="💼" title="Work Hub" sub="Law readings, projects & internship applications" />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <TabBtn active={tab === "readings"} onClick={() => setTab("readings")} accent="#3b82f6">📖 Readings</TabBtn>
        <TabBtn active={tab === "projects"} onClick={() => setTab("projects")} accent="#a855f7">🚀 Projects</TabBtn>
        <TabBtn active={tab === "internships"} onClick={() => setTab("internships")} accent="#f59e0b">🏢 Applications</TabBtn>
      </div>

      {/* ---- READINGS TAB ---- */}
      {tab === "readings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Summary bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            <StatTile icon="📖" label="Pending Readings" value={pendingReadings.length} color="#3b82f6" />
            <StatTile icon="⏱️" label="Est. Time Remaining" value={totalEstMins >= 60 ? `${Math.floor(totalEstMins/60)}h ${totalEstMins%60}m` : `${totalEstMins}m`} color="#f59e0b" />
            <StatTile icon="✅" label="Completed" value={readings.filter(r => r.done).length} color="#22c55e" />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Btn onClick={() => setShowAddReading(!showAddReading)} color="#3b82f6">+ Add Reading</Btn>
          </div>

          {showAddReading && (
            <Card accent="#3b82f6">
              <div style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 2, fontFamily: "'Rajdhani',sans-serif", marginBottom: 14 }}>ADD READING ASSIGNMENT</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>COURSE</div>
                  <Select value={newReading.course} onChange={e => setNewReading({...newReading, course: e.target.value})} style={{ width: "100%" }}>
                    <option>Criminal Law</option>
                    <option>Property</option>
                    <option>Con Law & Reg State</option>
                    <option>Advocacy</option>
                    <option>Other</option>
                  </Select>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>DUE DATE</div>
                  <input type="date" value={newReading.due} onChange={e => setNewReading({...newReading, due: e.target.value})} style={{ width: "100%", background: "#0a0a18", border: "1px solid #1e1e3e", color: "#e0e0ff", borderRadius: 9, padding: "9px 12px", fontSize: 13, boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>READING TITLE / TOPIC</div>
                <Input value={newReading.title} onChange={e => setNewReading({...newReading, title: e.target.value})} placeholder="e.g. Brown v. Board — equal protection analysis" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>PAGES</div>
                  <Input type="number" value={newReading.pages} onChange={e => setNewReading({...newReading, pages: +e.target.value})} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>EST. TIME (minutes)</div>
                  <Input type="number" value={newReading.estMins} onChange={e => setNewReading({...newReading, estMins: +e.target.value})} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={addReading} color="#3b82f6">Save Reading</Btn>
                <Btn onClick={() => setShowAddReading(false)} color="#3b82f6" variant="outline">Cancel</Btn>
              </div>
            </Card>
          )}

          {readings.map(r => (
            <div key={r.id} style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: `1px solid ${r.done ? "#22c55e22" : courseColors[r.course] + "33"}`, borderRadius: 16, padding: "16px 20px", opacity: r.done ? 0.55 : 1, transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div onClick={() => toggleReading(r.id)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${r.done ? "#22c55e" : courseColors[r.course] || "#3b82f6"}`, background: r.done ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginTop: 2 }}>
                  {r.done && <span style={{ fontSize: 12, color: "#fff" }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 5 }}>
                    <Chip color={courseColors[r.course] || "#3b82f6"}>{r.course}</Chip>
                    {r.due && <span style={{ fontSize: 11, color: "#55558a" }}>Due {r.due}</span>}
                    <span style={{ fontSize: 11, color: "#55558a" }}>{r.pages} pages</span>
                  </div>
                  <div style={{ fontWeight: 700, color: r.done ? "#6666aa" : "#f0f0ff", fontSize: 14, textDecoration: r.done ? "line-through" : "none", marginBottom: 8 }}>{r.title}</div>
                  {!r.done && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "#55558a" }}>Est. time:</span>
                      <input type="number" value={r.estMins} onChange={e => updateReadingTime(r.id, +e.target.value)} style={{ width: 70, background: "#0a0a18", border: "1px solid #1e1e3e", color: "#f59e0b", borderRadius: 7, padding: "4px 8px", fontSize: 12, textAlign: "center" }} />
                      <span style={{ fontSize: 11, color: "#55558a" }}>min</span>
                      <div style={{ marginLeft: "auto", background: "#f59e0b22", border: "1px solid #f59e0b33", borderRadius: 8, padding: "4px 12px", fontSize: 12, color: "#f59e0b", fontWeight: 700 }}>
                        ⏱ {r.estMins >= 60 ? `${Math.floor(r.estMins/60)}h ${r.estMins%60}m` : `${r.estMins}m`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- PROJECTS TAB ---- */}
      {tab === "projects" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Btn onClick={() => setShowAddProject(!showAddProject)} color="#a855f7">+ Add Project</Btn>
          </div>

          {showAddProject && (
            <Card accent="#a855f7">
              <div style={{ fontSize: 11, color: "#a855f7", letterSpacing: 2, fontFamily: "'Rajdhani',sans-serif", marginBottom: 14 }}>NEW PROJECT</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>PROJECT NAME</div>
                  <Input value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} placeholder="e.g. Law Review Note" />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>EST. HOURS</div>
                  <Input type="number" value={newProject.estHours} onChange={e => setNewProject({...newProject, estHours: +e.target.value})} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>DESCRIPTION</div>
                <Input value={newProject.desc} onChange={e => setNewProject({...newProject, desc: e.target.value})} placeholder="What is this project?" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>COLOR</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["#a855f7","#3b82f6","#22c55e","#f59e0b","#ef4444","#ec4899"].map(c => (
                      <div key={c} onClick={() => setNewProject({...newProject, color: c})} style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: newProject.color === c ? "3px solid #fff" : "2px solid transparent" }} />
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>INITIAL PROGRESS %</div>
                  <Input type="number" value={newProject.progress} onChange={e => setNewProject({...newProject, progress: Math.min(100, Math.max(0, +e.target.value))})} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={addProject} color="#a855f7">Save Project</Btn>
                <Btn onClick={() => setShowAddProject(false)} color="#a855f7" variant="outline">Cancel</Btn>
              </div>
            </Card>
          )}

          {projects.map(p => (
            <div key={p.id} style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: `1px solid ${p.color}30`, borderRadius: 18, padding: "20px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
                    <div style={{ fontWeight: 800, fontSize: 16, color: "#f0f0ff" }}>{p.name}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#55558a", marginBottom: 4 }}>{p.desc}</div>
                  <div style={{ fontSize: 11, color: "#44446a" }}>Est. {p.estHours} hours total · ~{Math.round(p.estHours * (1 - p.progress/100))} hours remaining</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: p.color, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>{p.progress}%</div>
                  <div style={{ fontSize: 10, color: "#44446a" }}>complete</div>
                </div>
              </div>
              {/* Big progress bar */}
              <div style={{ background: "#0a0a18", borderRadius: 10, height: 16, overflow: "hidden", marginBottom: 12, border: `1px solid ${p.color}20` }}>
                <div style={{ width: `${p.progress}%`, height: "100%", background: `linear-gradient(90deg, ${p.color}aa, ${p.color})`, borderRadius: 10, transition: "width 0.5s ease", boxShadow: `0 0 10px ${p.color}66` }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: "#55558a" }}>Update progress:</span>
                <input type="range" min={0} max={100} value={p.progress} onChange={e => updateProgress(p.id, +e.target.value)} style={{ flex: 1, accentColor: p.color }} />
                <span style={{ fontSize: 12, color: p.color, fontWeight: 700, width: 35 }}>{p.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- INTERNSHIPS TAB ---- */}
      {tab === "internships" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Weekly goal bar */}
          <div style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: "1px solid #f59e0b33", borderRadius: 18, padding: "22px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: "#f59e0b", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif" }}>WEEKLY APPLICATION GOAL</div>
                <div style={{ fontSize: 13, color: "#55558a", marginTop: 4 }}>Target: {WEEKLY_GOAL} applications this week</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 44, fontWeight: 900, color: weekApps >= WEEKLY_GOAL ? "#22c55e" : "#f59e0b", fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>{weekApps}<span style={{ fontSize: 20, color: "#44446a" }}>/{WEEKLY_GOAL}</span></div>
                <div style={{ fontSize: 10, color: "#44446a" }}>this week</div>
              </div>
            </div>
            {/* Segmented bar */}
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              {Array.from({length: WEEKLY_GOAL}).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 18, borderRadius: 8, background: i < weekApps ? "linear-gradient(135deg, #f59e0b, #d97706)" : "#1a1a2e", border: `1px solid ${i < weekApps ? "#f59e0b55" : "#2a2a4e"}`, transition: "all 0.3s", boxShadow: i < weekApps ? "0 0 8px #f59e0b55" : "none" }} />
              ))}
            </div>
            {weekApps >= WEEKLY_GOAL
              ? <div style={{ fontSize: 13, color: "#22c55e", fontWeight: 700 }}>🎉 Weekly goal crushed! Keep the momentum.</div>
              : <div style={{ fontSize: 12, color: "#55558a" }}>{WEEKLY_GOAL - weekApps} more to hit your goal this week</div>
            }
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            <StatTile icon="📤" label="Total Applied" value={applications.length} color="#3b82f6" />
            <StatTile icon="🎯" label="Interviews" value={applications.filter(a=>a.status==="interview").length} color="#22c55e" />
            <StatTile icon="🏆" label="Offers" value={applications.filter(a=>a.status==="offer").length} color="#f59e0b" />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Btn onClick={() => setShowAddApp(!showAddApp)} color="#f59e0b">+ Log Application</Btn>
          </div>

          {showAddApp && (
            <Card accent="#f59e0b">
              <div style={{ fontSize: 11, color: "#f59e0b", letterSpacing: 2, fontFamily: "'Rajdhani',sans-serif", marginBottom: 14 }}>NEW APPLICATION</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>FIRM / ORGANIZATION</div>
                  <Input value={newApp.firm} onChange={e => setNewApp({...newApp, firm: e.target.value})} placeholder="e.g. Sullivan & Cromwell" />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>TYPE</div>
                  <Select value={newApp.type} onChange={e => setNewApp({...newApp, type: e.target.value})} style={{ width: "100%" }}>
                    <option>BigLaw</option>
                    <option>Boutique</option>
                    <option>Government</option>
                    <option>Public Interest</option>
                    <option>Clerkship</option>
                    <option>In-House</option>
                    <option>Other</option>
                  </Select>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>STATUS</div>
                  <Select value={newApp.status} onChange={e => setNewApp({...newApp, status: e.target.value})} style={{ width: "100%" }}>
                    <option value="submitted">Submitted</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={addApp} color="#f59e0b">Log Application</Btn>
                <Btn onClick={() => setShowAddApp(false)} color="#f59e0b" variant="outline">Cancel</Btn>
              </div>
            </Card>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[...applications].reverse().map(app => (
              <div key={app.id} style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: `1px solid ${statusColors[app.status]}28`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 24 }}>{statusIcons[app.status]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#f0f0ff", fontSize: 14 }}>{app.firm}</div>
                  <div style={{ fontSize: 11, color: "#55558a", marginTop: 2 }}>{app.type} · Applied {app.date}</div>
                </div>
                <div>
                  <Select value={app.status} onChange={e => setApplications(prev => prev.map(a => a.id === app.id ? {...a, status: e.target.value} : a))} style={{ background: `${statusColors[app.status]}18`, color: statusColors[app.status], border: `1px solid ${statusColors[app.status]}44`, borderRadius: 8, padding: "5px 10px", fontSize: 12 }}>
                    <option value="submitted">Submitted</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SECTION: DAILY CALENDAR
   ============================================================ */
function CalendarSection({ state, dispatch }) {
  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay()]);
  const calEvents = state.calEvents;
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", startHour: 9, duration: 60, color: "#a855f7", type: "other" });
  const [editingId, setEditingId] = useState(null);
  const [editDuration, setEditDuration] = useState(60);

  const typeColors = { school: "#3b82f6", gym: "#22c55e", work: "#f59e0b", personal: "#ec4899", other: "#a855f7", sleep: "#1e3a5f" };

  const addEvent = () => {
    if (!newEvent.title.trim()) return;
    dispatch({ type: 'ADD_CAL_EVENT', event: { ...newEvent, id: Date.now(), day: selectedDay } });
    setNewEvent({ title: "", startHour: 9, duration: 60, color: typeColors[newEvent.type] || "#a855f7", type: "other" });
    setShowAddEvent(false);
  };

  const removeEvent = (id) => dispatch({ type: 'REMOVE_CAL_EVENT', id });

  // Build hours display
  const HOURS_START = 6;
  const HOURS_END = 24;
  const HOUR_HEIGHT = 60; // px per hour

  const dayLawClasses = (LAW_SCHEDULE[selectedDay] || []).filter(
    c => !state.cancelledClasses.includes(`${selectedDay}-${c.name}`)
  );
  const cancelledToday = (LAW_SCHEDULE[selectedDay] || []).filter(
    c => state.cancelledClasses.includes(`${selectedDay}-${c.name}`)
  );
  const dayEvents = calEvents.filter(e => e.day === selectedDay);

  // Combine law classes + custom events for this day
  const allBlocks = [
    ...dayLawClasses.map(c => ({ id: `law-${c.name}`, title: c.name, startHour: c.startHour, duration: c.duration, color: c.color, type: "school", room: c.room, isClass: true })),
    ...dayEvents,
  ].sort((a, b) => a.startHour - b.startHour);

  const fmt = (h) => {
    const hr = Math.floor(h);
    const min = Math.round((h - hr) * 60);
    const ampm = hr >= 12 ? "PM" : "AM";
    const d = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
    return `${d}:${min.toString().padStart(2,"0")} ${ampm}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="📅" title="Daily Calendar" sub="Plan your day hour by hour" />

      {/* Day selector */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {DAYS.map(d => {
          const hasClasses = (LAW_SCHEDULE[d] || []).length > 0;
          const isToday = d === DAYS[new Date().getDay()];
          return (
            <button key={d} onClick={() => setSelectedDay(d)} style={{ background: selectedDay === d ? "#a855f722" : "transparent", color: selectedDay === d ? "#c084fc" : "#55558a", border: `1px solid ${selectedDay === d ? "#a855f740" : "#1e1e3e"}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1, fontWeight: selectedDay === d ? 800 : 400, position: "relative", transition: "all 0.15s" }}>
              {d.slice(0, 3).toUpperCase()}
              {isToday && <div style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8, borderRadius: "50%", background: "#a855f7", border: "2px solid #070710" }} />}
              {hasClasses && <div style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "#3b82f6" }} />}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Calendar column */}
        <div style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: "1px solid #1e1e3e", borderRadius: 18, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #1e1e3e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800, color: "#f0f0ff", fontFamily: "'Rajdhani',sans-serif", fontSize: 18, letterSpacing: 2 }}>{selectedDay.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: "#55558a" }}>{allBlocks.length} blocks scheduled · {dayLawClasses.length} classes</div>
            </div>
            <Btn onClick={() => setShowAddEvent(!showAddEvent)} color="#a855f7" style={{ padding: "7px 14px", fontSize: 12 }}>+ Add Block</Btn>
          </div>

          {/* Timeline */}
          <div style={{ padding: "0 0 20px", position: "relative", overflowY: "auto", maxHeight: 600 }}>
            {Array.from({ length: HOURS_END - HOURS_START }).map((_, i) => {
              const hour = HOURS_START + i;
              const label = hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`;
              return (
                <div key={hour} style={{ display: "flex", height: HOUR_HEIGHT, borderBottom: "1px solid #1a1a2e", position: "relative" }}>
                  <div style={{ width: 60, flexShrink: 0, padding: "6px 12px 0", fontSize: 10, color: "#33336a", textAlign: "right", borderRight: "1px solid #1a1a2e" }}>{label}</div>
                  <div style={{ flex: 1, position: "relative" }} />
                </div>
              );
            })}

            {/* Adderall IR cutoff line */}
            {(() => {
              const todayStr = new Date().toISOString().split("T")[0];
              const todayLog = selectedDay === ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()]
                ? state.adderallLog.find(l => l.date === todayStr)
                : null;
              if (!todayLog) return null;
              // Latest safe IR = bedtime minus 6 hours
              const bedtime = calcBedtime(state.wakeUpTime);
              const [bH, bM, bP] = bedtime.match(/(\d+):(\d+) (AM|PM)/).slice(1);
              const bedMins = (+bH % 12 + (bP === "PM" ? 12 : 0)) * 60 + +bM;
              const latestIrMins = ((bedMins - 360) + 1440) % 1440; // 6h before bed
              const latestIrHour = latestIrMins / 60;
              const topPx = (latestIrHour - HOURS_START) * HOUR_HEIGHT;
              if (topPx < 0 || topPx > (HOURS_END - HOURS_START) * HOUR_HEIGHT) return null;
              const displayH = Math.floor(latestIrMins / 60);
              const displayM = latestIrMins % 60;
              const dH = displayH > 12 ? displayH - 12 : displayH === 0 ? 12 : displayH;
              const dP = displayH >= 12 ? "PM" : "AM";
              const label = `${dH}:${displayM.toString().padStart(2,"0")} ${dP}`;
              return (
                <div key="ir-cutoff" style={{ position: "absolute", left: 60, right: 0, top: topPx, zIndex: 10, pointerEvents: "none" }}>
                  <div style={{ height: 2, background: "linear-gradient(90deg, #ef4444, #ef444488)", boxShadow: "0 0 8px #ef4444aa" }} />
                  <div style={{ position: "absolute", right: 10, top: -18, background: "#ef4444", color: "#fff", borderRadius: "6px 6px 0 6px", padding: "2px 8px", fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" }}>
                    ⚠️ LATEST IR: {label}
                  </div>
                </div>
              );
            })()}

            {/* Event blocks overlaid */}
            {allBlocks.map(block => {
              const top = (block.startHour - HOURS_START) * HOUR_HEIGHT;
              const height = Math.max((block.duration / 60) * HOUR_HEIGHT, 28);
              return (
                <div key={block.id} style={{ position: "absolute", left: 68, right: 12, top, height, background: `${block.color}22`, border: `1px solid ${block.color}55`, borderRadius: 8, padding: "5px 10px", overflow: "hidden", cursor: "default", borderLeft: `3px solid ${block.color}` }}>
                  <div style={{ fontWeight: 700, color: "#f0f0ff", fontSize: 12, lineHeight: 1.3 }}>{block.title}</div>
                  <div style={{ fontSize: 10, color: block.color, marginTop: 2 }}>{fmt(block.startHour)} · {block.duration}min{block.room ? ` · ${block.room}` : ""}</div>
                  {!block.isClass && (
                    <button onClick={() => removeEvent(block.id)} style={{ position: "absolute", top: 4, right: 4, background: "transparent", border: "none", color: "#55558a", cursor: "pointer", fontSize: 11, lineHeight: 1 }}>✕</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel: add form + day summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {showAddEvent && (
            <Card accent="#a855f7">
              <div style={{ fontSize: 11, color: "#a855f7", letterSpacing: 2, fontFamily: "'Rajdhani',sans-serif", marginBottom: 14 }}>ADD TIME BLOCK</div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>TITLE</div>
                <Input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="e.g. Study Contracts" />
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>TYPE</div>
                <Select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value, color: typeColors[e.target.value]})} style={{ width: "100%" }}>
                  <option value="school">📚 School</option>
                  <option value="gym">💪 Gym</option>
                  <option value="work">💼 Work</option>
                  <option value="personal">🙋 Personal</option>
                  <option value="other">✨ Other</option>
                </Select>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>START TIME</div>
                <input type="range" min={6} max={23} step={0.5} value={newEvent.startHour} onChange={e => setNewEvent({...newEvent, startHour: +e.target.value})} style={{ width: "100%", accentColor: "#a855f7" }} />
                <div style={{ fontSize: 12, color: "#a855f7", textAlign: "center", marginTop: 4, fontWeight: 700 }}>{fmt(newEvent.startHour)}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 5 }}>DURATION (minutes)</div>
                <input type="range" min={15} max={240} step={15} value={newEvent.duration} onChange={e => setNewEvent({...newEvent, duration: +e.target.value})} style={{ width: "100%", accentColor: "#a855f7" }} />
                <div style={{ fontSize: 12, color: "#a855f7", textAlign: "center", marginTop: 4, fontWeight: 700 }}>{newEvent.duration >= 60 ? `${Math.floor(newEvent.duration/60)}h ${newEvent.duration%60 > 0 ? newEvent.duration%60 + "m" : ""}` : `${newEvent.duration}m`}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={addEvent} color="#a855f7" style={{ flex: 1 }}>Add Block</Btn>
                <Btn onClick={() => setShowAddEvent(false)} color="#a855f7" variant="outline">✕</Btn>
              </div>
            </Card>
          )}

          {/* Day Summary */}
          <Card accent="#1e3a5f" style={{ background: "linear-gradient(145deg, #0a0d1c, #0d1428)" }}>
            <div style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 2, fontFamily: "'Rajdhani',sans-serif", marginBottom: 14 }}>DAY SUMMARY</div>
            {cancelledToday.length > 0 && cancelledToday.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, padding: "7px 10px", background: "#ef444410", borderRadius: 8, borderLeft: "3px solid #ef4444", alignItems: "center" }}>
                <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 700, whiteSpace: "nowrap", minWidth: 65 }}>{c.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, textDecoration: "line-through" }}>{c.name}</div>
                  <div style={{ fontSize: 9, color: "#44446a" }}>CANCELLED</div>
                </div>
                <button onClick={() => dispatch({ type: "RESTORE_CLASS", key: `${selectedDay}-${c.name}` })} style={{ fontSize: 9, color: "#22c55e", background: "#22c55e15", border: "1px solid #22c55e33", borderRadius: 5, padding: "3px 7px", cursor: "pointer" }}>Restore</button>
              </div>
            ))}
            {allBlocks.length === 0 ? (
              <div style={{ color: "#33336a", fontSize: 13, textAlign: "center", padding: "16px 0" }}>Nothing scheduled yet.<br/>Add some time blocks!</div>
            ) : allBlocks.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, padding: "8px 10px", background: `${b.color}0e`, borderRadius: 8, borderLeft: `3px solid ${b.color}` }}>
                <div style={{ fontSize: 11, color: b.color, fontWeight: 700, whiteSpace: "nowrap", minWidth: 65 }}>{fmt(b.startHour)}</div>
                <div>
                  <div style={{ fontSize: 12, color: "#e0e0ff", fontWeight: 700 }}>{b.title}</div>
                  <div style={{ fontSize: 10, color: "#44446a" }}>{b.duration}min{b.room ? ` · ${b.room}` : ""}</div>
                </div>
              </div>
            ))}
          </Card>

          {/* Time stats */}
          <Card accent="#22c55e">
            <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 2, fontFamily: "'Rajdhani',sans-serif", marginBottom: 12 }}>TIME BREAKDOWN</div>
            {["school","gym","work","personal","other"].map(type => {
              const mins = allBlocks.filter(b => b.type === type).reduce((a, b) => a + b.duration, 0);
              if (mins === 0) return null;
              return (
                <div key={type} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: typeColors[type], width: 60, textTransform: "uppercase", fontWeight: 700 }}>{type}</div>
                  <div style={{ flex: 1, background: "#0a0a18", borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min((mins / 480) * 100, 100)}%`, height: "100%", background: typeColors[type], borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 11, color: typeColors[type], width: 40, textAlign: "right" }}>{Math.floor(mins/60)}h{mins%60>0?`${mins%60}m`:""}</div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ACHIEVEMENTS DEFINITION
   ============================================================ */
const ACHIEVEMENTS = [
  // Streak
  { id: "streak_3", icon: "🔥", name: "First Fire", desc: "3-day freedom streak", cat: "streak", xp: 50 },
  { id: "streak_7", icon: "⚡", name: "One Week Clean", desc: "7-day freedom streak", cat: "streak", xp: 150 },
  { id: "streak_30", icon: "🛡️", name: "Month of Freedom", desc: "30-day streak", cat: "streak", xp: 500 },
  { id: "streak_90", icon: "👑", name: "90-Day Sovereign", desc: "90-day streak — this is the real you", cat: "streak", xp: 2000 },
  // Gym
  { id: "gym_1", icon: "💪", name: "First Rep", desc: "Log your first workout", cat: "gym", xp: 50 },
  { id: "gym_10", icon: "🏋️", name: "10 Sessions", desc: "10 workouts logged", cat: "gym", xp: 200 },
  { id: "gym_25", icon: "🦾", name: "Iron Regular", desc: "25 workouts logged", cat: "gym", xp: 400 },
  { id: "gym_ppl", icon: "🔄", name: "Full Cycle", desc: "Log Push, Pull and Legs in one week", cat: "gym", xp: 150 },
  // Sleep
  { id: "sleep_week", icon: "😴", name: "Sleep Week", desc: "7 nights averaging 7h+", cat: "sleep", xp: 200 },
  { id: "sleep_perfect", icon: "🌙", name: "Perfect Night", desc: "Log 8+ hours", cat: "sleep", xp: 75 },
  // Habits
  { id: "habit_week", icon: "✅", name: "Habit Week", desc: "Complete all habits 7 days in a row", cat: "habits", xp: 300 },
  { id: "water_month", icon: "💧", name: "Hydrated", desc: "Hit all 4 water bottles 30 days", cat: "habits", xp: 500 },
  // School
  { id: "tasks_10", icon: "📚", name: "Grind Started", desc: "Complete 10 tasks", cat: "school", xp: 100 },
  { id: "tasks_50", icon: "⚖️", name: "Law Machine", desc: "Complete 50 tasks", cat: "school", xp: 400 },
  { id: "apps_10", icon: "📤", name: "Hustle Mode", desc: "Submit 10 applications", cat: "school", xp: 200 },
  // Leveling
  { id: "level_5", icon: "🌟", name: "Level 5", desc: "Reach Level 5", cat: "level", xp: 0 },
  { id: "level_10", icon: "💫", name: "Level 10", desc: "Reach Level 10", cat: "level", xp: 0 },
];

/* ============================================================
   SECTION: BRAIN DUMP
   ============================================================ */
function BrainDumpSection({ state, dispatch }) {
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const textareaRef = useRef(null);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  const add = () => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;
    lines.forEach(line => {
      dispatch({ type: "ADD_BRAIN_DUMP", item: { id: Date.now() + Math.random(), text: line, ts: new Date().toISOString(), converted: false } });
    });
    setText("");
  };

  const convert = (id, category) => {
    dispatch({ type: "CONVERT_DUMP_TO_TASK", id, category });
  };

  const items = state.brainDump;
  const today = new Date().toISOString().split("T")[0];
  const todayItems = items.filter(i => i.ts.startsWith(today));
  const olderItems = items.filter(i => !i.ts.startsWith(today));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="🧠" title="Brain Dump" sub="Get it out of your head. Sort it later." />

      {/* Capture zone */}
      <div style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: "1px solid #a855f733", borderRadius: 20, padding: 24 }}>
        <div style={{ fontSize: 11, color: "#a855f7", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 14 }}>CAPTURE — ONE THOUGHT PER LINE</div>
        <textarea ref={textareaRef} value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && e.metaKey) add(); }}
          placeholder={"Read Property ch.5 before Thursday\nEmail Professor about office hours\nPick up groceries\nCall mom back\n..."}
          style={{ width: "100%", minHeight: 140, background: "#070710", border: "1px solid #2a2a4e", color: "#e0e0ff", borderRadius: 12, padding: "14px 16px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", resize: "vertical", lineHeight: 1.8, boxSizing: "border-box", outline: "none" }}
          onFocus={e => e.target.style.borderColor="#a855f7"}
          onBlur={e => e.target.style.borderColor="#2a2a4e"} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <span style={{ fontSize: 11, color: "#33336a" }}>Tip: one thought per line · Cmd+Enter to save</span>
          <Btn onClick={add} color="#a855f7" style={{ padding: "9px 28px" }}>DUMP IT 🧠</Btn>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        <StatTile icon="🧠" label="Total Captured" value={items.length} color="#a855f7" />
        <StatTile icon="📅" label="Added Today" value={todayItems.length} color="#f59e0b" />
        <StatTile icon="✅" label="Converted to Tasks" value={0} color="#22c55e" sub="process below" />
      </div>

      {/* Items */}
      {todayItems.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: "#f59e0b", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 12 }}>TODAY — NEEDS PROCESSING</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {todayItems.map(item => (
              <DumpItem key={item.id} item={item} onConvert={convert} onDelete={() => dispatch({ type: "DELETE_BRAIN_DUMP", id: item.id })} />
            ))}
          </div>
        </div>
      )}

      {olderItems.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: "#55558a", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 12 }}>OLDER</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {olderItems.map(item => (
              <DumpItem key={item.id} item={item} onConvert={convert} onDelete={() => dispatch({ type: "DELETE_BRAIN_DUMP", id: item.id })} />
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#33336a" }}>
          <div style={{ fontSize: 48 }}>🧠</div>
          <div style={{ marginTop: 12, fontSize: 14 }}>Your head is clear. Start dumping thoughts above.</div>
        </div>
      )}
    </div>
  );
}

function DumpItem({ item, onConvert, onDelete }) {
  const [showCats, setShowCats] = useState(false);
  const catColors = { school: "#3b82f6", gym: "#22c55e", work: "#f59e0b", personal: "#ec4899", other: "#8b5cf6" };
  const catIcons = { school: "📚", gym: "💪", work: "💼", personal: "🙋", other: "✨" };
  const ts = new Date(item.ts);
  const timeStr = ts.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: "1px solid #2a2a3e", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7", flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 14, color: "#e0e0ff", lineHeight: 1.4 }}>{item.text}</div>
      <div style={{ fontSize: 10, color: "#33336a", whiteSpace: "nowrap" }}>{timeStr}</div>
      <div style={{ display: "flex", gap: 6, position: "relative" }}>
        {!showCats ? (
          <button onClick={() => setShowCats(true)} style={{ background: "#22c55e18", color: "#22c55e", border: "1px solid #22c55e33", borderRadius: 7, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>→ Task</button>
        ) : (
          <div style={{ display: "flex", gap: 4 }}>
            {Object.entries(catColors).map(([cat, color]) => (
              <button key={cat} onClick={() => { onConvert(item.id, cat); setShowCats(false); }} title={cat}
                style={{ background: `${color}22`, color, border: `1px solid ${color}44`, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>
                {catIcons[cat]}
              </button>
            ))}
            <button onClick={() => setShowCats(false)} style={{ background: "transparent", border: "none", color: "#55558a", cursor: "pointer", fontSize: 13 }}>✕</button>
          </div>
        )}
        <button onClick={onDelete} style={{ background: "#ef444415", color: "#ef4444", border: "1px solid #ef444428", borderRadius: 7, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>🗑</button>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION: HABITS + ADDERALL
   ============================================================ */
function HabitsSection({ state, dispatch }) {
  const [tab, setTab] = useState("habits");
  const today = new Date().toISOString().split("T")[0];
  const todayLabel = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

  // ── HABITS ──
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", icon: "⭐", color: "#a855f7" });

  const toggleHabit = (id) => dispatch({ type: "TOGGLE_HABIT", id });
  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    dispatch({ type: "ADD_HABIT", habit: { id: Date.now(), name: newHabit.name, icon: newHabit.icon, color: newHabit.color, completedDates: [] } });
    setNewHabit({ name: "", icon: "⭐", color: "#a855f7" });
    setShowAddHabit(false);
  };

  // Build last 14 days for streak grid
  const last14 = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split("T")[0];
  });

  const todayDone = state.habits.filter(h => h.completedDates.includes(today)).length;
  const totalHabits = state.habits.length;

  // Water specifically — count completed water habits today
  const waterHabits = state.habits.filter(h => h.name.includes("Bottle #"));
  const waterDone = waterHabits.filter(h => h.completedDates.includes(today)).length;

  // ── ADDERALL ──
  const [erTime, setErTime] = useState("8:00");
  const [irTime, setIrTime] = useState("13:30");
  const [notes, setNotes] = useState("");

  const logAdderall = () => {
    dispatch({ type: "LOG_ADDERALL", entry: { id: Date.now(), date: today, erTime, irTime, notes } });
    setNotes("");
  };

  // IR cutoff warning — if IR time is within 6h of bedtime
  const bedtime = calcBedtime(state.wakeUpTime);
  const [bedH, bedM, bedP] = bedtime.match(/(\d+):(\d+) (AM|PM)/).slice(1);
  let bedMinutes = (+bedH % 12 + (bedP === "PM" ? 12 : 0)) * 60 + +bedM;
  const irParts = irTime.split(":").map(Number);
  const irMinutes = irParts[0] * 60 + irParts[1];
  const minutesBeforeBed = ((bedMinutes - irMinutes) + 1440) % 1440;
  const irTooLate = minutesBeforeBed < 360; // 6 hours

  const emojiOptions = ["⭐","🏃","📖","💧","🧘","🍎","🧹","🪥","🛏️","💊","☀️","🌙","🎯","🔔"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="✅" title="Habits & Health" sub="Daily habits + medication tracking" />

      <div style={{ display: "flex", gap: 8 }}>
        <TabBtn active={tab === "habits"} onClick={() => setTab("habits")} accent="#22c55e">✅ Daily Habits</TabBtn>
        <TabBtn active={tab === "adderall"} onClick={() => setTab("adderall")} accent="#3b82f6">💊 Adderall Log</TabBtn>
      </div>

      {tab === "habits" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Today summary */}
          <div style={{ background: "linear-gradient(135deg, #0a1208, #0d1c0d)", border: "1px solid #22c55e33", borderRadius: 18, padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif" }}>TODAY · {todayLabel.toUpperCase()}</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: todayDone === totalHabits ? "#22c55e" : "#f0f0ff", fontFamily: "'Rajdhani',sans-serif", lineHeight: 1.1, marginTop: 4 }}>
                {todayDone}<span style={{ fontSize: 20, color: "#44446a" }}>/{totalHabits}</span>
              </div>
              <div style={{ fontSize: 12, color: "#55558a", marginTop: 4 }}>habits complete</div>
            </div>
            {/* Water meter */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 2, marginBottom: 10 }}>WATER</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                {[4,3,2,1].map(n => (
                  <div key={n} style={{ width: 36, height: 18, borderRadius: 6, background: waterDone >= n ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "#1a1a2e", border: `1px solid ${waterDone >= n ? "#3b82f655" : "#2a2a4e"}`, transition: "all 0.3s", boxShadow: waterDone >= n ? "0 0 8px #3b82f666" : "none" }} />
                ))}
              </div>
              <div style={{ fontSize: 12, color: "#3b82f6", marginTop: 6, fontWeight: 800 }}>{waterDone}/4</div>
            </div>
            {/* Ring */}
            <div style={{ position: "relative", width: 80, height: 80 }}>
              <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="40" cy="40" r="34" fill="none" stroke="#1a1a2e" strokeWidth="8" />
                <circle cx="40" cy="40" r="34" fill="none" stroke={todayDone === totalHabits ? "#22c55e" : "#a855f7"} strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - todayDone / Math.max(totalHabits, 1))}`}
                  strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#f0f0ff" }}>
                {Math.round((todayDone / Math.max(totalHabits, 1)) * 100)}%
              </div>
            </div>
          </div>

          {/* Habits list */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {state.habits.map(habit => {
              const done = habit.completedDates.includes(today);
              const streak = (() => {
                let s = 0;
                let d = new Date();
                while (true) {
                  const key = d.toISOString().split("T")[0];
                  if (habit.completedDates.includes(key)) { s++; d.setDate(d.getDate() - 1); }
                  else break;
                }
                return s;
              })();
              return (
                <div key={habit.id} onClick={() => toggleHabit(habit.id)}
                  style={{ background: done ? `${habit.color}18` : "linear-gradient(145deg, #0d0d1c, #141428)", border: `2px solid ${done ? habit.color : "#1e1e3e"}`, borderRadius: 16, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}>
                  {done && <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 28px 28px 0", borderColor: `transparent ${habit.color} transparent transparent` }} />}
                  {done && <div style={{ position: "absolute", top: 2, right: 3, fontSize: 10, color: "#fff", fontWeight: 900 }}>✓</div>}
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{habit.icon}</div>
                  <div style={{ fontWeight: 700, color: done ? habit.color : "#e0e0ff", fontSize: 14 }}>{habit.name}</div>
                  {streak > 1 && <div style={{ fontSize: 11, color: habit.color, marginTop: 4 }}>🔥 {streak} day streak</div>}
                </div>
              );
            })}
            <div onClick={() => setShowAddHabit(true)} style={{ background: "transparent", border: "2px dashed #2a2a4e", borderRadius: 16, padding: "18px 20px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", minHeight: 100 }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#a855f7"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#2a2a4e"}>
              <div style={{ fontSize: 28, color: "#33336a" }}>+</div>
              <div style={{ fontSize: 12, color: "#33336a" }}>Add Habit</div>
            </div>
          </div>

          {showAddHabit && (
            <Card accent="#a855f7">
              <div style={{ fontSize: 11, color: "#a855f7", letterSpacing: 2, fontFamily: "'Rajdhani',sans-serif", marginBottom: 14 }}>NEW HABIT</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginBottom: 12 }}>
                <Input value={newHabit.name} onChange={e => setNewHabit({...newHabit, name: e.target.value})} placeholder="e.g. Stretch for 10 mins" />
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {["#a855f7","#3b82f6","#22c55e","#f59e0b","#ef4444","#ec4899"].map(c => (
                    <div key={c} onClick={() => setNewHabit({...newHabit, color: c})} style={{ width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer", border: newHabit.color === c ? "3px solid #fff" : "2px solid transparent", flexShrink: 0 }} />
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, color: "#44446a", letterSpacing: 2, marginBottom: 8 }}>ICON</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {emojiOptions.map(e => (
                    <div key={e} onClick={() => setNewHabit({...newHabit, icon: e})} style={{ width: 36, height: 36, borderRadius: 8, background: newHabit.icon === e ? "#a855f722" : "#0a0a18", border: `1px solid ${newHabit.icon === e ? "#a855f7" : "#1e1e3e"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>{e}</div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={addHabit} color="#a855f7">Add Habit</Btn>
                <Btn onClick={() => setShowAddHabit(false)} color="#a855f7" variant="outline">Cancel</Btn>
              </div>
            </Card>
          )}

          {/* 14-day grid */}
          <Card accent="#22c55e">
            <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 16 }}>14-DAY HABIT GRID</div>
            <div style={{ display: "grid", gridTemplateColumns: `120px repeat(14, 1fr)`, gap: 4 }}>
              <div />
              {last14.map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 9, color: "#33336a" }}>
                  {new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
                </div>
              ))}
              {state.habits.map(habit => (
                <>
                  <div key={habit.id + "label"} style={{ fontSize: 12, color: "#8888aa", display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{habit.icon}</span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 90 }}>{habit.name}</span>
                  </div>
                  {last14.map(d => (
                    <div key={d} style={{ height: 22, borderRadius: 5, background: habit.completedDates.includes(d) ? habit.color : "#0a0a18", border: `1px solid ${habit.completedDates.includes(d) ? habit.color + "66" : "#1a1a2e"}`, transition: "all 0.2s" }} />
                  ))}
                </>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "adderall" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card accent="#3b82f6">
            <div style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 18 }}>LOG TODAY'S DOSES</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 2, marginBottom: 8 }}>15MG XR — MORNING DOSE</div>
                <div style={{ background: "#3b82f615", border: "1px solid #3b82f630", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: "#3b82f6", marginBottom: 8 }}>Extended Release · ~8–10hr duration</div>
                  <input type="time" value={erTime} onChange={e => setErTime(e.target.value)}
                    style={{ background: "#0a0a18", border: "1px solid #1e1e3e", color: "#e0e0ff", borderRadius: 8, padding: "8px 12px", fontSize: 15, fontWeight: 700, width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 2, marginBottom: 8 }}>10MG IR — AFTERNOON DOSE</div>
                <div style={{ background: irTooLate ? "#ef444415" : "#a855f715", border: `1px solid ${irTooLate ? "#ef444430" : "#a855f730"}`, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: irTooLate ? "#ef4444" : "#a855f7", marginBottom: 8 }}>
                    {irTooLate ? `⚠️ Too close to bedtime (${bedtime})` : "Instant Release · ~4–5hr duration"}
                  </div>
                  <input type="time" value={irTime} onChange={e => setIrTime(e.target.value)}
                    style={{ background: "#0a0a18", border: `1px solid ${irTooLate ? "#ef444455" : "#1e1e3e"}`, color: irTooLate ? "#ef4444" : "#e0e0ff", borderRadius: 8, padding: "8px 12px", fontSize: 15, fontWeight: 700, width: "100%", boxSizing: "border-box" }} />
                  {irTooLate && (
                    <div style={{ fontSize: 11, color: "#ef4444", marginTop: 8, lineHeight: 1.5 }}>
                      IR will still be active at your {bedtime} bedtime. Consider taking it earlier.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 2, marginBottom: 6 }}>NOTES (optional)</div>
              <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Felt focused, took IR a bit late..." />
            </div>
            <Btn onClick={logAdderall} color="#3b82f6" style={{ width: "100%", fontWeight: 900 }}>💊 LOG TODAY'S DOSES</Btn>
          </Card>

          {/* Timeline */}
          <Card accent="#3b82f6">
            <div style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 16 }}>DOSE HISTORY</div>
            {state.adderallLog.length === 0 ? (
              <div style={{ color: "#33336a", fontSize: 13 }}>No doses logged yet.</div>
            ) : [...state.adderallLog].reverse().map((log, i) => {
              const logIrH = log.irTime ? parseInt(log.irTime) : 0;
              const logIrM = log.irTime ? parseInt(log.irTime.split(":")[1]) : 0;
              const logIrMins = logIrH * 60 + logIrM;
              const tooLate = ((bedMinutes - logIrMins) + 1440) % 1440 < 360;
              return (
                <div key={log.id || i} style={{ display: "flex", gap: 14, marginBottom: 12, padding: "12px 16px", background: "#0a0a18", borderRadius: 12, border: `1px solid ${tooLate ? "#ef444428" : "#1e1e3e"}` }}>
                  <div style={{ fontSize: 11, color: "#55558a", whiteSpace: "nowrap", minWidth: 80 }}>{log.date}</div>
                  <div style={{ display: "flex", gap: 12, flex: 1, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} />
                      <span style={{ fontSize: 12, color: "#e0e0ff" }}>XR: {fmt24(log.erTime)}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: tooLate ? "#ef4444" : "#a855f7" }} />
                      <span style={{ fontSize: 12, color: tooLate ? "#ef4444" : "#e0e0ff" }}>IR: {fmt24(log.irTime)} {tooLate ? "⚠️" : ""}</span>
                    </div>
                    {log.notes && <span style={{ fontSize: 11, color: "#55558a", fontStyle: "italic" }}>"{log.notes}"</span>}
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SECTION: ACHIEVEMENTS
   ============================================================ */
function AchievementsSection({ state, dispatch }) {
  const totalXp = totalXP(state);
  const catFilter = ["all","streak","gym","sleep","habits","school","level"];
  const [filter, setFilter] = useState("all");

  const catColors = { streak: "#ef4444", gym: "#22c55e", sleep: "#3b82f6", habits: "#f59e0b", school: "#a855f7", level: "#f59e0b" };

  const check = (id) => state.achievements.includes(id);
  const filtered = filter === "all" ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.cat === filter);

  const earned = ACHIEVEMENTS.filter(a => check(a.id)).length;
  const totalXpFromAch = ACHIEVEMENTS.filter(a => check(a.id)).reduce((sum, a) => sum + a.xp, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="🏆" title="Achievements" sub="Milestones that prove you put in the work" />

      {/* Summary */}
      <div style={{ background: "linear-gradient(135deg, #100a08, #0d0d1c)", border: "1px solid #f59e0b33", borderRadius: 20, padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: "#f59e0b", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif" }}>YOUR ACHIEVEMENTS</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#f0f0ff", fontFamily: "'Rajdhani',sans-serif", lineHeight: 1, marginTop: 4 }}>
            {earned}<span style={{ fontSize: 20, color: "#44446a" }}>/{ACHIEVEMENTS.length}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#44446a" }}>XP from achievements</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#f59e0b", fontFamily: "'Rajdhani',sans-serif" }}>{totalXpFromAch}</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {catFilter.map(f => (
          <TabBtn key={f} active={filter === f} onClick={() => setFilter(f)} accent={catColors[f] || "#a855f7"}>
            {f.toUpperCase()}
          </TabBtn>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {filtered.map(ach => {
          const done = check(ach.id);
          const color = catColors[ach.cat] || "#a855f7";
          return (
            <div key={ach.id} style={{ background: done ? `linear-gradient(145deg, ${color}18, ${color}08)` : "linear-gradient(145deg, #0d0d1c, #141428)", border: `1px solid ${done ? color + "55" : "#1e1e3e"}`, borderRadius: 16, padding: "18px 20px", position: "relative", overflow: "hidden", transition: "all 0.2s", opacity: done ? 1 : 0.5 }}>
              {done && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, ${color}44)` }} />}
              <div style={{ fontSize: 34, marginBottom: 10, filter: done ? "none" : "grayscale(1)" }}>{ach.icon}</div>
              <div style={{ fontWeight: 800, color: done ? "#f0f0ff" : "#44446a", fontSize: 14, marginBottom: 4 }}>{ach.name}</div>
              <div style={{ fontSize: 12, color: "#44446a", lineHeight: 1.4, marginBottom: 10 }}>{ach.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {ach.xp > 0 && <Chip color={done ? color : "#33336a"}>+{ach.xp} XP</Chip>}
                {done ? <span style={{ fontSize: 11, color, fontWeight: 800 }}>✓ EARNED</span> : <span style={{ fontSize: 11, color: "#22224a" }}>LOCKED</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   SECTION: WEEKLY REVIEW
   ============================================================ */
function WeeklyReviewSection({ state }) {
  const now = new Date();
  const isSunday = now.getDay() === 0;
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
  const weekLabel = `Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  // Sunday-only gate
  if (!isSunday) {
    const daysUntilSunday = 7 - now.getDay();
    const nextSunday = new Date(now); nextSunday.setDate(now.getDate() + daysUntilSunday);
    const nextSundayLabel = nextSunday.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <SectionTitle icon="📊" title="Weekly Review" sub="Opens on Sundays" />
        <div style={{ background: "linear-gradient(135deg, #100820, #0d0d1c)", border: "1px solid #a855f733", borderRadius: 22, padding: "60px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 64 }}>📊</div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 28, fontWeight: 900, color: "#f0f0ff", marginTop: 20, letterSpacing: 2 }}>WEEKLY REVIEW</div>
          <div style={{ fontSize: 14, color: "#55558a", marginTop: 10, lineHeight: 1.7 }}>
            This unlocks every Sunday — your dedicated reflection time.<br />
            Come back to review your week, grade yourself honestly,<br />and set your intention for the week ahead.
          </div>
          <div style={{ marginTop: 28, display: "inline-block", background: "#a855f718", border: "1px solid #a855f733", borderRadius: 14, padding: "16px 32px" }}>
            <div style={{ fontSize: 11, color: "#6666aa", letterSpacing: 3, marginBottom: 6 }}>NEXT REVIEW</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#a855f7", fontFamily: "'Rajdhani',sans-serif" }}>{nextSundayLabel}</div>
            <div style={{ fontSize: 12, color: "#44446a", marginTop: 4 }}>in {daysUntilSunday} day{daysUntilSunday !== 1 ? "s" : ""}</div>
          </div>
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, maxWidth: 500, margin: "24px auto 0" }}>
            {[
              { icon: "💪", label: "Workouts", val: state.workouts.length },
              { icon: "🔥", label: "Streak", val: `${state.currentStreak}d` },
              { icon: "⚡", label: "Total XP", val: totalXP(state) },
            ].map(s => (
              <div key={s.label} style={{ background: "#0a0a18", borderRadius: 12, padding: "14px 0", textAlign: "center" }}>
                <div style={{ fontSize: 22 }}>{s.icon}</div>
                <div style={{ fontWeight: 900, fontSize: 20, color: "#a855f7", fontFamily: "'Rajdhani',sans-serif" }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "#44446a" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Tasks this week (approx — all completed)
  const doneTasks = state.tasks.filter(t => t.done).length;
  const pendingTasks = state.tasks.filter(t => !t.done).length;

  // Workouts this week
  const weekWorkouts = state.workouts.filter(w => {
    const d = new Date(w.date);
    return d >= weekStart;
  });

  // Sleep avg last 7 days
  const last7Sleep = state.sleepHistory.slice(-7);
  const avgSleep = last7Sleep.length ? (last7Sleep.reduce((a, b) => a + b.hours, 0) / last7Sleep.length).toFixed(1) : 0;
  const goodNights = last7Sleep.filter(s => s.hours >= 7).length;

  // Habits this week
  const today = new Date().toISOString().split("T")[0];
  const weekDays = Array.from({length: 7}).map((_, i) => { const d = new Date(weekStart); d.setDate(d.getDate()+i); return d.toISOString().split("T")[0]; });
  const habitCompletions = state.habits.reduce((sum, h) => sum + weekDays.filter(d => h.completedDates.includes(d)).length, 0);
  const maxHabitCompletions = state.habits.length * 7;

  // XP this week (rough — show total)
  const totalXpVal = totalXP(state);

  // Streak
  const streakGood = state.currentStreak >= 7;

  // Water this week
  const waterHabits = state.habits.filter(h => h.name.includes("Bottle #"));
  const waterDaysComplete = weekDays.filter(d => waterHabits.every(h => h.completedDates.includes(d))).length;

  const grades = {
    sleep: avgSleep >= 8 ? "A" : avgSleep >= 7 ? "B" : avgSleep >= 6 ? "C" : "D",
    gym: weekWorkouts.length >= 3 ? "A" : weekWorkouts.length >= 2 ? "B" : weekWorkouts.length >= 1 ? "C" : "D",
    tasks: doneTasks >= 10 ? "A" : doneTasks >= 7 ? "B" : doneTasks >= 4 ? "C" : "D",
    habits: habitCompletions / Math.max(maxHabitCompletions, 1) >= 0.8 ? "A" : habitCompletions / Math.max(maxHabitCompletions, 1) >= 0.6 ? "B" : "C",
    streak: streakGood ? "A" : state.currentStreak >= 3 ? "B" : state.currentStreak >= 1 ? "C" : "D",
  };

  const gradeColor = (g) => g === "A" ? "#22c55e" : g === "B" ? "#a3e635" : g === "C" ? "#f59e0b" : "#ef4444";

  const overallScore = Object.values(grades).reduce((sum, g) => sum + (g === "A" ? 4 : g === "B" ? 3 : g === "C" ? 2 : 1), 0) / 5;
  const overallGrade = overallScore >= 3.5 ? "A" : overallScore >= 2.5 ? "B" : overallScore >= 1.5 ? "C" : "D";

  const messages = {
    A: "You had an elite week. This is who you're becoming — lock it in.",
    B: "Strong week. A few things slipped but the foundation is solid. Build on it.",
    C: "Average week. Something held you back — figure out what and address it Sunday.",
    D: "Rough week. But you're here reviewing it, which means you haven't quit. Reset Monday.",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="📊" title="Weekly Review" sub={weekLabel} />

      {/* Overall grade */}
      <div style={{ background: `linear-gradient(135deg, ${gradeColor(overallGrade)}15, #0d0d1c)`, border: `1px solid ${gradeColor(overallGrade)}33`, borderRadius: 22, padding: "28px 32px", display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 90, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif", color: gradeColor(overallGrade), lineHeight: 1 }}>{overallGrade}</div>
          <div style={{ fontSize: 11, color: "#44446a", letterSpacing: 2 }}>OVERALL</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ff", marginBottom: 10 }}>Week Summary</div>
          <div style={{ fontSize: 14, color: "#8888aa", lineHeight: 1.7 }}>{messages[overallGrade]}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <Chip color="#a855f7" size="md">+{totalXpVal} TOTAL XP</Chip>
            <Chip color="#ef4444" size="md">🔥 {state.currentStreak} DAY STREAK</Chip>
            <Chip color="#22c55e" size="md">LVL {state.level}</Chip>
          </div>
        </div>
      </div>

      {/* Category grades */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
        {[
          { key: "sleep", icon: "💤", label: "Sleep", detail: `${avgSleep}h avg · ${goodNights}/7 good nights` },
          { key: "gym", icon: "💪", label: "Gym", detail: `${weekWorkouts.length} workouts this week` },
          { key: "tasks", icon: "✅", label: "Tasks", detail: `${doneTasks} done · ${pendingTasks} pending` },
          { key: "habits", icon: "🔁", label: "Habits", detail: `${habitCompletions}/${maxHabitCompletions} completions` },
          { key: "streak", icon: "🛡️", label: "Freedom", detail: `${state.currentStreak} day streak` },
        ].map(({ key, icon, label, detail }) => (
          <div key={key} style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: `1px solid ${gradeColor(grades[key])}33`, borderRadius: 16, padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 24 }}>{icon}</div>
            <div style={{ fontSize: 42, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif", color: gradeColor(grades[key]), lineHeight: 1, marginTop: 6 }}>{grades[key]}</div>
            <div style={{ fontSize: 12, color: "#8888aa", marginTop: 4 }}>{label}</div>
            <div style={{ fontSize: 10, color: "#33336a", marginTop: 6, lineHeight: 1.4 }}>{detail}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card accent="#3b82f6">
          <div style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 16 }}>SLEEP THIS WEEK</div>
          <SvgBarChart data={last7Sleep} dataKey="hours" height={140} yMax={10}
            colorFn={e => e.hours>=8?"#22c55e":e.hours>=7?"#a3e635":e.hours>=6?"#f59e0b":"#ef4444"}
            formatX={d => d.slice(-3)} />
        </Card>
        <Card accent="#22c55e">
          <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 16 }}>WORKOUTS THIS WEEK</div>
          {weekWorkouts.length === 0 ? (
            <div style={{ color: "#33336a", fontSize: 13, textAlign: "center", padding: "30px 0" }}>No workouts logged this week yet.</div>
          ) : weekWorkouts.map((w, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, padding: "8px 12px", background: "#22c55e0a", borderRadius: 8 }}>
              <Chip color={{ Push: "#a855f7", Pull: "#3b82f6", Legs: "#22c55e" }[w.type] || "#22c55e"}>{w.type}</Chip>
              <span style={{ fontSize: 12, color: "#8888aa" }}>{w.date}</span>
              <span style={{ fontSize: 12, color: "#22c55e", marginLeft: "auto" }}>{w.exercises.length} exercises</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Next week focus */}
      <Card accent="#a855f7">
        <div style={{ fontSize: 11, color: "#a855f7", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 16 }}>NEXT WEEK — SET YOUR INTENTION</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[
            { label: "Gym target", icon: "💪", current: `${weekWorkouts.length} sessions`, target: "3 sessions" },
            { label: "Sleep target", icon: "💤", current: `${avgSleep}h avg`, target: "7.5h avg" },
            { label: "Freedom", icon: "🛡️", current: `${state.currentStreak} days`, target: `${state.currentStreak + 7} days` },
          ].map(item => (
            <div key={item.label} style={{ background: "#a855f710", border: "1px solid #a855f722", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 20 }}>{item.icon}</div>
              <div style={{ fontSize: 12, color: "#8888aa", marginTop: 6 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "#44446a", marginTop: 2 }}>This week: {item.current}</div>
              <div style={{ fontSize: 12, color: "#a855f7", fontWeight: 700, marginTop: 4 }}>Target: {item.target}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


/* ============================================================
   DAILY INTENTIONS + MAIN QUEST (combined Morning section)
   ============================================================ */
function MorningSection({ state, dispatch }) {
  const today = new Date().toISOString().split("T")[0];
  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const todayIntention = state.intentions.find(i => i.date === today);
  const [quest, setQuest] = useState(state.mainQuest?.text || "");
  const [win, setWin] = useState("");
  const [grateful, setGrateful] = useState("");
  const [health, setHealth] = useState("");
  const [saved, setSaved] = useState(false);

  const saveIntention = () => {
    if (!win && !grateful && !health) return;
    dispatch({ type: "ADD_INTENTION", entry: { id: Date.now(), date: today, win, grateful, health } });
    setSaved(true);
  };

  const setMainQuest = () => {
    if (!quest.trim()) return;
    dispatch({ type: "SET_MAIN_QUEST", quest: { text: quest, date: today, done: false } });
  };

  const mq = state.mainQuest;
  const mqIsToday = mq?.date === today;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="🌅" title="Morning Check-In" sub={todayLabel} />

      {/* Main Quest */}
      <div style={{ background: "linear-gradient(135deg, #0f0920, #0d0d1c)", border: "1px solid #a855f744", borderRadius: 20, padding: 28 }}>
        <div style={{ fontSize: 11, color: "#a855f7", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 6 }}>TODAY'S MAIN QUEST</div>
        <div style={{ fontSize: 13, color: "#44446a", marginBottom: 18 }}>The one thing that makes today a win.</div>
        {mqIsToday && mq ? (
          <div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ flex: 1, background: mq.done ? "#22c55e18" : "#a855f715", border: `1px solid ${mq.done ? "#22c55e44" : "#a855f744"}`, borderRadius: 14, padding: "18px 22px" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: mq.done ? "#22c55e" : "#f0f0ff", textDecoration: mq.done ? "line-through" : "none", lineHeight: 1.4 }}>{mq.text}</div>
              </div>
              {!mq.done && (
                <Btn onClick={() => dispatch({ type: "COMPLETE_MAIN_QUEST" })} color="#22c55e" style={{ padding: "14px 22px", fontSize: 13, flexShrink: 0 }}>✓ DONE<br/><span style={{fontSize:10}}>+300 XP</span></Btn>
              )}
              {mq.done && <div style={{ fontSize: 28 }}>🏆</div>}
            </div>
            {!mq.done && <button onClick={() => { dispatch({ type: "SET_MAIN_QUEST", quest: null }); setQuest(""); }} style={{ marginTop: 10, background: "none", border: "none", color: "#33336a", fontSize: 11, cursor: "pointer" }}>Change quest</button>}
            {mq.done && <div style={{ marginTop: 10, fontSize: 13, color: "#22c55e" }}>✅ Quest complete — +300 XP earned</div>}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <Input value={quest} onChange={e => setQuest(e.target.value)} placeholder="e.g. Finish Property outline through ch.5" onKeyDown={e => e.key === "Enter" && setMainQuest()} style={{ flex: 1 }} />
            <Btn onClick={setMainQuest} color="#a855f7" style={{ flexShrink: 0 }}>SET QUEST</Btn>
          </div>
        )}
      </div>

      {/* Daily intentions */}
      <Card accent="#f59e0b">
        <div style={{ fontSize: 11, color: "#f59e0b", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 18 }}>DAILY INTENTIONS · 2 MINUTES</div>
        {(todayIntention || saved) ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 13, color: "#22c55e", fontWeight: 700 }}>✓ Intentions set for today</div>
            {[
              { icon: "🎯", label: "Today I will", value: (todayIntention || {win}).win },
              { icon: "🙏", label: "Grateful for", value: (todayIntention || {grateful}).grateful },
              { icon: "💪", label: "Health intention", value: (todayIntention || {health}).health },
            ].map(item => item.value && (
              <div key={item.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 1 }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize: 14, color: "#e0e0ff", marginTop: 2 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 2, marginBottom: 6 }}>🎯 TODAY I WILL...</div>
              <Input value={win} onChange={e => setWin(e.target.value)} placeholder="The one thing I'll accomplish today" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 2, marginBottom: 6 }}>🙏 I'M GRATEFUL FOR...</div>
              <Input value={grateful} onChange={e => setGrateful(e.target.value)} placeholder="Something small counts" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 2, marginBottom: 6 }}>💪 MY HEALTH INTENTION TODAY...</div>
              <Input value={health} onChange={e => setHealth(e.target.value)} placeholder="e.g. Hit the gym, drink all 4 bottles, sleep by 11" />
            </div>
            <Btn onClick={saveIntention} color="#f59e0b" style={{ alignSelf: "flex-start" }}>SAVE INTENTIONS</Btn>
          </div>
        )}
      </Card>

      {/* Past intentions log */}
      {state.intentions.length > 1 && (
        <Card accent="#44446a">
          <div style={{ fontSize: 11, color: "#44446a", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 14 }}>PAST INTENTIONS</div>
          {[...state.intentions].reverse().slice(0, 5).map(entry => (
            <div key={entry.id} style={{ padding: "10px 0", borderBottom: "1px solid #1a1a2e" }}>
              <div style={{ fontSize: 10, color: "#33336a", marginBottom: 6 }}>{entry.date}</div>
              {entry.win && <div style={{ fontSize: 12, color: "#8888aa" }}>🎯 {entry.win}</div>}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

/* ============================================================
   MOOD / ENERGY LOG
   ============================================================ */
function MoodSection({ state, dispatch }) {
  const today = new Date().toISOString().split("T")[0];
  const todayLog = state.moodLog.find(m => m.date === today);
  const [energy, setEnergy] = useState(3);
  const [focus, setFocus] = useState(3);
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const log = () => {
    dispatch({ type: "LOG_MOOD", entry: { id: Date.now(), date: today, energy, focus, mood, note } });
    setSaved(true);
  };

  const last14 = state.moodLog.slice(-14);
  const avgEnergy = last14.length ? (last14.reduce((a, m) => a + m.energy, 0) / last14.length).toFixed(1) : "-";
  const avgFocus = last14.length ? (last14.reduce((a, m) => a + m.focus, 0) / last14.length).toFixed(1) : "-";
  const avgMood = last14.length ? (last14.reduce((a, m) => a + m.mood, 0) / last14.length).toFixed(1) : "-";

  const scaleLabels = { 1: "💀", 2: "😞", 3: "😐", 4: "😊", 5: "🔥" };
  const ScaleSelect = ({ value, onChange, color }) => (
    <div style={{ display: "flex", gap: 8 }}>
      {[1,2,3,4,5].map(n => (
        <div key={n} onClick={() => onChange(n)}
          style={{ width: 48, height: 48, borderRadius: 12, background: value === n ? `${color}22` : "#0a0a18", border: `2px solid ${value === n ? color : "#1e1e3e"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", transition: "all 0.15s" }}>
          {scaleLabels[n]}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle icon="📈" title="Mood & Energy" sub="Track your daily state. Find your patterns." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        <StatTile icon="⚡" label="Avg Energy" value={avgEnergy} color="#f59e0b" sub="last 14 days" />
        <StatTile icon="🧠" label="Avg Focus" value={avgFocus} color="#a855f7" sub="last 14 days" />
        <StatTile icon="😊" label="Avg Mood" value={avgMood} color="#22c55e" sub="last 14 days" />
      </div>

      {/* Daily log */}
      {(todayLog || saved) ? (
        <Card accent="#22c55e">
          <div style={{ fontSize: 13, color: "#22c55e", fontWeight: 700, marginBottom: 12 }}>✓ Logged for today</div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "Energy", value: (todayLog||{energy}).energy, color: "#f59e0b" },
              { label: "Focus", value: (todayLog||{focus}).focus, color: "#a855f7" },
              { label: "Mood", value: (todayLog||{mood}).mood, color: "#22c55e" },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32 }}>{scaleLabels[item.value]}</div>
                <div style={{ fontSize: 11, color: item.color, marginTop: 4 }}>{item.label}: {item.value}/5</div>
              </div>
            ))}
          </div>
          {(todayLog?.note || note) && <div style={{ marginTop: 12, fontSize: 12, color: "#55558a", fontStyle: "italic" }}>"{todayLog?.note || note}"</div>}
        </Card>
      ) : (
        <Card accent="#a855f7">
          <div style={{ fontSize: 11, color: "#a855f7", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 20 }}>HOW ARE YOU FEELING TODAY?</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { label: "⚡ Energy level", val: energy, set: setEnergy, color: "#f59e0b" },
              { label: "🧠 Focus / clarity", val: focus, set: setFocus, color: "#a855f7" },
              { label: "😊 Overall mood", val: mood, set: setMood, color: "#22c55e" },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 12, color: "#8888aa", marginBottom: 8 }}>{item.label}</div>
                <ScaleSelect value={item.val} onChange={item.set} color={item.color} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 2, marginBottom: 6 }}>NOTES (optional)</div>
              <Input value={note} onChange={e => setNote(e.target.value)} placeholder="Anything worth noting — slept late, stressful day, feeling good..." />
            </div>
            <Btn onClick={log} color="#a855f7" style={{ alignSelf: "flex-start" }}>LOG TODAY</Btn>
          </div>
        </Card>
      )}

      {/* Chart */}
      {last14.length > 1 && (
        <Card accent="#3b82f6">
          <div style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 3, fontFamily: "'Rajdhani',sans-serif", marginBottom: 16 }}>14-DAY TREND</div>
          <SvgLineChart data={last14} height={160} yDomain={[1,5]}
            lines={[{key:"energy",color:"#f59e0b"},{key:"focus",color:"#a855f7"},{key:"mood",color:"#22c55e"}]}
            formatX={d => { const p = d.split("-"); return `${p[1]}/${p[2]}`; }} />
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
            {[["#f59e0b","Energy"],["#a855f7","Focus"],["#22c55e","Mood"]].map(([c,l]) => (
              <div key={l} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 16, height: 2, background: c, borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: "#55558a" }}>{l}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ============================================================
   EXAM COUNTDOWN
   ============================================================ */
function ExamSection({ state, dispatch }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newExam, setNewExam] = useState({ course: "", date: "", color: "#a855f7" });
  const courseColors = { "Criminal Law": "#ef4444", "Property": "#22c55e", "Con Law & Reg State": "#3b82f6", "Advocacy": "#f59e0b" };

  const addExam = () => {
    if (!newExam.course || !newExam.date) return;
    dispatch({ type: "ADD_EXAM", exam: { id: Date.now(), ...newExam, outlineProgress: 0 } });
    setNewExam({ course: "", date: "", color: "#a855f7" });
    setShowAdd(false);
  };

  const sorted = [...state.exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  const today = new Date(); today.setHours(0,0,0,0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <SectionTitle icon="📝" title="Exam Countdown" sub="Know what's coming. Stay ahead of it." />
        <Btn onClick={() => setShowAdd(s => !s)} color="#a855f7">+ Add Exam</Btn>
      </div>

      {showAdd && (
        <Card accent="#a855f7">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 2, marginBottom: 6 }}>COURSE</div>
              <Input value={newExam.course} onChange={e => setNewExam({...newExam, course: e.target.value})} placeholder="e.g. Contracts" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#44446a", letterSpacing: 2, marginBottom: 6 }}>EXAM DATE</div>
              <input type="date" value={newExam.date} onChange={e => setNewExam({...newExam, date: e.target.value})}
                style={{ background: "#070710", border: "1px solid #1e1e3e", color: "#e0e0ff", borderRadius: 10, padding: "9px 12px", fontSize: 13, width: "100%", boxSizing: "border-box" }} />
            </div>
            <Btn onClick={addExam} color="#a855f7">Add</Btn>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {sorted.map(exam => {
          const examDate = new Date(exam.date + "T12:00:00");
          const daysLeft = Math.ceil((examDate - today) / 86400000);
          const color = courseColors[exam.course] || exam.color || "#a855f7";
          const urgency = daysLeft <= 7 ? "#ef4444" : daysLeft <= 14 ? "#f59e0b" : daysLeft <= 30 ? "#a855f7" : "#22c55e";
          const progress = exam.outlineProgress || 0;

          return (
            <div key={exam.id} style={{ background: "linear-gradient(145deg, #0d0d1c, #141428)", border: `1px solid ${color}33`, borderRadius: 20, padding: "24px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${color}, ${color}44)` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#f0f0ff" }}>{exam.course}</div>
                  <div style={{ fontSize: 13, color: "#44446a", marginTop: 4 }}>
                    {examDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 52, fontWeight: 900, color: urgency, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>{daysLeft}</div>
                  <div style={{ fontSize: 11, color: "#44446a" }}>days left</div>
                </div>
              </div>

              {/* Outline progress */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "#44446a", letterSpacing: 2 }}>OUTLINE PROGRESS</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color, fontFamily: "'Rajdhani',sans-serif" }}>{progress}%</span>
                </div>
                <div style={{ height: 10, background: "#0a0a18", borderRadius: 10, overflow: "hidden", marginBottom: 10, cursor: "pointer", position: "relative" }}
                  onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    dispatch({ type: "UPDATE_EXAM_PROGRESS", id: exam.id, progress: Math.min(100, Math.max(0, pct)) });
                  }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: 10, transition: "width 0.3s", boxShadow: `0 0 8px ${color}55` }} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[0,25,50,75,100].map(n => (
                    <button key={n} onClick={() => dispatch({ type: "UPDATE_EXAM_PROGRESS", id: exam.id, progress: n })}
                      style={{ background: progress === n ? `${color}33` : "#0a0a18", color: progress === n ? color : "#33336a", border: `1px solid ${progress === n ? color+"55" : "#1e1e3e"}`, borderRadius: 7, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>{n}%</button>
                  ))}
                </div>
              </div>

              {daysLeft <= 7 && (
                <div style={{ marginTop: 14, background: "#ef444415", border: "1px solid #ef444430", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#ef4444" }}>
                  ⚠️ Less than a week — is your outline ready?
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   AI ASSISTANT
   ============================================================ */
function AIAssistant({ state, dispatch }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm your LifeOS AI — I have full control over your app.\n\nI can add tasks, update your calendar, cancel classes, log workouts, track sleep, and more. Just talk to me naturally.\n\nTry things like:\n• \"Criminal Law is cancelled Wednesday\"\n• \"Add a 2-hour study block Monday at 3pm\"\n• \"I need to read Property ch.5, Con Law ch.3, and prep advocacy outline\"\n• \"Log a push workout: bench 4x8 at 190, OHP 3x10 at 115\"\n• \"I slept 7.5 hours last night\"" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const buildSystemPrompt = () => {
    const day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
    const todayClasses = LAW_SCHEDULE[day] || [];
    return `You are the AI assistant embedded inside LifeOS, a gamified life management app for a law student with ADHD who is working hard to improve his life.

CURRENT APP STATE:
- Level: ${state.level}, XP: ${state.xp}/${getXPNeeded(state.level)}
- Today: ${day}
- Today's law classes: ${todayClasses.length > 0 ? todayClasses.map(c => `${c.name} at ${c.time}`).join(", ") : "None"}
- Pending tasks: ${state.tasks.filter(t=>!t.done).map(t=>`"${t.text}" (${t.category})`).join(", ") || "None"}
- Completed tasks today: ${state.tasks.filter(t=>t.done).length}
- Recent workouts: ${state.workouts.slice(-3).map(w=>`${w.type} on ${w.date}`).join(", ") || "None"}
- Sleep average: ${state.sleepHistory.length ? (state.sleepHistory.reduce((a,b)=>a+b.hours,0)/state.sleepHistory.length).toFixed(1) : "N/A"}h
- Last 3 nights sleep: ${state.sleepHistory.slice(-3).map(s=>`${s.hours}h (${s.date})`).join(", ") || "None"}
- Freedom streak: ${state.currentStreak} days (best: ${state.longestStreak})
- Cookbook recipes: ${state.cookbook.length}
- Wake up time: ${state.wakeUpTime}
- Cancelled classes: ${state.cancelledClasses.length > 0 ? state.cancelledClasses.join(", ") : "None"}
- Calendar events this week: ${state.calEvents.length} events scheduled

YOUR CAPABILITIES:
You can take actions in the app by including a special JSON block in your response. The user will not see this block — it gets parsed and executed automatically. Always wrap actions in: <<<ACTIONS[...]>>>

Available action types:
1. Add task: {"type":"ADD_TASK","task":{"id":${Date.now()},"text":"task text","category":"school|gym|work|personal|other","done":false}}
2. Add multiple tasks: multiple ADD_TASK objects in the array
3. Log sleep: {"type":"LOG_SLEEP","hours":7.5,"date":"Mar 8"}
4. Add workout: {"type":"ADD_WORKOUT","workout":{"id":${Date.now()},"date":"2025-03-08","type":"Push|Pull|Legs","exercises":[{"name":"Bench Press","sets":4,"reps":8,"weight":185}]}}
5. Add recipe: {"type":"ADD_MEAL","meal":{"id":${Date.now()},"name":"Meal Name","type":"breakfast|lunch|dinner|snack","time":20,"ingredients":["item1","item2"],"restaurant":false}}
6. Streak check-in: {"type":"STREAK_CHECKIN"}
7. Break streak: {"type":"BREAK_STREAK"}
8. Add calendar event: {"type":"ADD_CAL_EVENT","event":{"id":${Date.now()},"day":"Monday","title":"Study Session","startHour":14,"duration":90,"color":"#3b82f6","type":"school|gym|work|personal|other"}}
   - startHour is a number: 9=9AM, 13.5=1:30PM, 20=8PM etc.
   - day must be: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
   - color by type: school=#3b82f6, gym=#22c55e, work=#f59e0b, personal=#ec4899, other=#a855f7
9. Cancel a class: {"type":"CANCEL_CLASS","key":"Monday-Criminal Law"}
   - key format: "DayName-ClassName" (e.g. "Tuesday-Property", "Wednesday-Criminal Law")
   - Valid class names: Criminal Law, Advocacy, Property, Con Law & Reg State
10. Restore a cancelled class: {"type":"RESTORE_CLASS","key":"Monday-Criminal Law"}

IMPORTANT RULES:
- Be warm, motivating, and real. This person has ADHD and is fighting hard. Be their hype man AND their accountability partner.
- Keep responses concise and punchy — ADHD brains love short, clear, energetic text. Use line breaks often.
- When you take an action, confirm it enthusiastically.
- If the user seems overwhelmed, help them prioritize — pick the ONE most important thing.
- You know their law schedule, so factor that into advice.
- Reference their actual data (streak, XP, sleep) to make responses personal.
- If they mention struggling with the porn addiction/streak, be compassionate and non-judgmental. Remind them of their progress and that a slip doesn't erase growth.
- Use occasional emojis but don't overdo it.
- Never be preachy or lecture-y. Be a supportive friend who happens to know everything about their life.`;
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: [...history, { role: "user", content: userMsg }]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "Sorry, I couldn't process that. Try again!";

      // Parse and execute actions
      const actionMatch = raw.match(/<<<ACTIONS(\[[\s\S]*?\])>>>/);
      if (actionMatch) {
        try {
          const actions = JSON.parse(actionMatch[1]);
          actions.forEach(action => dispatch(action));
        } catch(e) { console.error("Action parse error", e); }
      }

      // Clean response for display
      const displayText = raw.replace(/<<<ACTIONS[\s\S]*?>>>/g, "").trim();
      setMessages(prev => [...prev, { role: "assistant", content: displayText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection issue — check your network and try again." }]);
    }
    setLoading(false);
  };

  const suggestions = [
    "Criminal Law cancelled Wednesday",
    "Add study block Tuesday 6pm 90min",
    "Add tasks: read Property ch.5, prep Advocacy outline",
    "Log sleep 7.5 hours",
    "What should I focus on today?",
  ];

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(true)} style={{ position: "fixed", bottom: 28, right: 28, width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", cursor: "pointer", zIndex: 200, display: open ? "none" : "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 0 0 0 #a855f7aa", animation: "aiPulse 2.5s infinite" }}>
        🤖
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{ position: "fixed", bottom: 20, right: 20, width: 400, height: 580, background: "linear-gradient(160deg, #0d0d1c, #0a0a16)", border: "1px solid #a855f744", borderRadius: 22, display: "flex", flexDirection: "column", zIndex: 200, boxShadow: "0 20px 60px #00000088, 0 0 0 1px #a855f722", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e3e", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg, #120a28, #0d0d1c)" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: "#f0f0ff", fontSize: 14, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1 }}>LIFEOS AI</div>
              <div style={{ fontSize: 11, color: "#7744aa", display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "aiPulse 2s infinite" }} />
                Knows your full life context
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "#1e1e3e", border: "none", color: "#6666aa", cursor: "pointer", fontSize: 16, width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "85%", padding: "11px 15px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#141428", border: m.role === "user" ? "none" : "1px solid #1e1e3e", fontSize: 13, color: "#e0e0ff", lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "#141428", border: "1px solid #1e1e3e", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#a855f7", animation: `aiDot 1.2s ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div style={{ padding: "0 14px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => { setInput(s); inputRef.current?.focus(); }} style={{ background: "#a855f714", color: "#a855f7", border: "1px solid #a855f728", borderRadius: 20, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background="#a855f724"}
                  onMouseLeave={e => e.currentTarget.style.background="#a855f714"}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "12px 14px 16px", borderTop: "1px solid #1e1e3e", display: "flex", gap: 10 }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} placeholder="Ask me anything or tell me what to add..." style={{ flex: 1, background: "#0a0a18", border: "1px solid #2a2a4e", color: "#e0e0ff", borderRadius: 12, padding: "10px 14px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none" }}
              onFocus={e => e.target.style.borderColor = "#a855f7"}
              onBlur={e => e.target.style.borderColor = "#2a2a4e"} />
            <button onClick={send} disabled={loading || !input.trim()} style={{ width: 42, height: 42, borderRadius: 12, background: input.trim() && !loading ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e3e", border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", flexShrink: 0 }}>
              {loading ? "⏳" : "↑"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes aiPulse { 0%,100%{box-shadow:0 0 0 0 #a855f755} 50%{box-shadow:0 0 0 10px #a855f700} }
        @keyframes aiDot { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      `}</style>
    </>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "⚡" },
  { id: "morning", label: "Morning", icon: "🌅" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "work", label: "Work", icon: "💼" },
  { id: "exams", label: "Exams", icon: "📝" },
  { id: "braindump", label: "Brain Dump", icon: "🧠" },
  { id: "habits", label: "Habits", icon: "✅" },
  { id: "mood", label: "Mood", icon: "📈" },
  { id: "gym", label: "Gym", icon: "💪" },
  { id: "meals", label: "Meals", icon: "🍽️" },
  { id: "sleep", label: "Sleep", icon: "💤" },
  { id: "streak", label: "Freedom", icon: "🛡️" },
  { id: "review", label: "Weekly Review", icon: "📊" },
  { id: "achievements", label: "Achievements", icon: "🏆" },
  { id: "upgrades", label: "Upgrades", icon: "🎮" },
];

const STORAGE_KEY = "lifeos_v1";

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INIT;
    const parsed = JSON.parse(saved);
    // Merge with INIT so new fields added in updates don't disappear
    return { ...INIT, ...parsed };
  } catch { return INIT; }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Save to localStorage whenever state changes
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const sections = { dashboard: Dashboard, morning: MorningSection, calendar: CalendarSection, work: WorkSection, exams: ExamSection, braindump: BrainDumpSection, habits: HabitsSection, mood: MoodSection, gym: GymSection, meals: MealsSection, sleep: SleepSection, streak: StreakSection, review: WeeklyReviewSection, achievements: AchievementsSection, upgrades: UpgradesSection };
  const ActiveSection = sections[activeTab];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #070710; color: #e0e0ff; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #0a0a18; } ::-webkit-scrollbar-thumb { background: #2020448; border-radius: 5px; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #a855f7 !important; }
        button:active { transform: scale(0.97); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .section { animation: fadeIn 0.25s ease; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#070710" }}>
        {/* Sidebar */}
        <aside style={{ width: 220, flexShrink: 0, background: "linear-gradient(180deg, #0a0a18 0%, #070710 100%)", borderRight: "1px solid #14143a", position: "fixed", top: 0, bottom: 0, left: 0, display: "flex", flexDirection: "column", zIndex: 50 }}>
          {/* Logo */}
          <div style={{ padding: "28px 22px 22px", borderBottom: "1px solid #14143a" }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 24, fontWeight: 900, letterSpacing: 4, color: "#f0f0ff" }}>LIFE<span style={{ color: "#a855f7" }}>OS</span></div>
            <div style={{ fontSize: 9, color: "#33336a", letterSpacing: 3, marginTop: 2 }}>YOUR LIFE · GAMIFIED</div>
          </div>

          {/* XP Widget */}
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #14143a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: "#55558a" }}>Level {state.level}</span>
              <span style={{ fontSize: 11, color: "#a855f7", fontWeight: 700 }}>{state.xp}/{getXPNeeded(state.level)}</span>
            </div>
            <XPBar xp={state.xp} level={state.level} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {state.currentStreak > 0 && <Chip color="#ef4444">🔥 {state.currentStreak}d</Chip>}
              <Chip color="#a855f7">LVL {state.level}</Chip>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "14px 12px", overflowY: "auto" }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", marginBottom: 3, background: activeTab===tab.id ? "#a855f718" : "transparent", border: `1px solid ${activeTab===tab.id ? "#a855f740" : "transparent"}`, borderRadius: 11, color: activeTab===tab.id ? "#c084fc" : "#55558a", fontWeight: activeTab===tab.id ? 700 : 400, cursor: "pointer", fontSize: 13, textAlign: "left", transition: "all 0.15s", fontFamily: "'DM Sans',sans-serif" }}
                onMouseEnter={e => activeTab!==tab.id && (e.currentTarget.style.background="#a855f70a")}
                onMouseLeave={e => activeTab!==tab.id && (e.currentTarget.style.background="transparent")}>
                <span style={{ fontSize: 18, width: 22, textAlign: "center" }}>{tab.icon}</span>
                <span style={{ fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1.5, textTransform: "uppercase", fontSize: 12 }}>{tab.label}</span>
                {activeTab===tab.id && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 8px #a855f7" }} />}
              </button>
            ))}
          </nav>

          {/* Bottom */}
          <div style={{ padding: "16px 22px", fontSize: 10, color: "#22224a", lineHeight: 1.6, borderTop: "1px solid #14143a" }}>
            Complete tasks · log workouts<br />track sleep · build streaks<br />earn XP · level up your life
          </div>
        </aside>

        {/* Main */}
        <main style={{ marginLeft: 220, flex: 1, padding: "36px 36px 60px", minHeight: "100vh" }}>
          <div style={{ maxWidth: 1080 }} className="section">
            <ActiveSection state={state} dispatch={dispatch} />
          </div>
        </main>
      </div>

      <AIAssistant state={state} dispatch={dispatch} />
    </>
  );
}
