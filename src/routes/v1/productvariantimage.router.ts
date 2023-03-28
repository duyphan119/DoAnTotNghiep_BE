import { Router } from "express";
import { requireIsAdmin } from "../../middlewares/auth.middleware";
import productVariantImageController from "../../controllers/productVariantImage.controller";

const router = Router();

// router.get("/:id", variantController.getVariantById);
router.get("/", productVariantImageController.getAll);
router.post("/many", requireIsAdmin, productVariantImageController.createMany);
// router.post("/", requireIsAdmin, variantController.createVariant);
router.patch("/:id", requireIsAdmin, productVariantImageController.updateOne);
router.delete(
  "/many",
  requireIsAdmin,
  productVariantImageController.deleteMany
);
router.delete("/:id", requireIsAdmin, productVariantImageController.deleteOne);

export default router;
