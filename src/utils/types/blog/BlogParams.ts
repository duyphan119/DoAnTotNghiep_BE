import SearchParams from "../SearchParams";

type BlogParams = SearchParams &
  Partial<{
    title: string;
    slug: string;
    content: string;
    heading: string;
    blogCategoryId: string;
    blogCategorySlug: string;
    blogCategory: string;
  }>;

export default BlogParams;
