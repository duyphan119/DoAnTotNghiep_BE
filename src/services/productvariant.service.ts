import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import ProductVariant from "../entities/productVariant.entity";
import VariantValue from "../entities/variantValue.entity";
import helper from "../utils";
import { ICrudService } from "../utils/interfaces";
import {
  GetAll,
  SearchParams,
  CreateProductVariantDTO,
  ProductVariantParams,
} from "../utils/types";

class ProductVariantService
  implements
    ICrudService<ProductVariant, ProductVariantParams, CreateProductVariantDTO>
{
  getAll(params: ProductVariantParams): Promise<GetAll<ProductVariant>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        if (q) resolve(await this.search(params));
        else {
          const { productId, variant_values } = params;
          const { sort } = helper.handleSort(params);
          const { wherePagination } = helper.handlePagination(params);
          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            ...wherePagination,
            where: {
              ...(productId ? { productId: +productId } : {}),
            },
            relations: {
              ...(variant_values ? { variantValues: true } : {}),
            },
          });
          // for (let i = 0; i < items.length; i++) {
          //   await this.getRepository().save({
          //     ...items[i],
          //     code: this.generateCode(
          //       items[i].productId,
          //       items[i].variantValues
          //     ),
          //   });
          // }
          resolve({ items, count });
        }
      } catch (error) {
        console.log("ProductVariantService.getAll error", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
  createOne(dto: CreateProductVariantDTO): Promise<ProductVariant | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItem = await this.getRepository().save({
          ...dto,
          code: this.generateCode(dto.productId, dto.variantValues),
        });
        resolve(newItem);
      } catch (error) {
        console.log("ProductVariantService.createOne error", error);
        resolve(null);
      }
    });
  }
  createMany(
    listDto: CreateProductVariantDTO[]
  ): Promise<(ProductVariant | null)[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const ngu = listDto.map((dto) => ({
          productId: dto.productId,
          code: this.generateCode(dto.productId, dto.variantValues),
          variantValues: dto.variantValues,
          price: dto.price,
          inventory: dto.inventory,
          name: this.generateName(dto.variantValues),
        }));
        const newItems = await this.getRepository().save(ngu);
        resolve(newItems);
      } catch (error) {
        console.log("ProductVariantService.createMany error", error);
      }
      resolve([]);
    });
  }
  generateName(variantValues: VariantValue[]): string {
    const arr = [...variantValues];
    arr.sort((a, b) => a.id - b.id);
    return arr.map((item) => item.value).join(" / ");
  }

  updateOne(
    id: number,
    dto: Partial<CreateProductVariantDTO>
  ): Promise<ProductVariant | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const existingItem = await this.getRepository().findOneBy({ id });
        if (existingItem) {
          const newItem = await this.getRepository().save({
            ...existingItem,
            ...dto,
            ...(dto.variantValues && dto.variantValues.length > 0
              ? {
                  name: this.generateName(dto.variantValues),
                  ...(dto.productId
                    ? {
                        code: this.generateCode(
                          dto.productId,
                          dto.variantValues
                        ),
                      }
                    : {}),
                }
              : {}),
          });
          resolve(newItem);
        }
      } catch (error) {
        console.log("ProductVariantService.updateOne error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateProductVariantDTO>)[]
  ): Promise<(ProductVariant | null)[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItems = await Promise.all(
          inputs.map((input) => this.updateOne(input.id, input))
        );
        resolve(newItems);
      } catch (error) {
        console.log("ProductVariantService.updateMany error", error);
      }
      resolve([]);
    });
  }
  deleteOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete(id);
        resolve(true);
      } catch (error) {
        console.log("ProductVariantService.deleteOne error", error);
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
        console.log("ProductVariantService.deleteMany error", error);
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
        console.log("ProductVariantService.softDeleteOne error", error);
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
        console.log("ProductVariantService.softDeleteMany error", error);
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
        console.log("ProductVariantService.restoreOne error", error);
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
        console.log("ProductVariantService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  search(params: SearchParams): Promise<GetAll<ProductVariant>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { sort } = helper.handleSort(params);
        const { wherePagination } = helper.handlePagination(params);
        const [items, count] = await this.getRepository().findAndCount({
          order: sort,
          ...wherePagination,
          where: [helper.handleILike("name", q)],
          relations: {
            variantValues: true,
          },
        });
        resolve({ items, count });
      } catch (error) {
        console.log("ProductVariantService.search error", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
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

  generateCode(productId: number, variantValues: VariantValue[]): string {
    let code = "";

    code += `${productId}`.padStart(5, "0");
    code += `-${variantValues
      .map((variantValue) => `${variantValue.code}`)
      .join("-")}`;

    return code;
  }

  getById(id: number): Promise<ProductVariant | null> {
    return new Promise(async (resolve, _) => {
      try {
        const productVariant = await this.getRepository().findOne({
          where: { id },
          relations: { variantValues: true },
        });
        resolve(productVariant);
      } catch (error) {
        console.log("ProductVariantService.getById error", error);
        resolve(null);
      }
    });
  }
}

const productVariantService = new ProductVariantService();

export default productVariantService;
