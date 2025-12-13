import API from './api';

export const trucksService = {
  getAll: () => API.get('/trucks'),
  getById: (id) => API.get(`/trucks/${id}`),
  create: (data) => API.post('/trucks', data),
  update: (id, data) => API.put(`/trucks/${id}`, data),
  delete: (id) => API.delete(`/trucks/${id}`)
};
