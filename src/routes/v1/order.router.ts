import { Router } from "express";
import orderController from "../../controllers/order.controller";
import {
  requireIsAdmin,
  requireLogin,
} from "../../middlewares/auth.middleware";

const order = Router();

// order.get("/seed", groupProductController.seed);
order.get("/user", requireLogin, orderController.getOrdersUser);
order.get("/:id", requireIsAdmin, orderController.getOrderById);
order.get("/", requireIsAdmin, orderController.getAllOrders);
order.patch("/checkout", requireLogin, orderController.checkout);
order.patch("/:id/status", requireIsAdmin, orderController.updateStatus);

export default order;
