import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
} from "../constantList";
import orderDiscountService from "../services/orderDiscount.service";

class OrderDiscountController {
  async check(req: Request, res: Response) {
    if (!res.locals.user)
      return res.status(STATUS_OK).json({ message: MSG_ERROR });
    const userId = +res.locals.user.id;
    const { code, total } = req.query;
    const _code = `${code}`;
    const _total = +`${total}`;
    const result = await orderDiscountService.check(userId, _code, _total);

    if (result) {
      const orderdiscount = await orderDiscountService.getByCode(_code);
      if (orderdiscount)
        return res
          .status(STATUS_OK)
          .json({ data: orderdiscount, message: MSG_SUCCESS });
    }

    return res.status(STATUS_OK).json({ message: MSG_ERROR });
  }
  async getAll(req: Request, res: Response) {
    const data = await orderDiscountService.getAll(req.query);
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const data = await orderDiscountService.getById(+req.params.id);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createOne(req: Request, res: Response) {
    const data = await orderDiscountService.createOne(req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async createMany(req: Request, res: Response) {
    const data = await orderDiscountService.createMany(req.body.inputs);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateOne(req: Request, res: Response) {
    const data = await orderDiscountService.updateOne(+req.params.id, req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async updateMany(req: Request, res: Response) {
    const data = await orderDiscountService.updateMany(req.body.inputs);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteOne(req: Request, res: Response) {
    const result = await orderDiscountService.deleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async deleteMany(req: Request, res: Response) {
    const result = await orderDiscountService.deleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteOne(req: Request, res: Response) {
    const result = await orderDiscountService.softDeleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteMany(req: Request, res: Response) {
    const result = await orderDiscountService.softDeleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreOne(req: Request, res: Response) {
    const result = await orderDiscountService.restoreOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreMany(req: Request, res: Response) {
    const result = await orderDiscountService.restoreMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  // async seed(req: Request, res: Response) {
  //   const { error, data } = await orderDiscountService.seed();
  //   if (error) {
  //     return res.status(STATUS_INTERVAL_ERROR).json(error);
  //   }
  //   return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  // }
}

const orderDiscountController = new OrderDiscountController();

export default orderDiscountController;
