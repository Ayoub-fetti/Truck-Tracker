import API from './api';

export const tripsService = {
  getAll: () => API.get('/trips'),
  getById: (id) => API.get(`/trips/${id}`),
  getDriverTrips: () => API.get('/trips/my-trips'),
  create: (data) => API.post('/trips', data),
  update: (id, data) => API.put(`/trips/${id}`, data),
  updateKilometers: (id, kilometers) => API.patch(`/trips/${id}/kilometers`, { kilometers }),
  updateVehicleState: (id, state) => API.patch(`/trips/${id}/vehicle-state`, { state }),
  updateFuelConsumption: (id, consumption) => API.patch(`/trips/${id}/fuel`, { consumption })
};
