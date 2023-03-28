import SearchParams from "../SearchParams";

type CommentProductParams = SearchParams &
  Partial<{
    productId: string;
    content: string;
    star: string;
    user: string;
    product: string;
    repComments: string;
  }>;

export default CommentProductParams;
