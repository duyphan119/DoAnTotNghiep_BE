import { Router } from "express";
import productController from "../../controllers/product.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

// router.get("/seed", productController.seed);
router.get("/search", productController.search);
router.get("/recommend", productController.recommend);
router.get("/:id", productController.getById);
router.get("/", getUser, productController.getAll);
router.post("/", requireIsAdmin, productController.createOne);
router.patch("/:id", requireIsAdmin, productController.updateOne);
router.delete("/soft/many", requireIsAdmin, productController.softDeleteOne);
router.delete("/restore/many", requireIsAdmin, productController.restoreOne);
router.delete("/many", requireIsAdmin, productController.deleteOne);
router.delete("/soft/:id", requireIsAdmin, productController.softDeleteOne);
router.delete("/restore/:id", requireIsAdmin, productController.restoreOne);
router.delete("/:id", requireIsAdmin, productController.deleteOne);

export default router;
