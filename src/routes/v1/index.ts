import { Router } from "express";
import blogRouter from "./blog.router";

const v1Router = Router();

v1Router.use("/blog", blogRouter);

export default v1Router;
