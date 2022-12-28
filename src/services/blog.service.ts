import { AppDataSource } from "../data-source";
import Blog from "../entities/blog.entity";
import { QueryParams, ResponseData } from "../utils/types";
import {
  handleSort,
  handlePagination,
  handleILike,
  handleSearchILike,
} from "../utils";
import slugify from "slugify";

type BlogQueryParams = QueryParams &
  Partial<{
    title: string;
    slug: string;
    content: string;
    q: string;
  }>;

type CreateBlogDTO = {
  title: string;
  content: string;
} & Partial<{ thumbnail: string }>;

class BlogService {
  getRepository() {
    return AppDataSource.getRepository(Blog);
  }
  getAll(query: BlogQueryParams, isAdmin?: boolean): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { withDeleted, title, slug, content, q } = query;
        const { wherePagination } = handlePagination(query);
        const { sort } = handleSort(query);
        const [blogs, count] = await this.getRepository().findAndCount({
          order: sort,
          where: {
            ...handleILike("title", title),
            ...handleILike("slug", slug),
            ...handleILike("content", content),
            ...handleSearchILike(["title", "slug", "content"], q),
          },
          withDeleted: isAdmin && withDeleted ? true : false,
          ...wherePagination,
        });
        resolve({ data: { items: blogs, count } });
      } catch (error) {
        console.log("GET ALL BLOGS ERROR", error);
        resolve({ error });
      }
    });
  }
  getById(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const blog = await this.getRepository().findOneBy({ id });
        resolve({ data: blog });
      } catch (error) {
        console.log("GET BLOG BY ID ERROR", error);
        resolve({ error });
      }
    });
  }
  createBlog(userId: number, dto: CreateBlogDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { title } = dto;
        const newBlog = await this.getRepository().save({
          ...dto,
          userId,
          slug: slugify(title, { lower: true }),
        });
        resolve({ data: newBlog });
      } catch (error) {
        console.log("CREATE BLOG ERROR", error);
        resolve({ error });
      }
    });
  }
  updateBlog(
    id: number,
    userId: number,
    dto: Partial<CreateBlogDTO>
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const blog = await this.getRepository().findOneBy({ id, userId });
        if (blog) {
          const { title } = dto;
          const newBlog = await this.getRepository().save({
            ...blog,
            ...dto,
            ...(title ? { slug: slugify(title, { lower: true }) } : {}),
          });
          resolve({ data: newBlog });
        }
        resolve({});
      } catch (error) {
        console.log("UPDATE BLOG ERROR", error);
        resolve({ error });
      }
    });
  }
  softDeleteBlog(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete({ id });
        resolve({});
      } catch (error) {
        console.log("SOFT DELETE BLOG ERROR", error);
        resolve({ error });
      }
    });
  }
  restoreBlog(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore({ id });
        resolve({});
      } catch (error) {
        console.log("RESTORE BLOG ERROR", error);
        resolve({ error });
      }
    });
  }
  deleteBlog(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id });
        resolve({});
      } catch (error) {
        console.log("DELETE BLOG ERROR", error);
        resolve({ error });
      }
    });
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

export default new BlogService();
