import slugify from "slugify";
import { Between, In, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import Product from "../entities/product.entity";
import {
  everageStar,
  handleILike,
  handlePagination,
  handleSort,
} from "../utils";
import { ICrudService } from "../utils/interfaces";
import { GetAll, PaginationParams, SearchParams } from "../utils/types";
import {
  BestSellerProduct,
  CreateProductDTO,
  GetAllProductQueryParams,
  ProductHasMinMaxPrice,
  UpdateProductDTO,
} from "../utils/types/product";
import commentProductService from "./commentProduct.service";
import groupProductService from "./groupProduct.service";
import orderItemService from "./orderItem.service";
import productVariantService from "./productVariant.service";
import productVariantImageService from "./productVariantImage.service";

class ProductService
  implements
    ICrudService<
      GetAll<Product | ProductHasMinMaxPrice>,
      Product,
      GetAllProductQueryParams,
      CreateProductDTO,
      UpdateProductDTO
    >
{
  createOne(dto: CreateProductDTO): Promise<Product | null> {
    return new Promise(async (resolve, _) => {
      try {
        const { name, productVariants, images, ...others } = dto;
        const product = await this.getRepository().save({
          ...others,
          name,
          slug: slugify(name, { lower: true, locale: "vi" }),
        });
        const promises = [];
        promises.push(
          productVariantService.createProductVariants(
            productVariants.map((item) => ({
              inventory: item.inventory,
              name: item.name,
              productId: product.id,
              price: item.price,
              variantValues: item.variantValues,
            }))
          )
        );
        promises.push(
          productVariantImageService.createProductVariantImages(
            images.map((item) => ({ ...item, productId: product.id }))
          )
        );
        if (dto.thumbnail !== "") {
          promises.push(
            groupProductService.updateOne(dto.groupProductId, {
              thumbnail: dto.thumbnail,
            })
          );
        }
        await Promise.allSettled(promises);
        resolve(product);
      } catch (error) {
        console.log("CREATE PRODUCT ERROR", error);
        resolve(null);
      }
    });
  }
  createMany(listDto: CreateProductDTO[]): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  updateOne(id: number, dto: UpdateProductDTO): Promise<Product | null> {
    return new Promise(async (resolve, _) => {
      try {
        const promises: Array<Promise<any>> = [];
        const {
          productVariants,
          newProductVariants,
          images,
          newImages,
          deleteImages,
          updateImages,
          ...others
        } = dto;
        const product = await this.getRepository().findOneBy({ id });
        if (product) {
          const { name } = others;
          const newProduct = await this.getRepository().save({
            ...product,
            ...others,
            ...(name
              ? { slug: slugify(name, { lower: true, locale: "vi" }) }
              : {}),
          });
          if (newProductVariants) {
            promises.push(
              productVariantService.createProductVariants(
                newProductVariants.map((item) => ({
                  inventory: item.inventory,
                  name: item.name,
                  productId: newProduct.id,
                  price: item.price,
                  variantValues: item.variantValues,
                }))
              )
            );
          }
          if (newImages) {
            promises.push(
              productVariantImageService.createProductVariantImages(
                newImages.map((item) => ({
                  variantValueId:
                    item.variantValueId === 0 ? null : item.variantValueId,
                  productId: newProduct.id,
                  path: item.path,
                }))
              )
            );
          }
          if (deleteImages) {
            promises.push(
              productVariantImageService.deleteProductVariantImages(
                deleteImages
              )
            );
          }
          if (updateImages) {
            promises.push(
              productVariantImageService.updateProductVariantImages(
                updateImages
              )
            );
          }

          await Promise.allSettled(promises);

          resolve(newProduct);
        }
      } catch (error) {
        console.log("UPDATE PRODUCT ERROR", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & UpdateProductDTO)[]
  ): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  deleteOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete(id);
        resolve(true);
      } catch (error) {
        console.log("VariantService.deleteOne error", error);
        resolve(false);
      }
    });
  }
  deleteMany(listId: number[]): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete(listId);
        resolve(true);
      } catch (error) {
        console.log("VariantService.deleteMany error", error);
        resolve(false);
      }
    });
  }
  softDeleteOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete(id);
        resolve(true);
      } catch (error) {
        console.log("VariantService.softDeleteOne error", error);
        resolve(false);
      }
    });
  }
  softDeleteMany(listId: number[]): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete(listId);
        resolve(true);
      } catch (error) {
        console.log("VariantService.softDeleteMany error", error);
        resolve(false);
      }
    });
  }
  restoreOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore(id);
        resolve(true);
      } catch (error) {
        console.log("VariantService.restoreOne error", error);
        resolve(false);
      }
    });
  }
  restoreMany(listId: number[]): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore(listId);
        resolve(true);
      } catch (error) {
        console.log("VariantService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  search(params: SearchParams): Promise<GetAll<Product>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { wherePagination } = handlePagination(params);

        let [products, count] = await this.getRepository().findAndCount({
          order: {
            id: "DESC",
          },
          where: [handleILike("slug", q), handleILike("name", q)],
          withDeleted: false,
          ...wherePagination,
          relations: {
            productVariants: { variantValues: { variant: true } },
            images: true,
          },
        });
        const newProducts = products.map((product: Product) => ({
          ...product,
          minPrice: this.price(product, "min"),
          maxPrice: this.price(product, "max"),
        })) as ProductHasMinMaxPrice[];

        resolve({ items: newProducts, count });
      } catch (error) {
        console.log("VariantService.search error", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
  getRepository() {
    return AppDataSource.getRepository(Product);
  }

  minPrice(product: Product) {
    let min = 0;
    for (let i = 1; i < product.productVariants.length; i++) {
      if (product.productVariants[min].price > product.productVariants[i].price)
        min = i;
    }
    return product.productVariants[min].price;
  }

  maxPrice(product: Product) {
    let max = 0;
    for (let i = 1; i < product.productVariants.length; i++) {
      if (product.productVariants[max].price < product.productVariants[i].price)
        max = i;
    }
    return product.productVariants[max].price;
  }

  price(product: Product, type: "min" | "max") {
    return product.productVariants && product.productVariants.length > 0
      ? type === "min"
        ? this.minPrice(product)
        : this.maxPrice(product)
      : product.price;
  }

  getAll(
    params: GetAllProductQueryParams
  ): Promise<GetAll<Product | ProductHasMinMaxPrice>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        if (q) resolve(await this.search(params));
        else {
          const {
            name,
            slug,
            product_variants,
            images,
            group_product,
            group_product_slug,
            min_price,
            max_price,
            v_ids,
          } = params;
          const { wherePagination } = handlePagination(params);
          const { sortBy, sortType, sort } = handleSort(params);

          let [products, count] = await this.getRepository().findAndCount({
            order: {
              ...(sortBy === "groupProduct"
                ? {
                    groupProduct: { name: sortType === "asc" ? "asc" : "desc" },
                  }
                : sort),
              ...(images ? { images: { id: "DESC" } } : {}),
            },
            where: {
              ...handleILike("name", name),
              ...handleILike("slug", slug),
              ...(group_product_slug
                ? {
                    groupProduct: {
                      ...handleILike("slug", group_product_slug),
                    },
                  }
                : {}),
              ...(min_price && !max_price
                ? { productVariants: { price: MoreThanOrEqual(+min_price) } }
                : {}),
              ...(max_price && !min_price
                ? { productVariants: { price: LessThanOrEqual(+max_price) } }
                : {}),
              ...(max_price && max_price
                ? {
                    productVariants: {
                      price: Between(+(min_price || "0"), +(max_price || "0")),
                    },
                  }
                : {}),
              ...(v_ids
                ? {
                    productVariants: {
                      variantValues: { id: In(v_ids.split("-")) },
                    },
                  }
                : {}),
            },
            ...wherePagination,
            relations: {
              ...(product_variants
                ? { productVariants: { variantValues: { variant: true } } }
                : {}),
              ...(images ? { images: true } : {}),
              ...(group_product ? { groupProduct: true } : {}),
            },
          });

          if (product_variants) {
            const newProducts = products.map((product: Product) => ({
              ...product,
              minPrice: this.price(product, "min"),
              maxPrice: this.price(product, "max"),
            })) as ProductHasMinMaxPrice[];
            if (sortBy && sortBy === "price")
              newProducts.sort(
                (a: ProductHasMinMaxPrice, b: ProductHasMinMaxPrice) =>
                  (a.minPrice - b.minPrice) * (sortType === "asc" ? 1 : -1)
              );
            resolve({ items: newProducts, count });
          } else {
            resolve({ items: products, count });
          }
        }
      } catch (error) {
        console.log("ProductService.getAll error", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }

  getById(id: number): Promise<Product | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOne({
          where: { id },
          relations: {
            productVariants: {
              variantValues: true,
            },
            images: true,
          },
        });
        resolve(item);
      } catch (error) {
        console.log("ProductService.getById error", error);
      }
      resolve(null);
    });
  }

  bestSellers(): Promise<BestSellerProduct[]> {
    return new Promise(async (resolve, _) => {
      try {
        const items = await orderItemService
          .getRepository()
          .createQueryBuilder("ctdh")
          .leftJoin("ctdh.productVariant", "mhbt")
          .leftJoin("mhbt.product", "mh")
          .leftJoin("ctdh.order", "dh")
          .groupBy("mh.mahang")
          .select("sum(ctdh.soluong)", "total")
          .addSelect("mh.mahang", "productId")
          .addSelect("mh.tenhang", "productName")
          .addSelect("mh.hinhanh", "thumbnail")
          .addSelect("mh.solongton", "inventory")
          .where("dh.dathanhtoan = :isPaid", { isPaid: true })
          .orderBy("sum(ctdh.soluong)", "DESC")
          .getRawMany();

        resolve(
          items.splice(0, 10).map((item) => ({ ...item, total: +item.total }))
        );
      } catch (error) {
        console.log("BEST SELLERS ERROR", error);
        resolve([]);
      }
    });
  }

  updateThumbnail(id: number, thumbnail: string): Promise<Product | null> {
    return new Promise(async (resolve, _) => {
      try {
        const product = await this.getRepository().findOneBy({ id });
        if (product) {
          const newProduct = await this.getRepository().save({
            ...product,
            thumbnail,
          });
          resolve(newProduct);
        }
      } catch (error) {
        console.log("UPDATE PRODUCT ERROR", error);
      }
      resolve(null);
    });
  }

  updateStar(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        const data = await commentProductService.getAll({
          productId: `${id}`,
        });
        if (data) {
          const { items } = data;
          const star = everageStar(items);
          await this.getRepository().update({ id }, { star });
          resolve(true);
        }
      } catch (error) {
        console.log("UPDATE PRODUCT STAR ERROR", error);
      }
      resolve(false);
    });
  }

  softDeleteProduct(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete({ id });
        resolve(true);
      } catch (error) {
        console.log("SOFT DELETE PRODUCT ERROR", error);
        resolve(false);
      }
    });
  }

  restoreProduct(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore({ id });
        resolve(true);
      } catch (error) {
        console.log("RESTORE PRODUCT ERROR", error);
        resolve(false);
      }
    });
  }

  deleteProduct(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        const product = await this.getRepository().findOneBy({ id });
        if (product) {
          await productVariantService.deleteProductVariantByProduct(product.id);
          await this.getRepository().delete({ id });
        }
        resolve(true);
      } catch (error) {
        console.log("DELETE PRODUCT ERROR", error);
        resolve(false);
      }
    });
  }
}

const productService = new ProductService();

export default productService;
