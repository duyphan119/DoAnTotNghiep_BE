import { Router } from "express";
import statisticsController from "../../controllers/statistics.controller";

const statisticsRouter = Router();

statisticsRouter.get("/", statisticsController.getStastics);

export default statisticsRouter;
