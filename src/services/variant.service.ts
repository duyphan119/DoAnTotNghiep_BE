import { AppDataSource } from "../data-source";
import Variant from "../entities/variant.entity";
import { QueryParams, ResponseData } from "../utils/types";
import {
  handleSort,
  handlePagination,
  handleILike,
  handleSearchILike,
} from "../utils";

type VariantQueryParams = QueryParams &
  Partial<{
    name: string;
    q: string;
    variant_values: string;
  }>;

type CreateVariantDTO = {
  name: string;
};

class VariantService {
  getRepository() {
    return AppDataSource.getRepository(Variant);
  }

  getAll(query: VariantQueryParams, isAdmin?: boolean): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { withDeleted, name, q, variant_values } = query;
        const { wherePagination } = handlePagination(query);
        const { sort } = handleSort(query);
        const [variants, count] = await this.getRepository().findAndCount({
          order: sort,
          where: {
            ...handleILike("name", name),
            ...handleSearchILike(["name"], q),
          },
          withDeleted: isAdmin && withDeleted ? true : false,
          ...wherePagination,
          relations: {
            ...(variant_values ? { variantValues: true } : {}),
          },
        });
        resolve({ data: { items: variants, count } });
      } catch (error) {
        console.log("GET ALL VARIANTS ERROR", error);
        resolve({ error });
      }
    });
  }
  getById(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const variant = await this.getRepository().findOneBy({ id });
        resolve({ data: variant });
      } catch (error) {
        console.log("GET VARIANT BY ID ERROR", error);
        resolve({ error });
      }
    });
  }
  createVariant(dto: CreateVariantDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const newVariant = await this.getRepository().save(dto);
        resolve({ data: newVariant });
      } catch (error) {
        console.log("CREATE VARIANT ERROR", error);
        resolve({ error });
      }
    });
  }
  updateVariant(
    id: number,
    dto: Partial<CreateVariantDTO>
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const variant = await this.getRepository().findOneBy({ id });
        if (variant) {
          const newVariant = await this.getRepository().save({
            ...variant,
            ...dto,
          });
          resolve({ data: newVariant });
        }
        resolve({});
      } catch (error) {
        console.log("UPDATE VARIANT ERROR", error);
        resolve({ error });
      }
    });
  }
  softDeleteVariant(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete({ id });
        resolve(true);
      } catch (error) {
        console.log("SOFT DELETE VARIANT ERROR", error);
        resolve(false);
      }
    });
  }
  restoreVariant(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore({ id });
        resolve(true);
      } catch (error) {
        console.log("RESTORE VARIANT ERROR", error);
        resolve(false);
      }
    });
  }
  deleteVariant(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id });
        resolve(true);
      } catch (error) {
        console.log("DELETE VARIANT ERROR", error);
        resolve(false);
      }
    });
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

export default new VariantService();
