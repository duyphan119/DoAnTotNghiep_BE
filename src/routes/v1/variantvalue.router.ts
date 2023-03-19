import { Router } from "express";
import variantValueController from "../../controllers/variantValue.controller";
import { requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/seed", variantValueController.seed);
router.get("/:id", variantValueController.getById);
router.get("/", variantValueController.getAll);
router.post("/many", requireIsAdmin, variantValueController.createMany);
router.post("/", requireIsAdmin, variantValueController.createOne);
router.patch("/many", requireIsAdmin, variantValueController.updateMany);
router.patch("/:id", requireIsAdmin, variantValueController.updateOne);
router.delete("/many", requireIsAdmin, variantValueController.softDeleteMany);
router.delete("/:id", requireIsAdmin, variantValueController.softDeleteOne);
router.delete(
  "/restore/many",
  requireIsAdmin,
  variantValueController.restoreMany
);
router.delete(
  "/restore/:id",
  requireIsAdmin,
  variantValueController.restoreOne
);
router.delete("/force/many", requireIsAdmin, variantValueController.deleteMany);
router.delete("/force/:id", requireIsAdmin, variantValueController.deleteOne);

export default router;
