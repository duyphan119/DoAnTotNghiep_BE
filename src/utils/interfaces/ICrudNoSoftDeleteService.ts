import { GetAll, SearchParams } from "../types";

interface ICrudNoSoftDeleteService<GetAllModel, Model, QueryParams, Dto> {
  getAll(params: QueryParams): Promise<GetAllModel>;
  getById(id: number): Promise<Model | null>;
  createOne(dto: Dto): Promise<Model | null>;
  createMany(listDto: Dto[]): Promise<Model[]>;
  updateOne(id: number, dto: Partial<Dto>): Promise<Model | null>;
  updateMany(inputs: Array<{ id: number } & Partial<Dto>>): Promise<Model[]>;
  deleteOne(id: number): Promise<boolean>;
  deleteMany(listId: number[]): Promise<boolean>;
  search(params: SearchParams): Promise<GetAll<Model>>;
}

export default ICrudNoSoftDeleteService;
