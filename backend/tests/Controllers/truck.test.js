const request = require("supertest");
const app = require("../../src/app");
const Truck = require("../../src/models/Truck");
const User = require("../../src/models/User");

describe("TruckController", () => {
  let token, driver;

  beforeEach(async () => {
    driver = await User.create({
      nom: "Driver",
      email: "driver@test.com",
      password: "pass123",
      role: "chauffeur",
    });
    const admin = await User.create({
      nom: "Admin",
      email: "admin@test.com",
      password: "pass123",
      role: "admin",
    });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "pass123" });
    token = res.body.token;
  });

  describe("POST /api/trucks", () => {
    it("should create a truck", async () => {
      const res = await request(app)
        .post("/api/trucks")
        .set("Authorization", `Bearer ${token}`)
        .send({ immatriculation: "ABC123", marque: "Volvo", modele: "FH16" });
      expect(res.status).toBe(201);
      expect(res.body.immatriculation).toBe("ABC123");
    });
  });

  describe("GET /api/trucks", () => {
    it("should get all trucks", async () => {
      await Truck.create({
        immatriculation: "ABC123",
        marque: "Volvo",
        modele: "FH16",
      });
      const res = await request(app)
        .get("/api/trucks")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it("should filter by status", async () => {
      await Truck.create({
        immatriculation: "ABC123",
        marque: "Volvo",
        modele: "FH16",
        statut: "disponible",
      });
      const res = await request(app)
        .get("/api/trucks?statut=disponible")
        .set("Authorization", `Bearer ${token}`);
      expect(res.body.length).toBe(1);
    });
  });

  describe("GET /api/trucks/:id", () => {
    it("should get a truck by id", async () => {
      const truck = await Truck.create({
        immatriculation: "ABC123",
        marque: "Volvo",
        modele: "FH16",
      });
      const res = await request(app)
        .get(`/api/trucks/${truck._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.immatriculation).toBe("ABC123");
    });

    it("should return 404 if not found", async () => {
      const res = await request(app)
        .get("/api/trucks/507f1f77bcf86cd799439011")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/trucks/:id", () => {
    it("should update a truck", async () => {
      const truck = await Truck.create({
        immatriculation: "ABC123",
        marque: "Volvo",
        modele: "FH16",
      });
      const res = await request(app)
        .put(`/api/trucks/${truck._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ kilometrage: 5000 });
      expect(res.status).toBe(200);
      expect(res.body.kilometrage).toBe(5000);
    });
  });

  describe("DELETE /api/trucks/:id", () => {
    it("should delete a truck", async () => {
      const truck = await Truck.create({
        immatriculation: "ABC123",
        marque: "Volvo",
        modele: "FH16",
      });
      const res = await request(app)
        .delete(`/api/trucks/${truck._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Truck deleted");
    });
  });
});
