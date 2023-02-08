import QueryParams from "../QueryParams";

type GetAllCommentProductQueryParams = QueryParams &
  Partial<{
    productId: string;
    content: string;
    star: string;
    user: string;
    depth: string;
  }>;

export default GetAllCommentProductQueryParams;
