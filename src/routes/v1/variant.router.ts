import { Router } from "express";
import variantController from "../../controllers/variant.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const variantRouter = Router();

variantRouter.get("/seed", variantController.seed);
variantRouter.get("/:id", variantController.getById);
variantRouter.get("/", getUser, variantController.getAll);
variantRouter.post("/", requireIsAdmin, variantController.createVariant);
variantRouter.patch("/:id", requireIsAdmin, variantController.updateVariant);
variantRouter.delete(
  "/soft/:id",
  requireIsAdmin,
  variantController.softDeleteVariant
);
variantRouter.delete(
  "/restore/:id",
  requireIsAdmin,
  variantController.restoreVariant
);
variantRouter.delete("/:id", requireIsAdmin, variantController.deleteVariant);

export default variantRouter;
