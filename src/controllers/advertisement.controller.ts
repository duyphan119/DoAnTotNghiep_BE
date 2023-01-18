import { Request, Response } from "express";
import {
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constants";
import advertisementService from "../services/advertisement.service";

class AdvertisementController {
  async getAll(req: Request, res: Response) {
    const { error, data } = await advertisementService.getAll(req.query);
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const { error, data } = await advertisementService.getById(+req.params.id);
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createAdvertisement(req: Request, res: Response) {
    const { error, data } = await advertisementService.create(req.body);
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateAdvertisement(req: Request, res: Response) {
    const { error, data } = await advertisementService.update(
      +req.params.id,
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteAdvertisement(req: Request, res: Response) {
    const { error } = await advertisementService.delete(+req.params.id);
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  // async seed(req: Request, res: Response) {
  //   const { error, data } = await advertisementService.seed();
  //   if (error) {
  //     return res.status(STATUS_INTERVAL_ERROR).json(error);
  //   }
  //   return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  // }
}

export default new AdvertisementController();
