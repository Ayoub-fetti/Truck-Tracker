import { useState, useEffect } from 'react';
import { trucksService } from '../../services/trucks';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTrucks: 0,
    activeTrips: 0,
    pendingMaintenance: 0
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Camions</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalTrucks}</p>
        </div>
      </div>
    </div>
  );
}
