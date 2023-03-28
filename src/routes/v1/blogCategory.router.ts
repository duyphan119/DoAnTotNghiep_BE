import { Router } from "express";
import blogcategoryController from "../../controllers/blogCategory.controller";
import { requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/:id", blogcategoryController.getById);
router.get("/", blogcategoryController.getAll);
router.post("/", requireIsAdmin, blogcategoryController.createOne);
router.patch("/:id", requireIsAdmin, blogcategoryController.updateOne);
router.delete("/many", requireIsAdmin, blogcategoryController.softDeleteMany);
router.delete("/:id", requireIsAdmin, blogcategoryController.softDeleteOne);
router.delete(
  "/restore/many",
  requireIsAdmin,
  blogcategoryController.restoreMany
);
router.delete(
  "/restore/:id",
  requireIsAdmin,
  blogcategoryController.restoreOne
);
router.delete("/force/many", requireIsAdmin, blogcategoryController.deleteMany);
router.delete("/force/:id", requireIsAdmin, blogcategoryController.deleteOne);

export default router;
