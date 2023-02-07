import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
} from "../constantList";
import orderDiscountService from "../services/orderdiscount.service";

class OrderDiscountController {
  async check(req: Request, res: Response) {
    if (!res.locals.user)
      return res.status(STATUS_OK).json({ message: MSG_ERROR });
    const userId = +res.locals.user.id;
    const { code, total } = req.body;
    const result = await orderDiscountService.check(userId, code, total);

    if (result) {
      const orderdiscount = await orderDiscountService.getByCode(code);
      if (orderdiscount)
        return res
          .status(STATUS_OK)
          .json({ data: orderdiscount, message: MSG_SUCCESS });
    }

    return res.status(STATUS_OK).json({ message: MSG_ERROR });
  }

  async create(req: Request, res: Response) {
    const data = await orderDiscountService.create(req.body);
    if (!data) res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });

    res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
}

export default new OrderDiscountController();
