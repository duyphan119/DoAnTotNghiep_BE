import { Router } from "express";
import advertisementController from "../../controllers/advertisement.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const advertisementRouter = Router();

// advertisementRouter.get("/seed", advertisementController.seed);
advertisementRouter.get("/:id", advertisementController.getById);
advertisementRouter.get("/", getUser, advertisementController.getAll);
advertisementRouter.post(
  "/",
  requireIsAdmin,
  advertisementController.createAdvertisement
);
advertisementRouter.patch(
  "/:id",
  requireIsAdmin,
  advertisementController.updateAdvertisement
);
advertisementRouter.delete(
  "/:id",
  requireIsAdmin,
  advertisementController.deleteAdvertisement
);

export default advertisementRouter;
