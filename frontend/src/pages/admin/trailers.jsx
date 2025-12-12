import { useState, useEffect } from "react";
import { trailersService } from "../../services/trailers";
import { trucksService } from "../../services/trucks";

export default function Trailers() {
  const [trailers, setTrailers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrailer, setEditingTrailer] = useState(null);
  const [formData, setFormData] = useState({
    immatriculation: "",
    type: "",
    capacite: "",
    kilometrage: "",
    truckAttache: "",
    statut: "disponible",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trailersRes, trucksRes] = await Promise.all([
        trailersService.getAll(),
        trucksService.getAll(),
      ]);
      setTrailers(trailersRes.data);
      setTrucks(trucksRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrailer) {
        await trailersService.update(editingTrailer._id, formData);
      } else {
        await trailersService.create(formData);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Error saving trailer:", error);
    }
  };

  const handleEdit = (trailer) => {
    setEditingTrailer(trailer);
    setFormData(trailer);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await trailersService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting trailer:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      immatriculation: "",
      type: "",
      capacite: "",
      kilometrage: "",
      truckAttache: "",
      statut: "disponible",
    });
    setEditingTrailer(null);
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
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-semibold text-gray-800">Trailers Management</h1>

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-sm 
                   hover:bg-blue-700 transition-all"
      >
        Add Trailer
      </button>
    </div>

    {/* FORM */}
    {showForm && (
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-gray-100">
        <h2 className="text-xl font-bold mb-5 text-gray-800">
          {editingTrailer ? "Edit Trailer" : "Add New Trailer"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input
            type="text"
            placeholder="Immatriculation"
            value={formData.immatriculation}
            onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
            required
          />

          <input
            type="text"
            placeholder="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
            required
          />

          <input
            type="number"
            placeholder="Capacité"
            value={formData.capacite}
            onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
          />

          <input
            type="number"
            placeholder="Kilométrage"
            value={formData.kilometrage}
            onChange={(e) => setFormData({ ...formData, kilometrage: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
          />

          <select
            value={formData.truckAttache}
            onChange={(e) => setFormData({ ...formData, truckAttache: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
          >
            <option value="">Truck Attaché (Optional)</option>
            {trucks.map((truck) => (
              <option key={truck._id} value={truck._id}>
                {truck.immatriculation}
              </option>
            ))}
          </select>

          <select
            value={formData.statut}
            onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
          >
            <option value="disponible">Disponible</option>
            <option value="en_service">En Service</option>
            <option value="maintenance">Maintenance</option>
          </select>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2.5 rounded-xl shadow-sm 
                         hover:bg-green-700 transition-all"
            >
              {editingTrailer ? "Update" : "Create"}
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
            <th className="px-6 py-3 text-left">Immatriculation</th>
            <th className="px-6 py-3 text-left">Type</th>
            <th className="px-6 py-3 text-left">Capacité</th>
            <th className="px-6 py-3 text-left">Kilométrage</th>
            <th className="px-6 py-3 text-left">Truck Attaché</th>
            <th className="px-6 py-3 text-left">Statut</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {trailers.map((trailer) => (
            <tr key={trailer._id} className="border-t hover:bg-gray-50 transition">
              <td className="px-6 py-4">{trailer.immatriculation}</td>
              <td className="px-6 py-4">{trailer.type}</td>
              <td className="px-6 py-4">{trailer.capacite}</td>
              <td className="px-6 py-4">{trailer.kilometrage}</td>
              <td className="px-6 py-4">
                {trailer.truckAttache?.immatriculation || "None"}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium
                    ${
                      trailer.statut === "disponible"
                        ? "bg-green-100 text-green-700"
                        : trailer.statut === "en_service"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {trailer.statut}
                </span>
              </td>

              <td className="px-6 py-4">
                <button
                  onClick={() => handleEdit(trailer)}
                  className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(trailer._id)}
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
