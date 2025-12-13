import { useState, useEffect } from "react";
import { trucksService } from "../../services/trucks";
import { tripsService } from "../../services/trips";
import { maintenanceService } from "../../services/maintenance";
import { tiresService } from "../../services/tires";
import { trailersService } from "../../services/trailers";
import { fuelService } from "../../services/fuel";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

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
        activeTrips: trips.data.filter((trip) => trip.statut === "en_cours")
          .length,
        pendingMaintenance: maintenance.data.filter(
          (m) => m.statut === "en_cours"
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

  const fleetData = {
    labels: ["Trucks", "Trailers", "Tires"],
    datasets: [
      {
        label: "Fleet Overview",
        data: [stats.totalTrucks, stats.totalTrailers, stats.totalTires],
        backgroundColor: ["#3b82f6", "#10b981", "#eab308"],
      },
    ],
  };

  const tripsData = {
    labels: ["Active Trips", "Pending Maintenance"],
    datasets: [
      {
        data: [stats.activeTrips, stats.pendingMaintenance],
        backgroundColor: ["#8b5cf6", "#ef4444"],
      },
    ],
  };

  const activityData = {
    labels: ["Trucks", "Trailers", "Trips", "Maintenance", "Fuel Logs"],
    datasets: [
      {
        label: "Activity",
        data: [
          stats.totalTrucks,
          stats.totalTrailers,
          stats.activeTrips,
          stats.pendingMaintenance,
          stats.totalFuelLogs,
        ],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
      },
    ],
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 p-6 rounded-xl hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Total Trucks</h3>
          <p className="mt-2 text-4xl font-bold text-blue-600 tracking-tight">
            {stats.totalTrucks}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 p-6 rounded-xl hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Total Trailers</h3>
          <p className="mt-2 text-4xl font-bold text-green-600 tracking-tight">
            {stats.totalTrailers}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 p-6 rounded-xl hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Active Trips</h3>
          <p className="mt-2 text-4xl font-bold text-purple-600 tracking-tight">
            {stats.activeTrips}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 p-6 rounded-xl hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">
            Pending Maintenance
          </h3>
          <p className="mt-2 text-4xl font-bold text-red-600 tracking-tight">
            {stats.pendingMaintenance}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 p-6 rounded-xl hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Total Tires</h3>
          <p className="mt-2 text-4xl font-bold text-yellow-600 tracking-tight">
            {stats.totalTires}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 p-6 rounded-xl hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Fuel Logs</h3>
          <p className="mt-2 text-4xl font-bold text-indigo-600 tracking-tight">
            {stats.totalFuelLogs}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Fleet Overview
          </h2>
          <Bar data={fleetData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Operations Status
          </h2>
          <Doughnut data={tripsData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Activity Overview
          </h2>
          <Line data={activityData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}
