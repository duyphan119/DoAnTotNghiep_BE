import { Router } from "express";
import variantValueController from "../../controllers/variantValue.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/seed", variantValueController.seed);
router.get("/:id", variantValueController.getById);
router.get("/", getUser, variantValueController.getAll);
router.post("/", requireIsAdmin, variantValueController.createVariantValue);
router.patch("/:id", requireIsAdmin, variantValueController.updateVariantValue);
router.delete(
  "/soft/:id",
  requireIsAdmin,
  variantValueController.softDeleteVariantValue
);
router.delete(
  "/restore/:id",
  requireIsAdmin,
  variantValueController.restoreVariantValue
);
router.delete(
  "/:id",
  requireIsAdmin,
  variantValueController.deleteVariantValue
);

export default router;
