import { AppDataSource } from "../data-source";
import Variant from "../entities/variant.entity";
import { QueryParams, ResponseData } from "../utils/types";
import {
  handleSort,
  handlePagination,
  handleILike,
  handleSearchILike,
} from "../utils";
import slugify from "slugify";

type VariantQueryParams = QueryParams &
  Partial<{
    name: string;
    q: string;
  }>;

type CreateVariantDTO = {
  name: string;
};

class VariantService {
  private variantRepository = AppDataSource.getRepository(Variant);

  getAll(query: VariantQueryParams, isAdmin?: boolean): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { withDeleted, name, q } = query;
        const { wherePagination } = handlePagination(query);
        const { sort } = handleSort(query);
        const [variants, count] = await this.variantRepository.findAndCount({
          order: sort,
          where: {
            ...handleILike("name", name),
            ...handleSearchILike(["name"], q),
          },
          withDeleted: isAdmin && withDeleted ? true : false,
          ...wherePagination,
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
        const variant = await this.variantRepository.findOneBy({ id });
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
        const newVariant = await this.variantRepository.save(dto);
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
        const variant = await this.variantRepository.findOneBy({ id });
        if (variant) {
          const newVariant = await this.variantRepository.save({
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
  softDeleteVariant(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.variantRepository.softDelete({ id });
        resolve({});
      } catch (error) {
        console.log("SOFT DELETE VARIANT ERROR", error);
        resolve({ error });
      }
    });
  }
  restoreVariant(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.variantRepository.restore({ id });
        resolve({});
      } catch (error) {
        console.log("RESTORE VARIANT ERROR", error);
        resolve({ error });
      }
    });
  }
  deleteVariant(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.variantRepository.delete({ id });
        resolve({});
      } catch (error) {
        console.log("DELETE VARIANT ERROR", error);
        resolve({ error });
      }
    });
  }
  seed(): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.variantRepository.count();
        if (count === 0) {
          const variants = await this.variantRepository.save([
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
