"use client";

import { ReactNode } from "react";
import { StoreProvider } from "@/context/StoreContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SessionProvider>
          <Provider store={store}>
            <StoreProvider>{children}</StoreProvider>

            <Toaster />
            <Sonner />
          </Provider>
        </SessionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
