import { Request, Response } from "express";
import { MSG_ERROR, MSG_SUCCESS, STATUS_OK } from "../constants";
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
}

export default new OrderDiscountController();
