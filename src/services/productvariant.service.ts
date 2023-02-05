import { AppDataSource } from "../data-source";
import ProductVariant from "../entities/productvariant.entity";
import VariantValue from "../entities/variantvalue.entity";
import { handlePagination, handleSort } from "../utils";
import { QueryParams, ResponseData } from "../utils/types";

export type ProductVariantQueryParams = QueryParams &
  Partial<{
    productId: string;
    variant_values: string;
  }>;

export type CreateProductVariantDTO = {
  productId: number;
  price: number;
  inventory: number;
  name: string;
  variantValues: VariantValue[];
};

class ProductVariantService {
  getRepository() {
    return AppDataSource.getRepository(ProductVariant);
  }

  totalInventory(productId: number): Promise<number> {
    return new Promise(async (resolve, _) => {
      try {
        const [res] = await this.getRepository()
          .createQueryBuilder("mhbt")
          .groupBy("mhbt.mahang")
          .select("sum(mhbt.soluongton)", "total")
          .where("mhbt.mahang = :productId", { productId })
          .execute();
        resolve(res ? res.total : 0);
      } catch (error) {
        resolve(0);
      }
    });
  }

  getAllProductVariants(
    query: ProductVariantQueryParams,
    isAdmin?: boolean
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { productId, variant_values, withDeleted } = query;
        const { sort } = handleSort(query);
        const { wherePagination } = handlePagination(query);
        const [productVariants, count] =
          await this.getRepository().findAndCount({
            order: sort,
            ...wherePagination,
            where: {
              ...(productId ? { productId: +productId } : {}),
            },
            relations: {
              ...(variant_values ? { variantValues: true } : {}),
            },
            withDeleted: isAdmin && withDeleted ? true : false,
          });

        resolve({ data: { items: productVariants, count } });
      } catch (error) {
        console.log("GET ALL PRODUCT VARIANTS ERROR", error);
        resolve({ error });
      }
    });
  }

  getById(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const productVariant = await this.getRepository().findOneBy({
          id,
        });
        resolve({ data: productVariant });
      } catch (error) {
        console.log("GET PRODUCT VARIANT BY ID ERROR", error);
        resolve({ error });
      }
    });
  }

  createProductVariant(dto: CreateProductVariantDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const newProductVariant = await this.getRepository().save(dto);
        resolve({ data: newProductVariant });
      } catch (error) {
        console.log("CREATE PRODUCT VARIANTS ERROR", error);
        resolve({ error });
      }
    });
  }

  createProductVariants(dto: CreateProductVariantDTO[]): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const newProductVariants = await this.getRepository().save(dto);
        resolve({ data: { items: newProductVariants } });
      } catch (error) {
        console.log("CREATE PRODUCT VARIANTS ERROR", error);
        resolve({ error });
      }
    });
  }
  updateProductVariants(
    dto: Array<Partial<ProductVariant>>
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await Promise.all(
          dto.map((input) => this.updateProductVariant(input.id || -1, input))
        );
        resolve({});
      } catch (error) {
        console.log("UPDATE PRODUCT VARIANTS ERROR", error);
        resolve({ error });
      }
    });
  }

  updateProductVariant(
    id: number,
    dto: Partial<ProductVariant>
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const productVariant = await this.getRepository().findOneBy({
          id,
        });
        if (productVariant) {
          const newProductVariant = await this.getRepository().save({
            ...productVariant,
            ...dto,
          });
          resolve({ data: newProductVariant });
        }
        resolve({ error: Error });
      } catch (error) {
        console.log("UPDATE PRODUCT VARIANT ERROR", error);
        resolve({ error });
      }
    });
  }

  softDeleteProductVariant(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete({ id });
        resolve(true);
      } catch (error) {
        console.log("SOFT DELETE PRODUCT VARIANT ERROR", error);
        resolve(false);
      }
    });
  }

  restoreProductVariant(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore({ id });
        resolve(true);
      } catch (error) {
        console.log("RESTORE PRODUCT VARIANT ERROR", error);
        resolve(false);
      }
    });
  }

  deleteProductVariant(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOne({
          where: { id },
          relations: { variantValues: true },
        });
        await this.getRepository().save({ ...item, variantValues: [] });
        await this.getRepository().delete({ id });
        resolve(true);
      } catch (error) {
        console.log("DELETE PRODUCT VARIANT ERROR", error);
        resolve(false);
      }
    });
  }

  deleteProductVariantByProduct(productId: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ productId });
        resolve({});
      } catch (error) {
        console.log("DELETE PRODUCT VARIANT BY PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new ProductVariantService();
