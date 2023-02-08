import { Router } from "express";
import orderDiscountController from "../../controllers/orderDiscount.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

// router.get("/seed", groupProductController.seed);
router.get("/check", getUser, orderDiscountController.check);
router.post("/", requireIsAdmin, orderDiscountController.create);

export default router;
