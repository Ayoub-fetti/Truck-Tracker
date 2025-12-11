import { useState, useEffect } from 'react';
import { trailersService } from '../../services/trailers';
import { trucksService } from '../../services/trucks';

export default function Trailers() {
  const [trailers, setTrailers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrailer, setEditingTrailer] = useState(null);
  const [formData, setFormData] = useState({
    immatriculation: '',
    type: '',
    capacite: '',
    kilometrage: '',
    truckAttache: '',
    statut: 'disponible'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trailersRes, trucksRes] = await Promise.all([
        trailersService.getAll(),
        trucksService.getAll()
      ]);
      setTrailers(trailersRes.data);
      setTrucks(trucksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      console.error('Error saving trailer:', error);
    }
  };

  const handleEdit = (trailer) => {
    setEditingTrailer(trailer);
    setFormData(trailer);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await trailersService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting trailer:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      immatriculation: '', type: '', capacite: '', kilometrage: '', 
      truckAttache: '', statut: 'disponible' 
    });
    setEditingTrailer(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trailers Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Trailer
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingTrailer ? 'Edit Trailer' : 'Add New Trailer'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Immatriculation"
              value={formData.immatriculation}
              onChange={(e) => setFormData({...formData, immatriculation: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Type"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Capacité"
              value={formData.capacite}
              onChange={(e) => setFormData({...formData, capacite: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Kilométrage"
              value={formData.kilometrage}
              onChange={(e) => setFormData({...formData, kilometrage: e.target.value})}
              className="border p-2 rounded"
            />
            <select
              value={formData.truckAttache}
              onChange={(e) => setFormData({...formData, truckAttache: e.target.value})}
              className="border p-2 rounded"
            >
              <option value="">Truck Attaché (Optional)</option>
              {trucks.map(truck => (
                <option key={truck._id} value={truck._id}>{truck.immatriculation}</option>
              ))}
            </select>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({...formData, statut: e.target.value})}
              className="border p-2 rounded"
            >
              <option value="disponible">Disponible</option>
              <option value="en_service">En Service</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                {editingTrailer ? 'Update' : 'Create'}
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
              <tr key={trailer._id} className="border-t">
                <td className="px-6 py-4">{trailer.immatriculation}</td>
                <td className="px-6 py-4">{trailer.type}</td>
                <td className="px-6 py-4">{trailer.capacite}</td>
                <td className="px-6 py-4">{trailer.kilometrage}</td>
                <td className="px-6 py-4">{trailer.truckAttache?.immatriculation || 'None'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    trailer.statut === 'disponible' ? 'bg-green-100 text-green-800' :
                    trailer.statut === 'en_service' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {trailer.statut}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(trailer)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trailer._id)}
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
