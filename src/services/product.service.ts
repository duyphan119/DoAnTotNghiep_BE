import { AppDataSource } from "../data-source";
import slugify from "slugify";
import { Between, In, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import {
  everageStar,
  handleILike,
  handlePagination,
  handleSearchILike,
  handleSort,
} from "../utils";
import Product from "../entities/product.entity";
import { QueryParams, ResponseData } from "../utils/types";
import commentproductService from "./commentproduct.service";
import orderItemService from "./orderitem.service";
import productvariantService from "./productvariant.service";

export type RelationQueryParams = Partial<{
  product_variants: string;
  images: string;
}>;

type ProductHasMinMaxPrice = Product & {
  minPrice: number;
  maxPrice: number;
};

type ProductQueryParams = QueryParams &
  RelationQueryParams &
  Partial<{
    name: string;
    slug: string;
    group_product_slug: string;
    group_product: string;
    v_ids: string;
    min_price: string;
    max_price: string;
    q: string;
  }>;

type CreateProductDTO = {
  name: string;
  groupProductId: number;
  price: number;
} & Partial<{
  inventory: number;
  thumbnail: string;
  detail: string;
  description: string;
}>;

export type BestSellerProduct = {
  productId: number;
  productName: string;
  thumbnail: string;
  inventory: number;
  total: number;
};

class ProductService {
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

  getAllProducts(
    query: ProductQueryParams,
    isAdmin?: boolean
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const {
          withDeleted,
          name,
          slug,
          product_variants,
          images,
          group_product,
          group_product_slug,
          min_price,
          max_price,
          v_ids,
          q,
        } = query;
        const { wherePagination } = handlePagination(query);
        const { sortBy, sortType, sort } = handleSort(query);
        let [products, count] = await this.getRepository().findAndCount({
          order: sort,
          where: {
            ...handleILike("name", name),
            ...handleILike("slug", slug),
            ...handleSearchILike(["name", "slug"], q),
            ...(group_product_slug
              ? {
                  groupProduct: handleILike("slug", group_product_slug),
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
          withDeleted: isAdmin && withDeleted ? true : false,
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
          resolve({ data: { items: newProducts, count } });
        } else {
          resolve({ data: { items: products, count } });
        }
      } catch (error) {
        console.log("GET ALL PRODUCTS ERROR", error);
        resolve({ error });
      }
    });
  }

  getById(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const product = await this.getRepository().findOneBy({ id });
        if (product) {
          resolve({ data: product });
        }
        resolve({});
      } catch (error) {
        console.log("UPDATE PRODUCT ERROR", error);
        resolve({ error });
      }
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

  createProduct(dto: CreateProductDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { name } = dto;
        const newProduct = await this.getRepository().save({
          ...dto,
          slug: slugify(name, { lower: true }),
        });
        resolve({ data: newProduct });
      } catch (error) {
        console.log("CREATE PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }

  updateProduct(id: number, dto: Partial<Product>): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const product = await this.getRepository().findOneBy({ id });
        if (product) {
          const { name } = dto;
          const newProduct = await this.getRepository().save({
            ...product,
            ...dto,
            ...(name ? { slug: slugify(name, { lower: true }) } : {}),
          });
          resolve({ data: newProduct });
        }

        resolve({});
      } catch (error) {
        console.log("UPDATE PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }

  updateThumbnail(id: number, thumbnail: string): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const product = await this.getRepository().findOneBy({ id });
        if (product) {
          const newProduct = await this.getRepository().save({
            ...product,
            thumbnail,
          });
          resolve({ data: newProduct });
        }

        resolve({});
      } catch (error) {
        console.log("UPDATE PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }

  updateStar(id: number): Promise<any> {
    return new Promise(async (resolve, _) => {
      try {
        const { data } = await commentproductService.getAll({
          productId: `${id}`,
        });
        if (data) {
          const { items } = data;
          const star = everageStar(items);
          await this.updateProduct(id, { star });
          resolve({});
        }
      } catch (error) {
        console.log("UPDATE PRODUCT STAR ERROR", error);
        resolve({ error });
      }
    });
  }

  softDeleteProduct(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete({ id });
        resolve({});
      } catch (error) {
        console.log("SOFT DELETE PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }

  restoreProduct(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore({ id });
        resolve({});
      } catch (error) {
        console.log("RESTORE PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }

  deleteProduct(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const product = await this.getRepository().findOneBy({ id });
        if (product) {
          await productvariantService.deleteProductVariantByProduct(product.id);
          await this.getRepository().delete({ id });
        }
        resolve({});
      } catch (error) {
        console.log("DELETE PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new ProductService();
