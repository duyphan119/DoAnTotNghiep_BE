import { Router } from "express";
import blogRouter from "./blog.router";
import groupProductRouter from "./groupproduct.router";
import userAddressRouter from "./useraddress.router";

const v1Router = Router();

v1Router.use("/blog", blogRouter);
v1Router.use("/group-product", groupProductRouter);
v1Router.use("/user-address", userAddressRouter);

export default v1Router;
