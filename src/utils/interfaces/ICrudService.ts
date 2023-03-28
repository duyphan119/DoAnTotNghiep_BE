import { GetAll } from "../types";

interface ICrudService<Model, Params, CreateModelDto> {
  search(params: Params): Promise<GetAll<Model>>;
  getAll(params: Params): Promise<GetAll<Model>>;
  getById(id: number): Promise<Model | null>;
  createOne(dto: CreateModelDto): Promise<Model | null>;
  createMany(listDto: CreateModelDto[]): Promise<Array<Model | null>>;
  updateOne(id: number, dto: Partial<CreateModelDto>): Promise<Model | null>;
  updateMany(
    inputs: Array<{ id: number } & Partial<CreateModelDto>>
  ): Promise<Array<Model | null>>;
  deleteOne(id: number): Promise<boolean>;
  deleteMany(listId: number[]): Promise<boolean>;
  softDeleteOne(id: number): Promise<boolean>;
  softDeleteMany(listId: number[]): Promise<boolean>;
  restoreOne(id: number): Promise<boolean>;
  restoreMany(listId: number[]): Promise<boolean>;
}

export default ICrudService;
