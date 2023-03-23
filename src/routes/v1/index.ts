import { Router } from "express";
import advertisementRouter from "./advertisement.router";
import authRouter from "./auth.router";
import blogRouter from "./blog.router";
import blogCategoryRouter from "./blogCategory.router";
import cartRouter from "./cart.router";
import commentProductRouter from "./commentProduct.router";
import groupProductRouter from "./groupProduct.router";
import notificationRouter from "./notification.router";
import orderRouter from "./order.router";
import orderDiscountRouter from "./orderDiscount.router";
import productRouter from "./product.router";
import productVariantRouter from "./productvariant.router";
import productVariantImageRouter from "./productvariantimage.router";
import settingWensiteRouter from "./settingWebsite.router";
import statisticsRouter from "./statistics.router";
import uploadRouter from "./upload.router";
import userRouter from "./user.router";
import userAddressRouter from "./userAddress.router";
import variantRouter from "./variant.router";
import variantValueRouter from "./variantValue.router";
import repCommentProductRouter from "./repCommentProduct.router";
import notificationTypeRouter from "./notificationType.router";

const router = Router();

router.use("/blog-category", blogCategoryRouter);
router.use("/blog", blogRouter);
router.use("/group-product", groupProductRouter);
router.use("/user-address", userAddressRouter);
router.use("/variant", variantRouter);
router.use("/variant-value", variantValueRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/product-variant", productVariantRouter);
router.use("/order", orderRouter);
router.use("/upload", uploadRouter);
router.use("/cart", cartRouter);
router.use("/product-variant-image", productVariantImageRouter);
router.use("/advertisement", advertisementRouter);
router.use("/comment-product", commentProductRouter);
router.use("/notification", notificationRouter);
router.use("/order-discount", orderDiscountRouter);
router.use("/setting-website", settingWensiteRouter);
router.use("/statistics", statisticsRouter);
router.use("/rep-comment-product", repCommentProductRouter);
router.use("/notification-type", notificationTypeRouter);

export default router;
