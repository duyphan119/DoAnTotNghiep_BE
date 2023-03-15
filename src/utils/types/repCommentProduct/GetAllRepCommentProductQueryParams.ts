import SearchParams from "../SearchParams";

type GetAllRepCommentProductQueryParams = Partial<{
  content: string;
}> &
  SearchParams;

export default GetAllRepCommentProductQueryParams;
