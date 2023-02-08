import { Router } from "express";
import blogController from "../../controllers/blog.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/seed", blogController.seed);
router.get("/:id", blogController.getById);
router.get("/", getUser, blogController.getAll);
router.post("/", requireIsAdmin, blogController.createBlog);
router.patch("/:id", requireIsAdmin, blogController.updateBlog);
router.delete("/soft/:id", requireIsAdmin, blogController.softDeleteBlog);
router.delete("/restore/:id", requireIsAdmin, blogController.restoreBlog);
router.delete("/:id", requireIsAdmin, blogController.deleteBlog);

export default router;
