import { Router } from "express";
import variantValueController from "../../controllers/variantvalue.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const variantValueRouter = Router();

variantValueRouter.get("/seed", variantValueController.seed);
variantValueRouter.get("/:id", variantValueController.getById);
variantValueRouter.get("/", getUser, variantValueController.getAll);
variantValueRouter.post(
  "/",
  requireIsAdmin,
  variantValueController.createVariantValue
);
variantValueRouter.patch(
  "/:id",
  requireIsAdmin,
  variantValueController.updateVariantValue
);
variantValueRouter.delete(
  "/soft/:id",
  requireIsAdmin,
  variantValueController.softDeleteVariantValue
);
variantValueRouter.delete(
  "/restore/:id",
  requireIsAdmin,
  variantValueController.restoreVariantValue
);
variantValueRouter.delete(
  "/:id",
  requireIsAdmin,
  variantValueController.deleteVariantValue
);

export default variantValueRouter;
