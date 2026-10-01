import express from "express";
import { savePayment, updatePaymentStatus } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", savePayment);
router.put("/update-status", updatePaymentStatus);
// router.get("/:id/:type", listApplications);

export default router;