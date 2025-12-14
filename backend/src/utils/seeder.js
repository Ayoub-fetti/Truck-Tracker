require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminExists = await User.findOne({ email: "admin@admin.com" });

    if (!adminExists) {
      await User.create({
        nom: "Admin",
        email: "admin@admin.com",
        password: "password",
        role: "admin",
      });
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }

    process.exit(0);
  } catch (error) {
    console.error("Seeder error:", error);
    process.exit(1);
  }
};

seedAdmin();
