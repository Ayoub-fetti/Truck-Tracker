// frontend/src/pages/admin/tires.jsx
import { useState, useEffect } from "react";
import { tiresService } from "../../services/tires";
import { trucksService } from "../../services/trucks";
import { trailersService } from "../../services/trailers";

export default function Tires() {
  const [tires, setTires] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTire, setEditingTire] = useState(null);
  const [formData, setFormData] = useState({
    vehicule: "",
    vehiculeType: "Truck",
    position: "",
    marque: "",
    etat: "bon",
    pressionRecommandee: "",
    kilometrageInstallation: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tiresRes, trucksRes, trailersRes] = await Promise.all([
        tiresService.getAll(),
        trucksService.getAll(),
        trailersService.getAll(),
      ]);
      setTires(tiresRes.data);
      setTrucks(trucksRes.data);
      setTrailers(trailersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTire) {
        await tiresService.update(editingTire._id, formData);
      } else {
        await tiresService.create(formData);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Error saving tire:", error);
    }
  };

  const handleEdit = (tire) => {
    setEditingTire(tire);
    setFormData(tire);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await tiresService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting tire:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      vehicule: "",
      vehiculeType: "Truck",
      position: "",
      marque: "",
      etat: "bon",
      pressionRecommandee: "",
      kilometrageInstallation: "",
    });
    setEditingTire(null);
    setShowForm(false);
  };

  const getVehicleOptions = () => {
    return formData.vehiculeType === "Truck" ? trucks : trailers;
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
        <h1 className="text-2xl font-bold">Tires Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Tire
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingTire ? "Edit Tire" : "Add New Tire"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <select
              value={formData.vehiculeType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vehiculeType: e.target.value,
                  vehicule: "",
                })
              }
              className="border p-2 rounded"
              required
            >
              <option value="Truck">Truck</option>
              <option value="Trailer">Trailer</option>
            </select>
            <select
              value={formData.vehicule}
              onChange={(e) =>
                setFormData({ ...formData, vehicule: e.target.value })
              }
              className="border p-2 rounded"
              required
            >
              <option value="">Select {formData.vehiculeType}</option>
              {getVehicleOptions().map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.immatriculation}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
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
            />
            <select
              value={formData.etat}
              onChange={(e) =>
                setFormData({ ...formData, etat: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="neuf">Neuf</option>
              <option value="bon">Bon</option>
              <option value="moyen">Moyen</option>
              <option value="usé">Usé</option>
              <option value="à_changer">À Changer</option>
            </select>
            <input
              type="number"
              placeholder="Pression Recommandée"
              value={formData.pressionRecommandee}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pressionRecommandee: e.target.value,
                })
              }
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Kilométrage Installation"
              value={formData.kilometrageInstallation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kilometrageInstallation: e.target.value,
                })
              }
              className="border p-2 rounded"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {editingTire ? "Update" : "Create"}
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
              <th className="px-6 py-3 text-left">Véhicule</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Position</th>
              <th className="px-6 py-3 text-left">Marque</th>
              <th className="px-6 py-3 text-left">État</th>
              <th className="px-6 py-3 text-left">Pression</th>
              <th className="px-6 py-3 text-left">Km Installation</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tires.map((tire) => (
              <tr key={tire._id} className="border-t">
                <td className="px-6 py-4">{tire.vehicule?.immatriculation}</td>
                <td className="px-6 py-4">{tire.vehiculeType}</td>
                <td className="px-6 py-4">{tire.position}</td>
                <td className="px-6 py-4">{tire.marque}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      tire.etat === "neuf" || tire.etat === "bon"
                        ? "bg-green-100 text-green-800"
                        : tire.etat === "moyen"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tire.etat}
                  </span>
                </td>
                <td className="px-6 py-4">{tire.pressionRecommandee}</td>
                <td className="px-6 py-4">{tire.kilometrageInstallation}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(tire)}
                    className="text-blue-600 hover:text-blue-800 mr-4 "
                  >
                    <i class="fa-solid fa-marker text-orange-600"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(tire._id)}
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
