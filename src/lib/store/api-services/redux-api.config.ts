import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reduxApi = createApi({
  reducerPath: "reduxApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: () => ({}),
});
