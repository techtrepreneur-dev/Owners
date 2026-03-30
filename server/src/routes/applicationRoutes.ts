import express from "express";
import { createApplication, listApplications, updateApplicationStatus } from "../controllers/applicationControllers.js";

const router = express.Router();

router.post("/", createApplication);
router.put("/:id/status", updateApplicationStatus);
router.get("/", listApplications);

export default router;