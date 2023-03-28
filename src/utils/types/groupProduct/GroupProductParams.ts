import SearchParams from "../SearchParams";

type GroupProductParams = SearchParams &
  Partial<{
    name: string;
    slug: string;
    description: string;
    relatedSlug: string;
    requireThumbnail: string;
  }>;

export default GroupProductParams;
