import { Between } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import CommentProduct from "../entities/commentProduct.entity";
import helper from "../utils";
import { ICrudService } from "../utils/interfaces";
import { GetAll } from "../utils/types";
import { CreateCommentProductDTO, CommentProductParams } from "../utils/types";
import productService from "./product.service";
import repCommentProductService from "./repCommentProduct.service";
import userService from "./user.service";

class CommentProductService
  implements
    ICrudService<CommentProduct, CommentProductParams, CreateCommentProductDTO>
{
  updateMany(
    inputs: ({ id: number } & Partial<CreateCommentProductDTO>)[]
  ): Promise<(CommentProduct | null)[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItems = await Promise.all(
          inputs.map((input) => {
            const { id, ...dto } = input;
            return this.updateOne(id, dto);
          })
        );
        resolve(newItems);
      } catch (error) {
        console.log("CommentProductService.updateMany error", error);
      }
      resolve([]);
    });
  }
  createMany(
    listDto: CreateCommentProductDTO[]
  ): Promise<(CommentProduct | null)[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItems = await Promise.all(
          listDto.map((dto) => this.createOne(dto))
        );
        resolve(newItems);
      } catch (error) {
        console.log("CommentProductService.createMany error", error);
      }
      resolve([]);
    });
  }
  updateOne(
    id: number,
    dto: Partial<CreateCommentProductDTO>
  ): Promise<CommentProduct | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const existingItem = await this.getRepository().findOneBy({ id });
        if (existingItem) {
          const newItem = await this.getRepository().save({
            ...existingItem,
            ...dto,
          });
          if (dto.star) {
            await productService.updateStar(newItem.productId);
          }
          resolve(newItem);
        }
      } catch (error) {
        console.log("CommentProductService.updateOne error", error);
      }
      resolve(null);
    });
  }
  search(params: CommentProductParams): Promise<GetAll<CommentProduct>> {
    return new Promise(async (resolve, _) => {
      try {
        const LIMIT_REP = 3;
        const { q, product, repComments } = params;
        const { sort, sortBy, sortType } = helper.handleSort(params);
        const { wherePagination } = helper.handlePagination(params);
        let [items, count] = await this.getRepository().findAndCount({
          order:
            sortBy === "productName"
              ? {
                  product: {
                    name: sortType,
                  },
                }
              : sort,
          ...wherePagination,
          where: [
            helper.handleILike("content", q),
            helper.handleEqual("star", q, true),
            helper.handleEqual("productId", q, true),
            helper.handleSearchEqual(["star"], q),
          ],
          relations: {
            user: true,
            ...(product || sortBy === "productName" ? { product: true } : {}),
            ...(repComments ? { repComments: { user: true } } : {}),
          },
        });
        if (repComments) {
          const listRes = await Promise.all(
            items.map((item: CommentProduct) =>
              repCommentProductService.getRepository().find({
                where: {
                  commentProductId: item.id,
                },
                relations: {
                  user: true,
                },
                take: LIMIT_REP,
              })
            )
          );
          items = items.map((item, index) => ({
            ...item,
            repComments: listRes[index],
          }));
        }
        // if (userId && productId) {
        //   userCommentProduct = await this.checkUserCommentProduct(
        //     userId,
        //     +productId
        //   );
        // }
        resolve({ items, count });
      } catch (error) {
        console.log("CommentProductService.getAll error", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }

  deleteOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete(id);
        resolve(true);
      } catch (error) {
        console.log("CommentProductService.deleteOne error", error);
        resolve(false);
      }
    });
  }
  deleteMany(listId: number[]): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete(listId);
        resolve(true);
      } catch (error) {
        console.log("CommentProductService.deleteMany error", error);
        resolve(false);
      }
    });
  }
  softDeleteOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete(id);
        resolve(true);
      } catch (error) {
        console.log("CommentProductService.softDeleteOne error", error);
        resolve(false);
      }
    });
  }
  softDeleteMany(listId: number[]): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete(listId);
        resolve(true);
      } catch (error) {
        console.log("CommentProductService.softDeleteMany error", error);
        resolve(false);
      }
    });
  }
  restoreOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore(id);
        resolve(true);
      } catch (error) {
        console.log("CommentProductService.restoreOne error", error);
        resolve(false);
      }
    });
  }
  restoreMany(listId: number[]): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore(listId);
        resolve(true);
      } catch (error) {
        console.log("CommentProductService.restoreMany error", error);
        resolve(false);
      }
    });
  }
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
            user: true,
          },
        });
        resolve(item);
      } catch (error) {
        console.log(
          "CommentProductService.checkUserCommentProduct error",
          error
        );
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
              new Date(`${year}-${month}-${helper.lastDay(month, year)}`)
            ),
          },
        });

        resolve(count);
      } catch (error) {
        console.log(
          "CommentProductService.countCommentProductByMonth error",
          error
        );
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
        console.log("CommentProductService.getById error", error);
        resolve(null);
      }
    });
  }

  getAll(params: CommentProductParams): Promise<GetAll<CommentProduct>> {
    return new Promise(async (resolve, _) => {
      try {
        const LIMIT_REP = 3;
        const {
          productId,
          content,
          star,
          product,
          repComments,
          sortBy,
          sortType,
        } = params;
        // let userCommentProduct: CommentProduct | null = null;
        const { sort } = helper.handleSort(params);
        const { wherePagination } = helper.handlePagination(params);
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
            ...helper.handleILike("content", content),
            ...helper.handleEqual("star", star, true),
            ...helper.handleEqual("productId", productId, true),
            ...helper.handleSearchEqual(["star"], star),
            // ...(userId ? { userId: Not(userId) } : {}),
          },
          relations: {
            user: true,
            ...(product ? { product: true } : {}),
            ...(repComments ? { repComments: { user: true } } : {}),
            ...(sortBy === "productName" ? { product: true } : {}),
          },
        });
        if (repComments) {
          const listRes = await Promise.all(
            items.map((item: CommentProduct) =>
              repCommentProductService.getRepository().find({
                where: {
                  commentProductId: item.id,
                },
                relations: {
                  user: true,
                },
                take: LIMIT_REP,
              })
            )
          );
          items = items.map((item, index) => ({
            ...item,
            repComments: listRes[index],
          }));
        }
        // if (userId && productId) {
        //   userCommentProduct = await this.checkUserCommentProduct(
        //     userId,
        //     +productId
        //   );
        // }
        resolve({ items, count });
      } catch (error) {
        console.log("CommentProductService.getAll error", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }

  createOne(dto: CreateCommentProductDTO): Promise<CommentProduct | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItem = await this.getRepository().save(dto);
        await productService.updateStar(dto.productId);
        resolve(newItem);
      } catch (error) {
        console.log("CommentProductService.createOne error", error);
      }
      resolve(null);
    });
  }
}

const commentProductService = new CommentProductService();

export default commentProductService;
