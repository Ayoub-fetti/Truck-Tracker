const request = require('supertest');
const app = require('../../src/app');
const Trailer = require('../../src/models/Trailer');
const Truck = require('../../src/models/Truck');
const User = require('../../src/models/User');

describe('TrailerController', () => {
  let token, truck;

  beforeEach(async () => {
    const admin = await User.create({ nom: 'Admin', email: 'admin@test.com', password: 'pass123', role: 'admin' });
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'pass123' });
    token = res.body.token;
    truck = await Truck.create({ immatriculation: 'ABC123', marque: 'Volvo', modele: 'FH16' });
  });

  describe('POST /api/trailers', () => {
    it('should create a trailer', async () => {
      const res = await request(app).post('/api/trailers').set('Authorization', `Bearer ${token}`)
        .send({ immatriculation: 'TRL123', type: 'Frigorifique', capacite: 25000 });
      expect(res.status).toBe(201);
      expect(res.body.immatriculation).toBe('TRL123');
    });
  });

  describe('GET /api/trailers', () => {
    it('should get all trailers', async () => {
      await Trailer.create({ immatriculation: 'TRL123', type: 'Frigorifique' });
      const res = await request(app).get('/api/trailers').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('should filter by status', async () => {
      await Trailer.create({ immatriculation: 'TRL123', type: 'Frigorifique', statut: 'disponible' });
      const res = await request(app).get('/api/trailers?statut=disponible').set('Authorization', `Bearer ${token}`);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /api/trailers/:id', () => {
    it('should get a trailer by id', async () => {
      const trailer = await Trailer.create({ immatriculation: 'TRL123', type: 'Frigorifique' });
      const res = await request(app).get(`/api/trailers/${trailer._id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.immatriculation).toBe('TRL123');
    });

    it('should return 404 if not found', async () => {
      const res = await request(app).get('/api/trailers/507f1f77bcf86cd799439011').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/trailers/:id', () => {
    it('should update a trailer', async () => {
      const trailer = await Trailer.create({ immatriculation: 'TRL123', type: 'Frigorifique' });
      const res = await request(app).put(`/api/trailers/${trailer._id}`).set('Authorization', `Bearer ${token}`)
        .send({ capacite: 30000 });
      expect(res.status).toBe(200);
      expect(res.body.capacite).toBe(30000);
    });
  });

  describe('DELETE /api/trailers/:id', () => {
    it('should delete a trailer', async () => {
      const trailer = await Trailer.create({ immatriculation: 'TRL123', type: 'Frigorifique' });
      const res = await request(app).delete(`/api/trailers/${trailer._id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Trailer deleted');
    });
  });
});
