import slugify from "slugify";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import BlogCategory from "../entities/blogCategory.entity";
import { handleILike, handlePagination, handleSort } from "../utils";
import { GetAll, QueryParams, SearchParams } from "../utils/types";
import {
  CreateBlogCategoryDTO,
  GetAllBlogCategoryQueryParams,
} from "../utils/types/blogCategory";
import blogService from "./blog.service";

class BlogCategoryService {
  getRepository() {
    return AppDataSource.getRepository(BlogCategory);
  }

  getAll(query: GetAllBlogCategoryQueryParams): Promise<GetAll<BlogCategory>> {
    return new Promise(async (resolve, _) => {
      try {
        const { name, slug, desciption, q, blogs } = query;
        const { sort } = handleSort(query);
        const { wherePagination } = handlePagination(query);

        if (q) {
          resolve(await this.search(query));
        } else {
          const [blogCategories, count] =
            await this.getRepository().findAndCount({
              order: sort,
              where: {
                ...handleILike("name", name),
                ...handleILike("slug", slug),
                ...handleILike("desciption", desciption),
              },
              ...wherePagination,
            });
          if (blogs) {
            const results = await Promise.all(
              blogCategories.map((blogCategory) =>
                blogService.getAll({
                  blogCategoryId: "" + blogCategory.id,
                  limit: "" + 4,
                })
              )
            );
            results.forEach((data, index) => {
              blogCategories[index].blogs = data.items;
            });
          }
          resolve({ items: blogCategories, count });
        }
      } catch (error) {
        console.log("BlogCategoryService --- getAll --- error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }

  search(query: SearchParams): Promise<GetAll<BlogCategory>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = query;
        const { sort } = handleSort(query);
        const { wherePagination } = handlePagination(query);

        const [blogCategories, count] = await this.getRepository().findAndCount(
          {
            order: sort,
            where: [
              handleILike("name", q),
              handleILike("slug", q),
              handleILike("desciption", q),
            ],
            ...wherePagination,
          }
        );
        resolve({ items: blogCategories, count });
      } catch (error) {
        console.log("BlogCategoryService --- search --- error", error);
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
        console.log("BlogCategoryService --- createOne --- error", error);
      }
      resolve(null);
    });
  }

  createOne(dto: CreateBlogCategoryDTO): Promise<BlogCategory | null> {
    return new Promise(async (resolve, _) => {
      try {
        const { name } = dto;
        const newItem = await this.getRepository().save({
          ...dto,
          slug: slugify(name, { lower: true, locale: "vi" }),
        });
        resolve(newItem);
      } catch (error) {
        console.log("BlogCategoryService --- createOne --- error", error);
      }
      resolve(null);
    });
  }

  updateOne(
    id: number,
    dto: Partial<CreateBlogCategoryDTO>
  ): Promise<BlogCategory | null> {
    return new Promise(async (resolve, _) => {
      try {
        const { name } = dto;
        const item = await this.getById(id);
        if (item) {
          const newItem = await this.getRepository().save({
            ...item,
            ...dto,
            slug: name
              ? slugify(name, { lower: true, locale: "vi" })
              : item.slug,
          });
          resolve(newItem);
        }
      } catch (error) {
        console.log("BlogCategoryService --- updateOne --- error", error);
      }
      resolve(null);
    });
  }

  softDeleteBlogCategory(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete({ id });
        resolve(true);
      } catch (error) {
        console.log(
          "BlogCategoryService --- softDeleteBlogCategory --- error",
          error
        );
        resolve(false);
      }
    });
  }
  restoreBlogCategory(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore({ id });
        resolve(true);
      } catch (error) {
        console.log(
          "BlogCategoryService --- restoreBlogCategory --- error",
          error
        );
        resolve(false);
      }
    });
  }
  deleteBlogCategory(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id });
        resolve(true);
      } catch (error) {
        console.log(
          "BlogCategoryService --- deleteBlogCateegory --- error",
          error
        );
        resolve(false);
      }
    });
  }
}

const blogCategoryService = new BlogCategoryService();

export default blogCategoryService;
