import { Router } from "express";
import repCommentProductController from "../../controllers/repCommentProduct.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/:id", repCommentProductController.getById);
router.get("/", getUser, repCommentProductController.getAll);
router.post("/many", requireIsAdmin, repCommentProductController.createMany);
router.post("/", requireIsAdmin, repCommentProductController.createOne);
router.patch("/many", requireIsAdmin, repCommentProductController.updateMany);
router.patch("/:id", requireIsAdmin, repCommentProductController.updateOne);
router.delete(
  "/many",
  requireIsAdmin,
  repCommentProductController.softDeleteMany
);
router.delete(
  "/:id",
  requireIsAdmin,
  repCommentProductController.softDeleteOne
);
router.delete(
  "/restore/many",
  requireIsAdmin,
  repCommentProductController.restoreMany
);
router.delete(
  "/restore/:id",
  requireIsAdmin,
  repCommentProductController.restoreOne
);
router.delete(
  "/force/many",
  requireIsAdmin,
  repCommentProductController.deleteMany
);
router.delete(
  "/force/:id",
  requireIsAdmin,
  repCommentProductController.deleteOne
);

export default router;
