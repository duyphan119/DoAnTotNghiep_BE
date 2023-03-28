import { Router } from "express";
import groupProductController from "../../controllers/groupProduct.controller";
import { requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/seed", groupProductController.seed);
router.get("/:id", groupProductController.getById);
router.get("/", groupProductController.getAll);
router.post("/", requireIsAdmin, groupProductController.createOne);
router.patch("/:id", requireIsAdmin, groupProductController.updateOne);
router.delete("/many", requireIsAdmin, groupProductController.softDeleteMany);
router.delete("/:id", requireIsAdmin, groupProductController.softDeleteOne);
router.delete(
  "/restore/many",
  requireIsAdmin,
  groupProductController.restoreMany
);
router.delete(
  "/restore/:id",
  requireIsAdmin,
  groupProductController.restoreOne
);
router.delete("/force/many", requireIsAdmin, groupProductController.deleteMany);
router.delete("/force/:id", requireIsAdmin, groupProductController.deleteOne);

export default router;
