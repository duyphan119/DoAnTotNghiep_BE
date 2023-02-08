import { Router } from "express";
import { requireIsAdmin } from "../../middlewares/auth.middleware";
import productVariantImageController from "../../controllers/productVariantImage.controller";

const router = Router();

// router.get("/:id", variantController.getVariantById);
router.get("/", productVariantImageController.getAll);
router.post(
  "/many",
  requireIsAdmin,
  productVariantImageController.createProductVariantImages
);
// router.post("/", requireIsAdmin, variantController.createVariant);
router.patch(
  "/:id",
  requireIsAdmin,
  productVariantImageController.updateProductVariantImage
);
router.delete(
  "/:id",
  requireIsAdmin,
  productVariantImageController.deleteProductVariantImage
);
// router.delete("/", requireIsAdmin, variantController.deleteVariants);

export default router;
