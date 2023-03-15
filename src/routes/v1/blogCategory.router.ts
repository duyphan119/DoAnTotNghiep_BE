import { Router } from "express";
import blogcategoryController from "../../controllers/blogCategory.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/:id", blogcategoryController.getById);
router.get("/", getUser, blogcategoryController.getAll);
router.post("/", requireIsAdmin, blogcategoryController.createBlogCategory);
router.patch("/:id", requireIsAdmin, blogcategoryController.updateBlogCategory);
router.delete(
  "/force/:id",
  requireIsAdmin,
  blogcategoryController.deleteBlogCategory
);
router.delete(
  "/:id",
  requireIsAdmin,
  blogcategoryController.softDeleteBlogCategory
);
router.delete(
  "/restore/:id",
  requireIsAdmin,
  blogcategoryController.restoreBlogCategory
);

export default router;
