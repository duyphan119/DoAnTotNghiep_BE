import { Router } from "express";
import productController from "../../controllers/product.controller";
import {
  getUser,
  requireIsAdmin,
  requireLogin,
} from "../../middlewares/auth.middleware";

const router = Router();

// router.get("/seed", productController.seed);
router.get("/search", productController.searchProduct);
router.get("/:id", productController.getById);
router.get("/", getUser, productController.getAllProducts);
router.post("/", requireIsAdmin, productController.createProduct);
router.patch("/:id", requireIsAdmin, productController.updateProduct);
router.delete("/soft/:id", requireIsAdmin, productController.softDeleteProduct);
router.delete("/restore/:id", requireIsAdmin, productController.restoreProduct);
router.delete("/:id", requireIsAdmin, productController.deleteProduct);

export default router;
