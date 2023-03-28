import { IsNull, Not } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import UserAddress from "../entities/userAddress.entity";
import helper from "../utils";
import { ICrudService } from "../utils/interfaces";
import {
  CreateUserAddressDTO,
  GetAll,
  PaginationParams,
  SearchParams,
} from "../utils/types";

class UserAddressService
  implements ICrudService<UserAddress, SearchParams, CreateUserAddressDTO>
{
  search(params: SearchParams): Promise<GetAll<UserAddress>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { wherePagination } = helper.handlePagination(params);
        const { sort } = helper.handleSort(params);
        const [items, count] = await this.getRepository().findAndCount({
          order: sort,
          where: [
            helper.handleILike("province", q),
            helper.handleILike("district", q),
            helper.handleILike("ward", q),
            helper.handleILike("address", q),
          ],
          ...wherePagination,
        });
        resolve({ items, count });
      } catch (error) {
        console.log("UserAddressService.search error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
  getAll(params: SearchParams): Promise<GetAll<UserAddress>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { wherePagination } = helper.handlePagination(params);
        const { sort } = helper.handleSort(params);
        if (q) resolve(await this.search(params));
        else {
          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            ...wherePagination,
          });
          resolve({ items, count });
        }
      } catch (error) {
        console.log("UserAddressService.getAll error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
  getById(id: number): Promise<UserAddress | null> {
    return new Promise(async (resolve, _) => {
      try {
        const UserAddress = await this.getRepository().findOneBy({ id });
        resolve(UserAddress);
      } catch (error) {
        console.log("UserAddressService.getById error", error);
        resolve(null);
      }
    });
  }
  createOne(dto: CreateUserAddressDTO): Promise<UserAddress | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItem = await this.getRepository().save(dto);
        resolve(newItem);
      } catch (error) {
        console.log("UserAddressService.createOne", error);
        resolve(null);
      }
    });
  }
  createMany(listDto: CreateUserAddressDTO[]): Promise<(UserAddress | null)[]> {
    return new Promise(async (resolve, _) => {
      try {
        const newItems = await Promise.all(
          listDto.map((dto) => this.createOne(dto))
        );
        resolve(newItems);
      } catch (error) {
        console.log("UserAddressService.createMany error", error);
        resolve([]);
      }
    });
  }
  updateOne(
    id: number,
    dto: Partial<CreateUserAddressDTO>
  ): Promise<UserAddress | null> {
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
        console.log("UserAddressService.updateOne error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateUserAddressDTO>)[]
  ): Promise<(UserAddress | null)[]> {
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
        console.log("UserAddressService.updateMany error", error);
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
        console.log("UserAddressService.deleteOne error", error);
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
        console.log("UserAddressService.deleteMany error", error);
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
        console.log("UserAddressService.softDeleteOne error", error);
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
        console.log("UserAddressService.softDeleteMany error", error);
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
        console.log("UserAddressService.restoreOne error", error);
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
        console.log("UserAddressService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  getRepository() {
    return AppDataSource.getRepository(UserAddress);
  }

  getByDTO(dto: CreateUserAddressDTO): Promise<UserAddress | null> {
    return this.getRepository().findOneBy(dto);
  }

  getByUserId(
    userId: number,
    query: PaginationParams
  ): Promise<GetAll<UserAddress>> {
    return new Promise(async (resolve, _) => {
      try {
        const { wherePagination } = helper.handlePagination(query);
        const [items, count] = await this.getRepository().findAndCount({
          where: {
            userId,
            province: Not(IsNull()),
            district: Not(IsNull()),
            address: Not(IsNull()),
            ward: Not(IsNull()),
          },
          ...wherePagination,
        });
        resolve({ items, count });
      } catch (error) {
        console.log("UserAddressService.getByUserId error", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
}

const userAddressService = new UserAddressService();

export default userAddressService;
