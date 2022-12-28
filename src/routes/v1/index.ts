import { Router } from "express";
import authRouter from "./auth.router";
import blogRouter from "./blog.router";
import cartRouter from "./cart.router";
import groupProductRouter from "./groupproduct.router";
import orderRouter from "./order.router";
import productRouter from "./product.router";
import productVariantRouter from "./productvariant.router";
import userRouter from "./user.router";
import userAddressRouter from "./useraddress.router";
import variantRouter from "./variant.router";
import variantValueRouter from "./variantvalue.router";

const v1Router = Router();

v1Router.use("/blog", blogRouter);
v1Router.use("/group-product", groupProductRouter);
v1Router.use("/user-address", userAddressRouter);
v1Router.use("/variant", variantRouter);
v1Router.use("/variant-value", variantValueRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/user", userRouter);
v1Router.use("/product", productRouter);
v1Router.use("/product-variant", productVariantRouter);
v1Router.use("/order", orderRouter);
v1Router.use("/cart", cartRouter);

export default v1Router;
