import API from './api';

export const maintenanceService = {
  getAll: () => API.get('/maintenance'),
  getById: (id) => API.get(`/maintenance/${id}`),
  create: (data) => API.post('/maintenance', data),
  update: (id, data) => API.put(`/maintenance/${id}`, data),
  delete: (id) => API.delete(`/maintenance/${id}`)
};
