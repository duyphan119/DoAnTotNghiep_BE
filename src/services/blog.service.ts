import slugify from "slugify";
import { In } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import Blog from "../entities/blog.entity";
import {
  handleEqual,
  handleILike,
  handlePagination,
  handleSort,
} from "../utils";
import { ICrudService } from "../utils/interfaces";
import { GetAll, ResponseData, SearchParams } from "../utils/types";
import { CreateBlogDTO, BlogParams } from "../utils/types/blog";

class BlogService
  implements
    ICrudService<
      GetAll<Blog>,
      Blog,
      BlogParams,
      CreateBlogDTO & { userId: number },
      Partial<CreateBlogDTO> & { userId: number }
    >
{
  getAll(params: BlogParams): Promise<GetAll<Blog>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        if (q) resolve(await this.search(params));
        else {
          const {
            title,
            slug,
            content,
            heading,
            blogCategoryId,
            blogCategorySlug,
            blogCategory,
            q,
          } = params;
          const { wherePagination } = handlePagination(params);
          const { sort } = handleSort(params);
          const [blogs, count] = await this.getRepository().findAndCount({
            order: sort,
            where: {
              ...handleILike("heading", heading),
              ...handleILike("title", title),
              ...handleILike("slug", slug),
              ...handleILike("content", content),
              ...handleEqual("blogCategoryId", blogCategoryId, true),
              ...(blogCategorySlug
                ? {
                    blogCategory: {
                      slug: blogCategorySlug,
                    },
                  }
                : {}),
            },
            ...wherePagination,
            select: {
              id: true,
              title: true,
              userId: true,
              createdAt: true,
              updatedAt: true,
              heading: true,
              thumbnail: true,
              slug: true,
              blogCategoryId: true,
              ...(slug ? { content: true } : {}),
            },
            relations: {
              ...(blogCategorySlug || blogCategory
                ? { blogCategory: true }
                : {}),
            },
          });
          resolve({ items: blogs, count });
        }
      } catch (error) {
        console.log("BlogService.getAll error", error);
      }
      resolve(EMPTY_ITEMS);
    });
  }
  getById(id: number): Promise<Blog | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOne({
          where: { id },
          relations: { blogCategory: true },
        });
        resolve(item);
      } catch (error) {
        console.log("BlogService.getById error", error);
        resolve(null);
      }
    });
  }
  createOne(dto: CreateBlogDTO & { userId: number }): Promise<Blog | null> {
    return new Promise(async (resolve, _) => {
      try {
        const newItem = await this.getRepository().save({
          ...dto,
          slug: slugify(dto.title, { lower: true, locale: "vi" }),
        });
        resolve(newItem);
      } catch (error) {
        console.log("BlogService.createOne", error);
        resolve(null);
      }
    });
  }
  createMany(
    listDto: Array<CreateBlogDTO & { userId: number }>
  ): Promise<Blog[]> {
    return new Promise(async (resolve, _) => {
      try {
        const newItems = await this.getRepository().save(
          listDto.map((dto) => ({
            ...dto,
            slug: slugify(dto.title, { lower: true, locale: "vi" }),
          }))
        );
        resolve(newItems);
      } catch (error) {
        console.log("BlogService.createMany error", error);
        resolve([]);
      }
    });
  }
  updateOne(
    id: number,
    dto: Partial<Partial<CreateBlogDTO> & { userId: number }>
  ): Promise<Blog | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({
          id,
          userId: dto.userId,
        });
        if (item) {
          const { title } = dto;
          const newItem = await this.getRepository().save({
            ...item,
            ...dto,
            ...(title
              ? { slug: slugify(title, { lower: true, locale: "vi" }) }
              : {}),
          });
          resolve(newItem);
        }
      } catch (error) {
        console.log("BlogService.updateOne error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateBlogDTO> & { userId: number })[]
  ): Promise<Blog[]> {
    return new Promise(async (resolve, _) => {
      try {
        await Promise.all(
          inputs.map(
            (
              input: { id: number } & Partial<CreateBlogDTO> & {
                  userId: number;
                }
            ) => {
              const { id, ...dto } = input;
              return this.getRepository().update({ id }, dto);
            }
          )
        );
        resolve(
          await this.getRepository().find({
            where: {
              id: In(
                inputs.map(
                  (
                    input: { id: number } & Partial<CreateBlogDTO> & {
                        userId: number;
                      }
                  ) => input.id
                )
              ),
            },
          })
        );
      } catch (error) {
        console.log("BlogService.updateMany error", error);
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
        console.log("BlogService.deleteOne error", error);
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
        console.log("BlogService.deleteMany error", error);
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
        console.log("BlogService.softDeleteOne error", error);
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
        console.log("BlogService.softDeleteMany error", error);
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
        console.log("BlogService.restoreOne error", error);
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
        console.log("BlogService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  search(params: SearchParams): Promise<GetAll<Blog>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { wherePagination } = handlePagination(params);
        const { sort } = handleSort(params);
        const [blogs, count] = await this.getRepository().findAndCount({
          order: sort,
          where: [
            handleILike("heading", q),
            handleILike("title", q),
            handleILike("slug", q),
            handleILike("content", q),
            handleEqual("blogCategoryId", q, true),
            {
              blogCategory: {
                slug: q,
              },
            },
          ],
          ...wherePagination,
          select: {
            id: true,
            title: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
            heading: true,
            thumbnail: true,
            slug: true,
            blogCategoryId: true,
          },
          relations: {
            blogCategory: true,
          },
        });
        resolve({ items: blogs, count });
      } catch (error) {
        console.log("BlogService.getAll error", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
  getRepository() {
    return AppDataSource.getRepository(Blog);
  }
  seed(): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count();
        if (count === 0) {
          const blogs = await this.getRepository().save([
            {
              title: "Bài viết 1",
              content: "<p>Bài viết 1</p>",
              slug: "bai-viet-1",
              thumbnail:
                "https://res.cloudinary.com/dwhjftwvw/image/upload/v1672045683/cv-app/221226/blbxhawm1udmeaxwnxcj.jpg",
              userId: 1,
            },
            {
              title: "Bài viết 2",
              content: "<p>Bài viết 2</p>",
              slug: "bai-viet-2",
              thumbnail:
                "https://res.cloudinary.com/dwhjftwvw/image/upload/v1672045971/cv-app/221226/ir9rvjq6ns3ckzxoxkyf.jpg",
              userId: 1,
            },
            {
              title: "Bài viết 3",
              content: "<p>Bài viết 3</p>",
              slug: "bai-viet-3",
              thumbnail:
                "https://res.cloudinary.com/dwhjftwvw/image/upload/v1672046012/cv-app/221226/j5ohfuzd3yd9qjsdudis.jpg",
              userId: 1,
            },
          ]);
          resolve({ data: { items: blogs } });
        }
        resolve({ data: { items: [] } });
      } catch (error) {
        console.log("CREATE SEED BLOGS ERROR", error);
        resolve({ error });
      }
    });
  }
}

const blogService = new BlogService();

export default blogService;
