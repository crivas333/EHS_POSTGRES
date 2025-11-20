import { GraphQLClient } from "graphql-request";

let GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || "/graphql"; // default fallback

if (!GRAPHQL_ENDPOINT.startsWith("http")) {
  GRAPHQL_ENDPOINT = `${window.location.origin}${GRAPHQL_ENDPOINT}`;
}

if (import.meta.env.DEV) {
  console.log("🔗 GraphQL endpoint in use:", GRAPHQL_ENDPOINT);
}

export const myclient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  fetch: (url, options) =>
    fetch(url, {
      ...options,
      credentials: "include", // send cookies/session
    }),
});
