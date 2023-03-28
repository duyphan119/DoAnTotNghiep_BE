import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import Advertisement from "../entities/advertisement.entity";
import helper from "../utils";
import { ICrudService } from "../utils/interfaces";
import { GetAll } from "../utils/types";
import { AdvertisementParams, CreateAdvertisementDTO } from "../utils/types";

class AdvertisementService
  implements
    ICrudService<Advertisement, AdvertisementParams, CreateAdvertisementDTO>
{
  search(params: AdvertisementParams): Promise<GetAll<Advertisement>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { sort } = helper.handleSort(params);
        const { wherePagination } = helper.handlePagination(params);

        const [items, count] = await this.getRepository().findAndCount({
          order: sort,
          where: [
            helper.handleILike("title", q),
            helper.handleILike("href", q),
            helper.handleILike("page", q),
          ],
          ...wherePagination,
        });
        resolve({ items, count });
      } catch (error) {
        console.log("AdvertisementService.search error", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
  getAll(params: AdvertisementParams): Promise<GetAll<Advertisement>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        if (q) resolve(await this.search(params));
        else {
          const { page, title, href } = params;
          const { sort } = helper.handleSort(params);
          const { wherePagination } = helper.handlePagination(params);

          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            where: {
              ...helper.handleILike("page", page),
              ...helper.handleILike("title", title),
              ...helper.handleILike("href", href),
            },
            ...wherePagination,
          });
          resolve({ items, count });
        }
      } catch (error) {
        console.log("AdvertisementService.getAll error", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
  getById(id: number): Promise<Advertisement | null> {
    return new Promise(async (resolve, _) => {
      try {
        const existingItem = await this.getRepository().findOneBy({ id });
        resolve(existingItem);
      } catch (error) {
        console.log("AdvertisementService.getById error", error);
      }
      resolve(null);
    });
  }
  createOne(dto: CreateAdvertisementDTO): Promise<Advertisement | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItem = await this.getRepository().save(dto);
        resolve(newItem);
      } catch (error) {
        console.log("AdvertisementService.getById error", error);
      }
      resolve(null);
    });
  }
  createMany(
    listDto: CreateAdvertisementDTO[]
  ): Promise<(Advertisement | null)[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItems = await Promise.all(
          listDto.map((dto) => this.createOne(dto))
        );
        resolve(newItems);
      } catch (error) {
        console.log("AdvertisementService.createMany error", error);
      }
      resolve([]);
    });
  }
  updateOne(
    id: number,
    dto: Partial<CreateAdvertisementDTO>
  ): Promise<Advertisement | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const existingItem = await this.getById(id);
        if (existingItem) {
          const newItem = await this.getRepository().save({
            ...existingItem,
            ...dto,
          });
          resolve(newItem);
        }
      } catch (error) {
        console.log("AdvertisementService.updateOne error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateAdvertisementDTO>)[]
  ): Promise<(Advertisement | null)[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItems = await Promise.all(
          inputs.map((input) => {
            const { id, ...dto } = input;
            return this.updateOne(id, dto);
          })
        );
        resolve(newItems);
      } catch (error) {
        console.log("AdvertisementService.updateMany error", error);
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
        console.log("AdvertisementService.deleteOne error", error);
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
        console.log("AdvertisementService.deleteMany error", error);
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
        console.log("AdvertisementService.softDeleteOne error", error);
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
        console.log("AdvertisementService.softDeleteMany error", error);
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
        console.log("AdvertisementService.restoreOne error", error);
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
        console.log("AdvertisementService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  getRepository() {
    return AppDataSource.getRepository(Advertisement);
  }
}

const advertisementService = new AdvertisementService();

export default advertisementService;
