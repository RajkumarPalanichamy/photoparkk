import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import newArrivalRoutes from "./routes/newarrival.js";
import addtocartRoutes from "./routes/addtocart.js";
import specialoffersRoutes from "./routes/specialoffers.js";
import acryliccustomizeRoutes from "./routes/acryliccustomize.js";
import canvascustomizeRoutes from "./routes/canvascustomize.js";
import backlightcustomizeRoutes from "./routes/backlightcustomize.js";
import userRoutes from "./routes/users.js";
import frameCustomizeRoutes from "./routes/framecustomize.js";
import framesOrder from "./routes/framesorder.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import dashboardRoutes from "./routes/dashboard.js";

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create Express App
const app = express();

// ✅ Middleware to handle large JSON and form data
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 🐛 DEBUG: Log all incoming requests (add this for debugging)
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${
      req.originalUrl
    } - Headers: ${JSON.stringify(req.headers)}`
  );
  next();
});

// ✅ Root route for API health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🟢 API is working perfectly!",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Serve static files
app.use(
  "/newarrivalsUploads",
  express.static(path.join(__dirname, "newarrivalsUploads"))
);
app.use(
  "/addtocartUploads",
  express.static(path.join(__dirname, "addtocartUploads"))
);
app.use(
  "/specialoffersUploads",
  express.static(path.join(__dirname, "specialoffersUploads"))
);
app.use(
  "/acryliccustomizeUploads",
  express.static(path.join(__dirname, "acryliccustomizeUploads"))
);
app.use(
  "/canvascustomizeUploads",
  express.static(path.join(__dirname, "canvascustomizeUploads"))
);
app.use(
  "/backlightcustomizeUploads",
  express.static(path.join(__dirname, "backlightcustomizeUploads"))
);
app.use("/frameuploads", express.static(path.join(__dirname, "frameuploads")));

// ✅ Routes

// Normal Routes
app.use("/api/newarrivals", newArrivalRoutes);
app.use("/api/specialoffers", specialoffersRoutes);

// Customized Routes
app.use("/api/acryliccustomize", acryliccustomizeRoutes);
app.use("/api/canvascustomize", canvascustomizeRoutes);
app.use("/api/backlightcustomize", backlightcustomizeRoutes);

// Frames Customized
app.use("/api/framecustomize", frameCustomizeRoutes);

// Cart
app.use("/api/cart", addtocartRoutes);

// ------------Orders--------------
//CommonOrders
app.use("/api/orders", orderRoutes);
//FrameOrders
app.use("/api/frameorders", framesOrder);

// ------------Dashboard--------------
app.use("/api/dashboard", dashboardRoutes);

// ------------Payments--------------
app.use("/api/payments", paymentRoutes);

// Users
app.use("/api/users", userRoutes);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
