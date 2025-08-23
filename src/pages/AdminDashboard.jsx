// src/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Card, CardContent } from "../components/ui/card"; // keep your Card
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  Pill,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/***********************************
 * MOCK DATA (replace with Firestore)
 ***********************************/
const mockStats = {
  totalMedicines: 312,
  topReserved: [
    { name: "Paracetamol", count: 120 },
    { name: "Amoxicillin", count: 95 },
    { name: "Ventolin", count: 62 },
    { name: "Ibuprofen", count: 47 },
  ],
  lowStock: [
    { name: "Ibuprofen", quantity: 3, threshold: 10 },
    { name: "Cough Syrup", quantity: 2, threshold: 8 },
    { name: "Zinc Tablets", quantity: 5, threshold: 12 },
  ],
  reservationsOverTime: [
    { day: "Mon", count: 10 },
    { day: "Tue", count: 15 },
    { day: "Wed", count: 7 },
    { day: "Thu", count: 20 },
    { day: "Fri", count: 25 },
    { day: "Sat", count: 16 },
    { day: "Sun", count: 11 },
  ],
  recentReservations: [
    {
      id: "R-2451",
      patient: "Adaobi O.",
      medicine: "Paracetamol 500mg",
      qty: 2,
      pharmacy: "CareFirst",
      status: "fulfilled",
      createdAt: "2025-08-21 10:05",
    },
    {
      id: "R-2450",
      patient: "Chinedu A.",
      medicine: "Ventolin Inhaler",
      qty: 1,
      pharmacy: "CityPharm",
      status: "pending",
      createdAt: "2025-08-21 09:47",
    },
    {
      id: "R-2449",
      patient: "Ngozi I.",
      medicine: "Amoxicillin 500mg",
      qty: 1,
      pharmacy: "PrimeHealth",
      status: "cancelled",
      createdAt: "2025-08-20 17:32",
    },
  ],
};

/**********************
 * SMALL UTIL HELPERS
 **********************/
const cn = (...xs) => xs.filter(Boolean).join(" ");
const fmt = (n) => new Intl.NumberFormat().format(n);

function StatCard({ title, value, icon: Icon, accent = "text-emerald-600", trend }) {
  const up = trend && trend.value > 0;
  const down = trend && trend.value < 0;
  return (
    <Card className="h-full">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs md:text-sm text-gray-500">{title}</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{fmt(value)}</h3>
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    up && "bg-emerald-100 text-emerald-700",
                    down && "bg-rose-100 text-rose-700",
                    trend.value === 0 && "bg-gray-100 text-gray-700"
                  )}
                >
                  {up && <TrendingUp className="h-3.5 w-3.5 mr-1" />}
                  {down && <TrendingDown className="h-3.5 w-3.5 mr-1" />}
                  {trend.label}
                </span>
              )}
            </div>
          </div>
          <div className={cn("rounded-xl p-2 md:p-2.5 bg-gray-50", accent)}>
            <Icon className={cn("h-5 w-5 md:h-6 md:w-6", accent)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Skeleton({ className = "" }) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200/70", className)} />;
}

/**********************
 * CSV EXPORT (client)
 **********************/
