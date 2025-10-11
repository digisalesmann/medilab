// src/components/MobileQuickAndActivity.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiFlashlightLine,
  RiFirstAidKitLine,
  RiCalendarEventLine,
  RiMapPinLine,
  RiArrowRightSLine,
  RiPulseLine,
  RiCheckFill,
  RiLineChartLine,
} from "react-icons/ri";
import { useAnalytics } from "../lib/analytics";

/** --------------------------------------------
 * Small helpers
 * -------------------------------------------*/

// Haversine distance in km
function distanceKm(a, b) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function formatKm(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function todayISO() {
  const d = new Date();
  // Ensure the date is consistent for comparison across the day
  return d.toISOString().slice(0, 10); 
}

function pastDaysISO(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function shortDayLabel(dateISO) {
  const d = new Date(dateISO + 'T00:00:00'); // Append time to treat it as local date
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

/** --------------------------------------------
 * Hooks
 * -------------------------------------------*/

function useGeolocation() {
  const [state, setState] = useState({
    status: "idle",
    coords: null,
    error: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState({ status: "error", coords: null, error: "Not supported" });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, status: "prompt" }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        setState({
          status: "granted",
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error: null,
        });
      },
      (err) => {
        if (cancelled) return;
        setState({
          status: err.code === 1 ? "denied" : "error",
          coords: null,
          error: err.message || "Failed to get location",
        });
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function useNearestPharmacy(pharmacies, coords) {
  return useMemo(() => {
    // Fallback for null coordinates during location fetching
    if (!pharmacies || !Array.isArray(pharmacies) || !coords) return null; 
    let min = Infinity;
    let nearest = null;
    pharmacies.forEach((p) => {
      if (typeof p.lat !== "number" || typeof p.lng !== "number") return;
      const d = distanceKm(coords, { lat: p.lat, lng: p.lng });
      if (d < min) {
        min = d;
        nearest = { ...p, distanceKm: d };
      }
    });
    return nearest;
  }, [pharmacies, coords]);
}

function useWeeklyActivity(initialActivity) {
  const STORAGE_KEY = "medilab.weeklyActivity";
  // Activity levels: 0 (None), 4 (Low), 8 (Medium), 12 (High/Max)
  const [data, setData] = useState(() => {
    if (initialActivity?.length) return initialActivity;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    const days = pastDaysISO(7).map((d) => ({ date: d, value: 0 }));
    return days;
  });

  useEffect(() => {
    // Normalizes stored data to the last 7 days when the component mounts
    const last7 = pastDaysISO(7);
    const map = new Map(data.map((d) => [d.date, d.value]));
    const normalized = last7.map((d) => ({ date: d, value: map.get(d) || 0 }));
    if (JSON.stringify(normalized) !== JSON.stringify(data)) {
      setData(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const total = useMemo(
    () => data.reduce((s, d) => s + (d.value || 0), 0),
    [data]
  );

  const bumpToday = (delta = 1) => {
    const iso = todayISO();
    setData((arr) =>
      arr.map((d) =>
        d.date === iso ? { ...d, value: Math.max(0, (d.value || 0) + delta) } : d
      )
    );
  };

  const cycleTodayValue = () => {
    const iso = todayISO();
    const cycle = [0, 4, 8, 12]; // Activity levels: None, Low, Medium, High
    
    let nextValue = 4;
    
    setData((arr) =>
      arr.map((d) => {
        if (d.date !== iso) return d;

        const currentValue = d.value || 0;
        const currentIndex = cycle.indexOf(currentValue);

        // Find the next value in the cycle array
        nextValue = cycle[(currentIndex + 1) % cycle.length];

        return { ...d, value: nextValue };
      })
    );

    return nextValue;
  }

  return { data, setData, total, bumpToday, cycleTodayValue };
}

/** --------------------------------------------
 * UI atoms
 * -------------------------------------------*/

function QuickAction({ label, icon, color, onClick, className }) {
  const IconElement = typeof icon === 'function' ? icon : () => icon;

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`
        group flex flex-col items-center justify-center select-none 
        active:scale-[0.98] transition-all duration-150 
        rounded-xl border border-gray-200 bg-white/95 shadow-lg hover:shadow-xl
        p-2 sm:p-3
        ${className}
      `}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md mb-1.5 
          transition-all group-hover:scale-105 group-active:scale-100 ${color}`}
      >
        <IconElement className="text-2xl" />
      </div>
      <div className="text-[11px] sm:text-xs font-semibold text-gray-800 leading-tight text-center">
        {label}
      </div>
    </button>
  );
}

// REFACTORED FOR PREMIUM COLUMN CHART VISUAL
function WeeklyActivityTimeline({ data, total, onDayClick }) {
  const MAX_ACTIVITY = 12;
  const isAllZero = total === 0;

  return (
    <div className="bg-white/95 p-4 mx-2 mt-6 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-800 flex items-center">
          <RiPulseLine className="text-rose-500 mr-2 text-lg" />
          Weekly Health Check-in
        </p>
        <span className="text-xs text-gray-500">
          Total: <strong className="text-gray-800">{total}</strong>
        </span>
      </div>

      <div className="flex justify-between gap-1 h-28 items-end pb-1 border-b border-gray-200">
        {data.map((d) => {
          const isToday = d.date === todayISO();
          const activityLevel = d.value || 0;
          const heightPct = (activityLevel / MAX_ACTIVITY) * 100;
          const heightStyle = { height: `${heightPct}%` };

          return (
            <button
              key={d.date}
              onClick={() => onDayClick?.(d)}
              className={`flex flex-col items-center justify-end h-full min-w-[40px] px-1 transition focus:outline-none group`}
              aria-label={`Activity for ${shortDayLabel(d.date)}: ${activityLevel}`}
            >
              <div className="relative w-full h-full flex flex-col justify-end items-center">
                
                {/* Activity Score (Visible on hover/focus or if it's today) */}
                <span className={`absolute -top-4 text-[10px] font-bold text-emerald-700 transition-opacity duration-300 ${isToday || activityLevel > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {activityLevel}
                </span>

                {/* The Bar */}
                <div 
                  style={heightStyle} 
                  className={`w-4 bg-emerald-400 rounded-t-sm transition-all duration-500 ease-out 
                    shadow-md hover:shadow-lg active:shadow-sm
                    ${isToday ? 'bg-emerald-600 ring-2 ring-emerald-300' : ''}
                    ${isAllZero && 'bg-gray-300'}
                  `}
                />
              </div>

              {/* Day Label */}
              <span
                className={`text-[11px] mt-2 font-medium ${
                  isToday ? "text-emerald-700 font-bold" : "text-gray-500"
                }`}
              >
                {shortDayLabel(d.date).slice(0, 3)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between pt-2">
        <span className="text-[11px] text-gray-500">
          Tap **Today's** column to check in activity (cycles 0/4/8/12)
        </span>
        <a
          href="/activity"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center"
        >
          Details <RiArrowRightSLine className="text-base" />
        </a>
      </div>
    </div>
  );
}

/** --------------------------------------------
 * Desktop Sparkline/Area Chart Component
 * -------------------------------------------*/

function WeeklyActivitySparkline({ data, total }) {
  const MAX_SCORE = 12;
  const days = data.map(d => ({ 
    ...d, 
    value: d.value || 0,
    // Normalize to 0-100 for SVG plotting (inverted for chart plotting: high score = low Y-axis)
    normalized: MAX_SCORE > 0 ? 100 - (d.value / MAX_SCORE) * 100 : 100 
  }));
  
  // Find the highest score to highlight the peak
  const maxVal = Math.max(...days.map(d => d.value));
  
  const todayIndex = days.findIndex(d => d.date === todayISO());

  // Generate the SVG Path string
  const points = days.map((d, i) => `${(i / (days.length - 1)) * 100} ${d.normalized}`);
  const dPath = `M ${points.join(' L ')}`;
  
  // Create area path (closes the shape to the bottom-left and bottom-right corners)
  const dArea = `${dPath} L 100 100 L 0 100 Z`;

  return (
    <div className="hidden md:block mt-6 p-6 bg-white rounded-xl border shadow-lg overflow-hidden">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <RiLineChartLine className="text-emerald-500 mr-2" />
        Weekly Activity Trend
      </h2>

      <div className="relative h-36">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          {/* Chart Gradient Definition */}
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: "#34d399", stopOpacity: 0.8}} /> {/* Emerald-400 */}
              <stop offset="100%" style={{stopColor: "#ecfdf5", stopOpacity: 0.1}} /> {/* Emerald-50 (Near white) */}
            </linearGradient>
          </defs>

          {/* Grid Lines (Light gray, subtle) */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#f3f4f6" strokeDasharray="1 3" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#f3f4f6" strokeDasharray="1 3" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#f3f4f6" strokeDasharray="1 3" />

          {/* Area Fill (Gradient) */}
          <path d={dArea} fill="url(#chartGradient)" />

          {/* Line Path (Emerald-600) */}
          <path d={dPath} fill="none" stroke="#059669" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* Data Points */}
          {days.map((d, i) => {
            const isPeak = d.value === maxVal && maxVal > 0;
            const isToday = i === todayIndex;
            const cx = (i / (days.length - 1)) * 100;
            const cy = d.normalized;

            return (
              <g key={d.date}>
                {/* Point dot */}
                <circle cx={cx} cy={cy} r={1.5} fill={isToday ? "#059669" : "#a7f3d0"} stroke="#059669" strokeWidth={isToday ? 0.5 : 0} />
                
                {/* Value Label (only for Today and Peak) */}
                {(isToday || isPeak) && (
                  <text
                    x={cx}
                    y={cy - 5}
                    textAnchor="middle"
                    fontSize="5"
                    fontWeight="bold"
                    fill="#059669"
                    className="transition duration-300"
                  >
                    {d.value}
                  </text>
                )}
                {/* Highlight ring for today */}
                {isToday && <circle cx={cx} cy={cy} r={3.5} fill="none" stroke="#10b981" strokeWidth="0.5" />}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between text-xs font-semibold text-gray-600 mt-2 border-t pt-3">
        {days.map((d) => (
          <div key={d.date} className={`text-center ${d.date === todayISO() ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
            {shortDayLabel(d.date)}
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
        <span>
          Total check-ins this week: <strong className="text-gray-900">{total}</strong>
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${total === 0 ? 'bg-gray-100 text-gray-500' : 'bg-emerald-100 text-emerald-700 font-semibold'}`}>
          {total === 0 ? 'Start Tracking' : (maxVal === MAX_SCORE ? 'Peak Week!' : 'On Track')}
        </span>
      </div>
    </div>
  );
}


/** --------------------------------------------
 * Main component
 * -------------------------------------------*/

export default function MobileQuickAndActivity({ pharmacies, initialActivity }) {
  const navigate = useNavigate();
  const geo = useGeolocation();
  const nearest = useNearestPharmacy(pharmacies, geo.coords);
  const { trackEvent, trackPageView } = useAnalytics();

  const { data, total, cycleTodayValue, bumpToday } =
    useWeeklyActivity(initialActivity);

  const [toast, setToast] = useState("");

  useEffect(() => {
    trackPageView("Quick + Activity Dashboard");
  }, [trackPageView]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3000); // Extended toast time
    return () => clearTimeout(id);
  }, [toast]);

  // Daily login activity bump
  useEffect(() => {
    const today = todayISO();
    const lastLoginDate = localStorage.getItem("medilab.lastLoginDate");
    if (lastLoginDate !== today) {
      bumpToday(1); // Small, initial activity bump for daily login
      localStorage.setItem("medilab.lastLoginDate", today);
      setToast("Welcome back! Daily check-in counted as activity (+1)");
      trackEvent("daily_login", { date: today });
    }
  }, [bumpToday, trackEvent]);

  // Handles the activity timeline click
  const handleBarClick = (d) => {
    if (d.date !== todayISO()) {
      setToast("Activity check-in is only available for today.");
      return;
    }
    // Logic: cycles through 0, 4, 8, 12
    const next = cycleTodayValue(); 
    const label = next === 0 ? "None" : next === 4 ? "Low" : next === 8 ? "Medium" : "High";
    
    setToast(`Daily Activity set to: ${label} (${next})`);
    trackEvent("activity_update", { date: d.date, value: next });
  };

  // Logic for the Location/Pharmacy badge status
  const locationBadge = (() => {
    if (geo.status === "granted" && nearest) {
      return (
        <>
          Nearest pharmacy:{" "}
          <strong className="text-emerald-700">
            {nearest.name ? `${nearest.name} • ` : ""}
            {formatKm(nearest.distanceKm)}
          </strong>
        </>
      );
    }
    if (geo.status === "granted" && !nearest) {
      return "Location Active • Browse nearby";
    }
    if (geo.status === "denied") return <span className="text-red-600">Location Denied • Tap to enable</span>;
    if (geo.status === "error") return <span className="text-red-600">Location Unavailable</span>;
    
    // Status is 'idle' or 'prompt'
    return (
      <span className="inline-flex items-center gap-2">
        Locating Nearby...
        <span className="inline-block w-16 h-2 rounded-full bg-gray-200 animate-pulse" />
      </span>
    );
  })();

  return (
    <>
      {/* Toast Notification (Premium styling) */}
      {toast && (
        <div
          aria-live="polite"
          // Premium UI: Subtle shadow and tighter padding
          className="md:hidden mx-2 mt-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium px-4 py-3 shadow-md"
        >
          {toast}
        </div>
      )}

      {/* Mobile Quick Actions Section */}
      <section className="md:hidden space-y-4 px-2 mt-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 px-1">Quick Access</h3>
        
        <div className="grid grid-cols-3 gap-3">
          <QuickAction
            label="Emergency Call"
            icon={<RiFlashlightLine className="text-white text-3xl animate-pulse" />}
            color="bg-red-500 shadow-red-300/50"
            className="h-28"
            onClick={() => {
              navigate("/emergency");
              trackEvent("quick_action", { action: "emergency" });
            }}
          />
          <QuickAction
            label="First Aid Tips"
            icon={<RiFirstAidKitLine className="text-white text-3xl" />}
            color="bg-blue-500 shadow-blue-300/50"
            className="h-28"
            onClick={() => {
              navigate("/first-aid");
              trackEvent("quick_action", { action: "first_aid" });
            }}
          />
          <QuickAction
            label="Book Lab Test"
            icon={<RiCalendarEventLine className="text-white text-3xl" />}
            color="bg-purple-500 shadow-purple-300/50"
            className="h-28"
            onClick={() => {
              navigate("/lab-booking");
              trackEvent("quick_action", { action: "lab_booking" });
            }}
          />
        </div>

        {/* Location/Nearest Pharmacy Badge (Premium styling) */}
        <button
          onClick={() => {
            navigate("/nearby-pharmacies");
            trackEvent("navigate", { target: "nearby_pharmacies" });
          }}
          // Premium UI: Pill shape, color-coded based on status
          className={`flex items-center justify-between w-full rounded-full border shadow-sm px-4 py-3 transition text-left
            ${geo.status === "granted" 
                ? 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100'
                : geo.status === "denied" 
                ? 'bg-red-50 border-red-300 hover:bg-red-100'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }
          `}
          aria-label="Nearest pharmacy"
        >
          <div className="flex items-center gap-2">
            {geo.status === "granted" ? <RiCheckFill className="text-emerald-600 text-xl" /> : <RiMapPinLine className="text-gray-500 text-xl" />}
            <span className="text-sm font-medium text-gray-800">{locationBadge}</span>
          </div>
          <RiArrowRightSLine className="text-gray-500 text-xl" />
        </button>
      </section>

      {/* Mobile activity bars (Now Premium Column Chart) */}
      <div className="md:hidden">
        <WeeklyActivityTimeline data={data} total={total} onDayClick={handleBarClick} />
      </div>

      {/* Desktop weekly sparkline chart */}
      <WeeklyActivitySparkline data={data} total={total} />
    </>
  );
}