import SearchParams from "../SearchParams";

type BlogCategoryParams = Partial<{
  name: string;
  slug: string;
  desciption: string;
  blogs: string;
}> &
  SearchParams;

export default BlogCategoryParams;
