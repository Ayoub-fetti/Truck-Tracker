import { useState, useEffect } from 'react';
import { tripsService } from '../../services/trips';
import { fuelService } from '../../services/fuel';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { generateTripPDF } from '../../services/pdfService';

export default function MyTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trips');

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [tripsRes, fuelRes] = await Promise.all([
        tripsService.getDriverTrips(user._id),
        fuelService.getDriverFuel(user._id)
      ]);
      setTrips(tripsRes.data);
      setFuelLogs(fuelRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

if (loading)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('trips')}
          className={`px-4 py-2 rounded ${activeTab === 'trips' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          My Trips ({trips.length})
        </button>
        <button
          onClick={() => setActiveTab('fuel')}
          className={`px-4 py-2 rounded ${activeTab === 'fuel' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Fuel Logs ({fuelLogs.length})
        </button>
      </div>

      {activeTab === 'trips' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Départ</th>
                <th className="px-6 py-3 text-left">Destination</th>
                <th className="px-6 py-3 text-left">Truck</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No trips assigned to you
                  </td>
                </tr>
              ) : (
                trips.map((trip) => (
                  <tr key={trip._id} className="border-t">
                    <td className="px-6 py-4">{trip.depart}</td>
                    <td className="px-6 py-4">{trip.destination}</td>
                    <td className="px-6 py-4">{trip.truck?.immatriculation}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        trip.statut === 'terminé' ? 'bg-green-100 text-green-800' :
                        trip.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {trip.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(trip.dateDepart).toLocaleDateString()}</td>
                    <td className="px-6 py-4 space-x-2">
                      <Link
                        to={`/driver/my-trip-detail/${trip._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => generateTripPDF(trip._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'fuel' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Truck</th>
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
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No fuel logs found
                  </td>
                </tr>
              ) : (
                fuelLogs.map((fuel) => (
                  <tr key={fuel._id} className="border-t">
                    <td className="px-6 py-4">{fuel.truck?.immatriculation}</td>
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
      )}
    </div>
  );
}
