import { AppDataSource } from "../data-source";
import UserAddress from "../entities/useraddress.entity";
import { handlePagination } from "../utils";
import { PaginationParams, ResponseData } from "../utils/types";

export type CreateUserAddressDTO = {
  province: string;
  district: string;
  ward: string;
  address: string;
};
class UserAddressService {
  getRepository() {
    return AppDataSource.getRepository(UserAddress);
  }

  getByDTO(userId: number, dto: CreateUserAddressDTO) {
    return this.getRepository().findOneBy({ userId, ...dto });
  }

  getByUserId(userId: number, query: PaginationParams): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { wherePagination } = handlePagination(query);
        const [groupProducts, count] = await this.getRepository().findAndCount({
          where: { userId },
          ...wherePagination,
        });
        resolve({ data: { items: groupProducts, count } });
      } catch (error) {
        console.log("GET ALL USER ADDRESS BY USER ID ERROR", error);
        resolve({ error });
      }
    });
  }
  createUserAddress(
    userId: number,
    dto: CreateUserAddressDTO
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const newGroupProduct = await this.getRepository().save({
          ...dto,
          userId,
        });
        resolve({ data: newGroupProduct });
      } catch (error) {
        console.log("CREATE USER ADDRESS ERROR", error);
        resolve({ error });
      }
    });
  }
  updateUserAddress(
    id: number,
    userId: number,
    dto: Partial<CreateUserAddressDTO>
  ): Promise<ResponseData> {
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
          resolve({ data: newUserAddress });
        }
        resolve({});
      } catch (error) {
        console.log("UPDATE USER ADDRESS ERROR", error);
        resolve({ error });
      }
    });
  }
  deleteUserAddress(id: number, userId: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id, userId });
        resolve({});
      } catch (error) {
        console.log("DELETE USER ADDRESS ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new UserAddressService();
