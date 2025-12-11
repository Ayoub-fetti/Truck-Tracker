import API from './api';

export const fuelService = {
  getAll: () => API.get('/fuel'),
  create: (data) => API.post('/fuel', data),
  getByTrip: (tripId) => API.get(`/fuel/trip/${tripId}`)
};
