import { Router } from "express";
import groupProductController from "../../controllers/groupProduct.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const groupProductRouter = Router();

groupProductRouter.get("/seed", groupProductController.seed);
groupProductRouter.get("/:id", getUser, groupProductController.getById);
groupProductRouter.get("/", getUser, groupProductController.getAll);
groupProductRouter.post(
  "/",
  requireIsAdmin,
  groupProductController.createGroupProduct
);
groupProductRouter.patch(
  "/:id",
  requireIsAdmin,
  groupProductController.updateGroupProduct
);
groupProductRouter.delete(
  "/soft/:id",
  requireIsAdmin,
  groupProductController.softDeleteGroupProduct
);
groupProductRouter.delete(
  "/restore/:id",
  requireIsAdmin,
  groupProductController.restoreGroupProduct
);
groupProductRouter.delete(
  "/:id",
  requireIsAdmin,
  groupProductController.deleteGroupProduct
);

export default groupProductRouter;
