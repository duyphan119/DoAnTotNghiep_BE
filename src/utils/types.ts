export type ResponseData = Partial<{
  data: any;
  error: any;
}>;
export type SortParams = Partial<{
  sortBy: string;
  sortType: string;
}>;
export type PaginationParams = Partial<{
  p: string;
  limit: string;
}>;
export type QueryParams = Partial<{ withDeleted: string }> &
  SortParams &
  PaginationParams;
export type ParsedQueryParams = Partial<{
  sortBy: string;
  sortType: string;
  p: number;
  limit: number;
  select: string;
}>;
