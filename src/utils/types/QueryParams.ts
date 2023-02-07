import PaginationParams from "./PaginationParams";
import SortParams from "./SortParams";

type QueryParams = Partial<{ withDeleted: string }> &
  SortParams &
  PaginationParams;
export default QueryParams;
