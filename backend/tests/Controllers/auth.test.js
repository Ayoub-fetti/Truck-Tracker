const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/User");
const { generateToken } = require("../../src/utils/jwt");

describe("Auth Controller", () => {
  describe("POST /api/auth/login", () => {
    it("Should connecte a user with valid credentials", async () => {
      await User.create({
        nom: "Test User",
        email: "test@test.com",
        password: "password123",
        role: "chauffeur",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@test.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.email).toBe("test@test.com");
    });

    it("Should reject invalide email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "wrong@test.com", password: "password123" });

      expect(res.status).toBe(401);
    });

    it("Should reject invalide password", async () => {
      await User.create({
        nom: "Test User",
        email: "test@test.com",
        password: "password123",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@test.com", password: "wrongpassword" });

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/register", () => {
    it("Should create new user (admin only)", async () => {
      const admin = await User.create({
        nom: "Admin",
        email: "admin@test.com",
        password: "admin123",
        role: "admin",
      });

      const token = generateToken(admin._id);

      const res = await request(app)
        .post("/api/auth/register")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nom: "new driver",
          email: "driver@test.com",
          password: "password123",
          role: "chauffeur",
        });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe("driver@test.com");
    });



    it("Should reject used email", async () => {
      const admin = await User.create({
        nom: "Admin",
        email: "admin@test.com",
        password: "admin123",
        role: "admin",
      });

      await User.create({
        nom: "Existing",
        email: "existing@test.com",
        password: "password123",
      });

      const token = generateToken(admin._id);

      const res = await request(app)
        .post("/api/auth/register")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nom: "Test",
          email: "existing@test.com",
          password: "password123",
        });

      expect(res.status).toBe(400);
    });

    it("Should reject without token", async () => {
      const res = await request(app).post("/api/auth/register").send({
        nom: "Test",
        email: "test@test.com",
        password: "password123",
      });
      expect(res.status).toBe(401);
      // console.log(res);
    });
  });
});
