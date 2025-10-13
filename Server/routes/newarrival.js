import express from "express";
import {
  createNewArrival,
  getAllNewArrivals,
  getNewArrivalById,
  updateNewArrival,
  deleteNewArrival,
} from "../controllers/newArrivalController.js";
import upload from "../Middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("image"), createNewArrival);
router.get("/", getAllNewArrivals);
router.get("/:id", getNewArrivalById);
router.put("/:id", upload.single("image"), updateNewArrival);
router.delete("/:id", deleteNewArrival);

export default router;
