import { Router } from "express";
import advertisementController from "../../controllers/advertisement.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/:id", advertisementController.getById);
router.get("/", getUser, advertisementController.getAll);
router.post("/", requireIsAdmin, advertisementController.createAdvertisement);
router.patch(
  "/:id",
  requireIsAdmin,
  advertisementController.updateAdvertisement
);
router.delete(
  "/:id",
  requireIsAdmin,
  advertisementController.deleteAdvertisement
);

export default router;
