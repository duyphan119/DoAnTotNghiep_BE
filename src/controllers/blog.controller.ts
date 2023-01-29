import { Request, Response } from "express";
import {
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import blogService from "../services/blog.service";

class BlogController {
  async getAll(req: Request, res: Response) {
    const { error, data } = await blogService.getAll(req.query);
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const { error, data } = await blogService.getById(+req.params.id);
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createBlog(req: Request, res: Response) {
    const { error, data } = await blogService.createBlog(
      +res.locals.user.id,
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateBlog(req: Request, res: Response) {
    const { error, data } = await blogService.updateBlog(
      +req.params.id,
      +res.locals.user.id,
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteBlog(req: Request, res: Response) {
    const { error } = await blogService.deleteBlog(+req.params.id);
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteBlog(req: Request, res: Response) {
    const { error } = await blogService.softDeleteBlog(+req.params.id);
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreBlog(req: Request, res: Response) {
    const { error } = await blogService.restoreBlog(+req.params.id);
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async seed(req: Request, res: Response) {
    const { error, data } = await blogService.seed();
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
}

export default new BlogController();
