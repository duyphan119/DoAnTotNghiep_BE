import { AppDataSource } from "../data-source";
import Advertisement from "../entities/advertisement.entity";
import { handleEqual, handleILike, handleSort } from "../utils";
import { QueryParams, ResponseData } from "../utils/types";

type AdvertisementQueryParams = QueryParams &
  Partial<{
    title: string;
    page: string;
  }>;

type CreateAdvertisementDTO = {
  path: string;
  title: string;
  href: string;
  page: string;
};

class AdvertisementService {
  getRepository() {
    return AppDataSource.getRepository(Advertisement);
  }

  getAll(query: AdvertisementQueryParams): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { title, page } = query;
        const { sort } = handleSort(query);
        const [items, count] = await this.getRepository().findAndCount({
          order: sort,
          where: {
            ...handleILike("title", title),
            ...handleEqual("page", page),
          },
        });
        resolve({ data: { items, count } });
      } catch (error) {
        console.log("GET ALL ADVERTISEMENTS ERROR", error);
        resolve({ error });
      }
    });
  }

  getById(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        resolve({ data: item });
      } catch (error) {
        console.log("GET ALL ADVERTISEMENTS ERROR", error);
        resolve({ error });
      }
    });
  }

  create(dto: CreateAdvertisementDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const advertisement = await this.getRepository().save(dto);
        resolve({ data: advertisement });
      } catch (error) {
        console.log("CREATE ADVERTISEMENT ERROR", error);
        resolve({ error });
      }
    });
  }

  update(id: number, dto: Partial<Advertisement>): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        if (item) {
          const advertisement = await this.getRepository().save({
            ...item,
            ...dto,
          });
          resolve({ data: advertisement });
        }
        resolve({});
      } catch (error) {
        console.log("UPDATE ADVERTISEMENT ERROR", error);
        resolve({ error });
      }
    });
  }

  delete(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id });
        resolve({});
      } catch (error) {
        console.log("UPDATE ADVERTISEMENT ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new AdvertisementService();
