import { In } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import NotificationType from "../entities/notificationType.entity";
import { handleILike, handlePagination, handleSort } from "../utils";
import { ICrudService } from "../utils/interfaces";
import { GetAll, SearchParams } from "../utils/types";
import {
  CreateNotificationTypeDTO,
  NotificationTypeParams,
} from "../utils/types/notificationType";

class NotificationTypeService
  implements
    ICrudService<
      GetAll<NotificationType>,
      NotificationType,
      NotificationTypeParams,
      CreateNotificationTypeDTO,
      Partial<CreateNotificationTypeDTO>
    >
{
  getRepository() {
    return AppDataSource.getRepository(NotificationType);
  }
  getAll(params: NotificationTypeParams): Promise<GetAll<NotificationType>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        if (q) resolve(await this.search(params));
        else {
          const { name } = params;
          const { sort } = handleSort(params);
          const { wherePagination } = handlePagination(params);

          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            ...wherePagination,
            where: {
              ...handleILike("name", name),
            },
          });
          resolve({ items, count });
        }
      } catch (error) {
        console.log("NotificationTypeService.getAll", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
  getById(id: number): Promise<NotificationType | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        resolve(item);
      } catch (error) {
        console.log("NotificationTypeService.getById", error);
        resolve(null);
      }
    });
  }
  createOne(dto: CreateNotificationTypeDTO): Promise<NotificationType | null> {
    return new Promise(async (resolve, _) => {
      try {
        const newItem = await this.getRepository().save(dto);
        resolve(newItem);
      } catch (error) {
        console.log("NotificationTypeService.createOne", error);
        resolve(null);
      }
    });
  }
  createMany(
    listDto: CreateNotificationTypeDTO[]
  ): Promise<NotificationType[]> {
    return new Promise(async (resolve, _) => {
      try {
        const newItems = await this.getRepository().save(listDto);
        resolve(newItems);
      } catch (error) {
        console.log("NotificationTypeService.createMany error", error);
        resolve([]);
      }
    });
  }
  updateOne(
    id: number,
    dto: Partial<CreateNotificationTypeDTO>
  ): Promise<NotificationType | null> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().update({ id }, dto);
        const existingItem = await this.getRepository().findOneBy({ id });
        resolve(existingItem);
      } catch (error) {
        console.log("NotificationTypeService.updateOne error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateNotificationTypeDTO>)[]
  ): Promise<NotificationType[]> {
    return new Promise(async (resolve, _) => {
      try {
        await Promise.all(
          inputs.map(
            (input: { id: number } & Partial<CreateNotificationTypeDTO>) => {
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
                  (
                    input: { id: number } & Partial<CreateNotificationTypeDTO>
                  ) => input.id
                )
              ),
            },
          })
        );
      } catch (error) {
        console.log("NotificationTypeService.updateMany error", error);
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
        console.log("NotificationTypeService.deleteOne error", error);
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
        console.log("NotificationTypeService.deleteMany error", error);
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
        console.log("NotificationTypeService.softDeleteOne error", error);
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
        console.log("NotificationTypeService.softDeleteMany error", error);
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
        console.log("NotificationTypeService.restoreOne error", error);
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
        console.log("NotificationTypeService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  search(params: SearchParams): Promise<GetAll<NotificationType>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { sort } = handleSort(params);
        const { wherePagination } = handlePagination(params);

        const [items, count] = await this.getRepository().findAndCount({
          ...wherePagination,
          order: sort,
          where: [handleILike("name", q)],
        });

        resolve({ items, count });
      } catch (error) {
        console.log("NotificationTypeService.search error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
}

const notificationTypeService = new NotificationTypeService();

export default notificationTypeService;
