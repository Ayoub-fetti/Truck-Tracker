// frontend/src/pages/admin/trips.jsx
import { useState, useEffect } from 'react';
import { tripsService } from '../../services/trips';
import { trucksService } from '../../services/trucks';
import { trailersService } from '../../services/trailers';
import { usersService } from '../../services/users';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState({
    truck: '',
    trailer: '',
    chauffeur: '',
    depart: '',
    destination: '',
    dateDepart: '',
    kilometrageDepart: '',
    marchandise: '',
    statut: 'planifié'
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
        usersService.getDriversFromTrucks()
      ]);
      setTrips(tripsRes.data);
      setTrucks(trucksRes.data);
      setTrailers(trailersRes.data);
      setDrivers(driversRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      console.error('Error saving trip:', error);
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setFormData({
      ...trip,
      truck: trip.truck?._id || trip.truck || '',
      trailer: trip.trailer?._id || trip.trailer || '',
      chauffeur: trip.chauffeur?._id || trip.chauffeur || '',
      dateDepart: trip.dateDepart?.split('T')[0] || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      truck: '', trailer: '', chauffeur: '', depart: '', destination: '', 
      dateDepart: '', kilometrageDepart: '', marchandise: '', statut: 'planifié'
    });
    setEditingTrip(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trips Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Trip
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingTrip ? 'Edit Trip' : 'Add New Trip'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Départ"
              value={formData.depart}
              onChange={(e) => setFormData({...formData, depart: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Destination"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <select
              value={formData.truck}
              onChange={(e) => setFormData({...formData, truck: e.target.value})}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Truck</option>
              {trucks.map(truck => (
                <option key={truck._id} value={truck._id}>{truck.immatriculation}</option>
              ))}
            </select>
            <select
              value={formData.trailer}
              onChange={(e) => setFormData({...formData, trailer: e.target.value})}
              className="border p-2 rounded"
            >
              <option value="">Select Trailer (Optional)</option>
              {trailers.map(trailer => (
                <option key={trailer._id} value={trailer._id}>{trailer.immatriculation}</option>
              ))}
            </select>
            <select
              value={formData.chauffeur}
              onChange={(e) => setFormData({...formData, chauffeur: e.target.value})}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Chauffeur</option>
              {drivers.map(driver => (
                <option key={driver._id} value={driver._id}>{driver.nom}</option>
              ))}
            </select>
            <input
              type="date"
              value={formData.dateDepart}
              onChange={(e) => setFormData({...formData, dateDepart: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Kilométrage Départ"
              value={formData.kilometrageDepart}
              onChange={(e) => setFormData({...formData, kilometrageDepart: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Marchandise"
              value={formData.marchandise}
              onChange={(e) => setFormData({...formData, marchandise: e.target.value})}
              className="border p-2 rounded"
            />
            <select
              value={formData.statut}
              onChange={(e) => setFormData({...formData, statut: e.target.value})}
              className="border p-2 rounded col-span-2"
            >
              <option value="planifié">Planifié</option>
              <option value="en_cours">En Cours</option>
              <option value="terminé">Terminé</option>
              <option value="annulé">Annulé</option>
            </select>
            <div className="flex gap-2 col-span-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                {editingTrip ? 'Update' : 'Create'}
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
              <th className="px-6 py-3 text-left">Départ</th>
              <th className="px-6 py-3 text-left">Destination</th>
              <th className="px-6 py-3 text-left">Truck</th>
              <th className="px-6 py-3 text-left">Trailer</th>
              <th className="px-6 py-3 text-left">Chauffeur</th>
              <th className="px-6 py-3 text-left">Marchandise</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id} className="border-t">
                <td className="px-6 py-4">{trip.depart}</td>
                <td className="px-6 py-4">{trip.destination}</td>
                <td className="px-6 py-4">{trip.truck?.immatriculation}</td>
                <td className="px-6 py-4">{trip.trailer?.immatriculation || 'None'}</td>
                <td className="px-6 py-4">{trip.chauffeur?.nom || trip.chauffeur}</td>
                <td className="px-6 py-4">{trip.marchandise}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    trip.statut === 'terminé' ? 'bg-green-100 text-green-800' :
                    trip.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                    trip.statut === 'annulé' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trip.statut}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(trip)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
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
