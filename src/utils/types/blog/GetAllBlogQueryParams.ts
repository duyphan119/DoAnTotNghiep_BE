import QueryParams from "../QueryParams";

type GetAllBlogQueryParams = QueryParams &
  Partial<{
    title: string;
    slug: string;
    content: string;
    heading: string;
    blogCategoryId: string;
  }>;

export default GetAllBlogQueryParams;
