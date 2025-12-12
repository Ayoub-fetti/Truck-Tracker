import { useState, useEffect } from "react";
import { trucksService } from "../../services/trucks";

export default function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);
  const [formData, setFormData] = useState({
    immatriculation: "",
    marque: "",
    modele: "",
    kilometrage: "",
    statut: "disponible",
  });

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      const response = await trucksService.getAll();
      setTrucks(response.data);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTruck) {
        await trucksService.update(editingTruck._id, formData);
      } else {
        await trucksService.create(formData);
      }
      fetchTrucks();
      resetForm();
    } catch (error) {
      console.error("Error saving truck:", error);
    }
  };

  const handleEdit = (truck) => {
    setEditingTruck(truck);
    setFormData(truck);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await trucksService.delete(id);
        fetchTrucks();
      } catch (error) {
        console.error("Error deleting truck:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      immatriculation: "",
      marque: "",
      modele: "",
      kilometrage: "",
      statut: "disponible",
    });
    setEditingTruck(null);
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
        <h1 className="text-2xl font-bold">Trucks Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Truck
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingTruck ? "Edit Truck" : "Add New Truck"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Immatriculation"
              value={formData.immatriculation}
              onChange={(e) =>
                setFormData({ ...formData, immatriculation: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Marque"
              value={formData.marque}
              onChange={(e) =>
                setFormData({ ...formData, marque: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Modèle"
              value={formData.modele}
              onChange={(e) =>
                setFormData({ ...formData, modele: e.target.value })
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
            />
            <select
              value={formData.statut}
              onChange={(e) =>
                setFormData({ ...formData, statut: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="disponible">Disponible</option>
              <option value="en_service">En Service</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {editingTruck ? "Update" : "Create"}
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
              <th className="px-6 py-3 text-left">Immatriculation</th>
              <th className="px-6 py-3 text-left">Marque</th>
              <th className="px-6 py-3 text-left">Modèle</th>
              <th className="px-6 py-3 text-left">Kilométrage</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck) => (
              <tr key={truck._id} className="border-t">
                <td className="px-6 py-4">{truck.immatriculation}</td>
                <td className="px-6 py-4">{truck.marque}</td>
                <td className="px-6 py-4">{truck.modele}</td>
                <td className="px-6 py-4">{truck.kilometrage}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      truck.statut === "disponible"
                        ? "bg-green-100 text-green-800"
                        : truck.statut === "en_service"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {truck.statut}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(truck)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(truck._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
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
