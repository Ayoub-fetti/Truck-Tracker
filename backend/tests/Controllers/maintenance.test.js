// tests/maintenance.test.js
const request = require('supertest');
const app = require('../../src/app');
const Maintenance = require('../../src/models/Maintenance');
const Truck = require('../../src/models/Truck');
const Trailer = require('../../src/models/Trailer');
const User = require('../../src/models/User');

describe('MaintenanceController', () => {
  let token, truck, trailer;

  beforeEach(async () => {
    const admin = await User.create({ nom: 'Admin', email: 'admin@test.com', password: 'pass123', role: 'admin' });
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'pass123' });
    token = res.body.token;
    truck = await Truck.create({ immatriculation: 'ABC123', marque: 'Volvo', modele: 'FH16', kilometrage: 15000 });
    trailer = await Trailer.create({ immatriculation: 'TRL123', type: 'Frigorifique', kilometrage: 12000 });
  });

  describe('POST /api/maintenance', () => {
    it('should create maintenance and update vehicle status', async () => {
      const res = await request(app).post('/api/maintenance').set('Authorization', `Bearer ${token}`)
        .send({ vehicule: truck._id, vehiculeType: 'Truck', type: 'révision', description: 'Oil change', kilometrage: 15000 });
      expect(res.status).toBe(201);
      expect(res.body.type).toBe('révision');
      const updatedTruck = await Truck.findById(truck._id);
      expect(updatedTruck.statut).toBe('maintenance');
    });
  });

  describe('GET /api/maintenance', () => {
    it('should get all maintenances', async () => {
      await Maintenance.create({ vehicule: truck._id, vehiculeType: 'Truck', type: 'révision', description: 'Test' });
      const res = await request(app).get('/api/maintenance').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('should filter by vehicle type', async () => {
      await Maintenance.create({ vehicule: truck._id, vehiculeType: 'Truck', type: 'révision', description: 'Test' });
      const res = await request(app).get('/api/maintenance?vehiculeType=Truck').set('Authorization', `Bearer ${token}`);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /api/maintenance/:id', () => {
    it('should get a maintenance by id', async () => {
      const maintenance = await Maintenance.create({ vehicule: truck._id, vehiculeType: 'Truck', type: 'révision', description: 'Test' });
      const res = await request(app).get(`/api/maintenance/${maintenance._id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.type).toBe('révision');
    });

    it('should return 404 if not found', async () => {
      const res = await request(app).get('/api/maintenance/507f1f77bcf86cd799439011').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/maintenance/:id', () => {
    it('should update maintenance', async () => {
      const maintenance = await Maintenance.create({ vehicule: truck._id, vehiculeType: 'Truck', type: 'révision', description: 'Test' });
      const res = await request(app).put(`/api/maintenance/${maintenance._id}`).set('Authorization', `Bearer ${token}`)
        .send({ cout: 500 });
      expect(res.status).toBe(200);
      expect(res.body.cout).toBe(500);
    });

    it('should update vehicle status when completed', async () => {
      const maintenance = await Maintenance.create({ vehicule: truck._id, vehiculeType: 'Truck', type: 'révision', description: 'Test' });
      await Truck.findByIdAndUpdate(truck._id, { statut: 'maintenance' });
      await request(app).put(`/api/maintenance/${maintenance._id}`).set('Authorization', `Bearer ${token}`)
        .send({ statut: 'terminée' });
      const updatedTruck = await Truck.findById(truck._id);
      expect(updatedTruck.statut).toBe('disponible');
    });
  });

  describe('DELETE /api/maintenance/:id', () => {
    it('should delete a maintenance', async () => {
      const maintenance = await Maintenance.create({ vehicule: truck._id, vehiculeType: 'Truck', type: 'révision', description: 'Test' });
      const res = await request(app).delete(`/api/maintenance/${maintenance._id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Maintenance deleted');
    });
  });

  describe('GET /api/maintenance/rules', () => {
    it('should get maintenance rules', async () => {
      const res = await request(app).get('/api/maintenance/rules').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('kilometrage');
      expect(res.body).toHaveProperty('jours');
    });
  });

  describe('PUT /api/maintenance/rules', () => {
    it('should update maintenance rules', async () => {
      const res = await request(app).put('/api/maintenance/rules').set('Authorization', `Bearer ${token}`)
        .send({ kilometrage: 15000, jours: 120 });
      expect(res.status).toBe(200);
      expect(res.body.rules.kilometrage).toBe(15000);
    });
  });

  describe('POST /api/maintenance/check', () => {
    it('should check and create needed maintenances', async () => {
      const res = await request(app).post('/api/maintenance/check').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('maintenances');
    });
  });
});
