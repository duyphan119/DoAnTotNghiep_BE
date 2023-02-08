import { Router } from "express";
import authController from "../../controllers/auth.controller";
import { getUser, requireLogin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/profile", getUser, authController.getProfile);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.delete("/logout", authController.logout);
router.patch("/refresh", authController.refreshToken);
router.patch("/change-profile", requireLogin, authController.changeProfile);
router.patch("/change-password", requireLogin, authController.changePassword);

export default router;
