import { Router } from "express";
import userAddressController from "../../controllers/userAddress.controller";
import { getUser, requireLogin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/user", getUser, userAddressController.getByUserId);
router.post("/", requireLogin, userAddressController.createUserAddress);
router.patch("/:id", requireLogin, userAddressController.updateUserAddress);
router.delete("/:id", requireLogin, userAddressController.deleteUserAddress);

export default router;
