import { IsNull, Not } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import UserAddress from "../entities/userAddress.entity";
import { handlePagination } from "../utils";
import { GetAll, PaginationParams } from "../utils/types";
import { CreateUserAddressDTO } from "../utils/types/userAddress";

class UserAddressService {
  getRepository() {
    return AppDataSource.getRepository(UserAddress);
  }

  getByDTO(
    userId: number,
    dto: CreateUserAddressDTO
  ): Promise<UserAddress | null> {
    return this.getRepository().findOneBy({ userId, ...dto });
  }

  getByUserId(
    userId: number,
    query: PaginationParams
  ): Promise<GetAll<UserAddress>> {
    return new Promise(async (resolve, _) => {
      try {
        const { wherePagination } = handlePagination(query);
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
        console.log("GET ALL USER ADDRESS BY USER ID ERROR", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
  createUserAddress(
    userId: number,
    dto: CreateUserAddressDTO
  ): Promise<UserAddress | null> {
    return new Promise(async (resolve, _) => {
      try {
        const newItem = await this.getRepository().save({
          ...dto,
          userId,
        });
        resolve(newItem);
      } catch (error) {
        console.log("CREATE USER ADDRESS ERROR", error);
        resolve(null);
      }
    });
  }
  updateUserAddress(
    id: number,
    userId: number,
    dto: Partial<CreateUserAddressDTO>
  ): Promise<UserAddress | null> {
    return new Promise(async (resolve, _) => {
      try {
        const userAddress = await this.getRepository().findOneBy({
          id,
          userId,
        });
        if (userAddress) {
          const newUserAddress = await this.getRepository().save({
            ...userAddress,
            ...dto,
          });
          resolve(newUserAddress);
        }
      } catch (error) {
        console.log("UPDATE USER ADDRESS ERROR", error);
      }
      resolve(null);
    });
  }
  deleteUserAddress(id: number, userId: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id, userId });
        resolve(true);
      } catch (error) {
        console.log("DELETE USER ADDRESS ERROR", error);
        resolve(false);
      }
    });
  }
}

const userAddressService = new UserAddressService();

export default userAddressService;
