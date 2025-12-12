import { useState, useEffect } from "react";
import { trucksService } from "../../services/trucks";
import { tripsService } from "../../services/trips";
import { maintenanceService } from "../../services/maintenance";
import { tiresService } from "../../services/tires";
import { trailersService } from "../../services/trailers";
import { fuelService } from "../../services/fuel";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTrucks: 0,
    totalTrailers: 0,
    activeTrips: 0,
    pendingMaintenance: 0,
    totalTires: 0,
    totalFuelLogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [trucks, trailers, trips, maintenance, tires, fuel] =
        await Promise.all([
          trucksService.getAll(),
          trailersService.getAll(),
          tripsService.getAll(),
          maintenanceService.getAll(),
          tiresService.getAll(),
          fuelService.getAll(),
        ]);

      setStats({
        totalTrucks: trucks.data.length,
        totalTrailers: trailers.data.length,
        activeTrips: trips.data.filter((trip) => trip.status === "active")
          .length,
        pendingMaintenance: maintenance.data.filter(
          (m) => m.status === "pending"
        ).length,
        totalTires: tires.data.length,
        totalFuelLogs: fuel.data.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Trucks</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalTrucks}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Trailers</h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalTrailers}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Active Trips</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.activeTrips}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Pending Maintenance</h3>
          <p className="text-3xl font-bold text-red-600">
            {stats.pendingMaintenance}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Tires</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.totalTires}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Fuel Logs</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {stats.totalFuelLogs}
          </p>
        </div>
      </div>
    </div>
  );
}
