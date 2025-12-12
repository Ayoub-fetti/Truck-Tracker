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

    {/* Page Header */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-gray-800">Trucks Management</h1>

      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2.5 bg-blue-600 text-white rounded-xl shadow-sm 
                   hover:bg-blue-700 transition font-medium"
      >
        Add Truck
      </button>
    </div>

    {/* Form Section */}
    {showForm && (
      <div className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {editingTruck ? "Edit Truck" : "Add New Truck"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Immatriculation"
            value={formData.immatriculation}
            onChange={(e) =>
              setFormData({ ...formData, immatriculation: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2.5 focus:outline-none 
                       focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            placeholder="Marque"
            value={formData.marque}
            onChange={(e) =>
              setFormData({ ...formData, marque: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2.5 focus:outline-none 
                       focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            placeholder="Modèle"
            value={formData.modele}
            onChange={(e) =>
              setFormData({ ...formData, modele: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2.5 focus:outline-none 
                       focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="number"
            placeholder="Kilométrage"
            value={formData.kilometrage}
            onChange={(e) =>
              setFormData({ ...formData, kilometrage: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2.5 focus:outline-none 
                       focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={formData.statut}
            onChange={(e) =>
              setFormData({ ...formData, statut: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2.5 focus:outline-none 
                       focus:ring-2 focus:ring-blue-400"
          >
            <option value="disponible">Disponible</option>
            <option value="en_service">En Service</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {editingTruck ? "Update" : "Create"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    )}

    {/* Table Section */}
    <div className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-700 font-medium">
          <tr>
            <th className="px-6 py-3">Immatriculation</th>
            <th className="px-6 py-3">Marque</th>
            <th className="px-6 py-3">Modèle</th>
            <th className="px-6 py-3">Kilométrage</th>
            <th className="px-6 py-3">Statut</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="text-gray-800">
          {trucks.map((truck) => (
            <tr
              key={truck._id}
              className="border-t border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4">{truck.immatriculation}</td>
              <td className="px-6 py-4">{truck.marque}</td>
              <td className="px-6 py-4">{truck.modele}</td>
              <td className="px-6 py-4">{truck.kilometrage}</td>

              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 rounded-md text-sm font-medium ${
                    truck.statut === "disponible"
                      ? "bg-green-100 text-green-700"
                      : truck.statut === "en_service"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {truck.statut}
                </span>
              </td>

              <td className="px-6 py-4 flex gap-3">
                <button
                  onClick={() => handleEdit(truck)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(truck._id)}
                  className="text-red-600 hover:text-red-800 font-medium"
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
