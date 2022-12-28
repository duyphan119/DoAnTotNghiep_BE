import { Router } from "express";
import productvariantController from "../../controllers/productvariant.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const productVariantRouter = Router();

// productVariantRouter.get("/seed", productvariantController.seed);
productVariantRouter.get("/:id", productvariantController.getById);
productVariantRouter.get(
  "/",
  getUser,
  productvariantController.getAllProductVariants
);
productVariantRouter.post(
  "/many",
  requireIsAdmin,
  productvariantController.createProductVariants
);
productVariantRouter.post(
  "/",
  requireIsAdmin,
  productvariantController.createProductVariant
);
productVariantRouter.patch(
  "/:id",
  requireIsAdmin,
  productvariantController.updateProductVariant
);
productVariantRouter.delete(
  "/soft/:id",
  requireIsAdmin,
  productvariantController.softDeleteProductVariant
);
productVariantRouter.delete(
  "/restore/:id",
  requireIsAdmin,
  productvariantController.restoreProductVariant
);
productVariantRouter.delete(
  "/:id",
  requireIsAdmin,
  productvariantController.deleteProductVariant
);

export default productVariantRouter;
