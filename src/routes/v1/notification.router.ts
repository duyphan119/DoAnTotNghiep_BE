import { Router } from "express";
import notificationController from "../../controllers/notification.controller";
import { requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/:id", requireIsAdmin, notificationController.getById);
router.get("/", requireIsAdmin, notificationController.getAll);
router.post("/many", requireIsAdmin, notificationController.createMany);
router.post("/", requireIsAdmin, notificationController.createOne);
router.patch("/read/:id", requireIsAdmin, notificationController.read);
router.patch("/many", requireIsAdmin, notificationController.updateMany);
router.patch("/:id", requireIsAdmin, notificationController.updateOne);
router.delete("/many", requireIsAdmin, notificationController.softDeleteMany);
router.delete("/:id", requireIsAdmin, notificationController.softDeleteOne);
router.delete(
  "/restore/many",
  requireIsAdmin,
  notificationController.restoreMany
);
router.delete(
  "/restore/:id",
  requireIsAdmin,
  notificationController.restoreOne
);
router.delete("/force/many", requireIsAdmin, notificationController.deleteMany);
router.delete("/force/:id", requireIsAdmin, notificationController.deleteOne);

export default router;
