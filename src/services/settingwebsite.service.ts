import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import SettingWebsite from "../entities/settingwebsite.entity";
import { handleEqual } from "../utils";
import { QueryParams, ResponseData } from "../utils/types";

type SettingWebsiteDTO = {
  key: string;
  value: string;
};

type SettingWebsiteQueryParams = Partial<{
  key: string;
}> &
  QueryParams;

class SettingWebsiteService {
  getRepository() {
    return AppDataSource.getRepository(SettingWebsite);
  }

  getAll(query: SettingWebsiteQueryParams): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { key } = query;
        const [items, count] = await this.getRepository().findAndCount({
          where: {
            ...handleEqual("key", key),
          },
        });
        resolve({ data: { items, count } });
      } catch (error) {
        console.log("GET ALL SETTING WEBSITE ERROR", error);
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
        console.log("GET SETTING WEBSITE BY ID ERROR", error);
        resolve({ error });
      }
    });
  }

  createOne(dto: SettingWebsiteDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().save(dto);
        resolve({ data: item });
      } catch (error) {
        console.log("CREATE SETTING WEBSITE ERROR", error);
        resolve({ error });
      }
    });
  }

  updateOne(
    id: number,
    dto: Partial<SettingWebsiteDTO>
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        if (item) {
          const newItem = await this.getRepository().save({ ...item, ...dto });
          resolve({ data: newItem });
        }
        resolve({ data: null });
      } catch (error) {
        console.log("UPDATE SETTING WEBSITE ERROR", error);
        resolve({ error });
      }
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

  getByKeys(keys: string[]): Promise<any> {
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

        resolve({ data: { items, count } });
      } catch (error) {
        console.log("GET SETTING WEBSITE BY KEYS", error);
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

export default new SettingWebsiteService();
