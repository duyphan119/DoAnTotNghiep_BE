import { Request, Response } from "express";
import { MSG_SUCCESS, STATUS_INTERVAL_ERROR, STATUS_OK } from "../constants";
import orderService from "../services/order.service";

class OrderController {
  async getAllOrders(req: Request, res: Response) {
    const { data, error } = await orderService.getAllOrders(
      req.query,
      false,
      true
    );
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async getOrderById(req: Request, res: Response) {
    const { data, error } = await orderService.getOrderById(+req.params.id);
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async updateStatus(req: Request, res: Response) {
    const { data, error } = await orderService.updateStatus(
      +req.params.id,
      req.body.status
    );
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async checkout(req: Request, res: Response) {
    const { data, error } = await orderService.checkout(
      +res.locals.user.id,
      req.body
    );
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
}

export default new OrderController();
