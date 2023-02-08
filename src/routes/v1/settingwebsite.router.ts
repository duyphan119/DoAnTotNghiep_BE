import { Router } from "express";
import settingWebsiteController from "../../controllers/settingWebsite.controller";
import { requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/seed", settingWebsiteController.seed);
router.get("/:id", settingWebsiteController.getById);
router.get("/", settingWebsiteController.getAll);
router.post("/keys", settingWebsiteController.getByKeys);
router.post("/", requireIsAdmin, settingWebsiteController.createOne);
router.patch("/:id", requireIsAdmin, settingWebsiteController.updateOne);
router.delete("/:id", requireIsAdmin, settingWebsiteController.deleteOne);

export default router;
