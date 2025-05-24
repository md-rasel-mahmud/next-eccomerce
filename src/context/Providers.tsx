"use client";

import { ReactNode } from "react";
import { StoreProvider } from "@/context/StoreContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SessionProvider>
          <Provider store={store}>
            <SWRConfig
              value={{
                fetcher: (url) => fetch(url).then((res) => res.json()),
                revalidateOnFocus: false,
                shouldRetryOnError: false,
              }}
            >
              <StoreProvider>{children}</StoreProvider>

              <Toaster />
              <Sonner richColors />
            </SWRConfig>
          </Provider>
        </SessionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
