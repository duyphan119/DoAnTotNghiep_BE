import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
} from "../constantList";
import statisticsService from "../services/statistics.service";
import helper from "../utils";

class StatisticsController {
  async getStastics(req: Request, res: Response) {
    const data = await statisticsService.getStatistics();
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
}

export default new StatisticsController();
