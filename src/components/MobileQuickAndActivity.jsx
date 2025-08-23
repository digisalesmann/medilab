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
} from "react-icons/ri";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
  const d = new Date(dateISO);
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
    const last7 = pastDaysISO(7);
    const map = new Map(data.map((d) => [d.date, d.value]));
    const normalized = last7.map((d) => ({ date: d, value: map.get(d) || 0 }));
    if (JSON.stringify(normalized) !== JSON.stringify(data)) {
      setData(normalized);
    }
  }, [data]);

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
        d.date === iso ? { ...d, value: (d.value || 0) + delta } : d
      )
    );
  };

  const setValueForDate = (dateISO, value) => {
    setData((arr) =>
      arr.map((d) =>
        d.date === dateISO ? { ...d, value: Math.max(0, value) } : d
      )
    );
  };

  return { data, setData, total, bumpToday, setValueForDate };
}

/** --------------------------------------------
 * UI atoms
 * -------------------------------------------*/

function QuickAction({ label, icon, color, onClick, className }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`group select-none active:scale-[0.99] transition-all duration-150 rounded-lg border border-gray-200 bg-white/95 shadow-xs hover:shadow-sm px-2 py-2 text-center ${className}`}
    >
      <div
        className={`mx-auto w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div className="mt-1 text-[12px] font-medium text-gray-800 leading-tight">
        {label}
      </div>
    </button>
  );
}

function WeeklyActivityCard({ data, total, onBarClick }) {
  const max = Math.max(1, ...data.map((d) => d.value || 0));

  return (
    <div className="bg-white/95 p-3 mx-2 mt-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-800 flex items-center">
          <RiPulseLine className="text-rose-500 mr-1" />
          Weekly Activity
        </p>
        <span className="text-[11px] text-gray-500">
          Total: <strong className="text-gray-800">{total}</strong>
        </span>
      </div>

      <div className="h-20 flex items-end gap-1.5">
        {data.map((d, idx) => {
          const pct = max === 0 ? 0 : (d.value / max) * 100;
          const isToday = d.date === todayISO();
          return (
            <button
              key={d.date}
              className="relative flex-1 rounded-t-md overflow-visible focus:outline-none"
              onClick={() => onBarClick?.(d, idx)}
              aria-label={`${shortDayLabel(d.date)}: ${d.value}`}
            >
              <div
                className={`w-full rounded-t-md transition-all duration-300 bg-gradient-to-t from-emerald-500 to-emerald-300 ${
                  isToday ? "ring-2 ring-emerald-500/60" : ""
                }`}
                style={{ height: `${Math.max(4, pct)}%` }}
              />
              <div className="absolute -bottom-4 w-full text-[10px] text-gray-500 text-center">
                {shortDayLabel(d.date).slice(0, 3)}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-gray-500">
          Tap a bar to set today’s value
        </span>
        <a
          href="/activity"
          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
        >
          View details →
        </a>
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

  const { data, total, setValueForDate, bumpToday } =
    useWeeklyActivity(initialActivity);

  const [toast, setToast] = useState("");

  useEffect(() => {
    trackPageView("Quick + Activity Dashboard");
  }, [trackPageView]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    const today = todayISO();
    const lastLoginDate = localStorage.getItem("medilab.lastLoginDate");
    if (lastLoginDate !== today) {
      bumpToday(1);
      localStorage.setItem("medilab.lastLoginDate", today);
      setToast("Daily login counted as activity");
      trackEvent("daily_login", { date: today });
    }
  }, [bumpToday, trackEvent]);

  const handleBarClick = (d) => {
    if (d.date !== todayISO()) {
      setToast("You can only update today on mobile");
      return;
    }
    const next = ((d.value || 0) + 3) % 12;
    setValueForDate(d.date, next);
    setToast(`Updated today to ${next}`);
    trackEvent("activity_update", { date: d.date, value: next });
  };

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
      return "Location on • Browse nearby";
    }
    if (geo.status === "denied") return "Enable location to show nearby";
    if (geo.status === "error") return "Location unavailable";
    return (
      <span className="inline-flex items-center gap-2">
        Locating...
        <span className="inline-block w-16 h-2 rounded bg-gray-200 animate-pulse" />
      </span>
    );
  })();

  return (
    <>
      {toast && (
        <div
          aria-live="polite"
          className="md:hidden mx-2 mb-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs px-3 py-2"
        >
          {toast}
        </div>
      )}

      {/* Mobile section */}
      <section className="md:hidden space-y-3 px-2 mt-6">
        <div className="grid grid-flow-col auto-cols-[minmax(110px,1fr)] gap-3">
          <QuickAction
            label="Emergency"
            icon={<RiFlashlightLine className="text-2xl mb-2 animate-pulse" />}
            color="text-emerald-600"
            className="h-28"
            onClick={() => {
              navigate("/emergency");
              trackEvent("quick_action", { action: "emergency" });
            }}
          />
          <QuickAction
            label="First Aid"
            icon={<RiFirstAidKitLine className="text-2xl mb-2" />}
            color="text-blue-600"
            className="h-28"
            onClick={() => {
              navigate("/first-aid");
              trackEvent("quick_action", { action: "first_aid" });
            }}
          />
          <QuickAction
            label="Book Lab"
            icon={<RiCalendarEventLine className="text-2xl mb-2" />}
            color="text-purple-600"
            className="h-28"
            onClick={() => {
              navigate("/lab-booking");
              trackEvent("quick_action", { action: "lab_booking" });
            }}
          />
        </div>

        <button
          onClick={() => {
            navigate("/nearby-pharmacies");
            trackEvent("navigate", { target: "nearby_pharmacies" });
          }}
          className="flex items-center justify-between w-full bg-white/95 px-4 py-3 rounded-lg border border-gray-200 shadow-xs hover:shadow-sm active:bg-gray-50 transition text-left"
          aria-label="Nearest pharmacy"
        >
          <div className="flex items-center gap-2">
            <RiMapPinLine
              className={`text-lg ${
                geo.status === "granted" ? "text-emerald-600" : "text-gray-400"
              }`}
            />
            <span className="text-xs font-medium">{locationBadge}</span>
          </div>
          <RiArrowRightSLine className="text-gray-500" />
        </button>
      </section>

      <div className="md:hidden">
        <WeeklyActivityCard data={data} total={total} onBarClick={handleBarClick} />
      </div>

      {/* Desktop Chart */}
      <div className="hidden md:block mt-6 p-4 bg-white rounded-xl border shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <RiPulseLine className="text-rose-500 mr-1" />
          Weekly Activity (Desktop View)
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => shortDayLabel(d).slice(0, 3)}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "#f0fdf4" }}
              contentStyle={{
                borderRadius: "0.5rem",
                borderColor: "#d1fae5",
                background: "white",
                fontSize: "12px",
              }}
              labelFormatter={(d) => shortDayLabel(d)}
              formatter={(value) => [`${value} activity`, "Count"]}
            />
            <Bar
              dataKey="value"
              fill="url(#activityGradient)"
              radius={[8, 8, 0, 0]}
              barSize={28}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
