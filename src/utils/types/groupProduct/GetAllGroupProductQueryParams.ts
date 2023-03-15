import SearchParams from "../SearchParams";

type GetAllGroupProductQueryParams = SearchParams &
  Partial<{
    name: string;
    slug: string;
    description: string;
    forHeader: string;
    relatedSlug: string;
    requireThumbnail: string;
  }>;

export default GetAllGroupProductQueryParams;
