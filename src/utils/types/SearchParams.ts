import QueryParams from "./QueryParams";

type SearchParams = Partial<{
  q: string;
}> &
  QueryParams;

export default SearchParams;
