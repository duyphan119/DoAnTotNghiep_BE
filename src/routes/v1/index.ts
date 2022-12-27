import { Router } from "express";
import blogRouter from "./blog.router";
import groupProductRouter from "./groupproduct.router";
import userAddressRouter from "./useraddress.router";
import variantRouter from "./variant.router";
import variantValueRouter from "./variantvalue.router";

const v1Router = Router();

v1Router.use("/blog", blogRouter);
v1Router.use("/group-product", groupProductRouter);
v1Router.use("/user-address", userAddressRouter);
v1Router.use("/variant", variantRouter);
v1Router.use("/variant-value", variantValueRouter);

export default v1Router;
