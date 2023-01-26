import { Router } from "express";
import orderDiscountController from "../../controllers/orderdiscount.controller";
import { getUser } from "../../middlewares/auth.middleware";

const orderDiscountRouter = Router();

// orderDiscountRouter.get("/seed", groupProductController.seed);
orderDiscountRouter.get("/check", getUser, orderDiscountController.check);

export default orderDiscountRouter;
