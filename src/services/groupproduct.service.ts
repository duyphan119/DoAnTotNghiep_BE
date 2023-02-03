import { AppDataSource } from "../data-source";
import GroupProduct, {
  GroupProductSexEnum,
} from "../entities/groupproduct.entity";
import { QueryParams, ResponseData, Sex } from "../utils/types";
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
    forHeader: string;
  }>;

type CreateGroupProductDTO = {
  name: string;
  slug: string;
} & Partial<{
  sex: Sex;
  isAdult: boolean;
  thumbnail: string;
  description: string;
}>;

class GroupProductService {
  getRepository() {
    return AppDataSource.getRepository(GroupProduct);
  }

  createSlug(name: string, sex?: Sex, isAdult?: boolean) {
    let slug = slugify(name, { lower: true });

    if (sex === "Nam") slug += "-nam";
    if (sex === "Nữ") slug += "-nu";
    if (isAdult === false) slug += "-tre-em";
    return slug;
  }

  getAll(
    query: GroupProductQueryParams,
    isAdmin?: boolean
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { withDeleted, name, slug, description, q, forHeader } = query;
        const { wherePagination } = handlePagination(query);
        const { sort } = handleSort(query);
        if (forHeader) {
          const itemsFemale = await this.getRepository().find({
            where: { sex: GroupProductSexEnum.FEMALE },
          });
          const itemsMale = await this.getRepository().find({
            where: { sex: GroupProductSexEnum.MALE },
          });
          const itemsGirl = await this.getRepository().find({
            where: { sex: GroupProductSexEnum.FEMALE, isAdult: false },
          });
          const itemsBoy = await this.getRepository().find({
            where: { sex: GroupProductSexEnum.MALE, isAdult: false },
          });

          resolve({
            data: [
              {
                name: GroupProductSexEnum.FEMALE,
                slug: slugify(GroupProductSexEnum.FEMALE, { lower: true }),
                items: itemsFemale,
              },
              {
                name: GroupProductSexEnum.MALE,
                slug: slugify(GroupProductSexEnum.MALE, { lower: true }),
                items: itemsMale,
              },
              {
                name: "Bé gái",
                slug: slugify("Bé gái", { lower: true }),
                items: itemsGirl,
              },
              {
                name: "Bé trai",
                slug: slugify("Bé trai", { lower: true }),
                items: itemsBoy,
              },
            ],
          });
        } else {
          const [groupProducts, count] =
            await this.getRepository().findAndCount({
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
        }
      } catch (error) {
        console.log("GET ALL GROUP PRODUCTS ERROR", error);
        resolve({ error });
      }
    });
  }
  getById(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const groupproduct = await this.getRepository().findOneBy({
          id,
        });
        resolve({ data: groupproduct });
      } catch (error) {
        console.log("GET GROUP PRODUCT BY ID ERROR", error);
        resolve({ error });
      }
    });
  }
  createGroupProduct(dto: CreateGroupProductDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { name, sex, isAdult } = dto;
        const newGroupProduct = await this.getRepository().save({
          ...dto,
          slug: this.createSlug(name, sex, isAdult),
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
        const groupProduct = await this.getRepository().findOneBy({
          id,
        });
        if (groupProduct) {
          const { name, sex, isAdult } = dto;
          const newGroupProduct = await this.getRepository().save({
            ...groupProduct,
            ...dto,
            ...(name ? { slug: this.createSlug(name, sex, isAdult) } : {}),
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
        await this.getRepository().softDelete({ id });
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
        await this.getRepository().restore({ id });
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
        await this.getRepository().delete({ id });
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
        const count = await this.getRepository().count();
        if (count === 0) {
          const groupproducts = await this.getRepository().save([
            {
              name: "Áo thun",
              slug: "ao-thun-nam",
            },
            {
              name: "Áo sơ mi",
              slug: "ao-so-mi-nam",
            },
            {
              name: "Áo polo",
              slug: "ao-polo-nam",
            },
            {
              name: "Áo khoác",
              slug: "ao-khoac-nam",
            },
            {
              name: "Quần tây",
              slug: "quan-tay-nam",
            },
            {
              name: "Quần short",
              slug: "quan-short-nam",
            },
            {
              name: "Quần kaki",
              slug: "quan-kaki-nam",
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
