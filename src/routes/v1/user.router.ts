import { Router } from "express";
import userController from "../../controllers/user.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const userRouter = Router();

userRouter.get("/seed", userController.seed);
userRouter.get("/:id", userController.getById);
userRouter.get("/", getUser, userController.getAllUsers);
userRouter.post("/", requireIsAdmin, userController.createUser);
userRouter.patch("/:id", requireIsAdmin, userController.updateUser);
userRouter.delete("/soft/:id", requireIsAdmin, userController.softDeleteUser);
userRouter.delete("/restore/:id", requireIsAdmin, userController.restoreUser);
userRouter.delete("/:id", requireIsAdmin, userController.deleteUser);

export default userRouter;
