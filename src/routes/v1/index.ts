import { Router } from "express";
import blogRouter from "./blog.router";
import groupProductRouter from "./groupproduct.router";

const v1Router = Router();

v1Router.use("/blog", blogRouter);
v1Router.use("/group-product", groupProductRouter);

export default v1Router;
