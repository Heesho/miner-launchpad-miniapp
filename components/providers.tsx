"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ReactNode, useState } from "react";
import { wagmiConfig } from "@/lib/wagmi";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Don't refetch on window focus by default - manual control
            refetchOnWindowFocus: false,
            // Default stale time - 30 seconds
            staleTime: 30_000,
            // Keep data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests once
            retry: 1,
            // Don't retry on 4xx errors
            retryOnMount: false,
            // Use structural sharing for better performance
            structuralSharing: true,
            // Network mode - always fetch when online
            networkMode: "online",
          },
          mutations: {
            // Don't retry mutations by default
            retry: false,
          },
        },
      }),
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
