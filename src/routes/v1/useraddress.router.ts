import { Router } from "express";
import userAddressController from "../../controllers/useraddress.controller";
import {
  getUser,
  requireIsAdmin,
  requireLogin,
} from "../../middlewares/auth.middleware";

const userAddressRouter = Router();

userAddressRouter.get("/user", getUser, userAddressController.getByUserId);
userAddressRouter.post(
  "/",
  requireLogin,
  userAddressController.createUserAddress
);
userAddressRouter.patch(
  "/:id",
  requireLogin,
  userAddressController.updateUserAddress
);
userAddressRouter.delete(
  "/:id",
  requireLogin,
  userAddressController.deleteUserAddress
);

export default userAddressRouter;
