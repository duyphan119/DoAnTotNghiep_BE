import { Router } from "express";
import notificationTypeController from "../../controllers/notificationType.controller";
import { requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/:id", requireIsAdmin, notificationTypeController.getById);
router.get("/", requireIsAdmin, notificationTypeController.getAll);
router.post("/many", requireIsAdmin, notificationTypeController.createMany);
router.post("/", requireIsAdmin, notificationTypeController.createOne);
router.patch("/many", requireIsAdmin, notificationTypeController.updateMany);
router.patch("/:id", requireIsAdmin, notificationTypeController.updateOne);
router.delete(
  "/many",
  requireIsAdmin,
  notificationTypeController.softDeleteMany
);
router.delete("/:id", requireIsAdmin, notificationTypeController.softDeleteOne);
router.delete(
  "/restore/many",
  requireIsAdmin,
  notificationTypeController.restoreMany
);
router.delete(
  "/restore/:id",
  requireIsAdmin,
  notificationTypeController.restoreOne
);
router.delete(
  "/force/many",
  requireIsAdmin,
  notificationTypeController.deleteMany
);
router.delete(
  "/force/:id",
  requireIsAdmin,
  notificationTypeController.deleteOne
);

export default router;
