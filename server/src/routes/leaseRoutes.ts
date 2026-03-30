import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getLeasePayments, getLeases } from "../controllers/leaseControllers.js";

const router = express.Router();

router.get("/", authMiddleware, getLeases);
router.get(
    "/:id/payments",
    authMiddleware,
    getLeasePayments
);

export default router;