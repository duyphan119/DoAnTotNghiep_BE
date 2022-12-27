import { Router } from "express";
import blogController from "../../controllers/blog.controller";
import { getUser, requireIsAdmin } from "../../middlewares/auth.middleware";

const blogRouter = Router();

blogRouter.get("/seed", blogController.seed);
blogRouter.get("/:id", blogController.getById);
blogRouter.get("/", getUser, blogController.getAll);
blogRouter.post("/", requireIsAdmin, blogController.createBlog);
blogRouter.patch("/:id", requireIsAdmin, blogController.updateBlog);
blogRouter.delete("/soft/:id", requireIsAdmin, blogController.softDeleteBlog);
blogRouter.delete("/restore/:id", requireIsAdmin, blogController.restoreBlog);
blogRouter.delete("/:id", requireIsAdmin, blogController.deleteBlog);

export default blogRouter;
