import express from "express";
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPackages);
router.get("/:id", getPackageById);
router.post("/", verifyToken, adminOnly, createPackage);
router.put("/:id", verifyToken, adminOnly, updatePackage);
router.delete("/:id", verifyToken, adminOnly, deletePackage);

export default router;
