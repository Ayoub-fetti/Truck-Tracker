import { useState, useEffect } from 'react';
import { tripsService } from '../../services/trips';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Trajets</h1>
      <div className="grid gap-4">
        {trips.map(trip => (
          <div key={trip.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">{trip.origin} → {trip.destination}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
