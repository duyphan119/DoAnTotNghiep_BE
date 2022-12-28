import { Router } from "express";
import cartController from "../../controllers/cart.controller";
import { requireLogin } from "../../middlewares/auth.middleware";

const orderRouter = Router();

// orderRouter.get("/seed", groupProductController.seed);
orderRouter.get("/user", requireLogin, cartController.getCartByUser);
orderRouter.post("/", requireLogin, cartController.createCartItem);
orderRouter.patch("/:id", requireLogin, cartController.updateCartItem);
orderRouter.delete("/:id", requireLogin, cartController.deleteCartItem);

export default orderRouter;
