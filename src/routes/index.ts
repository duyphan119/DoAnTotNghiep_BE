import { Router } from "express";
import v1Router from "./v1";

const rootRouter = Router();

rootRouter.use("/v1", v1Router);
rootRouter.get("/", (req, res) => res.send("Đồ án tốt nghiệp _ Backend"));

export default rootRouter;
