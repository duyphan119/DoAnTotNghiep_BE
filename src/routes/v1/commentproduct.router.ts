import { Router } from "express";
import commentproductController from "../../controllers/commentproduct.controller";
import { getUser, requireLogin } from "../../middlewares/auth.middleware";

const commentProductRouter = Router();

commentProductRouter.get("/", getUser, commentproductController.getAll);
commentProductRouter.post("/", requireLogin, commentproductController.create);
commentProductRouter.patch(
  "/:id",
  requireLogin,
  commentproductController.update
);
commentProductRouter.delete(
  "/:id",
  requireLogin,
  commentproductController.delete
);

export default commentProductRouter;
