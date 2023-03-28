import SearchParams from "../SearchParams";

type AdvertisementParams = SearchParams &
  Partial<{
    title: string;
    page: string;
    href: string;
  }>;

export default AdvertisementParams;
