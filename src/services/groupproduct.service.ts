import slugify from "slugify";
import { ILike, Not } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import GroupProduct, {
  GroupProductSexEnum,
} from "../entities/groupProduct.entity";
import seedGroupProducts from "../seeds/group-product";
import helper from "../utils";
import { ICrudService } from "../utils/interfaces";
import {
  CreateGroupProductDTO,
  Gender,
  GetAll,
  GroupProductParams,
} from "../utils/types";

class GroupProductService
  implements
    ICrudService<GroupProduct, GroupProductParams, CreateGroupProductDTO>
{
  getForHeaderClient(): Promise<
    {
      name: string;
      slug: string;
      items: GroupProduct[];
    }[]
  > {
    return new Promise(async (resolve, _) => {
      try {
        const itemsFemale = await this.getRepository().find({
          where: { sex: GroupProductSexEnum.FEMALE, isAdult: true },
          order: { name: "ASC" },
        });
        const itemsMale = await this.getRepository().find({
          where: { sex: GroupProductSexEnum.MALE, isAdult: true },
          order: { name: "ASC" },
        });
        const itemsGirl = await this.getRepository().find({
          where: { sex: GroupProductSexEnum.FEMALE, isAdult: false },
          order: { name: "ASC" },
        });
        const itemsBoy = await this.getRepository().find({
          where: { sex: GroupProductSexEnum.MALE, isAdult: false },
          order: { name: "ASC" },
        });

        resolve([
          {
            name: GroupProductSexEnum.FEMALE,
            slug: slugify(GroupProductSexEnum.FEMALE, {
              lower: true,
              locale: "vi",
            }),
            items: itemsFemale,
          },
          {
            name: GroupProductSexEnum.MALE,
            slug: slugify(GroupProductSexEnum.MALE, {
              lower: true,
              locale: "vi",
            }),
            items: itemsMale,
          },
          {
            name: "Bé gái",
            slug: slugify("Bé gái", { lower: true, locale: "vi" }),
            items: itemsGirl,
          },
          {
            name: "Bé trai",
            slug: slugify("Bé trai", { lower: true, locale: "vi" }),
            items: itemsBoy,
          },
        ]);
      } catch (error) {
        console.log("GroupProductServer.getForHeaderClient error", error);
        resolve([]);
      }
    });
  }
  getAll(params: GroupProductParams): Promise<GetAll<GroupProduct>> {
    return new Promise(async (resolve, _) => {
      try {
        const { name, slug, description, q, relatedSlug, requireThumbnail } =
          params;
        const { wherePagination } = helper.handlePagination(params);
        const { sort } = helper.handleSort(params);
        if (q) {
          resolve(await this.search(params));
        } else if (relatedSlug) {
          resolve(await this.getRelatied(params));
        } else {
          const [groupProducts, count] =
            await this.getRepository().findAndCount({
              order: sort,
              where: {
                ...helper.handleILike("name", name),
                ...helper.handleILike("slug", slug),
                ...helper.handleILike("description", description),
                ...(requireThumbnail ? { thumbnail: Not("") } : {}),
              },
              ...wherePagination,
            });
          resolve({ items: groupProducts, count });
        }
      } catch (error) {
        console.log("GroupProductService.getAll error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }

  getById(id: number): Promise<GroupProduct | null> {
    return new Promise(async (resolve, _) => {
      try {
        const variant = await this.getRepository().findOneBy({ id });
        resolve(variant);
      } catch (error) {
        console.log("GroupProductService.getById error", error);
        resolve(null);
      }
    });
  }
  createOne(dto: CreateGroupProductDTO): Promise<GroupProduct | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItem = await this.getRepository().save({
          ...dto,
          slug: this.createSlug(dto.name, dto.sex, dto.isAdult),
        });
        resolve(newItem);
      } catch (error) {
        console.log("GroupProductService.createOne", error);
        resolve(null);
      }
    });
  }
  createMany(
    listDto: CreateGroupProductDTO[]
  ): Promise<(GroupProduct | null)[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItems = await Promise.all(
          listDto.map((dto) => this.createOne(dto))
        );
        resolve(newItems);
      } catch (error) {
        console.log("GroupProductService.createMany error", error);
      }
      resolve([]);
    });
  }
  updateOne(
    id: number,
    dto: Partial<CreateGroupProductDTO>
  ): Promise<GroupProduct | null> {
    return new Promise(async (resolve, reject) => {
      try {
        let existingItem = await this.getRepository().findOneBy({ id });
        if (existingItem) {
          const newItem = await this.getRepository().save({
            ...existingItem,
            ...dto,
            ...(dto.name && dto.name !== existingItem.name
              ? {
                  slug: this.createSlug(
                    dto.name,
                    dto.sex as Gender,
                    dto.isAdult
                  ),
                }
              : {}),
          });
          resolve(newItem);
        }
      } catch (error) {
        console.log("GroupProductService.updateOne error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateGroupProductDTO>)[]
  ): Promise<(GroupProduct | null)[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItems = await Promise.all(
          inputs.map(({ id, ...dto }) => this.updateOne(id, dto))
        );
        resolve(newItems);
      } catch (error) {
        console.log("GroupProductService.updateMany error", error);
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
        console.log("GroupProductService.deleteOne error", error);
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
        console.log("GroupProductService.deleteMany error", error);
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
        console.log("GroupProductService.softDeleteOne error", error);
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
        console.log("GroupProductService.softDeleteMany error", error);
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
        console.log("GroupProductService.restoreOne error", error);
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
        console.log("GroupProductService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  getRepository() {
    return AppDataSource.getRepository(GroupProduct);
  }

  createSlug(name: string, sex?: Gender, isAdult?: boolean) {
    let slug = slugify(name, { lower: true, locale: "vi" });

    if (sex === "Nam" && isAdult) slug += "-nam";
    else if (sex === "Nữ" && isAdult) slug += "-nu";
    else if (sex === "Nam" && !isAdult) slug += "-be-trai";
    else if (sex === "Nữ" && !isAdult) slug += "-be-gai ";
    return slug;
  }

  search(params: GroupProductParams): Promise<GetAll<GroupProduct>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { wherePagination } = helper.handlePagination(params);
        const { sort } = helper.handleSort(params);
        const [items, count] = await this.getRepository().findAndCount({
          order: sort,
          where: [
            helper.handleILike("name", q),
            helper.handleILike("slug", q),
            helper.handleILike("description", q),
          ],
          ...wherePagination,
        });
        resolve({ items, count });
      } catch (error) {
        console.log("GroupProductService.search", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }

  getRelatied(query: GroupProductParams): Promise<GetAll<GroupProduct>> {
    return new Promise(async (resolve, _) => {
      try {
        const { relatedSlug } = query;
        const { wherePagination } = helper.handlePagination(query);
        const { sort } = helper.handleSort(query);

        const item = await this.getRepository().findOneBy({
          slug: ILike(`%${relatedSlug}%`),
        });
        if (item) {
          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            where: {
              isAdult: item.isAdult,
              sex: item.sex,
            },
            ...wherePagination,
          });
          resolve({ items, count });
        }
      } catch (error) {
        console.log("GroupProductService.getRelatied error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }

  seed(): Promise<GetAll<GroupProduct>> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count();
        if (count === 0) {
          const items = await this.getRepository().save(seedGroupProducts);
          resolve({ items: items, count: items.length });
        }
      } catch (error) {
        console.log("GroupProductService.seed error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
}

export default new GroupProductService();
