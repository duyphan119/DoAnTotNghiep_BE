import { In } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import RepCommentProduct from "../entities/repCommentProduct.entity";
import helper from "../utils";
import { ICrudService } from "../utils/interfaces";
import {
  GetAll,
  SearchParams,
  CreateRepCommentProductDTO,
  RepCommentProductParams,
} from "../utils/types";

class RepCommentProductService
  implements
    ICrudService<
      RepCommentProduct,
      RepCommentProductParams,
      CreateRepCommentProductDTO
    >
{
  search(params: SearchParams): Promise<GetAll<RepCommentProduct>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { wherePagination } = helper.handlePagination(params);
        const { sort } = helper.handleSort(params);
        const [variants, count] = await this.getRepository().findAndCount({
          order: sort,
          ...wherePagination,
          relations: {
            user: true,
          },
          where: [helper.handleILike("content", q)],
        });
        resolve({ items: variants, count });
      } catch (error) {
        console.log("RepCommentProductService.search error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
  getAll(params: RepCommentProductParams): Promise<GetAll<RepCommentProduct>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        if (q) resolve(await this.search(params));
        else {
          const { wherePagination } = helper.handlePagination(params);
          const { sort } = helper.handleSort(params);
          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            ...wherePagination,
            relations: {
              user: true,
            },
          });
          resolve({ items, count });
        }
      } catch (error) {
        console.log("RepCommentProductService.getAll error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
  getById(id: number): Promise<RepCommentProduct | null> {
    return new Promise(async (resolve, _) => {
      try {
        const variant = await this.getRepository().findOne({
          where: { id },
          relations: { user: true },
        });
        resolve(variant);
      } catch (error) {
        console.log("RepCommentProductService.getById error", error);
        resolve(null);
      }
    });
  }
  createOne(
    dto: CreateRepCommentProductDTO
  ): Promise<RepCommentProduct | null> {
    return new Promise(async (resolve, _) => {
      try {
        const newItem = await this.getRepository().save(dto);
        resolve(await this.getById(newItem.id));
      } catch (error) {
        console.log("RepCommentProductService.createOne", error);
        resolve(null);
      }
    });
  }
  createMany(
    listDto: CreateRepCommentProductDTO[]
  ): Promise<RepCommentProduct[]> {
    return new Promise(async (resolve, _) => {
      try {
        const newItems = await this.getRepository().save(listDto);
        resolve(newItems);
      } catch (error) {
        console.log("RepCommentProductService.createMany error", error);
        resolve([]);
      }
    });
  }
  updateOne(
    id: number,
    dto: Partial<CreateRepCommentProductDTO>
  ): Promise<RepCommentProduct | null> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().update({ id }, dto);
        const existingItem = await this.getRepository().findOneBy({ id });
        resolve(existingItem);
      } catch (error) {
        console.log("RepCommentProductService.updateOne error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateRepCommentProductDTO>)[]
  ): Promise<RepCommentProduct[]> {
    return new Promise(async (resolve, _) => {
      try {
        await Promise.all(
          inputs.map(
            (input: { id: number } & Partial<CreateRepCommentProductDTO>) => {
              const { id, ...dto } = input;
              return this.getRepository().update({ id }, dto);
            }
          )
        );
        resolve(
          await this.getRepository().find({
            where: {
              id: In(
                inputs.map(
                  (
                    input: { id: number } & Partial<CreateRepCommentProductDTO>
                  ) => input.id
                )
              ),
            },
          })
        );
      } catch (error) {
        console.log("RepCommentProductService.updateMany error", error);
        resolve([]);
      }
    });
  }
  deleteOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete(id);
        resolve(true);
      } catch (error) {
        console.log("RepCommentProductService.deleteOne error", error);
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
        console.log("RepCommentProductService.deleteMany error", error);
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
        console.log("RepCommentProductService.softDeleteOne error", error);
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
        console.log("RepCommentProductService.softDeleteMany error", error);
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
        console.log("RepCommentProductService.restoreOne error", error);
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
        console.log("RepCommentProductService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  getRepository() {
    return AppDataSource.getRepository(RepCommentProduct);
  }
}

const repCommentProductService = new RepCommentProductService();

export default repCommentProductService;
