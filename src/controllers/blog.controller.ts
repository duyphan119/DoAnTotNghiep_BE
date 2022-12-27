import { Request, Response } from "express";
import { STATUS_INTERVAL_ERROR, STATUS_OK } from "../constants";
import blogService from "../services/blog.service";

class BlogController {
  async getAll(req: Request, res: Response) {
    const { error, data } = await blogService.getAll(req.query);
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json(data);
  }
}

export default new BlogController();
