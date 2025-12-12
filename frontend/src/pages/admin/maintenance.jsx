// frontend/src/pages/admin/maintenance.jsx
import { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/maintenance';
import { trucksService } from '../../services/trucks';
import { trailersService } from '../../services/trailers';

export default function Maintenance() {
  const [maintenance, setMaintenance] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [formData, setFormData] = useState({
    vehicule: '',
    vehiculeType: 'Truck',
    type: 'révision',
    description: '',
    cout: '',
    kilometrage: '',
    prochaineMaintenance: '',
    statut: 'planifiée',
    garage: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [maintenanceRes, trucksRes, trailersRes] = await Promise.all([
        maintenanceService.getAll(),
        trucksService.getAll(),
        trailersService.getAll()
      ]);
      setMaintenance(maintenanceRes.data);
      setTrucks(trucksRes.data);
      setTrailers(trailersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMaintenance) {
        await maintenanceService.update(editingMaintenance._id, formData);
      } else {
        await maintenanceService.create(formData);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving maintenance:', error);
    }
  };

  const handleEdit = (maintenance) => {
    setEditingMaintenance(maintenance);
    setFormData({
      ...maintenance,
      prochaineMaintenance: maintenance.prochaineMaintenance?.split('T')[0] || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await maintenanceService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting maintenance:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      vehicule: '', vehiculeType: 'Truck', type: 'révision', description: '', 
      cout: '', kilometrage: '', prochaineMaintenance: '', statut: 'planifiée', garage: ''
    });
    setEditingMaintenance(null);
    setShowForm(false);
  };

  const getVehicleOptions = () => {
    return formData.vehiculeType === 'Truck' ? trucks : trailers;
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
        <h1 className="text-2xl font-bold">Maintenance Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Maintenance
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingMaintenance ? 'Edit Maintenance' : 'Add New Maintenance'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <select
              value={formData.vehiculeType}
              onChange={(e) => setFormData({...formData, vehiculeType: e.target.value, vehicule: ''})}
              className="border p-2 rounded"
              required
            >
              <option value="Truck">Truck</option>
              <option value="Trailer">Trailer</option>
            </select>
            <select
              value={formData.vehicule}
              onChange={(e) => setFormData({...formData, vehicule: e.target.value})}
              className="border p-2 rounded"
              required
            >
              <option value="">Select {formData.vehiculeType}</option>
              {getVehicleOptions().map(vehicle => (
                <option key={vehicle._id} value={vehicle._id}>{vehicle.immatriculation}</option>
              ))}
            </select>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="border p-2 rounded"
              required
            >
              <option value="révision">Révision</option>
              <option value="réparation">Réparation</option>
              <option value="vidange">Vidange</option>
              <option value="pneus">Pneus</option>
              <option value="autre">Autre</option>
            </select>
            <input
              type="number"
              placeholder="Coût"
              value={formData.cout}
              onChange={(e) => setFormData({...formData, cout: e.target.value})}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="border p-2 rounded col-span-2"
              rows="3"
              required
            />
            <input
              type="number"
              placeholder="Kilométrage"
              value={formData.kilometrage}
              onChange={(e) => setFormData({...formData, kilometrage: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="date"
              placeholder="Prochaine Maintenance"
              value={formData.prochaineMaintenance}
              onChange={(e) => setFormData({...formData, prochaineMaintenance: e.target.value})}
              className="border p-2 rounded"
            />
            <select
              value={formData.statut}
              onChange={(e) => setFormData({...formData, statut: e.target.value})}
              className="border p-2 rounded"
            >
              <option value="planifiée">Planifiée</option>
              <option value="en_cours">En Cours</option>
              <option value="terminée">Terminée</option>
            </select>
            <input
              type="text"
              placeholder="Garage"
              value={formData.garage}
              onChange={(e) => setFormData({...formData, garage: e.target.value})}
              className="border p-2 rounded"
            />
            <div className="flex gap-2 col-span-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                {editingMaintenance ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
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
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Coût</th>
              <th className="px-6 py-3 text-left">Kilométrage</th>
              <th className="px-6 py-3 text-left">Garage</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {maintenance.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="px-6 py-4">{item.vehicule?.immatriculation}</td>
                <td className="px-6 py-4">{item.type}</td>
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4">{item.cout}€</td>
                <td className="px-6 py-4">{item.kilometrage}</td>
                <td className="px-6 py-4">{item.garage}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    item.statut === 'terminée' ? 'bg-green-100 text-green-800' :
                    item.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.statut}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
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
