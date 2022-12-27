import { PaginationParams, SortParams } from "./types";
import { ILike } from "typeorm";

export const generateFolder = (date: Date) => {
  const year = date.getFullYear().toString().substring(2);
  const month: string =
    date.getMonth() + 1 > 9
      ? `${date.getMonth() + 1}`
      : `0${date.getMonth() + 1}`;
  const day: string =
    date.getDate() > 9 ? `${date.getDate()}` : `0${date.getDate()}`;
  return `${year}${month}${day}`;
};

export const handlePagination = ({ limit, p }: PaginationParams) => {
  const take: number = limit ? +limit : -1;
  const skip: number = take !== -1 && p ? (+p - 1) * take : -1;
  return {
    take,
    skip,
    wherePagination: {
      ...(take !== -1 ? { take } : {}),
      ...(skip !== -1 ? { skip } : {}),
    },
  };
};

export const handleSort = ({ sortBy, sortType }: SortParams) => {
  return {
    sortBy,
    sortType,
    sort: {
      [sortBy || "id"]: sortType || "desc",
    },
  };
};

export const handleILike = (key: string, value?: any) => {
  return value ? { [key]: ILike(`%${value}%`) } : {};
};

export const handleSearchILike = (keys: string[], q?: string) => {
  if (!q) return {};

  let obj: any = {};

  keys.forEach((key) => {
    obj[key] = ILike(`%${q}%`);
  });

  return obj;
};

// export const handleError = (error: any): ResponseData => {
//   console.log(error);
//   return {
//     status: 500,
//     data: {
//       code: 500,
//       message: "Error",
//       data: {
//         error,
//       },
//     },
//   };
// };
// export const handleItems = (
//   status: number,
//   items: any[],
//   count: number,
//   limit: number
// ): ResponseData => {
//   return {
//     status,
//     data: {
//       code: 200,
//       message: "Success",
//       data: {
//         items,
//         count,
//         totalPage: Math.ceil(count / limit),
//       },
//     },
//   };
// };
// export const handleItem = (status: number, item?: any): ResponseData => {
//   return {
//     status,
//     ...(item
//       ? { data: { data: item, code: status, message: "Success" } }
//       : { data: { code: status, message: "Success" } }),
//   };
// };
