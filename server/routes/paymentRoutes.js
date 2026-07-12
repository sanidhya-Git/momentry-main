import express from "express";
import {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  getAllPayments,
} from "../controllers/paymentController.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-order", verifyToken, createOrder);
router.post("/verify", verifyToken, verifyPayment);
router.get("/admin/all", verifyToken, adminOnly, getAllPayments);
router.get("/:id", verifyToken, getPaymentStatus);

export default router;
