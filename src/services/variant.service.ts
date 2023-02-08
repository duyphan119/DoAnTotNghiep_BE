import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import Variant from "../entities/variant.entity";
import {
  handleILike,
  handlePagination,
  handleSearchILike,
  handleSort,
} from "../utils";
import { GetAll, ResponseData } from "../utils/types";
import { CreateVariantDTO, VariantQueryParams } from "../utils/types/variant";

class VariantService {
  getRepository() {
    return AppDataSource.getRepository(Variant);
  }

  getAll(
    query: VariantQueryParams,
    isAdmin?: boolean
  ): Promise<GetAll<Variant>> {
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
        resolve({ items: variants, count });
      } catch (error) {
        console.log("GET ALL VARIANTS ERROR", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
  getById(id: number): Promise<Variant | null> {
    return new Promise(async (resolve, _) => {
      try {
        const variant = await this.getRepository().findOneBy({ id });
        resolve(variant);
      } catch (error) {
        console.log("GET VARIANT BY ID ERROR", error);
        resolve(null);
      }
    });
  }
  createVariant(dto: CreateVariantDTO): Promise<Variant | null> {
    return new Promise(async (resolve, _) => {
      try {
        const newItem = await this.getRepository().save(dto);
        resolve(newItem);
      } catch (error) {
        console.log("CREATE VARIANT ERROR", error);
        resolve(null);
      }
    });
  }
  updateVariant(
    id: number,
    dto: Partial<CreateVariantDTO>
  ): Promise<Variant | null> {
    return new Promise(async (resolve, _) => {
      try {
        const variant = await this.getRepository().findOneBy({ id });
        if (variant) {
          const newVariant = await this.getRepository().save({
            ...variant,
            ...dto,
          });
          resolve(newVariant);
        }
      } catch (error) {
        console.log("UPDATE VARIANT ERROR", error);
      }
      resolve(null);
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
