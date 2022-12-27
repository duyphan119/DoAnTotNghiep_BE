export type ResponseData = {
  data?: any;
  error?: any;
};
export type SortParams = {
  sortBy?: string;
  sortType?: string;
};
export type PaginationParams = {
  p?: string;
  limit?: string;
};
export type QueryParams = { withDeleted?: string } & SortParams &
  PaginationParams;
export type ParsedQueryParams = {
  sortBy?: string;
  sortType?: string;
  p?: number;
  limit?: number;
  select?: string;
};
