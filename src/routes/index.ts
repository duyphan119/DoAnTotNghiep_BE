import { Router } from "express";
import docsRouter from "./docs";
import v1Router from "./v1";

const rootRouter = Router();

rootRouter.use("/v1", v1Router);
rootRouter.use("/docs", docsRouter);
rootRouter.get("/hello", (req, res) => res.json({ msg: "hello index" }));
rootRouter.get("/", (req, res) => res.redirect("/docs"));

export default rootRouter;
