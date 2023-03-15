import QueryParams from "../QueryParams";

type GetAllBlogCategoryQueryParams = Partial<{
  name: string;
  slug: string;
  desciption: string;
  q: string;
  blogs: string;
}> &
  QueryParams;

export default GetAllBlogCategoryQueryParams;
