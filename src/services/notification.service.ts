import { In, IsNull } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import Notification from "../entities/notification.entity";
import {
  handleEqual,
  handleILike,
  handlePagination,
  handleSort,
} from "../utils";
import { ICrudService } from "../utils/interfaces";
import {
  GetAll,
  QueryParams,
  ResponseData,
  SearchParams,
} from "../utils/types";
import {
  CreateNotificationDTO,
  NotificationParams,
} from "../utils/types/notification";
import notificationTypeService from "./notificationType.service";
import userService from "./user.service";

class NotificationService
  implements
    ICrudService<
      GetAll<Notification> & { countUnRead?: number },
      Notification,
      NotificationParams,
      CreateNotificationDTO,
      Partial<CreateNotificationDTO>
    >
{
  getAll(
    params: NotificationParams
  ): Promise<GetAll<Notification> & { countUnRead?: number }> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        if (q) resolve(await this.search(params));
        else {
          const { content, type, notificationTypeId, unread } = params;
          const { sort } = handleSort(params);
          const { wherePagination } = handlePagination(params);

          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            ...wherePagination,
            where: {
              ...handleILike("content", content),
              ...handleEqual("notificationTypeId", notificationTypeId, true),
              ...(type
                ? {
                    notificationType: handleILike("name", type),
                  }
                : {}),
              ...(unread ? { readAt: IsNull() } : {}),
            },
            relations: {
              ...(type ? { notificationType: true } : {}),
            },
          });
          resolve({ items, count, countUnRead: await this.countUnRead() });
        }
      } catch (error) {
        console.log("NotificationService.getAll error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
  getById(id: number): Promise<Notification | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        resolve(item);
      } catch (error) {
        console.log("NotificationService.getById error", error);
        resolve(null);
      }
    });
  }
  createOrderNotification(userId: number): Promise<Notification | null> {
    return new Promise(async (resolve, _) => {
      try {
        let notificationType = await notificationTypeService
          .getRepository()
          .findOneBy({ name: "Đơn hàng" });
        if (!notificationType) {
          notificationType = await notificationTypeService
            .getRepository()
            .save({ name: "Đơn hàng" });
        }
        const user = await userService.getById(userId);
        if (user) {
          const item = await this.getRepository().save({
            content: `Khách hàng ${user.fullName} đã đặt 1 đơn hàng`,
            notificationTypeId: notificationType.id,
            userId,
          });
          resolve(item);
        }
      } catch (error) {
        console.log("NotificationService.createOrderNotification error", error);
      }
      resolve(null);
    });
  }
  createOne(dto: CreateNotificationDTO): Promise<Notification | null> {
    return new Promise(async (resolve, _) => {
      try {
        const newItem = await this.getRepository().save(dto);
        resolve(newItem);
      } catch (error) {
        console.log("NotificationService.createOne error", error);
        resolve(null);
      }
    });
  }
  createMany(listDto: CreateNotificationDTO[]): Promise<Notification[]> {
    return new Promise(async (resolve, _) => {
      try {
        const newItems = await this.getRepository().save(listDto);
        resolve(newItems);
      } catch (error) {
        console.log("NotificationService.createMany error error", error);
        resolve([]);
      }
    });
  }
  updateOne(
    id: number,
    dto: Partial<CreateNotificationDTO>
  ): Promise<Notification | null> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().update({ id }, dto);
        const existingItem = await this.getRepository().findOneBy({ id });
        resolve(existingItem);
      } catch (error) {
        console.log("NotificationService.updateOne error error", error);
      }
      resolve(null);
    });
  }
  read(id: number, readBy: number): Promise<Notification | null> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().update(
          { id },
          { readAt: new Date(), readBy }
        );
        const existingItem = await this.getRepository().findOneBy({ id });
        resolve(existingItem);
      } catch (error) {
        console.log("NotificationService.read error error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateNotificationDTO>)[]
  ): Promise<Notification[]> {
    return new Promise(async (resolve, _) => {
      try {
        await Promise.all(
          inputs.map(
            (input: { id: number } & Partial<CreateNotificationDTO>) => {
              const { id, ...dto } = input;
              return this.getRepository().update({ id }, dto);
            }
          )
        );
        resolve(
          await this.getRepository().find({
            where: {
              id: In(
                inputs.map(
                  (input: { id: number } & Partial<CreateNotificationDTO>) =>
                    input.id
                )
              ),
            },
          })
        );
      } catch (error) {
        console.log("NotificationService.updateMany error error", error);
        resolve([]);
      }
    });
  }
  deleteOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete(id);
        resolve(true);
      } catch (error) {
        console.log("NotificationService.deleteOne error error", error);
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
        console.log("NotificationService.deleteMany error error", error);
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
        console.log("NotificationService.softDeleteOne error error", error);
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
        console.log("NotificationService.softDeleteMany error error", error);
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
        console.log("NotificationService.restoreOne error error", error);
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
        console.log("NotificationService.restoreMany error error", error);
        resolve(false);
      }
    });
  }
  search(params: SearchParams): Promise<GetAll<Notification>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { sort } = handleSort(params);
        const { wherePagination } = handlePagination(params);
        const [items, count] = await this.getRepository().findAndCount({
          order: sort,
          ...wherePagination,
          where: [
            handleILike("content", q),
            handleEqual("notificationTypeId", q, true),
          ],
        });
        resolve({ items, count });
      } catch (error) {
        console.log("NotificationService.getAll error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
  getRepository() {
    return AppDataSource.getRepository(Notification);
  }

  countUnRead(): Promise<number> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count({
          where: { readAt: IsNull() },
        });
        resolve(count);
      } catch (error) {
        console.log("NotificationService.countUnRead error error", error);
        resolve(0);
      }
    });
  }
}
const notificationService = new NotificationService();
export default notificationService;
