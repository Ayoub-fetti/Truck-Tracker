// tests/trip.test.js
const request = require('supertest');
const app = require('../../src/app');
const Trip = require('../../src/models/Trip');
const Truck = require('../../src/models/Truck');
const User = require('../../src/models/User');

describe('TripController', () => {
  let token, truck, driver;

  beforeEach(async () => {
    driver = await User.create({ nom: 'Driver', email: 'driver@test.com', password: 'pass123', role: 'chauffeur' });
    const admin = await User.create({ nom: 'Admin', email: 'admin@test.com', password: 'pass123', role: 'admin' });
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'pass123' });
    token = res.body.token;
    truck = await Truck.create({ immatriculation: 'ABC123', marque: 'Volvo', modele: 'FH16' });
  });

  describe('POST /api/trips', () => {
    it('should create a trip and update truck status', async () => {
      const res = await request(app).post('/api/trips').set('Authorization', `Bearer ${token}`)
        .send({ truck: truck._id, chauffeur: driver._id, depart: 'Paris', destination: 'Lyon', dateDepart: new Date(), kilometrageDepart: 1000 });
      expect(res.status).toBe(201);
      expect(res.body.depart).toBe('Paris');
      const updatedTruck = await Truck.findById(truck._id);
      expect(updatedTruck.statut).toBe('en_service');
    });
  });

  describe('GET /api/trips', () => {
    it('should get all trips', async () => {
      await Trip.create({ truck: truck._id, chauffeur: driver._id, depart: 'Paris', destination: 'Lyon', dateDepart: new Date(), kilometrageDepart: 1000 });
      const res = await request(app).get('/api/trips').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('should filter by status', async () => {
      await Trip.create({ truck: truck._id, chauffeur: driver._id, depart: 'Paris', destination: 'Lyon', dateDepart: new Date(), kilometrageDepart: 1000, statut: 'en_cours' });
      const res = await request(app).get('/api/trips?statut=en_cours').set('Authorization', `Bearer ${token}`);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /api/trips/:id', () => {
    it('should get a trip by id', async () => {
      const trip = await Trip.create({ truck: truck._id, chauffeur: driver._id, depart: 'Paris', destination: 'Lyon', dateDepart: new Date(), kilometrageDepart: 1000 });
      const res = await request(app).get(`/api/trips/${trip._id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.depart).toBe('Paris');
    });

    it('should return 404 if not found', async () => {
      const res = await request(app).get('/api/trips/507f1f77bcf86cd799439011').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/trips/:id', () => {
    it('should update a trip', async () => {
      const trip = await Trip.create({ truck: truck._id, chauffeur: driver._id, depart: 'Paris', destination: 'Lyon', dateDepart: new Date(), kilometrageDepart: 1000 });
      const res = await request(app).put(`/api/trips/${trip._id}`).set('Authorization', `Bearer ${token}`)
        .send({ marchandise: 'Electronics' });
      expect(res.status).toBe(200);
      expect(res.body.marchandise).toBe('Electronics');
    });
  });

  describe('PATCH /api/trips/:id/status', () => {
    it('should update trip status and truck status when completed', async () => {
      const trip = await Trip.create({ truck: truck._id, chauffeur: driver._id, depart: 'Paris', destination: 'Lyon', dateDepart: new Date(), kilometrageDepart: 1000 });
      const res = await request(app).patch(`/api/trips/${trip._id}/status`).set('Authorization', `Bearer ${token}`)
        .send({ statut: 'terminé', kilometrageArrivee: 1500, dateArrivee: new Date() });
      expect(res.status).toBe(200);
      const updatedTruck = await Truck.findById(truck._id);
      expect(updatedTruck.statut).toBe('disponible');
      expect(updatedTruck.kilometrage).toBe(1500);
    });
  });

  describe('DELETE /api/trips/:id', () => {
    it('should delete a trip', async () => {
      const trip = await Trip.create({ truck: truck._id, chauffeur: driver._id, depart: 'Paris', destination: 'Lyon', dateDepart: new Date(), kilometrageDepart: 1000 });
      const res = await request(app).delete(`/api/trips/${trip._id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Trip deleted');
    });
  });

  describe('GET /api/trips/:id/pdf', () => {
    it('should generate PDF report', async () => {
      const trip = await Trip.create({ truck: truck._id, chauffeur: driver._id, depart: 'Paris', destination: 'Lyon', dateDepart: new Date(), kilometrageDepart: 1000 });
      const res = await request(app).get(`/api/trips/${trip._id}/pdf`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/pdf');
    });
  });
});
