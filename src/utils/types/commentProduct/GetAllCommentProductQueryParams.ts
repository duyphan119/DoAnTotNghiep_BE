import QueryParams from "../QueryParams";

type GetAllCommentProductQueryParams = QueryParams &
  Partial<{
    productId: string;
    content: string;
    star: string;
    user: string;
    product: string;
    repComments: string;
  }>;

export default GetAllCommentProductQueryParams;
