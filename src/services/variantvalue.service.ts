import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import VariantValue from "../entities/variantValue.entity";
import { handleILike, handlePagination, handleSort } from "../utils";
import { GetAll, ResponseData } from "../utils/types";
import {
  CreateVariantValueDTO,
  VariantValueQueryParams,
} from "../utils/types/variantValue";
import variantService from "./variant.service";

class VariantValueService {
  getRepository() {
    return AppDataSource.getRepository(VariantValue);
  }
  getAll(
    query: VariantValueQueryParams,
    isAdmin?: boolean
  ): Promise<GetAll<VariantValue>> {
    return new Promise(async (resolve, _) => {
      try {
        const { withDeleted, variant, value, type } = query;
        const { wherePagination } = handlePagination(query);
        const { sort } = handleSort(query);
        const [variantValues, count] = await this.getRepository().findAndCount({
          order: sort,
          where: {
            ...handleILike("value", value),
            ...(type ? { variant: handleILike("name", type) } : {}),
          },
          withDeleted: isAdmin && withDeleted ? true : false,
          ...wherePagination,
          relations: { ...(variant ? { variant: true } : {}) },
        });
        resolve({ items: variantValues, count });
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
        console.log("GET VARIANT VALUE BY ID ERROR", error);
        resolve(null);
      }
    });
  }
  createVariantValue(dto: CreateVariantValueDTO): Promise<VariantValue | null> {
    return new Promise(async (resolve, _) => {
      try {
        const newVariantValue = await this.getRepository().save(dto);
        resolve(newVariantValue);
      } catch (error) {
        console.log("CREATE VARIANT VALUE ERROR", error);
        resolve(null);
      }
    });
  }
  updateVariantValue(
    id: number,
    dto: Partial<CreateVariantValueDTO>
  ): Promise<VariantValue | null> {
    return new Promise(async (resolve, _) => {
      try {
        const variantValue = await this.getRepository().findOneBy({
          id,
        });
        if (variantValue) {
          const newVariantValue = await this.getRepository().save({
            ...variantValue,
            ...dto,
          });
          resolve(variantValue);
        }
      } catch (error) {
        console.log("UPDATE VARIANT VALUE ERROR", error);
      }
      resolve(null);
    });
  }
  softDeleteVariantValue(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete({ id });
        resolve(true);
      } catch (error) {
        console.log("SOFT DELETE VARIANT VALUE ERROR", error);
        resolve(false);
      }
    });
  }
  restoreVariantValue(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore({ id });
        resolve(true);
      } catch (error) {
        console.log("RESTORE VARIANT VALUE ERROR", error);
        resolve(false);
      }
    });
  }
  deleteVariantValue(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id });
        resolve(true);
      } catch (error) {
        console.log("DELETE VARIANT VALUE ERROR", error);
        resolve(false);
      }
    });
  }
  seed(): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count();
        if (count === 0) {
          variantService;
          const vColorData = await variantService.getAll({
            name: "Màu sắc",
          });
          const vSizeData = await variantService.getAll({
            name: "Kích cỡ",
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
