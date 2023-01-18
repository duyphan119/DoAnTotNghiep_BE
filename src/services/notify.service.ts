import { IsNull } from "typeorm";
import { AppDataSource } from "../data-source";
import Notify from "../entities/notify.entity";
import { handlePagination } from "../utils";
import { QueryParams, ResponseData } from "../utils/types";

type NotificationQueryParams = Partial<{
  unread: string;
}> &
  QueryParams;

type CreateNotifyDTO = {
  message: string;
} & Partial<{
  type: string;
}>;

class NotifyService {
  getRepository() {
    return AppDataSource.getRepository(Notify);
  }

  countUnRead(): Promise<number> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count({
          where: { readAt: IsNull() },
        });
        resolve(count);
      } catch (error) {
        console.log("COUNT UNREAD NOTIFICATIONS ERROR", error);
        resolve(0);
      }
    });
  }

  getAll(query: NotificationQueryParams): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { unread } = query;
        const { wherePagination } = handlePagination(query);
        const [items, count] = await this.getRepository().findAndCount({
          order: { id: "desc" },
          ...wherePagination,
        });
        const countUnRead = unread === "true" ? await this.countUnRead() : 0;
        resolve({ data: { items, count, countUnRead } });
      } catch (error) {
        console.log("GET ALL NOTIFICATIONS ERROR", error);
        resolve({ error });
      }
    });
  }

  createOne(userId: number, dto: CreateNotifyDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        console.log({ ...dto, userId });
        const item = await this.getRepository().save({ ...dto, userId });
        console.log(item);
        resolve({ data: item });
      } catch (error) {
        console.log("CREATE NOTIFICATION ERROR", error);
        resolve({ error });
      }
    });
  }

  deleteOne(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id });
        resolve({});
      } catch (error) {
        console.log("DELETE NOTIFICATION ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new NotifyService();
