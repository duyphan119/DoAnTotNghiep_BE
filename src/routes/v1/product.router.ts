import { Router } from "express";
import favoriteproductController from "../../controllers/favoriteproduct.controller";
import productController from "../../controllers/product.controller";
import {
  getUser,
  requireIsAdmin,
  requireLogin,
} from "../../middlewares/auth.middleware";

const productRouter = Router();

// productRouter.get("/seed", productController.seed);
productRouter.get(
  "/favorite/user",
  requireLogin,
  favoriteproductController.getByUser
);
productRouter.get("/:id", productController.getById);
productRouter.get("/", getUser, productController.getAllProducts);
productRouter.post(
  "/favorite",
  requireLogin,
  favoriteproductController.createFavoriteProduct
);
productRouter.post("/", requireIsAdmin, productController.createProduct);
productRouter.patch("/:id", requireIsAdmin, productController.updateProduct);
productRouter.delete(
  "/soft/:id",
  requireIsAdmin,
  productController.softDeleteProduct
);
productRouter.delete(
  "/restore/:id",
  requireIsAdmin,
  productController.restoreProduct
);
productRouter.delete(
  "/:id/favorite",
  requireLogin,
  favoriteproductController.deleteFavoriteProduct
);
productRouter.delete("/:id", requireIsAdmin, productController.deleteProduct);

export default productRouter;
