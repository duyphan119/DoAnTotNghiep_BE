import slugify from "slugify";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import BlogCategory from "../entities/blogCategory.entity";
import helper from "../utils";
import { ICrudService } from "../utils/interfaces";
import { GetAll, SearchParams } from "../utils/types";
import { BlogCategoryParams, CreateBlogCategoryDTO } from "../utils/types";
import blogService from "./blog.service";

class BlogCategoryService
  implements
    ICrudService<BlogCategory, BlogCategoryParams, CreateBlogCategoryDTO>
{
  createMany(
    listDto: CreateBlogCategoryDTO[]
  ): Promise<(BlogCategory | null)[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const newItems = await Promise.all(
          listDto.map((dto) => this.createOne(dto))
        );
        resolve(newItems);
      } catch (error) {
        console.log("BlogCategoryService.createMany error", error);
      }
      resolve([]);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateBlogCategoryDTO>)[]
  ): Promise<(BlogCategory | null)[]> {
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
        console.log("BlogCategoryService.updateMany error", error);
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
        console.log("BlogCategoryService.deleteOne error", error);
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
        console.log("BlogCategoryService.deleteMany error", error);
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
        console.log("BlogCategoryService.softDeleteOne error", error);
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
        console.log("BlogCategoryService.softDeleteMany error", error);
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
        console.log("BlogCategoryService.restoreOne error", error);
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
        console.log("BlogCategoryService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  getRepository() {
    return AppDataSource.getRepository(BlogCategory);
  }

  getAll(params: BlogCategoryParams): Promise<GetAll<BlogCategory>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { sort } = helper.handleSort(params);
        const { wherePagination } = helper.handlePagination(params);

        if (q) {
          resolve(await this.search(params));
        } else {
          const { name, slug, desciption, blogs } = params;
          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            where: {
              ...helper.handleILike("name", name),
              ...helper.handleILike("slug", slug),
              ...helper.handleILike("desciption", desciption),
            },
            ...wherePagination,
          });
          if (blogs) {
            const results = await Promise.all(
              items.map((blogCategory) =>
                blogService.getAll({
                  blogCategoryId: `${blogCategory.id}`,
                  limit: `${4}`,
                })
              )
            );
            results.forEach((data, index) => {
              items[index].blogs = data.items;
            });
          }
          resolve({ items, count });
        }
      } catch (error) {
        console.log("BlogCategoryService.getAll error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }

  search(params: BlogCategoryParams): Promise<GetAll<BlogCategory>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { sort } = helper.handleSort(params);
        const { wherePagination } = helper.handlePagination(params);

        const [items, count] = await this.getRepository().findAndCount({
          order: sort,
          where: [
            helper.handleILike("name", q),
            helper.handleILike("slug", q),
            helper.handleILike("desciption", q),
          ],
          ...wherePagination,
        });
        resolve({ items, count });
      } catch (error) {
        console.log("BlogCategoryService.search error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }

  getById(id: number): Promise<BlogCategory | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({ id });
        resolve(item);
      } catch (error) {
        console.log("BlogCategoryService.createOne error", error);
      }
      resolve(null);
    });
  }

  createOne(dto: CreateBlogCategoryDTO): Promise<BlogCategory | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const { name } = dto;
        const newItem = await this.getRepository().save({
          ...dto,
          slug: slugify(name, { lower: true, locale: "vi" }),
        });
        resolve(newItem);
      } catch (error) {
        console.log("BlogCategoryService.createOne error", error);
      }
      resolve(null);
    });
  }

  updateOne(
    id: number,
    dto: Partial<CreateBlogCategoryDTO>
  ): Promise<BlogCategory | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const existingItem = await this.getById(id);
        if (existingItem) {
          const { name } = dto;
          const newItem = await this.getRepository().save({
            ...existingItem,
            ...dto,
            ...(name
              ? { slug: slugify(name, { lower: true, locale: "vi" }) }
              : {}),
          });
          resolve(newItem);
        }
      } catch (error) {
        console.log("BlogCategoryService.updateOne error", error);
      }
      resolve(null);
    });
  }
}

const blogCategoryService = new BlogCategoryService();

export default blogCategoryService;
