// src/pages/AdminPanel.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ScannerInput from "../components/ScannerInput";
import { Card, CardContent } from "../components/ui/card";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ScanLine,
  ListChecks,
  Download,
  Trash2,
  RefreshCw,
  Filter,
  Search,
} from "lucide-react";

const MOCK_ADMIN_PHARMACY = "MediLab Central"; // keep gate

/***********************************
 * Helpers
 ***********************************/
const cn = (...xs) => xs.filter(Boolean).join(" ");
const toCSV = (rows) => {
  if (!rows?.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => JSON.stringify(r[h] ?? "")).join(","));
  return lines.join("\n");
};
const download = (filename, text, type = "text/plain") => {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/***********************************
 * Main
 ***********************************/
export default function AdminPanel() {
  const [reservations, setReservations] = useState([]);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [logs, setLogs] = useState(() => {
    const savedLogs = localStorage.getItem("verificationLogs");
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  const [activeTab, setActiveTab] = useState("verify"); // verify | reservations | logs
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | verified
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | user | medicine

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("reservations");
    if (saved) setReservations(JSON.parse(saved));
  }, []);

  // Persist reservations and logs
  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem("verificationLogs", JSON.stringify(logs));
  }, [logs]);

  /***********************************
   * Verification flow
   ***********************************/
  const verifyReservation = useCallback((reservationId) => {
    const existing = JSON.parse(localStorage.getItem("reservations") || "[]");
    const idx = existing.findIndex((r) => r.id === reservationId);
    const timestamp = new Date().toLocaleString();

    if (idx === -1) {
      setVerifyMessage(`❌ Reservation ID "${reservationId}" not found.`);
      setLogs((prev) => [...prev, { id: reservationId, status: "Not found", time: timestamp }]);
      return;
    }
    if (existing[idx].verified) {
      setVerifyMessage(`⚠️ Reservation "${reservationId}" is already verified.`);
      setLogs((prev) => [...prev, { id: reservationId, status: "Already verified", time: timestamp }]);
      return;
    }
    existing[idx].verified = true;
    existing[idx].verifiedAt = timestamp;
    localStorage.setItem("reservations", JSON.stringify(existing));
    setReservations(existing);
    setVerifyMessage(`✅ Reservation "${reservationId}" verified successfully.`);
    setLogs((prev) => [...prev, { id: reservationId, status: "Verified", time: timestamp }]);
  }, []);

  /***********************************
   * Derived views
   ***********************************/
  const mine = useMemo(() => reservations.filter((r) => r.pharmacyName === MOCK_ADMIN_PHARMACY), [
    reservations,
  ]);

  const filtered = useMemo(() => {
    let rows = mine;
    if (statusFilter !== "all") {
      rows = rows.filter((r) => (statusFilter === "verified" ? r.verified : !r.verified));
    }
    const q = query.toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.userName?.toLowerCase().includes(q) ||
          r.medicine?.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "oldest":
        rows = [...rows].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case "user":
        rows = [...rows].sort((a, b) => (a.userName || "").localeCompare(b.userName || ""));
        break;
      case "medicine":
        rows = [...rows].sort((a, b) => (a.medicine || "").localeCompare(b.medicine || ""));
        break;
      default:
        rows = [...rows].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return rows;
  }, [mine, query, statusFilter, sortBy]);

  const pendingCount = mine.filter((r) => !r.verified).length;
  const verifiedCount = mine.filter((r) => r.verified).length;

  /***********************************
   * Bulk actions
   ***********************************/
  const exportReservationsCSV = () => {
    if (!filtered.length) return;
    download("reservations.csv", toCSV(filtered), "text/csv;charset=utf-8");
  };

  const clearLogs = () => {
    if (!logs.length) return;
    if (!window.confirm("Clear all verification logs?")) return;
    setLogs([]);
    localStorage.removeItem("verificationLogs");
  };

  const exportLogs = () => {
    if (!logs.length) return;
    download("all-verification-logs.json", JSON.stringify(logs, null, 2), "application/json");
  };

  /***********************************
   * UI
   ***********************************/
  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl text-left md:text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-sm text-gray-500">Scan & verify reservations, review activity, export logs.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
            >
              <ListChecks className="h-4 w-4" /> Dashboard
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="text-amber-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Verified</p>
                <p className="text-2xl font-bold">{verifiedCount}</p>
              </div>
              <CheckCircle2 className="text-emerald-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total (this pharmacy)</p>
                <p className="text-2xl font-bold">{mine.length}</p>
              </div>
              <ScanLine className="text-indigo-600" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "verify", label: "Verify" },
            { key: "reservations", label: "Reservations" },
            { key: "logs", label: "Logs" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                "px-4 py-2 rounded-md border",
                activeTab === t.key ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Verify Tab */}
        {activeTab === "verify" && (
          <Card className="mb-8">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Verify Reservation</h2>
                <span className="text-xs text-gray-500">Pharmacy: {MOCK_ADMIN_PHARMACY}</span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="md:col-span-2">
                  <ScannerInput onVerify={verifyReservation} verifyMessage={verifyMessage} />
                </div>
                <div className="bg-gray-50 rounded-md p-3 text-sm">
                  <p className="font-medium mb-1">Tips</p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-600">
                    <li>Scan QR on customer receipt or type reservation ID.</li>
                    <li>Double‑scan will show “Already verified”.</li>
                    <li>Only reservations for <strong>{MOCK_ADMIN_PHARMACY}</strong> are listed.</li>
                  </ul>
                </div>
              </div>
              {verifyMessage && (
                <div className="mt-4 text-sm">
                  {verifyMessage.startsWith("✅") && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-2">{verifyMessage}</div>
                  )}
                  {verifyMessage.startsWith("⚠️") && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 text-amber-700 px-3 py-2">{verifyMessage}</div>
                  )}
                  {verifyMessage.startsWith("❌") && (
                    <div className="rounded-md border border-rose-200 bg-rose-50 text-rose-700 px-3 py-2">{verifyMessage}</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reservations Tab */}
        {activeTab === "reservations" && (
          <Card className="mb-8">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold">Active Reservations</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by ID, user, medicine…"
                      className="pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="py-2 px-2 border rounded-md text-sm"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="py-2 px-2 border rounded-md text-sm"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="user">User</option>
                      <option value="medicine">Medicine</option>
                    </select>
                  </div>
                  <button
                    onClick={exportReservationsCSV}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-md hover:bg-emerald-700"
                  >
                    <Download className="h-4 w-4" /> Export CSV
                  </button>
                </div>
              </div>

              {filtered.length === 0 ? (
                <p className="text-gray-600">No reservations found.</p>
              ) : (
                <div className="overflow-auto">
                  <table className="min-w-[760px] w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="py-2 pr-3">ID</th>
                        <th className="py-2 pr-3">Medicine</th>
                        <th className="py-2 pr-3">User</th>
                        <th className="py-2 pr-3">Status</th>
                        <th className="py-2 pr-3">Created</th>
                        <th className="py-2 pr-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filtered.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="py-2 pr-3 font-medium">{r.id}</td>
                          <td className="py-2 pr-3">{r.medicine}</td>
                          <td className="py-2 pr-3">{r.userName}</td>
                          <td className="py-2 pr-3">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                r.verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                              )}
                            >
                              {r.verified ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Verified
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Pending
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-2 pr-3 whitespace-nowrap">{r.createdAt || "—"}</td>
                          <td className="py-2 pr-3">
                            {!r.verified ? (
                              <button
                                onClick={() => verifyReservation(r.id)}
                                className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                              >
                                Verify
                              </button>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Logs Tab */}
        {activeTab === "logs" && (
          <Card className="mb-8">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Verification Logs</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportLogs}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-md hover:bg-emerald-700"
                  >
                    <Download className="h-4 w-4" /> Download All
                  </button>
                  <button
                    onClick={clearLogs}
                    className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 text-rose-600 border-rose-300"
                  >
                    <Trash2 className="h-4 w-4" /> Clear
                  </button>
                </div>
              </div>

              {logs.length === 0 ? (
                <p className="text-gray-600">No logs yet.</p>
              ) : (
                <div className="overflow-auto">
                  <table className="min-w-[720px] w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="py-2 pr-3">#</th>
                        <th className="py-2 pr-3">Reservation ID</th>
                        <th className="py-2 pr-3">Status</th>
                        <th className="py-2 pr-3">Time</th>
                        <th className="py-2 pr-3">Download</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {logs.map((log, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="py-2 pr-3">{i + 1}</td>
                          <td className="py-2 pr-3 font-medium">{log.id}</td>
                          <td className={cn(
                            "py-2 pr-3",
                            log.status === "Verified"
                              ? "text-emerald-700"
                              : log.status === "Already verified"
                              ? "text-amber-700"
                              : "text-rose-700"
                          )}>{log.status}</td>
                          <td className="py-2 pr-3 whitespace-nowrap">{log.time}</td>
                          <td className="py-2 pr-3">
                            <button
                              onClick={() =>
                                download(`log-${log.id}.json`, JSON.stringify(log, null, 2), "application/json")
                              }
                              className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                            >
                              <Download className="h-4 w-4" /> JSON
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
