import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
} from "../constantList";
import orderDiscountService from "../services/orderDiscount.service";
import helper from "../utils";

class OrderDiscountController {
  async check(req: Request, res: Response) {
    if (!res.locals.user)
      return res.status(STATUS_OK).json(helper.responseError());
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

    return res.status(STATUS_OK).json(helper.responseError());
  }
  async getAll(req: Request, res: Response) {
    const data = await orderDiscountService.getAll(req.query);
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async getById(req: Request, res: Response) {
    const data = await orderDiscountService.getById(+req.params.id);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async createOne(req: Request, res: Response) {
    try {
      const data = await orderDiscountService.createOne(req.body);
      if (!data) {
        return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
      }
      return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
    } catch (error) {
      return res.status(STATUS_BAD_REQUEST).json(helper.responseError(error));
    }
  }
  async updateOne(req: Request, res: Response) {
    try {
      const data = await orderDiscountService.updateOne(
        +req.params.id,
        req.body
      );
      if (!data) {
        return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
      }
      return res.status(STATUS_OK).json(helper.responseSuccess(data));
    } catch (error) {
      return res.status(STATUS_BAD_REQUEST).json(helper.responseError(error));
    }
  }
  async deleteOne(req: Request, res: Response) {
    const result = await orderDiscountService.deleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async deleteMany(req: Request, res: Response) {
    const result = await orderDiscountService.deleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async softDeleteOne(req: Request, res: Response) {
    const result = await orderDiscountService.softDeleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async softDeleteMany(req: Request, res: Response) {
    const result = await orderDiscountService.softDeleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async restoreOne(req: Request, res: Response) {
    const result = await orderDiscountService.restoreOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async restoreMany(req: Request, res: Response) {
    const result = await orderDiscountService.restoreMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  // async seed(req: Request, res: Response) {
  //   const { error, data } = await orderDiscountService.seed();
  //   if (error) {
  //     return res.status(STATUS_INTERVAL_ERROR).json(error);
  //   }
  //   return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
  // }
}

const orderDiscountController = new OrderDiscountController();

export default orderDiscountController;
