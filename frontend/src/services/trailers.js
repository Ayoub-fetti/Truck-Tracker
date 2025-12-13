import API from './api';

export const trailersService = {
  getAll: () => API.get('/trailers'),
  getById: (id) => API.get(`/trailers/${id}`),
  create: (data) => API.post('/trailers', data),
  update: (id, data) => API.put(`/trailers/${id}`, data),
  delete: (id) => API.delete(`/trailers/${id}`)
};
