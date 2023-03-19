import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import ProductVariant from "../entities/productVariant.entity";
import { handlePagination, handleSort } from "../utils";
import { GetAll } from "../utils/types";
import {
  CreateProductVariantDTO,
  GetAllProductVariantQueryParams,
} from "../utils/types/productVariant";

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
    query: GetAllProductVariantQueryParams,
    isAdmin?: boolean
  ): Promise<GetAll<ProductVariant>> {
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

        resolve({ items: productVariants, count });
      } catch (error) {
        console.log("GET ALL PRODUCT VARIANTS ERROR", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }

  getById(id: number): Promise<ProductVariant | null> {
    return new Promise(async (resolve, _) => {
      try {
        const productVariant = await this.getRepository().findOneBy({
          id,
        });
        resolve(productVariant);
      } catch (error) {
        console.log("GET PRODUCT VARIANT BY ID ERROR", error);
        resolve(null);
      }
    });
  }

  createProductVariant(
    dto: CreateProductVariantDTO
  ): Promise<ProductVariant | null> {
    return new Promise(async (resolve, _) => {
      try {
        const newProductVariant = await this.getRepository().save(dto);
        resolve(newProductVariant);
      } catch (error) {
        console.log("CREATE PRODUCT VARIANTS ERROR", error);
        resolve(null);
      }
    });
  }

  createProductVariants(
    dto: CreateProductVariantDTO[]
  ): Promise<ProductVariant[]> {
    return new Promise(async (resolve, _) => {
      try {
        const newProductVariants = await this.getRepository().save(dto);
        resolve(newProductVariants);
      } catch (error) {
        console.log("CREATE PRODUCT VARIANTS ERROR", error);
        resolve([]);
      }
    });
  }
  updateProductVariants(
    dto: Array<Partial<ProductVariant>>
  ): Promise<Array<ProductVariant | null>> {
    return new Promise(async (resolve, _) => {
      try {
        const items = await Promise.all(
          dto.map((input) => this.updateProductVariant(input.id || -1, input))
        );
        resolve(items);
      } catch (error) {
        console.log("UPDATE PRODUCT VARIANTS ERROR", error);
        resolve([]);
      }
    });
  }

  updateProductVariant(
    id: number,
    dto: Partial<ProductVariant>
  ): Promise<ProductVariant | null> {
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
          resolve(newProductVariant);
        }
      } catch (error) {
        console.log("UPDATE PRODUCT VARIANT ERROR", error);
      }
      resolve(null);
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

  deleteProductVariantByProduct(productId: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        const items = await this.getRepository().find({
          where: { productId },
          relations: { variantValues: true },
        });
        await this.getRepository().save(
          items.map((item) => ({ ...item, variantValues: [] }))
        );
        await this.getRepository().delete({ productId });
        resolve(true);
      } catch (error) {
        console.log("DELETE PRODUCT VARIANT BY PRODUCT ERROR", error);
        resolve(false);
      }
    });
  }
}

const productVariantService = new ProductVariantService();

export default productVariantService;
