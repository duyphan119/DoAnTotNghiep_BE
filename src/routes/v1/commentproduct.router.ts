import { Router } from "express";
import commentProductController from "../../controllers/commentProduct.controller";
import { getUser, requireLogin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/id", requireLogin, commentProductController.getById);
router.get("/", getUser, commentProductController.getAll);
router.post("/", requireLogin, commentProductController.create);
router.patch("/:id", requireLogin, commentProductController.update);
router.delete("/:id", requireLogin, commentProductController.delete);

export default router;
