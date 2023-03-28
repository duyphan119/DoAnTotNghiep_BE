import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import NotificationType from "../entities/notificationType.entity";
import helper from "../utils";
import { ICrudService } from "../utils/interfaces";
import {
  CreateNotificationTypeDTO,
  GetAll,
  NotificationTypeParams,
} from "../utils/types";

class NotificationTypeService
  implements
    ICrudService<
      NotificationType,
      NotificationTypeParams,
      CreateNotificationTypeDTO
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
          const { sort } = helper.handleSort(params);
          const { wherePagination } = helper.handlePagination(params);

          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            ...wherePagination,
            where: {
              ...helper.handleILike("name", name),
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
    return new Promise(async (resolve, reject) => {
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
  ): Promise<(NotificationType | null)[]> {
    return new Promise(async (resolve, _) => {
      try {
        const newItems = await Promise.all(
          listDto.map((dto) => this.createOne(dto))
        );
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
    return new Promise(async (resolve, reject) => {
      try {
        const existingItem = await this.getRepository().findOneBy({ id });
        if (existingItem) {
          const newItem = await this.getRepository().save({
            ...existingItem,
            ...dto,
          });
          resolve(newItem);
        }
        await this.getRepository().update({ id }, dto);
        resolve(existingItem);
      } catch (error) {
        console.log("NotificationTypeService.updateOne error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateNotificationTypeDTO>)[]
  ): Promise<(NotificationType | null)[]> {
    return new Promise(async (resolve, _) => {
      try {
        const newItems = await Promise.all(
          inputs.map(({ id, ...dto }) => this.updateOne(id, dto))
        );
        resolve(newItems);
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
  search(params: NotificationTypeParams): Promise<GetAll<NotificationType>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { sort } = helper.handleSort(params);
        const { wherePagination } = helper.handlePagination(params);

        const [items, count] = await this.getRepository().findAndCount({
          ...wherePagination,
          order: sort,
          where: [helper.handleILike("name", q)],
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
