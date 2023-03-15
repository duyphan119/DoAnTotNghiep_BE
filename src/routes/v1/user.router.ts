import { Router } from "express";
import userController from "../../controllers/user.controller";
import {
  requireEqualUserIdParam,
  requireIsAdmin,
} from "../../middlewares/auth.middleware";

const router = Router();

router.get("/seed", userController.seed);
router.get("/:userId", requireEqualUserIdParam, userController.getById);
router.get("/", requireIsAdmin, userController.getAll);
router.post("/many", requireIsAdmin, userController.createMany);
router.post("/", requireIsAdmin, userController.createOne);
router.patch("/many", requireIsAdmin, userController.updateMany);
router.patch("/:id", requireIsAdmin, userController.updateOne);
router.delete("/many", requireIsAdmin, userController.softDeleteMany);
router.delete("/:id", requireIsAdmin, userController.softDeleteOne);
router.delete("/restore/many", requireIsAdmin, userController.restoreMany);
router.delete("/restore/:id", requireIsAdmin, userController.restoreOne);
router.delete("/force/many", requireIsAdmin, userController.deleteMany);
router.delete("/force/:id", requireIsAdmin, userController.deleteOne);

export default router;
