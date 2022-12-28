import * as bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import User from "../entities/user.entity";
import {
  handleILike,
  handlePagination,
  handleSearchILike,
  handleSort,
} from "../utils";
import { QueryParams, ResponseData } from "../utils/types";

type UserQueryParams = QueryParams &
  Partial<{
    fullName: string;
    phone: string;
    email: string;
    q: string;
  }>;

type CreateUserDTO = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
};

class UserService {
  private userRepository = AppDataSource.getRepository(User);
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
  getAllUsers(
    query: UserQueryParams,
    isAdmin?: boolean
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { fullName, phone, email, q, withDeleted } = query;
        const { wherePagination } = handlePagination(query);
        const { sort } = handleSort(query);
        const [users, count] = await this.userRepository.findAndCount({
          order: sort,
          where: {
            isAdmin: false,
            ...handleILike("fullName", fullName),
            ...handleILike("phone", phone),
            ...handleILike("email", email),
            ...handleSearchILike(["fullName", "phone", "email"], q),
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
        resolve({ data: { items: users, count } });
      } catch (error) {
        console.log("GET ALL USERS ERROR", error);
        resolve({ error });
      }
    });
  }
  getById(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const user = await this.userRepository.findOneBy({ id });
        resolve(user ? { data: user } : {});
      } catch (error) {
        console.log("GET USER BY ID ERROR", error);
        resolve({ error });
      }
    });
  }
  getByEmail(email: string): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const user = await this.userRepository.findOneBy({ email });
        resolve(user ? { data: user } : {});
      } catch (error) {
        console.log("GET USER BY EMAIL ERROR", error);
        resolve({ error });
      }
    });
  }
  createUser(dto: CreateUserDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const newUser = await this.userRepository.save({
          ...dto,
          password: await this.hashPassword(dto.password),
        });
        resolve({ data: newUser });
      } catch (error) {
        console.log("CREATE USER BY EMAIL ERROR", error);
        resolve({ error });
      }
    });
  }
  updateUser(id: number, dto: Partial<CreateUserDTO>): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const user = await this.userRepository.findOneBy({ id });
        if (user) {
          const newUser = await this.userRepository.save({ ...user, ...dto });
          resolve({ data: newUser });
        }
        resolve({});
      } catch (error) {
        console.log("GET USER BY EMAIL ERROR", error);
        resolve({ error });
      }
    });
  }
  changePassword(
    id: number,
    newPassword: string,
    oldPassword: string
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const user = await this.userRepository.findOneBy({ id });
        if (user) {
          const compareResult = await this.comparePassword(
            oldPassword,
            user.password
          );
          if (compareResult) {
            const newUser = await this.userRepository.save({
              ...user,
              password: await this.hashPassword(newPassword),
            });
            resolve({ data: newUser });
          }
        }
        resolve({});
      } catch (error) {
        console.log("GET USER BY EMAIL ERROR", error);
        resolve({ error });
      }
    });
  }
  softDeleteUser(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.userRepository.softDelete({ id });
        resolve({});
      } catch (error) {
        console.log("SOFT DELETE USER ERROR", error);
        resolve({ error });
      }
    });
  }
  restoreUser(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.userRepository.restore({ id });
        resolve({});
      } catch (error) {
        console.log("RESTORE USER ERROR", error);
        resolve({ error });
      }
    });
  }
  deleteUser(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.userRepository.delete({ id });
        resolve({});
      } catch (error) {
        console.log("DELETE USER ERROR", error);
        resolve({ error });
      }
    });
  }
  seed(): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.userRepository.count();
        if (count === 0) {
          const users = await this.userRepository.save([
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
        console.log("CREATE SEED USERs ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new UserService();
