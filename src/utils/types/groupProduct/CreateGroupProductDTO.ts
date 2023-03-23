import Gender from "../Gender";

type CreateGroupProductDTO = {
  name: string;
} & Partial<{
  sex: Gender;
  isAdult: boolean;
  thumbnail: string;
  description: string;
}>;

export default CreateGroupProductDTO;
