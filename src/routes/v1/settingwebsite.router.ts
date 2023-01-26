import { Router } from "express";
import settingWebsiteController from "../../controllers/settingwebsite.controller";
import { requireIsAdmin } from "../../middlewares/auth.middleware";

const settingWensiteRouter = Router();

settingWensiteRouter.get("/seed", settingWebsiteController.seed);
settingWensiteRouter.get("/:id", settingWebsiteController.getById);
settingWensiteRouter.get("/", settingWebsiteController.getAll);
settingWensiteRouter.post("/keys", settingWebsiteController.getByKeys);
settingWensiteRouter.post(
  "/",
  requireIsAdmin,
  settingWebsiteController.createOne
);
settingWensiteRouter.patch(
  "/:id",
  requireIsAdmin,
  settingWebsiteController.updateOne
);
settingWensiteRouter.delete(
  "/:id",
  requireIsAdmin,
  settingWebsiteController.deleteOne
);

export default settingWensiteRouter;
