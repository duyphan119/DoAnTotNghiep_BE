import { validate } from "class-validator";
import { ILike } from "typeorm";
import { getCloudinary } from "../configCloudinary";
import { MSG_ERROR, MSG_SUCCESS } from "../constantList";
import CommentProduct from "../entities/commentProduct.entity";
import {
  PaginationParams,
  ResponseError,
  SortParams,
  ValidateError,
} from "./types";

class Helper {
  generateFolder(date: Date): string {
    const year = date.getFullYear().toString().substring(2);
    const month: string =
      date.getMonth() + 1 > 9
        ? `${date.getMonth() + 1}`
        : `0${date.getMonth() + 1}`;
    const day: string =
      date.getDate() > 9 ? `${date.getDate()}` : `0${date.getDate()}`;
    return `${year}${month}${day}`;
  }
  handlePagination({ limit, p }: PaginationParams) {
    const take: number = limit ? +limit : -1;
    const skip: number = take !== -1 && p ? (+p - 1) * take : -1;
    return {
      take,
      skip,
      wherePagination: {
        ...(take > -1 ? { take } : {}),
        ...(skip > -1 ? { skip } : {}),
      },
    };
  }
  handleSort({ sortBy, sortType }: SortParams): {
    sortBy?: string;
    sortType: "DESC" | "ASC";
    sort: { [key: string]: "DESC" | "ASC" };
  } {
    return {
      sortBy,
      sortType: sortType === "ASC" || sortType === "asc" ? "ASC" : "DESC",
      sort: {
        [sortBy || "id"]:
          sortType === "ASC" || sortType === "asc" ? "ASC" : "DESC",
      },
    };
  }
  handleILike(key: string, value?: any) {
    return value ? { [key]: ILike(`%${value}%`) } : {};
  }
  handleSearchILike(keys: string[], q?: string) {
    if (!q) return {};

    let obj: any = {};

    keys.forEach((key) => {
      obj[key] = ILike(`%${q}%`);
    });

    return obj;
  }
  handleSearch(keys: string[], q?: string) {
    if (!q) return [];

    let arr: any = [];

    keys.forEach((key) => {
      arr.push({ [key]: ILike(`%${q}%`) });
    });

    return arr;
  }
  handleSearchEqual(keys: string[], q?: string, isNumber?: boolean) {
    if (!q) return {};

    let obj: any = {};

    keys.forEach((key) => {
      obj[key] = isNumber ? +q : q;
    });

    return obj;
  }

  handleEqual(key: string, value?: any, isNumber?: boolean) {
    return value ? { [key]: isNumber ? +value : value } : {};
  }

  everageStar(items: CommentProduct[]) {
    const count = items.length;
    if (count === 0) return 0;
    const totalStar = items.reduce((prev, cur) => prev + cur.star, 0);
    return parseFloat((totalStar / count).toFixed(1));
  }

  handleRelationDepth(key: string, depth: number) {
    let relations: any = {};
    let temp: any = relations;

    for (let i = 0; i < depth; i++) {
      temp[key] = i === depth - 1 ? true : {};

      temp = temp[key];
    }

    return relations;
  }
  lastDay(month: number, year: number) {
    if (year % 4 === 0 && month === 2) return 29;

    if (month === 2) return 28;

    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;

    return 30;
  }
  async handleValidate(
    entity: any
  ): Promise<ResponseError<ValidateError> | null> {
    try {
      const errors = await validate(entity);
      if (errors.length > 0)
        return {
          type: "Validate",
          errors: errors.map((error) => {
            const { constraints } = error;
            const constraintsKeys = Object.keys(constraints || {});
            const messages: string[] = [];
            constraintsKeys.forEach((key) => {
              if (constraints) {
                messages.push(constraints[key]);
              }
            });
            return {
              field: error.property,
              messages,
            };
          }),
          message: `Data is invalid`,
        };
    } catch (error) {
      console.log("helper.handleValidate error", error);
    }
    return null;
  }

  responseSuccess(data?: any) {
    return { data, message: MSG_SUCCESS };
  }

  responseError(error?: any) {
    return { error, message: MSG_ERROR };
  }

  async deleteImageOnCloudinary(path: string): Promise<void> {
    getCloudinary().v2.uploader.destroy(
      "DoAnTotNghiep_BE" + path.split("DoAnTotNghiep_BE")[1].split(".")[0]
    );
  }
}

const helper = new Helper();

export default helper;

export const handlePagination = ({ limit, p }: PaginationParams) => {
  const take: number = limit ? +limit : -1;
  const skip: number = take !== -1 && p ? (+p - 1) * take : -1;
  return {
    take,
    skip,
    wherePagination: {
      ...(take > -1 ? { take } : {}),
      ...(skip > -1 ? { skip } : {}),
    },
  };
};

export const handleSort = ({
  sortBy,
  sortType,
}: SortParams): {
  sortBy?: string;
  sortType: "DESC" | "ASC";
  sort: { [key: string]: "DESC" | "ASC" };
} => {
  return {
    sortBy,
    sortType: sortType === "ASC" || sortType === "asc" ? "ASC" : "DESC",
    sort: {
      [sortBy || "id"]:
        sortType === "ASC" || sortType === "asc" ? "ASC" : "DESC",
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
