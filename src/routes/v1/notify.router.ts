import { Router } from "express";
import notifyController from "../../controllers/notify.controller";
import {
  requireIsAdmin,
  requireLogin,
} from "../../middlewares/auth.middleware";

const notifyRouter = Router();

notifyRouter.get("/", requireIsAdmin, notifyController.getAll);
notifyRouter.post("/", requireLogin, notifyController.createOne);
notifyRouter.delete("/:id", requireIsAdmin, notifyController.deleteOne);

export default notifyRouter;
