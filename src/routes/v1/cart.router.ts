import { Router } from "express";
import orderController from "../../controllers/order.controller";
import {
  requireIsAdmin,
  requireLogin,
} from "../../middlewares/auth.middleware";

const orderRouter = Router();

// orderRouter.get("/seed", groupProductController.seed);
orderRouter.get("/:id", requireIsAdmin, orderController.getOrderById);
orderRouter.get("/", requireIsAdmin, orderController.getAllOrders);
orderRouter.patch("/checkout", requireLogin, orderController.checkout);
orderRouter.patch("/status", requireIsAdmin, orderController.updateStatus);

export default orderRouter;
