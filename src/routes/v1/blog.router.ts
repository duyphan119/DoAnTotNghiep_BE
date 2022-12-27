import { Router } from "express";
import blogController from "../../controllers/blog.controller";

const blogRouter = Router();

blogRouter.get("/:id", blogController.getById);
blogRouter.get("/", blogController.getAll);

export default blogRouter;