function exportCSV(filename, rows) {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(",")]
    .concat(rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState("7d"); // 7d | 30d | 90d (for future use)
  const [query, setQuery] = useState("");

  // Simulate fetch
  useEffect(() => {
    setLoading(true);
    setError("");
    const t = setTimeout(() => {
      try {
        setStats(mockStats);
      } catch (e) {
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [range]);

  const totalReservations = useMemo(
    () => (stats ? stats.reservationsOverTime.reduce((a, b) => a + b.count, 0) : 0),
    [stats]
  );

  const filteredRecent = useMemo(() => {
    if (!stats) return [];
    const q = query.toLowerCase();
    return stats.recentReservations.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.patient.toLowerCase().includes(q) ||
        r.medicine.toLowerCase().includes(q) ||
        r.pharmacy.toLowerCase().includes(q)
    );
  }, [stats, query]);

  return (
    <AdminLayout>
      <div className="grid gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl text-left md:text-3xl font-bold tracking-tight">Admin Analytics</h1>
            <p className="text-sm text-gray-500">Overview of medicine inventory and reservations.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border rounded-md text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button
              onClick={() => exportCSV("reservations.csv", stats?.recentReservations || [])}
              className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
            >
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>

        {/* Errors / Loading */}
        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-rose-700 text-sm">{error}</div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        )}

        {/* KPIs */}
        {!loading && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Medicines"
              value={stats.totalMedicines}
              icon={Package}
              accent="text-blue-600"
              trend={{ value: 6, label: "+6% WoW" }}
            />
            <StatCard
              title="Unique Reserved"
              value={stats.topReserved.length}
              icon={Pill}
              accent="text-emerald-600"
              trend={{ value: 2, label: "+2 this week" }}
            />
            <StatCard
              title="Low Stock Items"
              value={stats.lowStock.length}
              icon={AlertTriangle}
              accent="text-amber-600"
              trend={{ value: -1, label: "-1 vs last wk" }}
            />
            <StatCard
              title="Total Reservations"
              value={totalReservations}
              icon={Activity}
              accent="text-purple-600"
              trend={{ value: 12, label: "+12% WoW" }}
            />
          </div>
        )}

        {/* Charts Row */}
        {!loading && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Area Chart */}
            <div className="bg-white rounded-xl p-4 shadow col-span-1 lg:col-span-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Reservations (daily)</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.reservationsOverTime} margin={{ left: 2, right: 6, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip cursor={{ stroke: "#94a3b8", strokeDasharray: 4 }} />
                  <Area type="monotone" dataKey="count" stroke="#10b981" fill="url(#colorRes)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-xl p-4 shadow col-span-1 lg:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Top Reserved (units)</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.topReserved} layout="vertical" margin={{ left: 16, right: 16, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                  <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Lists / Tables */}
        {!loading && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Low Stock */}
            <div className="bg-white rounded-xl p-4 shadow col-span-1 lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
              </div>
              <ul className="divide-y">
                {stats.lowStock.map((it, idx) => {
                  const pct = Math.min(100, Math.round((it.quantity / it.threshold) * 100));
                  return (
                    <li key={idx} className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{it.name}</p>
                          <p className="text-xs text-gray-500">Qty: {it.quantity} • Threshold: {it.threshold}</p>
                        </div>
                        <span className="text-xs rounded-full px-2 py-0.5 bg-amber-100 text-amber-700">Restock</span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recent Reservations */}
            <div className="bg-white rounded-xl p-4 shadow col-span-1 lg:col-span-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Recent Reservations</h2>
                <div className="relative w-64 max-w-full">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by ID, patient, medicine, pharmacy…"
                    className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="overflow-auto">
                <table className="min-w-[640px] w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2 pr-3">ID</th>
                      <th className="py-2 pr-3">Patient</th>
                      <th className="py-2 pr-3">Medicine</th>
                      <th className="py-2 pr-3">Qty</th>
                      <th className="py-2 pr-3">Pharmacy</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 pr-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredRecent.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-gray-500">No matching reservations.</td>
                      </tr>
                    ) : (
                      filteredRecent.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="py-2 pr-3 font-medium">{r.id}</td>
                          <td className="py-2 pr-3">{r.patient}</td>
                          <td className="py-2 pr-3">{r.medicine}</td>
                          <td className="py-2 pr-3">{r.qty}</td>
                          <td className="py-2 pr-3">{r.pharmacy}</td>
                          <td className="py-2 pr-3">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                                r.status === "fulfilled" && "bg-emerald-100 text-emerald-700",
                                r.status === "pending" && "bg-amber-100 text-amber-700",
                                r.status === "cancelled" && "bg-rose-100 text-rose-700"
                              )}
                            >
                              {r.status === "fulfilled" && <CheckCircle2 className="h-3.5 w-3.5" />}
                              {r.status === "pending" && <AlertTriangle className="h-3.5 w-3.5" />}
                              {r.status === "cancelled" && <XCircle className="h-3.5 w-3.5" />}
                              {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-2 pr-3 whitespace-nowrap">{r.createdAt}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !stats && !error && (
          <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">
            No analytics yet. Start by creating medicines and accepting reservations.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
