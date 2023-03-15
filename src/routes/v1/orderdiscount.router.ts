import { Router } from "express";
import orderDiscountController from "../../controllers/orderDiscount.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/check", getUser, orderDiscountController.check);
// router.get("/seed", orderDiscountController.seed);
router.get("/:id", orderDiscountController.getById);
router.get("/", getUser, orderDiscountController.getAll);
router.post("/many", requireIsAdmin, orderDiscountController.createMany);
router.post("/", requireIsAdmin, orderDiscountController.createOne);
router.patch("/many", requireIsAdmin, orderDiscountController.updateMany);
router.patch("/:id", requireIsAdmin, orderDiscountController.updateOne);
router.delete("/many", requireIsAdmin, orderDiscountController.softDeleteMany);
router.delete("/:id", requireIsAdmin, orderDiscountController.softDeleteOne);
router.delete(
  "/restore/many",
  requireIsAdmin,
  orderDiscountController.restoreMany
);
router.delete(
  "/restore/:id",
  requireIsAdmin,
  orderDiscountController.restoreOne
);
router.delete(
  "/force/many",
  requireIsAdmin,
  orderDiscountController.deleteMany
);
router.delete("/force/:id", requireIsAdmin, orderDiscountController.deleteOne);

export default router;
