import { Router } from "express";
import advertisementController from "../../controllers/advertisement.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/:id", advertisementController.getById);
router.get("/", getUser, advertisementController.getAll);
router.post("/", requireIsAdmin, advertisementController.createOne);
router.patch("/:id", requireIsAdmin, advertisementController.updateOne);
router.delete("/many", requireIsAdmin, advertisementController.deleteMany);
router.delete("/:id", requireIsAdmin, advertisementController.deleteOne);

export default router;
