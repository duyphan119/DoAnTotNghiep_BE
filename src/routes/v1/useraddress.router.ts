import { Router } from "express";
import userAddressController from "../../controllers/userAddress.controller";
import { getUser, requireLogin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/user", getUser, userAddressController.getByUserId);
router.post("/", requireLogin, userAddressController.createOne);
router.patch("/:id", requireLogin, userAddressController.updateOne);
router.delete("/:id", requireLogin, userAddressController.deleteOne);

export default router;
