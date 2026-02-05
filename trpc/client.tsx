"use client";
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./routers/_app";
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;
/**
 * Obtain a QueryClient appropriate for the current runtime environment.
 *
 * On the server (no `window`), returns a new QueryClient instance for each call.
 * In the browser, returns a lazily created singleton QueryClient that is reused across calls.
 *
 * @returns A QueryClient instance; on the server a new instance is returned for each call, on the browser a shared singleton is returned.
 */
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
/**
 * Compute the full HTTP URL for the tRPC API endpoint appropriate to the current runtime environment.
 *
 * @returns The full URL to the server's tRPC HTTP batch endpoint: an empty-host relative path (`/api/trpc`) when running in the browser, `https://<VERCEL_URL>/api/trpc` when running on Vercel, or `http://localhost:3000/api/trpc` as a local development fallback.
 */
function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
  })();
  return `${base}/api/trpc`;
}
/**
 * Wraps children with a QueryClientProvider and a tRPC provider configured for `AppRouter`.
 *
 * @param props.children - React nodes to be rendered inside the QueryClient and tRPC providers.
 * @returns A JSX element that supplies the QueryClient and tRPC contexts to `children`.
 */
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          // transformer: superjson, <-- if you use a data transformer
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}