import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/users.js";
import addtocartdata from "./models/addtocart.js";

dotenv.config();

const seedData = async () => {
  try {
    // Remove deprecated options - they're not needed in MongoDB Driver 4.0+
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🔌 Connected to MongoDB");

    // Clear existing data (optional - comment out if you want to keep existing data)
    await addtocartdata.deleteMany();

    // Check if user with this email already exists (regardless of role)
    const existingUser = await User.findOne({
      email: "admin@gmail.com",
    });

    if (existingUser) {
      // If user exists but is not admin, update to admin
      if (existingUser.role !== "admin") {
        existingUser.role = "admin";
        await existingUser.save();
        console.log("✅ Updated existing user to admin role");
        console.log("   Email: admin@gmail.com");
        console.log("   Password: (unchanged)");
        console.log("   Role: admin (updated)");
      } else {
        console.log("⚠️  Admin user already exists. Skipping user creation.");
        console.log("   Email: admin@gmail.com");
        console.log("   Role: admin");
      }
      console.log("✅ Seeder completed");
      await mongoose.connection.close();
      process.exit(0);
      return;
    }

    // Create admin user if it doesn't exist
    try {
      const createUser = await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: "123456",
        role: "admin",
      });

      console.log("✅ Admin user created successfully");
      console.log("   Email: admin@gmail.com");
      console.log("   Password: 123456");
      console.log("   Role: admin");
      console.log("✅ Seeder completed successfully");
    } catch (createError) {
      // Handle duplicate key error - user was created between check and create
      if (createError.code === 11000) {
        console.log("⚠️  User with email 'admin@gmail.com' already exists.");
        // Try to update it to admin role
        const user = await User.findOne({ email: "admin@gmail.com" });
        if (user && user.role !== "admin") {
          user.role = "admin";
          await user.save();
          console.log("✅ Updated existing user to admin role");
        } else {
          console.log("✅ User already exists with admin role");
        }
      } else {
        throw createError; // Re-throw if it's a different error
      }
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);

    // Handle duplicate key error specifically
    if (error.code === 11000) {
      console.log("⚠️  User with email 'admin@gmail.com' already exists.");
      console.log(
        "   Run the seeder again to update the existing user to admin role."
      );
    }

    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

seedData();
