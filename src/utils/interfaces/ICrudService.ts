import { GetAll, SearchParams } from "../types";

interface ICrudService<
  GetAllModel,
  Model,
  QueryParams,
  CreateItemDto,
  UpdateItemDto
> {
  getAll(params: QueryParams): Promise<GetAllModel>;
  getById(id: number): Promise<Model | null>;
  createOne(dto: CreateItemDto): Promise<Model | null>;
  createMany(listDto: CreateItemDto[]): Promise<Model[]>;
  updateOne(id: number, dto: UpdateItemDto): Promise<Model | null>;
  updateMany(inputs: Array<{ id: number } & UpdateItemDto>): Promise<Model[]>;
  deleteOne(id: number): Promise<boolean>;
  deleteMany(listId: number[]): Promise<boolean>;
  softDeleteOne(id: number): Promise<boolean>;
  softDeleteMany(listId: number[]): Promise<boolean>;
  restoreOne(id: number): Promise<boolean>;
  restoreMany(listId: number[]): Promise<boolean>;
  search(params: SearchParams): Promise<GetAll<Model>>;
}

export default ICrudService;
