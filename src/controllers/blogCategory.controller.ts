import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import blogcategoryService from "../services/blogCategory.service";

class BlogCategoryController {
  async getAll(req: Request, res: Response) {
    const data = await blogcategoryService.getAll(req.query);
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const data = await blogcategoryService.getById(+req.params.id);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createBlogCategory(req: Request, res: Response) {
    const data = await blogcategoryService.createOne(req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateBlogCategory(req: Request, res: Response) {
    const data = await blogcategoryService.updateOne(+req.params.id, req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteBlogCategory(req: Request, res: Response) {
    const result = await blogcategoryService.deleteBlogCategory(+req.params.id);
    if (!result) {
      return res.status(STATUS_UNAUTH).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteBlogCategory(req: Request, res: Response) {
    const result = await blogcategoryService.softDeleteBlogCategory(
      +req.params.id
    );
    if (!result) {
      return res.status(STATUS_UNAUTH).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreBlogCategory(req: Request, res: Response) {
    const result = await blogcategoryService.restoreBlogCategory(
      +req.params.id
    );
    if (!result) {
      return res.status(STATUS_UNAUTH).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}

const blogCategoryController = new BlogCategoryController();

export default blogCategoryController;
