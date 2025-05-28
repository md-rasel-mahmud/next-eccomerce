import { SortOrder } from "mongoose";

// type QueryParams = {
//   page?: string;
//   limit?: string;
//   sortBy?: string;
//   sortOrder?: SortOrder;
//   [key: string]: unknown;
// };

// export function buildQueryOptions(query: QueryParams) {
//   const {
//     page = "1",
//     limit = "10",
//     sortBy = "createdAt",
//     sortOrder = "desc",
//     minPrice,
//     maxPrice,
//     inStock,
//     ...filters
//   } = query;

//   const pageNumber = parseInt(page as string, 10);
//   const limitNumber = parseInt(limit as string, 10);
//   const skip = (pageNumber - 1) * limitNumber;

//   const filterFields = [
//     "page",
//     "limit",
//     "sortBy",
//     "sortOrder",
//     "minPrice",
//     "maxPrice",
//     "inStock",
//   ];
//   const filterQuery: Record<string, unknown> = {};

//   Object.keys(filters).forEach((key) => {
//     if (!filterFields.includes(key)) {
//       if (typeof filters[key] === "string" && filters[key].includes("~")) {
//         filterQuery[key] = {
//           $regex: filters[key].replace("~", ""),
//           $options: "i",
//         };
//       } else {
//         filterQuery[key] = filters[key];
//       }
//     }
//   });

//   // Price Range
//   if (minPrice || maxPrice) {
//     filterQuery.price = {} as { $gte?: number; $lte?: number };
//     if (minPrice) {
//       (filterQuery.price as { $gte?: number }).$gte = Number(minPrice);
//     }
//     if (maxPrice) {
//       (filterQuery.price as { $lte?: number }).$lte = Number(maxPrice);
//     }
//   }

//   // Stock Quantity
//   if (inStock === "true") {
//     filterQuery.stockQuantity = { $gt: 0 };
//   }

//   return {
//     filter: filterQuery,
//     pagination: {
//       skip,
//       limit: limitNumber,
//       page: pageNumber,
//       limitPerPage: limitNumber,
//       sortBy,
//       sortOrder,
//     },
//     sort: {
//       [sortBy]: sortOrder === "asc" ? 1 : -1,
//     },
//   };
// }

type QueryParams = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  category?: string; // slug এর জন্য
  [key: string]: unknown;
};

export function buildQueryOptions(query: QueryParams) {
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
    category, // slug filter
    minPrice,
    maxPrice,
    inStock,
    ...filters
  } = query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const filterFields = [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "minPrice",
    "maxPrice",
    "inStock",
    "category",
  ];
  const filterQuery: Record<string, unknown> = {};

  Object.keys(filters).forEach((key) => {
    if (!filterFields.includes(key)) {
      if (
        typeof filters[key] === "string" &&
        (filters[key] as string).includes("~")
      ) {
        filterQuery[key] = {
          $regex: (filters[key] as string).replace("~", ""),
          $options: "i",
        };
      } else {
        filterQuery[key] = filters[key];
      }
    }
  });

  if (filterQuery.isFeatured && filterQuery.isFeatured === "true") {
    filterQuery.isFeatured = true;
  } else {
    delete filterQuery.isFeatured;
  }

  if (filterQuery.isSeasonal && filterQuery.isSeasonal === "true") {
    filterQuery.isSeasonal = true;
  } else {
    delete filterQuery.isSeasonal;
  }

  // Price Range
  if (minPrice || maxPrice) {
    filterQuery.price = {} as { $gte?: number; $lte?: number };
    if (minPrice) {
      (filterQuery.price as { $gte?: number }).$gte = Number(minPrice);
    }
    if (maxPrice) {
      (filterQuery.price as { $lte?: number }).$lte = Number(maxPrice);
    }
  }

  // Stock Quantity
  if (inStock === "true") {
    filterQuery.stockQuantity = { $gt: 0 };
  }

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
    categorySlug: category,
  };
}
