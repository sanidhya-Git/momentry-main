import express from "express";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  getAdminDashboardStats,
  getAllBookings,
} from "../controllers/bookingController.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";
import { generateInvoice } from '../controllers/invoiceController.js'

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, getUserBookings);
router.get("/admin/dashboard", verifyToken, adminOnly, getAdminDashboardStats);
router.get("/admin/all", verifyToken, adminOnly, getAllBookings);
router.get('/:id/invoice', verifyToken, generateInvoice)
router.get("/:id", verifyToken, getBookingById);
router.put("/:id", verifyToken, updateBooking);

export default router;
