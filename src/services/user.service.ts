import * as bcrypt from "bcrypt";
import { Between, Brackets, In } from "typeorm";
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
import { ICrudService } from "../utils/interfaces";
import { GetAll, ResponseData, SearchParams } from "../utils/types";
import { CreateUserDTO, GetAllUserQueryParams } from "../utils/types/user";

class UserService
  implements
    ICrudService<
      GetAll<User>,
      User,
      GetAllUserQueryParams,
      CreateUserDTO,
      Partial<CreateUserDTO>
    >
{
  getAll(params: GetAllUserQueryParams): Promise<GetAll<User>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { sort } = handleSort(params);
        const { wherePagination } = handlePagination(params);

        if (q) resolve(await this.search(params));
        else {
          const { email, fullName, phone } = params;
          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            ...wherePagination,
            where: {
              isAdmin: false,
              ...handleILike("email", email),
              ...handleILike("fullName", fullName),
              ...handleILike("phone", phone),
            },
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
          resolve({ items, count });
        }
      } catch (error) {
        console.log("UserService.getAll error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
  getById(id: number): Promise<User | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        resolve(item);
      } catch (error) {
        console.log("UserService.getById error", error);
        resolve(null);
      }
    });
  }
  createOne(dto: CreateUserDTO): Promise<User | null> {
    return new Promise(async (resolve, _) => {
      try {
        const newItem = await this.getRepository().save(dto);
        resolve(newItem);
      } catch (error) {
        console.log("UserService.createOne", error);
        resolve(null);
      }
    });
  }
  createMany(listDto: CreateUserDTO[]): Promise<User[]> {
    return new Promise(async (resolve, _) => {
      try {
        const newItems = await this.getRepository().save(listDto);
        resolve(newItems);
      } catch (error) {
        console.log("UserService.createMany error", error);
        resolve([]);
      }
    });
  }
  updateOne(id: number, dto: Partial<CreateUserDTO>): Promise<User | null> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().update({ id }, dto);
        const existingItem = await this.getRepository().findOneBy({ id });
        resolve(existingItem);
      } catch (error) {
        console.log("UserService.updateOne error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateUserDTO>)[]
  ): Promise<User[]> {
    return new Promise(async (resolve, _) => {
      try {
        await Promise.all(
          inputs.map((input: { id: number } & Partial<CreateUserDTO>) => {
            const { id, ...dto } = input;
            return this.getRepository().update({ id }, dto);
          })
        );
        resolve(
          await this.getRepository().find({
            where: {
              id: In(
                inputs.map(
                  (input: { id: number } & Partial<CreateUserDTO>) => input.id
                )
              ),
            },
          })
        );
      } catch (error) {
        console.log("UserService.updateMany error", error);
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
        console.log("UserService.deleteOne error", error);
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
        console.log("UserService.deleteMany error", error);
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
        console.log("UserService.softDeleteOne error", error);
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
        console.log("UserService.softDeleteMany error", error);
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
        console.log("UserService.restoreOne error", error);
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
        console.log("UserService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  search(params: SearchParams): Promise<GetAll<User>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { sortBy, sortType } = handleSort(params);
        const { skip, take } = handlePagination(params);

        let queryBuilder = this.getQueryBuilder()
          .where("taikhoan.quyen = :isAdmin", { isAdmin: false })
          .andWhere(
            new Brackets((qb) => {
              qb.orWhere("taikhoan.email ilike :q", { q: `%${q}%` })
                .orWhere("taikhoan.hoten ilike :q", { q: `%${q}%` })
                .orWhere("taikhoan.sdt ilike :q", { q: `%${q}%` });
            })
          )
          .select("taikhoan.id")
          .addSelect("taikhoan.fullName")
          .addSelect("taikhoan.email")
          .addSelect("taikhoan.point")
          .addSelect("taikhoan.phone")
          .addSelect("taikhoan.createdAt")
          .addSelect("taikhoan.updatedAt")
          .orderBy(
            sortBy || "taikhoan.sdt",
            sortType === "ASC" ? "ASC" : "DESC"
          );

        if (take > -1) {
          queryBuilder = queryBuilder.take(take);
        }

        if (skip > -1) {
          queryBuilder = queryBuilder.skip(skip);
        }

        const [items, count] = await queryBuilder.getManyAndCount();

        resolve({ items, count });
      } catch (error) {
        console.log("UserService.search error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
  getRepository() {
    return AppDataSource.getRepository(User);
  }
  getQueryBuilder() {
    return AppDataSource.createQueryBuilder(User, "taikhoan");
  }
  hashPassword(rawPassword: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const salt = await bcrypt.genSalt(6);
        resolve(bcrypt.hash(rawPassword, salt));
      } catch (error) {
        console.log("UserService.hashPassword error", error);
        reject(error);
      }
    });
  }
  comparePassword(password: string, hash: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(bcrypt.compare(password, hash));
      } catch (error) {
        console.log("UserService.comparePassword error", error);
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
        console.log("UserService.updatePoint error", error);
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
        console.log("UserService.countUserByMonth error", error);
        resolve(0);
      }
    });
  }
  getByEmail(email: string): Promise<User | null> {
    return new Promise(async (resolve, _) => {
      try {
        const user = await this.getRepository().findOneBy({ email });
        resolve(user);
      } catch (error) {
        console.log("UserService.getByEmail error", error);
        resolve(null);
      }
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
        console.log("UserService.changePassword error", error);
      }
      resolve(false);
    });
  }
  seed(): Promise<GetAll<User>> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count();
        if (count === 0) {
          const items = await this.getRepository().save([
            {
              fullName: "Phan Khánh Duy",
              isAdmin: true,
              email: "duychomap123@gmail.com",
              phone: "0385981196",
              password: await this.hashPassword("123456"),
            },
          ]);
          resolve({ items, count: items.length });
        }
      } catch (error) {
        console.log("UserService.seed error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
}

const userService = new UserService();
export default userService;
