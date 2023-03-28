import SearchParams from "../SearchParams";

type UserParams = SearchParams &
  Partial<{
    fullName: string;
    phone: string;
    email: string;
  }>;

export default UserParams;
