import { AppDataSource } from "../data-source";
import slugify from "slugify";
import { Between, In, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import {
  everageStar,
  handleILike,
  handlePagination,
  handleSearch,
  handleSearchILike,
  handleSort,
} from "../utils";
import Product from "../entities/product.entity";
import {
  GetAll,
  PaginationParams,
  QueryParams,
  ResponseData,
} from "../utils/types";
import commentProductService from "./commentProduct.service";
import orderItemService from "./orderItem.service";
import productVariantService from "./productVariant.service";
import {
  BestSellerProduct,
  CreateProductDTO,
  GetAllProductQueryParams,
  ProductHasMinMaxPrice,
} from "../utils/types/product";
import { EMPTY_ITEMS } from "../constantList";

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
    query: GetAllProductQueryParams,
    isAdmin?: boolean
  ): Promise<GetAll<Product | ProductHasMinMaxPrice>> {
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
        } = query;
        const { wherePagination } = handlePagination(query);
        const { sortBy, sortType, sort } = handleSort(query);

        let [products, count] = await this.getRepository().findAndCount({
          order: sort,
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
          resolve({ items: newProducts, count });
        } else {
          resolve({ items: products, count });
        }
      } catch (error) {
        console.log("GET ALL PRODUCTS ERROR", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }

  searchProduct(
    query: PaginationParams & Partial<{ q: string }>
  ): Promise<GetAll<ProductHasMinMaxPrice>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = query;
        const { wherePagination } = handlePagination(query);

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
        console.log("SEARCH PRODUCTS ERROR", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }

  getById(id: number): Promise<Product | null> {
    return new Promise(async (resolve, _) => {
      try {
        const product = await this.getRepository().findOneBy({ id });
        if (product) {
          resolve(product);
        }
      } catch (error) {
        console.log("UPDATE PRODUCT ERROR", error);
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

  createProduct(dto: CreateProductDTO): Promise<Product | null> {
    return new Promise(async (resolve, _) => {
      try {
        const { name } = dto;
        const newProduct = await this.getRepository().save({
          ...dto,
          slug: slugify(name, { lower: true }),
        });
        resolve(newProduct);
      } catch (error) {
        console.log("CREATE PRODUCT ERROR", error);
        resolve(null);
      }
    });
  }

  updateProduct(id: number, dto: Partial<Product>): Promise<Product | null> {
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
          resolve(newProduct);
        }
      } catch (error) {
        console.log("UPDATE PRODUCT ERROR", error);
      }
      resolve(null);
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
          await this.updateProduct(id, { star });
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
