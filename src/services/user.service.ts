import * as bcrypt from "bcrypt";
import { Between } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import User from "../entities/user.entity";
import {
  handleILike,
  handlePagination,
  handleSearchILike,
  handleSort,
  lastDay,
} from "../utils";
import { GetAll, ResponseData } from "../utils/types";
import { CreateUserDTO, GetAllUserQueryParams } from "../utils/types/user";

class UserService {
  getRepository() {
    return AppDataSource.getRepository(User);
  }
  hashPassword(rawPassword: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const salt = await bcrypt.genSalt(6);
        resolve(bcrypt.hash(rawPassword, salt));
      } catch (error) {
        reject(error);
      }
    });
  }
  comparePassword(password: string, hash: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(bcrypt.compare(password, hash));
      } catch (error) {
        reject(error);
      }
    });
  }
  updatePoint(id: number, point: number): Promise<User | null> {
    return new Promise(async (resolve, __) => {
      try {
        const user = await this.getRepository().findOneBy({ id });
        if (user) {
          user.point += point;
          resolve(await this.getRepository().save(user));
        }
      } catch (error) {
        console.log("UPDATE USER POINT ERROR", error);
      }
      resolve(null);
    });
  }
  countUserByMonth(year: number, month: number): Promise<number> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count({
          where: {
            createdAt: Between(
              new Date(`${year}-${month}-01`),
              new Date(`${year}-${month}-${lastDay(month, year)}`)
            ),
          },
        });

        resolve(count);
      } catch (error) {
        resolve(0);
      }
    });
  }
  getAllUsers(
    query: GetAllUserQueryParams,
    isAdmin?: boolean
  ): Promise<GetAll<User>> {
    return new Promise(async (resolve, _) => {
      try {
        const { fullName, phone, email, withDeleted } = query;
        const { wherePagination } = handlePagination(query);
        const { sort } = handleSort(query);
        const [users, count] = await this.getRepository().findAndCount({
          order: sort,
          where: {
            isAdmin: false,
            ...handleILike("fullName", fullName),
            ...handleILike("phone", phone),
            ...handleILike("email", email),
          },
          withDeleted: isAdmin && withDeleted ? true : false,
          ...wherePagination,
          select: {
            id: true,
            createdAt: true,
            email: true,
            fullName: true,
            point: true,
            phone: true,
            updatedAt: true,
          },
        });
        resolve({ items: users, count });
      } catch (error) {
        console.log("GET ALL USERS ERROR", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
  getById(id: number): Promise<User | null> {
    return new Promise(async (resolve, _) => {
      try {
        const user = await this.getRepository().findOneBy({ id });
        resolve(user);
      } catch (error) {
        console.log("GET USER BY ID ERROR", error);
        resolve(null);
      }
    });
  }
  getByEmail(email: string): Promise<User | null> {
    return new Promise(async (resolve, _) => {
      try {
        const user = await this.getRepository().findOneBy({ email });
        resolve(user);
      } catch (error) {
        console.log("GET USER BY EMAIL ERROR", error);
        resolve(null);
      }
    });
  }
  createUser(dto: CreateUserDTO): Promise<User | null> {
    return new Promise(async (resolve, _) => {
      try {
        const newItem = await this.getRepository().save({
          ...dto,
          password: await this.hashPassword(dto.password),
        });
        resolve(newItem);
      } catch (error) {
        console.log("CREATE USER ERROR", error);
        resolve(null);
      }
    });
  }
  updateUser(id: number, dto: Partial<CreateUserDTO>): Promise<User | null> {
    return new Promise(async (resolve, _) => {
      try {
        const user = await this.getRepository().findOneBy({ id });
        if (user) {
          const newUser = await this.getRepository().save({ ...user, ...dto });
          resolve(newUser);
        }
      } catch (error) {
        console.log("GET USER BY EMAIL ERROR", error);
      }
      resolve(null);
    });
  }
  changePassword(
    id: number,
    newPassword: string,
    oldPassword: string
  ): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        const user = await this.getRepository().findOneBy({ id });
        if (user) {
          const compareResult = await this.comparePassword(
            oldPassword,
            user.password
          );
          if (compareResult) {
            await this.getRepository().save({
              ...user,
              password: await this.hashPassword(newPassword),
            });
            resolve(true);
          }
        }
      } catch (error) {
        console.log("GET USER BY EMAIL ERROR", error);
      }
      resolve(false);
    });
  }
  softDeleteUser(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete({ id });
        resolve(true);
      } catch (error) {
        console.log("SOFT DELETE USER ERROR", error);
        resolve(false);
      }
    });
  }
  restoreUser(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore({ id });
        resolve(true);
      } catch (error) {
        console.log("RESTORE USER ERROR", error);
        resolve(false);
      }
    });
  }
  deleteUser(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id });
        resolve(true);
      } catch (error) {
        console.log("DELETE USER ERROR", error);
        resolve(false);
      }
    });
  }
  seed(): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count();
        if (count === 0) {
          const users = await this.getRepository().save([
            {
              fullName: "Phan Khánh Duy",
              isAdmin: true,
              email: "duychomap123@gmail.com",
              phone: "0385981196",
              password: await this.hashPassword("123456"),
            },
          ]);
          resolve({ data: { items: users } });
        }
        resolve({ data: { items: [] } });
      } catch (error) {
        console.log("CREATE SEED USERS ERROR", error);
        resolve({ error });
      }
    });
  }
}

const userService = new UserService();
export default userService;
