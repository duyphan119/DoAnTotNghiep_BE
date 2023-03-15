import { In } from "typeorm";
import { getCloudinary } from "../configCloudinary";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import ProductVariantImage from "../entities/productVarianImage.entity";
import { handlePagination, handleSort } from "../utils";
import { GetAll } from "../utils/types";
import {
  CreateProductVariantImageDTO,
  GetAllProductVariantImageQueryParams,
} from "../utils/types/productVariantImage";

class ProductVariantImageService {
  getRepository() {
    return AppDataSource.getRepository(ProductVariantImage);
  }

  getAll(
    query: GetAllProductVariantImageQueryParams
  ): Promise<GetAll<ProductVariantImage>> {
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
        resolve({ items: productVariantImages, count });
      } catch (error) {
        console.log("GET ALL PRODUCT VARIANT IMAGES ERROR", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }

  createProductVariantImages(
    dto: CreateProductVariantImageDTO[]
  ): Promise<ProductVariantImage[]> {
    return new Promise(async (resolve, _) => {
      try {
        const result = await this.getRepository().save(
          dto.map((i: CreateProductVariantImageDTO) =>
            Object.assign(new ProductVariantImage(), i)
          )
        );
        resolve(result);
      } catch (error) {
        console.log("CREATE PRODUCT VARIANT IMAGES ERROR", error);
        resolve([]);
      }
    });
  }

  updateProductVariantImage(
    id: number,
    variantValueId: number
  ): Promise<ProductVariantImage | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        if (item) {
          const result = await this.getRepository().save({
            ...item,
            variantValueId,
          });
          resolve(result);
        }
      } catch (error) {
        console.log("UPDATE PRODUCT VARIANT IMAGE ERROR", error);
        resolve(null);
      }
    });
  }

  updateProductVariantImages(
    images: Array<{
      id: number;
      variantValueId: number;
    }>
  ): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        const promises: Array<Promise<any>> = [];
        images.forEach((image) => {
          promises.push(
            this.getRepository().update(
              { id: image.id },
              { variantValueId: image.variantValueId }
            )
          );
        });
        await Promise.allSettled(promises);
        resolve(true);
      } catch (error) {
        console.log("UPDATE PRODUCT VARIANT IMAGE ERROR", error);
      }
      resolve(false);
    });
  }

  deleteProductVariantImage(id: number): Promise<boolean> {
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
        resolve(true);
      } catch (error) {
        console.log("DELETE PRODUCT VARIANT IMAGES ERROR", error);
        resolve(false);
      }
    });
  }
  deleteProductVariantImages(ids: number[]): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        const promises: Array<Promise<any>> = [];

        const items = await this.getRepository().find({
          where: { id: In(ids) },
        });
        items.forEach((item) => {
          promises.push(
            getCloudinary().v2.uploader.destroy(
              "DoAnTotNghiep_BE" +
                item.path.split("DoAnTotNghiep_BE")[1].split(".")[0]
            )
          );
          promises.push(this.getRepository().delete({ id: item.id }));
        });
        await Promise.allSettled(promises);
        resolve(true);
      } catch (error) {
        console.log("DELETE PRODUCT VARIANT IMAGES ERROR", error);
        resolve(false);
      }
    });
  }
}

const productVariantImageService = new ProductVariantImageService();

export default productVariantImageService;
