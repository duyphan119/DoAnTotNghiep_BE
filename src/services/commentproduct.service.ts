import { Between } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import CommentProduct from "../entities/commentProduct.entity";
import {
  handleEqual,
  handleILike,
  handlePagination,
  handleSearchEqual,
  handleSort,
  lastDay,
} from "../utils";
import { GetAll } from "../utils/types";
import {
  CreateCommentProductDTO,
  GetAllCommentProductQueryParams,
} from "../utils/types/commentProduct";
import productService from "./product.service";
import repCommentProductService from "./repCommentProduct.service";

class CommentProductService {
  getRepository() {
    return AppDataSource.getRepository(CommentProduct);
  }

  checkUserCommentProductProduct(
    userId: number,
    productId: number
  ): Promise<CommentProduct | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOne({
          where: { userId, productId },
          relations: {
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
  ): Promise<
    GetAll<CommentProduct> & {
      userCommentProduct: CommentProduct | null;
    }
  > {
    return new Promise(async (resolve, _) => {
      try {
        // const LIMIT_REP = 3;
        const {
          productId,
          content,
          star,
          product,
          repComments,
          sortBy,
          sortType,
        } = query;
        let userCommentProduct: CommentProduct | null = null;
        const { sort } = handleSort(query);
        const { wherePagination } = handlePagination(query);
        let [items, count] = await this.getRepository().findAndCount({
          order:
            sortBy === "productName"
              ? {
                  product: {
                    name: sortType === "DESC" ? "DESC" : "ASC",
                  },
                }
              : sort,
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
            ...(product ? { product: true } : {}),
            ...(repComments ? { repComments: { user: true } } : {}),
            ...(sortBy === "productName" ? { product: true } : {}),
          },
        });
        // if (repComments) {
        //   const listRes = await Promise.all(
        //     items.map((item: CommentProduct) =>
        //       repCommentProductService.getRepository().find({
        //         where: {
        //           commentProductId: item.id,
        //         },
        //         relations: {
        //           user: true,
        //         },
        //         take: LIMIT_REP,
        //       })
        //     )
        //   );
        //   items = items.map((item, index) => ({
        //     ...item,
        //     repComments: listRes[index],
        //   }));
        // }
        if (userId && productId) {
          userCommentProduct = await this.checkUserCommentProductProduct(
            userId,
            +productId
          );
        }
        resolve({ items, count, userCommentProduct });
      } catch (error) {
        console.log("GET ALL COMMENT PRODUCTS ERROR", error);
        resolve({ ...EMPTY_ITEMS, userCommentProduct: null });
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
