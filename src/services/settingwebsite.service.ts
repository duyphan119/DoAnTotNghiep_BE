import { In } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import SettingWebsite from "../entities/settingWebsite.entity";
import helper from "../utils";
import {
  GetAll,
  ResponseData,
  CreateSettingWebsiteDTO,
  SettingWebsiteParams,
} from "../utils/types";

class SettingWebsiteService {
  getRepository() {
    return AppDataSource.getRepository(SettingWebsite);
  }

  getAll(query: SettingWebsiteParams): Promise<GetAll<SettingWebsite>> {
    return new Promise(async (resolve, _) => {
      try {
        const { key } = query;
        const [items, count] = await this.getRepository().findAndCount({
          where: {
            ...helper.handleEqual("key", key),
          },
        });
        resolve({ items, count });
      } catch (error) {
        console.log("GET ALL SETTING WEBSITE ERROR", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }

  getById(id: number): Promise<SettingWebsite | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        resolve(item);
      } catch (error) {
        console.log("GET SETTING WEBSITE BY ID ERROR", error);
        resolve(null);
      }
    });
  }

  createOne(dto: CreateSettingWebsiteDTO): Promise<SettingWebsite | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().save(dto);
        resolve(item);
      } catch (error) {
        console.log("CREATE SETTING WEBSITE ERROR", error);
        resolve(null);
      }
    });
  }

  updateOne(
    id: number,
    dto: Partial<CreateSettingWebsiteDTO>
  ): Promise<SettingWebsite | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        if (item) {
          const newItem = await this.getRepository().save({ ...item, ...dto });
          resolve(newItem);
        }
      } catch (error) {
        console.log("UPDATE SETTING WEBSITE ERROR", error);
      }
      resolve(null);
    });
  }

  deleteOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id });
        resolve(true);
      } catch (error) {
        console.log("DELETE SETTING WEBSITE ERROR", error);
        resolve(false);
      }
    });
  }

  getByKeys(keys: string[]): Promise<GetAll<SettingWebsite>> {
    return new Promise(async (resolve, _) => {
      try {
        const [items, count] = await this.getRepository().findAndCount({
          where: {
            key: In(keys),
          },
          select: {
            key: true,
            value: true,
          },
        });

        resolve({ items, count });
      } catch (error) {
        console.log("GET SETTING WEBSITE BY KEYS", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }

  seed(): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const items = await this.getRepository().save([
          {
            key: "Email Contact",
            value: "duychomap123@gmail.com",
          },
          {
            key: "Phone Contact",
            value: "0385981196",
          },
        ]);
        resolve({ data: { items, count: items.length } });
      } catch (error) {
        console.log("CREATE SEED SETTING WEBSITE ERROR", error);
        resolve({ error });
      }
    });
  }
}

const settingWebsiteService = new SettingWebsiteService();

export default settingWebsiteService;
