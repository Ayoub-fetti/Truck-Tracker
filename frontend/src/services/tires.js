import API from './api';

export const tiresService = {
  getAll: () => API.get('/tires'),
  getById: (id) => API.get(`/tires/${id}`),
  create: (data) => API.post('/tires', data),
  update: (id, data) => API.put(`/tires/${id}`, data),
  delete: (id) => API.delete(`/tires/${id}`)
};
