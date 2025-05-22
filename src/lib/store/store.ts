import { reduxApi } from "@/lib/store/api-services/redux-api.config";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [reduxApi.reducerPath]: reduxApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reduxApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
