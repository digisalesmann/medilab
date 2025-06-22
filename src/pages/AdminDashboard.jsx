// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { Card, CardContent } from '../components/ui/card'; // or use your own Card component
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Package, Pill, AlertTriangle, Activity } from 'lucide-react';


const mockStats = {
  totalMedicines: 312,
  topReserved: ['Paracetamol', 'Amoxicillin', 'Ventolin'],
  lowStock: [
    { name: 'Ibuprofen', quantity: 3 },
    { name: 'Cough Syrup', quantity: 2 },
  ],
  reservationsOverTime: [
    { day: 'Mon', count: 10 },
    { day: 'Tue', count: 15 },
    { day: 'Wed', count: 7 },
    { day: 'Thu', count: 20 },
    { day: 'Fri', count: 25 },
  ],
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setStats(mockStats);
    }, 500);
  }, []);

  if (!stats) return <div className="p-4">Loading dashboard...</div>;

  return (
    <AdminLayout>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold">Admin Analytics Dashboard</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <Package className="text-blue-500" />
              <div>
                <p className="text-sm text-muted">Total Medicines</p>
                <h2 className="text-xl font-bold">{stats.totalMedicines}</h2>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <Pill className="text-green-500" />
              <div>
                <p className="text-sm text-muted">Top Reserved</p>
                <ul className="text-md font-medium">
                  {stats.topReserved.map((med, i) => (
                    <li key={i}>{med}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <AlertTriangle className="text-red-500" />
              <div>
                <p className="text-sm text-muted">Low Stock Alerts</p>
                <ul>
                  {stats.lowStock.map((item, i) => (
                    <li key={i}>{item.name} ({item.quantity})</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <Activity className="text-purple-500" />
              <div>
                <p className="text-sm text-muted">Total Reservations</p>
                <h2 className="text-xl font-bold">
                  {stats.reservationsOverTime.reduce((a, b) => a + b.count, 0)}
                </h2>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">Reservation Trends (This Week)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.reservationsOverTime}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
