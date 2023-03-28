import { Request, Response } from "express";
import {
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
} from "../constantList";
import notificationService from "../services/notification.service";
import orderService from "../services/order.service";
import helper from "../utils";

class OrderController {
  async getAllOrders(req: Request, res: Response) {
    const data = await orderService.getAllOrders(req.query, false, true);
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async getOrdersUser(req: Request, res: Response) {
    const data = await orderService.getAllOrders(
      req.query,
      false,
      false,
      +res.locals.user.id
    );
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async getOrderById(req: Request, res: Response) {
    const data = await orderService.getOrderById(+req.params.id);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }

  async updateStatus(req: Request, res: Response) {
    const data = await orderService.updateStatus(+req.params.id);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async checkout(req: Request, res: Response) {
    const userId = +res.locals.user.id;
    const data = await orderService.checkout(userId, req.body);

    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }

    const notification = await notificationService.createOrderNotification(
      data.userId
    );

    if (notification) {
      _io.emit("Has notify", notification);
    }

    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async cancel(req: Request, res: Response) {
    const userId = +res.locals.user.id;
    const id = +req.params.id;
    const result = await orderService.cancel(userId, id);
    if (!result)
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
}

const orderController = new OrderController();

export default orderController;
