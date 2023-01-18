import { AppDataSource } from "../data-source";
import { handlePagination, handleSort } from "../utils";
import { QueryParams, ResponseData } from "../utils/types";
import ProductVariantImage from "../entities/productvariantimage.entity";
import { getCloudinary } from "../cloudinary";

export type ProductVariantImageQueryParams = QueryParams &
  Partial<{
    productId: string;
  }>;

export type CreateProductVariantImageDTO = {
  path: string;
  productId: number;
  variantValueId: number | null;
};

class ProductVariantImageService {
  getRepository() {
    return AppDataSource.getRepository(ProductVariantImage);
  }

  getAll(query: ProductVariantImageQueryParams): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { productId } = query;

        const { sort } = handleSort(query);
        const { wherePagination } = handlePagination(query);

        const [productVariantImages, count] =
          await this.getRepository().findAndCount({
            where: {
              ...(productId ? { productId: +productId } : {}),
            },
            ...wherePagination,
            order: sort,
          });
        resolve({ data: { items: productVariantImages, count } });
      } catch (error) {
        console.log("GET ALL PRODUCT VARIANT IMAGES ERROR", error);
        resolve({ error });
      }
    });
  }

  createProductVariantImages(
    dto: CreateProductVariantImageDTO[]
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const result = await this.getRepository().save(
          dto.map((i: CreateProductVariantImageDTO) =>
            Object.assign(new ProductVariantImage(), i)
          )
        );
        resolve({ data: { items: result, count: result.length } });
      } catch (error) {
        console.log("CREATE PRODUCT VARIANT IMAGES ERROR", error);
        resolve({ error });
      }
    });
  }

  updateProductVariantImage(
    id: number,
    variantValueId: number
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        if (item) {
          const result = await this.getRepository().save({
            ...item,
            variantValueId,
          });
          resolve({ data: result });
        }
        resolve({});
      } catch (error) {
        console.log("UPDATE PRODUCT VARIANT IMAGE ERROR", error);
        resolve({ error });
      }
    });
  }

  deleteProductVariantImage(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        if (item) {
          await getCloudinary().v2.uploader.destroy(
            "DoAnTotNghiep_BE" +
              item.path.split("DoAnTotNghiep_BE")[1].split(".")[0]
          );
          await this.getRepository().delete({ id: item.id });
        }
        resolve({});
      } catch (error) {
        console.log("DELETE PRODUCT VARIANT IMAGES ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new ProductVariantImageService();
