import { Between, Not } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import CommentProduct from "../entities/commentProduct.entity";
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
import { GetAll, QueryParams, ResponseData } from "../utils/types";
import {
  CreateCommentProductDTO,
  GetAllCommentProductQueryParams,
} from "../utils/types/commentProduct";
import productService from "./product.service";

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

  getById(id: number): Promise<CommentProduct | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOne({
          where: { id },
          relations: {
            user: true,
          },
        });
        resolve(item);
      } catch (error) {
        console.log("GET COMMENT PRODUCT BY ID ERROR", error);
        resolve(null);
      }
    });
  }

  getAll(
    query: GetAllCommentProductQueryParams,
    userId?: number
  ): Promise<GetAll<CommentProduct> & { userComment: CommentProduct | null }> {
    return new Promise(async (resolve, _) => {
      try {
        const { productId, content, star, depth } = query;
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
        resolve({ items, count, userComment });
      } catch (error) {
        console.log("GET ALL COMMENT PRODUCTS ERROR", error);
        resolve({ ...EMPTY_ITEMS, userComment: null });
      }
    });
  }

  create(
    userId: number,
    dto: CreateCommentProductDTO
  ): Promise<CommentProduct | null> {
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
          resolve(item);
        } else {
          item = await this.getRepository().save({ ...item, ...dto });
        }
        await productService.updateStar(dto.productId);
        const newItem = await this.getById(item.id);
        resolve(newItem);
      } catch (error) {
        console.log("CREATE COMMENT PRODUCT ERROR", error);
        resolve(null);
      }
    });
  }

  update(
    id: number,
    userId: number,
    dto: Partial<CommentProduct>
  ): Promise<CommentProduct | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        if (item && item.userId === userId) {
          await this.getRepository().save({ ...item, ...dto });
          if (dto.star) {
            await productService.updateStar(item.productId);
          }
          const newItem = await this.getById(item.id);
          resolve(newItem);
        }
      } catch (error) {
        console.log("UPDATE COMMENT PRODUCT ERROR", error);
      }
      resolve(null);
    });
  }

  delete(id: number, userId: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        if (item && item.userId === userId) {
          await this.getRepository().delete({ parentId: id });
          await this.getRepository().delete({ id });
          await productService.updateStar(item.productId);
          resolve(true);
        }
      } catch (error) {
        console.log("DELETE COMMENT PRODUCT ERROR", error);
      }
      resolve(false);
    });
  }
}

const commentProductService = new CommentProductService();

export default commentProductService;
