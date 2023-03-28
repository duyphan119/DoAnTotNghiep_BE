import SearchParams from "../SearchParams";

type RepCommentProductParams = Partial<{
  content: string;
}> &
  SearchParams;

export default RepCommentProductParams;
