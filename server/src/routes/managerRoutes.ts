import express from "express";
import {
    getManager,
    updateManager,
    getManagerProperties,
} from "../controllers/managerControllers.js";

const router = express.Router();

router.get("/:id", getManager);
router.put("/:id", updateManager);
router.get("/:id/properties", getManagerProperties);

export default router;