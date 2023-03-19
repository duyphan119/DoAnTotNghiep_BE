import { In } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import VariantValue from "../entities/variantValue.entity";
import { handleILike, handlePagination, handleSort } from "../utils";
import { ICrudService } from "../utils/interfaces";
import { GetAll, ResponseData, SearchParams } from "../utils/types";
import {
  CreateVariantValueDTO,
  VariantValueQueryParams,
} from "../utils/types/variantValue";

class VariantValueService
  implements
    ICrudService<
      GetAll<VariantValue>,
      VariantValue,
      VariantValueQueryParams,
      CreateVariantValueDTO,
      Partial<CreateVariantValueDTO>
    >
{
  createOne(dto: CreateVariantValueDTO): Promise<VariantValue | null> {
    return new Promise(async (resolve, _) => {
      try {
        const newItem = await this.getRepository().save(dto);
        resolve(newItem);
      } catch (error) {
        console.log("VariantValueService.createOne", error);
        resolve(null);
      }
    });
  }
  createMany(listDto: CreateVariantValueDTO[]): Promise<VariantValue[]> {
    return new Promise(async (resolve, _) => {
      try {
        const newItems = await this.getRepository().save(listDto);
        resolve(newItems);
      } catch (error) {
        console.log("VariantValueService.createMany error", error);
        resolve([]);
      }
    });
  }
  updateOne(
    id: number,
    dto: Partial<CreateVariantValueDTO>
  ): Promise<VariantValue | null> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().update({ id }, dto);
        const existingItem = await this.getRepository().findOneBy({ id });
        resolve(existingItem);
      } catch (error) {
        console.log("VariantValueService.updateOne error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateVariantValueDTO>)[]
  ): Promise<VariantValue[]> {
    return new Promise(async (resolve, _) => {
      try {
        await Promise.all(
          inputs.map(
            (input: { id: number } & Partial<CreateVariantValueDTO>) => {
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
                  (input: { id: number } & Partial<CreateVariantValueDTO>) =>
                    input.id
                )
              ),
            },
          })
        );
      } catch (error) {
        console.log("VariantValueService.updateMany error", error);
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
        console.log("VariantValueService.deleteOne error", error);
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
        console.log("VariantValueService.deleteMany error", error);
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
        console.log("VariantValueService.softDeleteOne error", error);
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
        console.log("VariantValueService.softDeleteMany error", error);
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
        console.log("VariantValueService.restoreOne error", error);
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
        console.log("VariantValueService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  search(params: VariantValueQueryParams): Promise<GetAll<VariantValue>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q, variant } = params;
        const { wherePagination } = handlePagination(params);
        const { sort } = handleSort(params);
        const [items, count] = await this.getRepository().findAndCount({
          order: sort,
          where: [
            handleILike("value", q),
            variant ? { variant: handleILike("name", q) } : {},
          ],
          ...wherePagination,
          relations: { ...(variant ? { variant: true } : {}) },
        });
        resolve({ items, count });
      } catch (error) {
        console.log("VariantValueService.search error", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
  getRepository() {
    return AppDataSource.getRepository(VariantValue);
  }
  getAll(params: VariantValueQueryParams): Promise<GetAll<VariantValue>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        if (q) resolve(await this.search(params));
        else {
          const { variant, value, type } = params;
          const { wherePagination } = handlePagination(params);
          const { sort } = handleSort(params);
          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            where: {
              ...handleILike("value", value),
              ...(type ? { variant: handleILike("name", type) } : {}),
            },
            ...wherePagination,
            relations: { ...(variant ? { variant: true } : {}) },
          });
          resolve({ items, count });
        }
      } catch (error) {
        console.log("GET ALL VARIANT VALUES ERROR", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
  getById(id: number): Promise<VariantValue | null> {
    return new Promise(async (resolve, _) => {
      try {
        const variantValue = await this.getRepository().findOneBy({
          id,
        });
        resolve(variantValue);
      } catch (error) {
        console.log("VariantValueService.getById error", error);
        resolve(null);
      }
    });
  }
  seed(): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count();
        if (count === 0) {
          const vColorData = await variantValueService.getAll({
            type: "Màu sắc",
          });
          const vSizeData = await variantValueService.getAll({
            type: "Kích cỡ",
          });

          if (vColorData && vSizeData) {
            const vColor = vColorData.items[0];
            const vSize = vSizeData.items[0];
            const variantValues = await this.getRepository().save([
              {
                variantId: vColor.id,
                value: "Đen",
              },
              {
                variantId: vColor.id,
                value: "Trắng",
              },
              {
                variantId: vColor.id,
                value: "Xanh Lá",
              },
              {
                variantId: vColor.id,
                value: "Xanh Dương",
              },
              {
                variantId: vColor.id,
                value: "Đỏ",
              },
              {
                variantId: vColor.id,
                value: "Vàng",
              },
              {
                variantId: vColor.id,
                value: "Tím",
              },
              {
                variantId: vColor.id,
                value: "Cam",
              },
              {
                variantId: vColor.id,
                value: "Hồng",
              },
              {
                variantId: vColor.id,
                value: "Xám",
              },
              {
                variantId: vColor.id,
                value: "Nâu",
              },
              { variantId: vSize.id, value: "XS" },
              { variantId: vSize.id, value: "S" },
              { variantId: vSize.id, value: "M" },
              { variantId: vSize.id, value: "L" },
              { variantId: vSize.id, value: "XL" },
              {
                variantId: vSize.id,
                value: "2XL",
              },
              {
                variantId: vSize.id,
                value: "3XL",
              },
              {
                variantId: vSize.id,
                value: "4XL",
              },
            ]);
            resolve({ data: { items: variantValues } });
          }
        }
        resolve({ data: { items: [] } });
      } catch (error) {
        console.log("CREATE SEED VARIANT VALUES ERROR", error);
        resolve({ error });
      }
    });
  }
}

const variantValueService = new VariantValueService();

export default variantValueService;
