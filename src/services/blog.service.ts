import { AppDataSource } from "../data-source";
import Blog from "../entities/blog.entity";
import { QueryParams, ResponseData } from "../utils/types";
import { ILike } from "typeorm";
type BlogQueryParams = QueryParams &
  Partial<{
    title: string;
    slug: string;
    content: string;
    q: string;
  }>;
class BlogService {
  private blogRepository = AppDataSource.getRepository(Blog);

  getAll(query: BlogQueryParams, isAdmin?: boolean): Promise<ResponseData> {
    return new Promise(async (resolve, reject) => {
      try {
        const { sortBy, sortType, withDeleted, title, slug, content, q } =
          query;
        const take: number = query.limit ? +query.limit : -1;
        const skip: number =
          take !== -1 && query.p ? (+query.p - 1) * take : -1;

        const [blogs, count] = await this.blogRepository.findAndCount({
          order: {
            [sortBy || "id"]: sortType || "desc",
          },
          where: {
            ...(title ? { title: ILike(`%${title}%`) } : {}),
            ...(slug ? { slug: ILike(`%${slug}%`) } : {}),
            ...(content ? { content: ILike(`%${content}%`) } : {}),
            ...(q
              ? {
                  title: ILike(`%${q}%`),
                  slug: ILike(`%${q}%`),
                  content: ILike(`%${q}%`),
                }
              : {}),
          },
          withDeleted: isAdmin && withDeleted ? true : false,
          ...(take !== -1 ? { take } : {}),
          ...(skip !== -1 ? { skip } : {}),
        });
        resolve({ data: { items: blogs, count, take } });
      } catch (error) {
        console.log("GET ALL BLOGS ERROR", error);
        resolve({ error });
      }
    });
  }
  getById(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, reject) => {
      try {
        const blog = await this.blogRepository.findOneBy({ id });
        resolve({ data: blog });
      } catch (error) {
        console.log("GET BLOG BY ID ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new BlogService();
