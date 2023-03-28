import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import Variant from "../entities/variant.entity";
import helper from "../utils";
import { ICrudService } from "../utils/interfaces";
import {
  GetAll,
  ResponseData,
  CreateVariantDTO,
  VariantParams,
} from "../utils/types";

class VariantService
  implements ICrudService<Variant, VariantParams, CreateVariantDTO>
{
  search(params: VariantParams): Promise<GetAll<Variant>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { wherePagination } = helper.handlePagination(params);
        const { sort } = helper.handleSort(params);
        const [variants, count] = await this.getRepository().findAndCount({
          order: sort,
          where: [helper.handleILike("name", q)],
          ...wherePagination,
        });
        resolve({ items: variants, count });
      } catch (error) {
        console.log("VariantService.search error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
  getAll(params: VariantParams): Promise<GetAll<Variant>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { wherePagination } = helper.handlePagination(params);
        const { sort } = helper.handleSort(params);
        if (q) resolve(await this.search(params));
        else {
          const { name, variant_values } = params;
          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            where: {
              ...helper.handleILike("name", name),
            },
            ...wherePagination,
            relations: {
              ...(variant_values ? { variantValues: true } : {}),
            },
          });
          resolve({ items, count });
        }
      } catch (error) {
        console.log("VariantService.getAll error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
  getById(id: number): Promise<Variant | null> {
    return new Promise(async (resolve, _) => {
      try {
        const variant = await this.getRepository().findOneBy({ id });
        resolve(variant);
      } catch (error) {
        console.log("VariantService.getById error", error);
        resolve(null);
      }
    });
  }
  createOne(dto: CreateVariantDTO): Promise<Variant | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItem = await this.getRepository().save(dto);
        resolve(newItem);
      } catch (error) {
        console.log("VariantService.createOne", error);
        resolve(null);
      }
    });
  }
  createMany(listDto: CreateVariantDTO[]): Promise<(Variant | null)[]> {
    return new Promise(async (resolve, _) => {
      try {
        const newItems = await Promise.all(
          listDto.map((dto) => this.createOne(dto))
        );
        resolve(newItems);
      } catch (error) {
        console.log("VariantService.createMany error", error);
        resolve([]);
      }
    });
  }
  updateOne(
    id: number,
    dto: Partial<CreateVariantDTO>
  ): Promise<Variant | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const existingItem = await this.getById(id);
        if (existingItem) {
          const newItem = await this.getRepository().save({
            ...existingItem,
            ...dto,
          });
          resolve(newItem);
        }
      } catch (error) {
        console.log("VariantService.updateOne error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateVariantDTO>)[]
  ): Promise<(Variant | null)[]> {
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
        console.log("VariantService.updateMany error", error);
      }
      resolve([]);
    });
  }
  deleteOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete(id);
        resolve(true);
      } catch (error) {
        console.log("VariantService.deleteOne error", error);
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
        console.log("VariantService.deleteMany error", error);
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
        console.log("VariantService.softDeleteOne error", error);
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
        console.log("VariantService.softDeleteMany error", error);
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
        console.log("VariantService.restoreOne error", error);
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
        console.log("VariantService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  getRepository() {
    return AppDataSource.getRepository(Variant);
  }
  seed(): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count();
        if (count === 0) {
          const variants = await this.getRepository().save([
            { name: "Màu sắc" },
            { name: "Kích cỡ" },
          ]);
          resolve({ data: { items: variants } });
        }
        resolve({ data: { items: [] } });
      } catch (error) {
        console.log("CREATE SEED VARIANTS ERROR", error);
        resolve({ error });
      }
    });
  }
}

const variantService = new VariantService();

export default variantService;
