import { Router } from "express";
import productVariantController from "../../controllers/productVariant.controller";
import { requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/:id", productVariantController.getById);
router.get("/", productVariantController.getAll);
router.post("/many", requireIsAdmin, productVariantController.createMany);
router.post("/", requireIsAdmin, productVariantController.createOne);
router.patch("/many", requireIsAdmin, productVariantController.updateMany);
router.patch("/:id", requireIsAdmin, productVariantController.updateOne);
router.delete("/many", requireIsAdmin, productVariantController.softDeleteMany);
router.delete("/:id", requireIsAdmin, productVariantController.softDeleteOne);
router.delete(
  "/restore/many",
  requireIsAdmin,
  productVariantController.restoreMany
);
router.delete(
  "/restore/:id",
  requireIsAdmin,
  productVariantController.restoreOne
);
router.delete(
  "/force/many",
  requireIsAdmin,
  productVariantController.deleteMany
);
router.delete("/force/:id", requireIsAdmin, productVariantController.deleteOne);

export default router;
