import { Router } from "express";
import authController from "../../controllers/auth.controller";
import { requireLogin } from "../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.delete("/logout", authController.logout);
authRouter.patch("/refresh", authController.refreshToken);
authRouter.patch("/change-profile", requireLogin, authController.changeProfile);
authRouter.patch(
  "/change-password",
  requireLogin,
  authController.changePassword
);

export default authRouter;
