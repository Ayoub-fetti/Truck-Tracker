import { useState, useEffect } from "react";
import { fuelService } from "../../services/fuel";
import { trucksService } from "../../services/trucks";
import { usersService } from "../../services/users";

export default function Fuel() {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFuel, setEditingFuel] = useState(null);
  const [formData, setFormData] = useState({
    truck: "",
    chauffeur: "",
    quantite: "",
    cout: "",
    kilometrage: "",
    station: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fuelRes, trucksRes, driversRes] = await Promise.all([
        fuelService.getAll(),
        trucksService.getAll(),
        usersService.getDriversFromTrucks(),
      ]);
      setFuelLogs(fuelRes.data);
      setTrucks(trucksRes.data);
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
      if (editingFuel) {
        await fuelService.update(editingFuel._id, formData);
      } else {
        await fuelService.create(formData);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Error saving fuel log:", error);
    }
  };

  const handleEdit = (fuel) => {
    setEditingFuel(fuel);
    setFormData({
      ...fuel,
      truck: fuel.truck?._id || fuel.truck || "",
      chauffeur: fuel.chauffeur?._id || fuel.chauffeur || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await fuelService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting fuel log:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      truck: "",
      chauffeur: "",
      quantite: "",
      cout: "",
      kilometrage: "",
      station: "",
    });
    setEditingFuel(null);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fuel Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Fuel Log
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingFuel ? "Edit Fuel Log" : "Add New Fuel Log"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <select
              value={formData.truck}
              onChange={(e) =>
                setFormData({ ...formData, truck: e.target.value })
              }
              className="border p-2 rounded"
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
              value={formData.chauffeur}
              onChange={(e) =>
                setFormData({ ...formData, chauffeur: e.target.value })
              }
              className="border p-2 rounded"
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
              type="number"
              placeholder="Quantité (L)"
              value={formData.quantite}
              onChange={(e) =>
                setFormData({ ...formData, quantite: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Coût"
              value={formData.cout}
              onChange={(e) =>
                setFormData({ ...formData, cout: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Kilométrage"
              value={formData.kilometrage}
              onChange={(e) =>
                setFormData({ ...formData, kilometrage: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Station"
              value={formData.station}
              onChange={(e) =>
                setFormData({ ...formData, station: e.target.value })
              }
              className="border p-2 rounded"
            />
            <div className="flex gap-2 col-span-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {editingFuel ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Truck</th>
              <th className="px-6 py-3 text-left">Chauffeur</th>
              <th className="px-6 py-3 text-left">Quantité (L)</th>
              <th className="px-6 py-3 text-left">Coût</th>
              <th className="px-6 py-3 text-left">Kilométrage</th>
              <th className="px-6 py-3 text-left">Station</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fuelLogs.map((fuel) => (
              <tr key={fuel._id} className="border-t">
                <td className="px-6 py-4">{fuel.truck?.immatriculation}</td>
                <td className="px-6 py-4">{fuel.chauffeur?.nom}</td>
                <td className="px-6 py-4">{fuel.quantite}</td>
                <td className="px-6 py-4">{fuel.cout}€</td>
                <td className="px-6 py-4">{fuel.kilometrage}</td>
                <td className="px-6 py-4">{fuel.station}</td>
                <td className="px-6 py-4">
                  {new Date(fuel.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(fuel)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    <i class="fa-solid fa-marker text-orange-600"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(fuel._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <i class="fa-solid fa-trash-can text-red-500"></i>
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
