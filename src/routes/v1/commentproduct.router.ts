import { Router } from "express";
import commentProductController from "../../controllers/commentProduct.controller";
import { getUser, requireLogin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/:id", requireLogin, commentProductController.getById);
router.get("/", getUser, commentProductController.getAll);
router.post("/", requireLogin, commentProductController.createOne);
router.patch("/:id", requireLogin, commentProductController.updateOne);
router.delete("/:id", requireLogin, commentProductController.deleteOne);

export default router;
