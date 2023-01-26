import { Between, Not } from "typeorm";
import { AppDataSource } from "../data-source";
import CommentProduct from "../entities/commentproduct.entity";
import {
  handleEqual,
  handleILike,
  handlePagination,
  handleRelationDepth,
  handleSearchEqual,
  handleSearchILike,
  handleSort,
  lastDay,
} from "../utils";
import { QueryParams, ResponseData } from "../utils/types";
import productService from "./product.service";

type CommentProductQueryParams = QueryParams &
  Partial<{
    productId: string;
    q: string;
    content: string;
    star: string;
    user: string;
    depth: string;
  }>;

type CreateCommentProductDTO = {
  productId: number;
  content: string;
  star: number;
} & Partial<{
  parentId: number;
}>;

class CommentProductService {
  getRepository() {
    return AppDataSource.getRepository(CommentProduct);
  }

  checkUserCommentProduct(
    userId: number,
    productId: number
  ): Promise<CommentProduct | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOne({
          where: { userId, productId },
          relations: {
            ...handleRelationDepth("children", 2),
            user: true,
          },
        });
        resolve(item);
      } catch (error) {
        console.log("CHECK USER COMMENT PRODUCT ERROR", error);
        resolve(null);
      }
    });
  }
  countCommentProductByMonth(year: number, month: number): Promise<number> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count({
          where: {
            createdAt: Between(
              new Date(`${year}-${month}-01`),
              new Date(`${year}-${month}-${lastDay(month, year)}`)
            ),
          },
        });

        resolve(count);
      } catch (error) {
        resolve(0);
      }
    });
  }

  getAll(
    query: CommentProductQueryParams,
    userId?: number
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { productId, q, content, star, depth } = query;
        let userComment: CommentProduct | null = null;
        const { sort } = handleSort(query);
        const { wherePagination } = handlePagination(query);
        let [items, count] = await this.getRepository().findAndCount({
          order: sort,
          ...wherePagination,
          where: {
            ...handleILike("content", content),
            ...handleEqual("star", star, true),
            ...handleEqual("productId", productId, true),
            ...handleSearchILike(["content"], q),
            ...handleSearchEqual(["star"], star),
            // ...(userId ? { userId: Not(userId) } : {}),
          },
          relations: {
            user: true,
            ...handleRelationDepth("children", +(depth || 0)),
          },
        });
        if (userId && productId) {
          userComment = await this.checkUserCommentProduct(userId, +productId);
        }
        resolve({ data: { items, count, userComment } });
      } catch (error) {
        console.log("GET ALL COMMENT PRODUCTS ERROR", error);
        resolve({ error });
      }
    });
  }

  create(userId: number, dto: CreateCommentProductDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        let item = await this.getRepository().findOneBy({
          userId,
          productId: dto.productId,
        });
        if (!item) {
          item = await this.getRepository().save({
            ...dto,
            userId,
          });
          resolve({ data: item });
        } else {
          item = await this.getRepository().save({ ...item, ...dto });
        }
        await productService.updateStar(dto.productId);
        resolve({ data: item });
      } catch (error) {
        console.log("CREATE COMMENT PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }

  update(
    id: number,
    userId: number,
    dto: Partial<CommentProduct>
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        if (item && item.userId === userId) {
          const newItem = await this.getRepository().save({ ...item, ...dto });
          if (dto.star) {
            await productService.updateStar(item.productId);
          }
          resolve({ data: newItem });
        }
        resolve({});
      } catch (error) {
        console.log("UPDATE COMMENT PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }

  delete(id: number, userId: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        if (item && item.userId === userId) {
          await this.getRepository().delete({ parentId: id });
          await this.getRepository().delete({ id });
          await productService.updateStar(item.productId);
          resolve({});
        }
        resolve({ error: { message: "" } });
      } catch (error) {
        console.log("DELETE COMMENT PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new CommentProductService();
