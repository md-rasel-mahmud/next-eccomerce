import { SortOrder } from "mongoose";

type QueryParams = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  [key: string]: unknown;
};

export function buildQueryOptions(query: QueryParams) {
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
    ...filters
  } = query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;

  // Remove control fields from filters
  const filterFields = ["page", "limit", "sortBy", "sortOrder"];
  const filterQuery: Record<string, unknown> = {};

  Object.keys(filters).forEach((key) => {
    if (!filterFields.includes(key)) {
      if (typeof filters[key] === "string" && filters[key].includes("~")) {
        filterQuery[key] = {
          $regex: filters[key].replace("~", ""),
          $options: "i",
        };
      } else {
        filterQuery[key] = filters[key];
      }
    }
  });

  return {
    filter: filterQuery,
    pagination: {
      skip,
      limit: limitNumber,
      page: pageNumber,
      limitPerPage: limitNumber,
      sortBy,
      sortOrder,
    },
    sort: {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    },
  };
}
