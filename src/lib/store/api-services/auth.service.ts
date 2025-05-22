import { reduxApi } from "@/lib/store/api-services/redux-api.config";

const authApi = reduxApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ body }) => ({
        url: "/register",
        method: "POST",
        body: body,
      }),
      async onQueryStarted({ router }, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log("data", data);

          router.push("/login");
        } catch (error) {
          console.error("Registration error:", error);
        }
      },
    }),
  }),
});

export const { useRegisterMutation } = authApi;
