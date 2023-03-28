import { Router } from "express";
import cartController from "../../controllers/cart.controller";
import { requireLogin } from "../../middlewares/auth.middleware";

const cartRouter = Router();

// cartRouter.get("/seed", groupProductController.seed);
cartRouter.get("/user", requireLogin, cartController.getCartByUser);
cartRouter.post("/login", requireLogin, cartController.loginCreateCart);
cartRouter.post("/", requireLogin, cartController.createCartItem);
cartRouter.patch("/:id", requireLogin, cartController.updateCartItem);
cartRouter.delete(
  "/:productVariantId",
  requireLogin,
  cartController.deleteCartItem
);

export default cartRouter;
