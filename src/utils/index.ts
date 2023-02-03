import { ILike } from "typeorm";
import CommentProduct from "../entities/commentproduct.entity";
import { PaginationParams, SortParams } from "./types";

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
export const handleSearch = (keys: string[], q?: string) => {
  if (!q) return [];

  let arr: any = [];

  keys.forEach((key) => {
    arr.push({ [key]: ILike(`%${q}%`) });
  });

  return arr;
};
export const handleSearchEqual = (
  keys: string[],
  q?: string,
  isNumber?: boolean
) => {
  if (!q) return {};

  let obj: any = {};

  keys.forEach((key) => {
    obj[key] = isNumber ? +q : q;
  });

  return obj;
};

export const handleEqual = (key: string, value?: any, isNumber?: boolean) => {
  return value ? { [key]: isNumber ? +value : value } : {};
};

export const everageStar = (items: CommentProduct[]) => {
  const count = items.length;
  if (count === 0) return 0;
  const totalStar = items.reduce((prev, cur) => prev + cur.star, 0);
  return parseFloat((totalStar / count).toFixed(1));
};

export const handleRelationDepth = (key: string, depth: number) => {
  let relations: any = {};
  let temp: any = relations;

  for (let i = 0; i < depth; i++) {
    temp[key] = i === depth - 1 ? true : {};

    temp = temp[key];
  }

  return relations;
};
export const lastDay = (month: number, year: number) => {
  if (year % 4 === 0 && month === 2) return 29;

  if (month === 2) return 28;

  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;

  return 30;
};
