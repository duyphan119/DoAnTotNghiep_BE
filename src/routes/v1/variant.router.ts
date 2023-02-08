import { Router } from "express";
import variantController from "../../controllers/variant.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/seed", variantController.seed);
router.get("/:id", variantController.getById);
router.get("/", getUser, variantController.getAll);
router.post("/", requireIsAdmin, variantController.createVariant);
router.patch("/:id", requireIsAdmin, variantController.updateVariant);
router.delete("/soft/:id", requireIsAdmin, variantController.softDeleteVariant);
router.delete("/restore/:id", requireIsAdmin, variantController.restoreVariant);
router.delete("/:id", requireIsAdmin, variantController.deleteVariant);

export default router;
