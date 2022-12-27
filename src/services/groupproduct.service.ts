import { AppDataSource } from "../data-source";
import GroupProduct from "../entities/groupproduct.entity";
import { QueryParams, ResponseData } from "../utils/types";
import {
  handleSort,
  handlePagination,
  handleILike,
  handleSearchILike,
} from "../utils";
import slugify from "slugify";

type GroupProductQueryParams = QueryParams &
  Partial<{
    name: string;
    slug: string;
    description: string;
    q: string;
  }>;

type CreateGroupProductDTO = {
  name: string;
  slug: string;
} & Partial<{ thumbnail: string; description: string }>;

class GroupProductService {
  private groupProductRepository = AppDataSource.getRepository(GroupProduct);

  getAll(
    query: GroupProductQueryParams,
    isAdmin?: boolean
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { withDeleted, name, slug, description, q } = query;
        const { wherePagination } = handlePagination(query);
        const { sort } = handleSort(query);
        const [groupProducts, count] =
          await this.groupProductRepository.findAndCount({
            order: sort,
            where: {
              ...handleILike("name", name),
              ...handleILike("slug", slug),
              ...handleILike("description", description),
              ...handleSearchILike(["name", "slug", "description"], q),
            },
            withDeleted: isAdmin && withDeleted ? true : false,
            ...wherePagination,
          });
        resolve({ data: { items: groupProducts, count } });
      } catch (error) {
        console.log("GET ALL GROUPS PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }
  getById(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const groupproduct = await this.groupProductRepository.findOneBy({
          id,
        });
        resolve({ data: groupproduct });
      } catch (error) {
        console.log("GET GROUPPRODUCT BY ID ERROR", error);
        resolve({ error });
      }
    });
  }
  createGroupProduct(dto: CreateGroupProductDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { name } = dto;
        const newGroupProduct = await this.groupProductRepository.save({
          ...dto,
          slug: slugify(name, { lower: true }),
        });
        resolve({ data: newGroupProduct });
      } catch (error) {
        console.log("CREATE GROUP PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }
  updateGroupProduct(
    id: number,
    dto: CreateGroupProductDTO
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const groupProduct = await this.groupProductRepository.findOneBy({
          id,
        });
        if (groupProduct) {
          const { name } = dto;
          const newGroupProduct = await this.groupProductRepository.save({
            ...groupProduct,
            ...dto,
            ...(name ? { slug: slugify(name, { lower: true }) } : {}),
          });
          resolve({ data: newGroupProduct });
        }
        resolve({});
      } catch (error) {
        console.log("UPDATE GROUP PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }
  softDeleteGroupProduct(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.groupProductRepository.softDelete({ id });
        resolve({});
      } catch (error) {
        console.log("SOFT DELETE GROUP PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }
  restoreGroupProduct(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.groupProductRepository.restore({ id });
        resolve({});
      } catch (error) {
        console.log("RESTORE GROUP PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }
  deleteGroupProduct(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.groupProductRepository.delete({ id });
        resolve({});
      } catch (error) {
        console.log("DELETE GROUP PRODUCT ERROR", error);
        resolve({ error });
      }
    });
  }
  seed(): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.groupProductRepository.count();
        if (count === 0) {
          const groupproducts = await this.groupProductRepository.save([
            {
              name: "Áo thun",
              slug: "ao-thun",
            },
            {
              name: "Áo sơ mi",
              slug: "ao-so-mi",
            },
            {
              name: "Áo polo",
              slug: "ao-polo",
            },
            {
              name: "Áo khoác",
              slug: "ao-khoac",
            },
            {
              name: "Quần tây",
              slug: "quan-tay",
            },
            {
              name: "Quần short",
              slug: "quan-short",
            },
            {
              name: "Quần kaki",
              slug: "quan-kaki",
            },
          ]);
          resolve({ data: { items: groupproducts } });
        }
        resolve({ data: { items: [] } });
      } catch (error) {
        console.log("CREATE SEED GROUP PRODUCTS ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new GroupProductService();
