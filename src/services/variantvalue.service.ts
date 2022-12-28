import { AppDataSource } from "../data-source";
import VariantValue from "../entities/variantvalue.entity";
import { QueryParams, ResponseData } from "../utils/types";
import {
  handleSort,
  handlePagination,
  handleILike,
  handleSearchILike,
} from "../utils";
import slugify from "slugify";
import Variant from "../entities/variant.entity";
import variantService from "./variant.service";

type VariantValueQueryParams = QueryParams &
  Partial<{
    title: string;
    slug: string;
    content: string;
    q: string;
  }>;

type CreateVariantValueDTO = {
  value: string;
  variantId: number;
};

class VariantValueService {
  getRepository() {
    return AppDataSource.getRepository(VariantValue);
  }
  getAll(
    query: VariantValueQueryParams,
    isAdmin?: boolean
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { withDeleted, title, slug, content, q } = query;
        const { wherePagination } = handlePagination(query);
        const { sort } = handleSort(query);
        const [variantValues, count] = await this.getRepository().findAndCount({
          order: sort,
          where: {
            ...handleILike("title", title),
            ...handleILike("slug", slug),
            ...handleILike("content", content),
            ...handleSearchILike(["title", "slug", "content"], q),
          },
          withDeleted: isAdmin && withDeleted ? true : false,
          ...wherePagination,
        });
        resolve({ data: { items: variantValues, count } });
      } catch (error) {
        console.log("GET ALL VARIANT VALUES ERROR", error);
        resolve({ error });
      }
    });
  }
  getById(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const variantValue = await this.getRepository().findOneBy({
          id,
        });
        resolve({ data: variantValue });
      } catch (error) {
        console.log("GET VARIANT VALUE BY ID ERROR", error);
        resolve({ error });
      }
    });
  }
  createVariantValue(dto: CreateVariantValueDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const newVariantValue = await this.getRepository().save(dto);
        resolve({ data: newVariantValue });
      } catch (error) {
        console.log("CREATE VARIANT VALUE ERROR", error);
        resolve({ error });
      }
    });
  }
  updateVariantValue(
    id: number,
    dto: Partial<CreateVariantValueDTO>
  ): Promise<ResponseData> {
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
          resolve({ data: newVariantValue });
        }
        resolve({});
      } catch (error) {
        console.log("UPDATE VARIANT VALUE ERROR", error);
        resolve({ error });
      }
    });
  }
  softDeleteVariantValue(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete({ id });
        resolve({});
      } catch (error) {
        console.log("SOFT DELETE VARIANT VALUE ERROR", error);
        resolve({ error });
      }
    });
  }
  restoreVariantValue(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore({ id });
        resolve({});
      } catch (error) {
        console.log("RESTORE VARIANT VALUE ERROR", error);
        resolve({ error });
      }
    });
  }
  deleteVariantValue(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id });
        resolve({});
      } catch (error) {
        console.log("DELETE VARIANT VALUE ERROR", error);
        resolve({ error });
      }
    });
  }
  seed(): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count();
        if (count === 0) {
          variantService;
          const { data: vColorData } = await variantService.getAll({
            name: "Màu sắc",
          });
          const { data: vSizeData } = await variantService.getAll({
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

export default new VariantValueService();
