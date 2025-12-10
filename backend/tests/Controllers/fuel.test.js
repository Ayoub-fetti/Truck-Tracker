const request = require('supertest');
const app = require('../../src/app');
const FuelLog = require('../../src/models/FuelLog');
const Truck = require('../../src/models/Truck');
const User = require('../../src/models/User');

describe('FuelController', () => {
  let token, adminToken, truck, driver;

  beforeEach(async () => {
    driver = await User.create({ nom: 'Driver', email: 'driver@test.com', password: 'pass123', role: 'chauffeur' });
    await User.create({ nom: 'Admin', email: 'admin@test.com', password: 'pass123', role: 'admin' });
    const res = await request(app).post('/api/auth/login').send({ email: 'driver@test.com', password: 'pass123' });
    token = res.body.token;
    const adminRes = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'pass123' });
    adminToken = adminRes.body.token;
    truck = await Truck.create({ immatriculation: 'ABC123', marque: 'Volvo', modele: 'FH16' });
  });

  describe('POST /api/fuel', () => {
    it('should create a fuel log', async () => {
      const res = await request(app).post('/api/fuel').set('Authorization', `Bearer ${token}`)
        .send({ truck: truck._id, quantite: 100, cout: 150, kilometrage: 1000, station: 'Total' });
      expect(res.status).toBe(201);
      expect(res.body.quantite).toBe(100);
    });

    it('should calculate average consumption', async () => {
      await FuelLog.create({ truck: truck._id, chauffeur: driver._id, quantite: 50, cout: 75, kilometrage: 500 });
      const res = await request(app).post('/api/fuel').set('Authorization', `Bearer ${token}`)
        .send({ truck: truck._id, quantite: 100, cout: 150, kilometrage: 1000 });
      expect(res.body.consommationMoyenne).toBeGreaterThan(0);
    });

    it('should update truck mileage', async () => {
      await request(app).post('/api/fuel').set('Authorization', `Bearer ${token}`)
        .send({ truck: truck._id, quantite: 100, cout: 150, kilometrage: 2000 });
      const updatedTruck = await Truck.findById(truck._id);
      expect(updatedTruck.kilometrage).toBe(2000);
    });
  });

  describe('GET /api/fuel', () => {
    it('should get all fuel logs', async () => {
      await FuelLog.create({ truck: truck._id, chauffeur: driver._id, quantite: 100, cout: 150, kilometrage: 1000 });
      const res = await request(app).get('/api/fuel').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('should filter by truck', async () => {
      await FuelLog.create({ truck: truck._id, chauffeur: driver._id, quantite: 100, cout: 150, kilometrage: 1000 });
      const res = await request(app).get(`/api/fuel?truck=${truck._id}`).set('Authorization', `Bearer ${token}`);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /api/fuel/:id', () => {
    it('should get a fuel log by id', async () => {
      const log = await FuelLog.create({ truck: truck._id, chauffeur: driver._id, quantite: 100, cout: 150, kilometrage: 1000 });
      const res = await request(app).get(`/api/fuel/${log._id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.quantite).toBe(100);
    });

    it('should return 404 if not found', async () => {
      const res = await request(app).get('/api/fuel/507f1f77bcf86cd799439011').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/fuel/stats/:truck', () => {
    it('should get consumption statistics', async () => {
      await FuelLog.create({ truck: truck._id, chauffeur: driver._id, quantite: 100, cout: 150, kilometrage: 1000, consommationMoyenne: 10 });
      const res = await request(app).get(`/api/fuel/stats/${truck._id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('avgConsumption');
      expect(res.body).toHaveProperty('totalFuel');
      expect(res.body).toHaveProperty('totalCost');
    });
  });

  describe('DELETE /api/fuel/:id', () => {
    it('should delete a fuel log', async () => {
      const log = await FuelLog.create({ truck: truck._id, chauffeur: driver._id, quantite: 100, cout: 150, kilometrage: 1000 });
      const res = await request(app).delete(`/api/fuel/${log._id}`).set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Fuel log deleted');
    });
  });
});
