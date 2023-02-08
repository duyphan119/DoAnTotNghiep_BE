import { Router } from "express";
import userController from "../../controllers/user.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/seed", userController.seed);
router.get("/:id", userController.getById);
router.get("/", getUser, userController.getAllUsers);
router.post("/", requireIsAdmin, userController.createUser);
router.patch("/:id", requireIsAdmin, userController.updateUser);
router.delete("/soft/:id", requireIsAdmin, userController.softDeleteUser);
router.delete("/restore/:id", requireIsAdmin, userController.restoreUser);
router.delete("/:id", requireIsAdmin, userController.deleteUser);

export default router;
