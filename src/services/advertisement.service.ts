import { getCloudinary } from "../configCloudinary";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import Advertisement from "../entities/advertisement.entity";
import { handleEqual, handleILike, handleSort } from "../utils";
import { GetAll } from "../utils/types";
import {
  CreateAdvertisementDTO,
  GetAllAdvertisementQueryParams,
} from "../utils/types/advertisement";

class AdvertisementService {
  getRepository() {
    return AppDataSource.getRepository(Advertisement);
  }

  getAll(
    query: GetAllAdvertisementQueryParams
  ): Promise<GetAll<Advertisement>> {
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
        resolve({ items, count });
      } catch (error) {
        console.log("GET ALL ADVERTISEMENTS ERROR", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }

  getById(id: number): Promise<Advertisement | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        resolve(item);
      } catch (error) {
        console.log("GET ALL ADVERTISEMENTS ERROR", error);
        resolve(null);
      }
    });
  }

  create(dto: CreateAdvertisementDTO): Promise<Advertisement | null> {
    return new Promise(async (resolve, _) => {
      try {
        const advertisement = await this.getRepository().save(dto);
        resolve(advertisement);
      } catch (error) {
        console.log("CREATE ADVERTISEMENT ERROR", error);
        resolve(null);
      }
    });
  }

  update(
    id: number,
    dto: Partial<Advertisement>
  ): Promise<Advertisement | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        if (item) {
          const advertisement = await this.getRepository().save({
            ...item,
            ...dto,
          });
          resolve(advertisement);
        }
      } catch (error) {
        console.log("UPDATE ADVERTISEMENT ERROR", error);
      }
      resolve(null);
    });
  }

  delete(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        await this.getRepository().delete({ id });
        if (item && item.path !== "") {
          getCloudinary().v2.uploader.destroy(
            "DoAnTotNghiep_BE" +
              item.path.split("DoAnTotNghiep_BE")[1].split(".")[0]
          );
        }
        resolve(true);
      } catch (error) {
        console.log("UPDATE ADVERTISEMENT ERROR", error);
        resolve(false);
      }
    });
  }
}

const advertisementService = new AdvertisementService();

export default advertisementService;
