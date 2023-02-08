import QueryParams from "../QueryParams";

type GetAllBlogQueryParams = QueryParams &
  Partial<{
    title: string;
    slug: string;
    content: string;
  }>;

export default GetAllBlogQueryParams;
