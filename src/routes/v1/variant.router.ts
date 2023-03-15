import { Router } from "express";
import variantController from "../../controllers/variant.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/seed", variantController.seed);
router.get("/:id", variantController.getById);
router.get("/", getUser, variantController.getAll);
router.post("/many", requireIsAdmin, variantController.createMany);
router.post("/", requireIsAdmin, variantController.createOne);
router.patch("/many", requireIsAdmin, variantController.updateMany);
router.patch("/:id", requireIsAdmin, variantController.updateOne);
router.delete("/many", requireIsAdmin, variantController.softDeleteMany);
router.delete("/:id", requireIsAdmin, variantController.softDeleteOne);
router.delete("/restore/many", requireIsAdmin, variantController.restoreMany);
router.delete("/restore/:id", requireIsAdmin, variantController.restoreOne);
router.delete("/force/many", requireIsAdmin, variantController.deleteMany);
router.delete("/force/:id", requireIsAdmin, variantController.deleteOne);

export default router;
