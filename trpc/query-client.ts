import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
/**
 * Creates a QueryClient instance preconfigured for the application's default React Query behavior.
 *
 * The client sets a 30,000 ms queries staleTime and considers queries with state `status === "pending"` as eligible for dehydration in addition to the default criteria. Serialization/deserialization hooks are intentionally left unset (placeholders present).
 *
 * @returns A configured QueryClient instance with the described default options
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}