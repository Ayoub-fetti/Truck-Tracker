import API from './api';

export const tripsService = {
  getAll: () => API.get('/trips'),
  getById: (id) => API.get(`/trips/${id}`),
  getDriverTrips: (userId) => API.get(`/trips?chauffeur=${userId}`),
  create: (data) => API.post('/trips', data),
  update: (id, data) => API.put(`/trips/${id}`, data),
  updateStatus: (id, statut) => API.patch(`/trips/${id}/status`, { statut }),
  updateKilometers: (id, kilometers) => API.patch(`/trips/${id}/kilometers`, { kilometers }),
  updateVehicleState: (id, state) => API.patch(`/trips/${id}/vehicle-state`, { state }),
  updateFuelConsumption: (id, consumption) => API.patch(`/trips/${id}/fuel`, { consumption })
};
