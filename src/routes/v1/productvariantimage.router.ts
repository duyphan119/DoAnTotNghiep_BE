import { Router } from "express";
import { requireIsAdmin } from "../../middlewares/auth.middleware";
import productVariantImageController from "../../controllers/productvariantimage.controller";

const productVariantImageRouter = Router();

// productVariantImageRouter.get("/:id", variantController.getVariantById);
productVariantImageRouter.get("/", productVariantImageController.getAll);
productVariantImageRouter.post(
  "/many",
  requireIsAdmin,
  productVariantImageController.createProductVariantImages
);
// productVariantImageRouter.post("/", requireIsAdmin, variantController.createVariant);
productVariantImageRouter.patch(
  "/:id",
  requireIsAdmin,
  productVariantImageController.updateProductVariantImage
);
productVariantImageRouter.delete(
  "/:id",
  requireIsAdmin,
  productVariantImageController.deleteProductVariantImage
);
// productVariantImageRouter.delete("/", requireIsAdmin, variantController.deleteVariants);

export default productVariantImageRouter;
