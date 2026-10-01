import express from "express";
import { approveApplication, cancleApplication, createApplication, listApplications } from "../controllers/applicationControllers.js";

const router = express.Router();

router.post("/", createApplication);
router.put("/approve", approveApplication);
router.get("/:id/:type", listApplications);
router.post("/cancle", cancleApplication);

export default router;