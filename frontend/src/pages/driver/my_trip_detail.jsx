// frontend/src/pages/driver/my_trip_detail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsService } from '../../services/trips';
import { fuelService } from '../../services/fuel';
import { useAuth } from '../../context/AuthContext';

export default function MyTripDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFuelForm, setShowFuelForm] = useState(false);
  const [fuelFormData, setFuelFormData] = useState({
    quantite: '',
    cout: '',
    kilometrage: '',
    station: ''
  });

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [id, user]);

  const fetchData = async () => {
    try {
      setError('');
      const tripRes = await tripsService.getById(id);
      
      // Check if this trip belongs to the current driver
      if (tripRes.data.chauffeur._id !== user._id) {
        setError('You are not authorized to view this trip');
        return;
      }
      
      setTrip(tripRes.data);
      
      // Try to get fuel logs, but don't fail if there's an issue
      try {
        const fuelRes = await fuelService.getByTrip(id);
        setFuelLogs(fuelRes.data || []);
      } catch (fuelError) {
        console.warn('Could not fetch fuel logs:', fuelError);
        setFuelLogs([]);
      }
      
    } catch (error) {
      console.error('Error fetching trip:', error);
      if (error.response?.status === 404) {
        setError('Trip not found');
      } else if (error.response?.status === 403) {
        setError('You are not authorized to view this trip');
      } else {
        setError('Error loading trip details');
      }
    } finally {
      setLoading(false);
    }
  };





  if (loading) return <div className="p-6">Loading...</div>;
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/driver/my-trips')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to My Trips
        </button>
      </div>
    );
  }
  
  if (!trip) return <div className="p-6">Trip not found</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Trip Details</h1>
        <button
          onClick={() => navigate('/driver/my-trips')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to My Trips
        </button>
      </div>
      
      {/* Trip Info */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Trip Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Départ:</strong> {trip.depart}</p>
            <p><strong>Destination:</strong> {trip.destination}</p>
            <p><strong>Truck:</strong> {trip.truck?.immatriculation}</p>
            <p><strong>Trailer:</strong> {trip.trailer?.immatriculation || 'None'}</p>
          </div>
          <div>
            <p><strong>Date Départ:</strong> {new Date(trip.dateDepart).toLocaleDateString()}</p>
            <p><strong>Kilométrage Départ:</strong> {trip.kilometrageDepart}</p>
            <p><strong>Kilométrage Arrivée:</strong> {trip.kilometrageArrivee || 'N/A'}</p>
            <p><strong>Statut:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                trip.statut === 'terminé' ? 'bg-green-100 text-green-800' :
                trip.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {trip.statut}
              </span>
            </p>
          </div>
        </div>
        
      </div>



      {/* Fuel Logs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Fuel Logs for this Trip</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Quantité (L)</th>
              <th className="px-6 py-3 text-left">Coût</th>
              <th className="px-6 py-3 text-left">Kilométrage</th>
              <th className="px-6 py-3 text-left">Station</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {fuelLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No fuel logs for this trip
                </td>
              </tr>
            ) : (
              fuelLogs.map((fuel) => (
                <tr key={fuel._id} className="border-t">
                  <td className="px-6 py-4">{fuel.quantite}</td>
                  <td className="px-6 py-4">{fuel.cout}€</td>
                  <td className="px-6 py-4">{fuel.kilometrage}</td>
                  <td className="px-6 py-4">{fuel.station}</td>
                  <td className="px-6 py-4">{new Date(fuel.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
