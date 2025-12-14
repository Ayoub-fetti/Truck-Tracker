// frontend/src/pages/admin/trips.jsx
import { useState, useEffect } from "react";
import { tripsService } from "../../services/trips";
import { trucksService } from "../../services/trucks";
import { trailersService } from "../../services/trailers";
import { usersService } from "../../services/users";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState({
    truck: "",
    trailer: "",
    chauffeur: "",
    depart: "",
    destination: "",
    dateDepart: "",
    kilometrageDepart: "",
    marchandise: "",
    statut: "planifié",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tripsRes, trucksRes, trailersRes, driversRes] = await Promise.all([
        tripsService.getAll(),
        trucksService.getAll(),
        trailersService.getAll(),
        usersService.getDriversFromTrucks(),
      ]);
      setTrips(tripsRes.data);
      setTrucks(trucksRes.data);
      setTrailers(trailersRes.data);
      setDrivers(driversRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrip) {
        await tripsService.update(editingTrip._id, formData);
      } else {
        await tripsService.create(formData);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setFormData({
      ...trip,
      truck: trip.truck?._id || trip.truck || "",
      trailer: trip.trailer?._id || trip.trailer || "",
      chauffeur: trip.chauffeur?._id || trip.chauffeur || "",
      dateDepart: trip.dateDepart?.split("T")[0] || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      truck: "",
      trailer: "",
      chauffeur: "",
      depart: "",
      destination: "",
      dateDepart: "",
      kilometrageDepart: "",
      marchandise: "",
      statut: "planifié",
    });
    setEditingTrip(null);
    setShowForm(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
      </div>
    );
  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Trips Management
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-sm 
                   hover:bg-blue-700 transition-all"
        >
          Add Trip
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-gray-100">
          <h2 className="text-xl font-bold mb-5 text-gray-800">
            {editingTrip ? "Edit Trip" : "Add New Trip"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              type="text"
              placeholder="Départ"
              value={formData.depart}
              onChange={(e) =>
                setFormData({ ...formData, depart: e.target.value })
              }
              className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
              required
            />

            <input
              type="text"
              placeholder="Destination"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
              required
            />

            <select
              value={formData.truck}
              onChange={(e) =>
                setFormData({ ...formData, truck: e.target.value })
              }
              className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
              required
            >
              <option value="">Select Truck</option>
              {trucks.map((truck) => (
                <option key={truck._id} value={truck._id}>
                  {truck.immatriculation}
                </option>
              ))}
            </select>

            <select
              value={formData.trailer}
              onChange={(e) =>
                setFormData({ ...formData, trailer: e.target.value })
              }
              className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
            >
              <option value="">Select Trailer (Optional)</option>
              {trailers.map((trailer) => (
                <option key={trailer._id} value={trailer._id}>
                  {trailer.immatriculation}
                </option>
              ))}
            </select>

            <select
              value={formData.chauffeur}
              onChange={(e) =>
                setFormData({ ...formData, chauffeur: e.target.value })
              }
              className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
              required
            >
              <option value="">Select Chauffeur</option>
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.nom}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={formData.dateDepart}
              onChange={(e) =>
                setFormData({ ...formData, dateDepart: e.target.value })
              }
              className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
              required
            />

            <input
              type="number"
              placeholder="Kilométrage Départ"
              value={formData.kilometrageDepart}
              onChange={(e) =>
                setFormData({ ...formData, kilometrageDepart: e.target.value })
              }
              className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
              required
            />

            <input
              type="text"
              placeholder="Marchandise"
              value={formData.marchandise}
              onChange={(e) =>
                setFormData({ ...formData, marchandise: e.target.value })
              }
              className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
            />

            <select
              value={formData.statut}
              onChange={(e) =>
                setFormData({ ...formData, statut: e.target.value })
              }
              className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 col-span-2"
            >
              <option value="planifié">Planifié</option>
              <option value="en_cours">En Cours</option>
              <option value="terminé">Terminé</option>
              <option value="annulé">Annulé</option>
            </select>

            <div className="flex gap-3 col-span-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-5 py-2.5 rounded-xl shadow-sm 
                         hover:bg-green-700 transition-all"
              >
                {editingTrip ? "Update" : "Create"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-5 py-2.5 rounded-xl shadow-sm 
                         hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-gray-600 uppercase text-sm">
              <th className="px-1 py-1 text-left">Départ</th>
              <th className="px-1 py-1 text-left">Destination</th>
              <th className="px-1 py-1 text-left">Truck</th>
              <th className="px-1 py-1 text-left">Trailer</th>
              <th className="px-1 py-1 text-left">Chauffeur</th>
              <th className="px-1 py-1 text-left">Marchandise</th>
              <th className="px-1 py-1 text-left">Statut</th>
              <th className="px-1 py-1 text-left">Date Depart</th>
              <th className="px-1 py-1 text-left">kilometrage Depart</th>
              <th className="px-1 py-1 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {trips.map((trip) => (
              <tr
                key={trip._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-1 py-1">{trip.depart}</td>
                <td className="px-1 py-1">{trip.destination}</td>
                <td className="px-1 py-1">{trip.truck?.immatriculation}</td>
                <td className="px-1 py-1">
                  {trip.trailer?.immatriculation || "None"}
                </td>
                <td className="px-1 py-1">
                  {trip.chauffeur?.nom || trip.chauffeur}
                </td>
                <td className="px-1 py-1">{trip.marchandise}</td>
                <td className="px-1 py-1">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium
                    ${
                      trip.statut === "terminé"
                        ? "bg-green-100 text-green-700"
                        : trip.statut === "en_cours"
                        ? "bg-blue-100 text-blue-700"
                        : trip.statut === "annulé"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {trip.statut}
                  </span>
                </td>
                <td className="px-1 py-1">
                  {new Date(trip.dateDepart).toLocaleDateString("fr-FR")}
                </td>{" "}
                <td className="px-1 py-1">
                  {trip.kilometrageDepart}
                </td>
                <td className="px-1 py-1">
                  <button
                    onClick={() => handleEdit(trip)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <i class="fa-solid fa-marker text-orange-600"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
