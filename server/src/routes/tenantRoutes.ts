import express from "express";
import {
    getTenant,
    // updateTenant,
    getCurrentResidences,
    addFavoriteProperty,
    removeFavoriteProperty,
} from "../controllers/tenantControllers.js";

const router = express.Router();

router.get("/:id", getTenant);
// router.put("/:id", updateTenant);

router.get("/:id/current-residences", getCurrentResidences);
router.post("/:id/favorites/:propertyId", addFavoriteProperty);
router.delete("/:id/favorites/:propertyId", removeFavoriteProperty);

export default router;