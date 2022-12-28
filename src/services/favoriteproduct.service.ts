import { AppDataSource } from "../data-source";
import FavoriteProduct from "../entities/favoriteproduct.entity";
import { handlePagination } from "../utils";
import { PaginationParams, ResponseData } from "../utils/types";
import { RelationQueryParams } from "./product.service";

class FavoriteProductService {
  getRepository() {
    return AppDataSource.getRepository(FavoriteProduct);
  }
  getByUser(
    userId: number,
    query: PaginationParams & RelationQueryParams
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { product_variants, images } = query;
        const { wherePagination } = handlePagination(query);
        const favoriteProducts = await this.getRepository().find({
          where: { userId },
          ...wherePagination,
          relations: {
            product: {
              ...(product_variants
                ? {
                    productVariants: {
                      variantValues: { variant: true },
                    },
                  }
                : {}),
              ...(images ? { images: true } : {}),
              groupProduct: true,
            },
          },
        });
        resolve({ data: favoriteProducts });
      } catch (error) {
        console.log("GET FAVORITE PRODUCTS BY USER ID ERROR", error);
        resolve({ error });
      }
    });
  }

  createFavoriteProduct(
    userId: number,
    productId: number
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const newFavoriteProduct = await this.getRepository().save({
          userId,
          productId,
        });
        resolve({ data: newFavoriteProduct });
      } catch (error) {
        console.log("CREATE FAVORITE PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }

  deleteFavoriteProduct(
    userId: number,
    productId: number
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({
          userId,
          productId,
        });
        resolve({});
      } catch (error) {
        console.log("DELETE FAVORITE PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new FavoriteProductService();
