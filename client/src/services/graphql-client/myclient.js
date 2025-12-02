
// src/services/graphql-client/myclient.js
import { GraphQLClient } from "graphql-request";

let GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || "/graphql";
if (!GRAPHQL_ENDPOINT.startsWith("http")) {
  GRAPHQL_ENDPOINT = `${window.location.origin}${GRAPHQL_ENDPOINT}`;
}

if (import.meta.env.DEV) {
  console.log("GraphQL endpoint:", GRAPHQL_ENDPOINT);
}

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(promise => {
    error ? promise.reject(error) : promise.resolve(token);
  });
  failedQueue = [];
};

export const myclient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
  }),
  fetch: async (url, options) => {
    let response = await fetch(url, { ...options, credentials: "include" });

    // Si recibimos 401 → intentar refresh
    if (response.status === 401 && !isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResponse = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation RefreshToken {
                refreshToken {
                  accessToken
                }
              }
            `,
          }),
        });

        if (refreshResponse.ok) {
          const result = await refreshResponse.json();
          const newToken = result.data.refreshToken.accessToken;

          localStorage.setItem("authToken", newToken);

          // Reintentar petición original
          response = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });

          processQueue(null, newToken);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }

    return response;
  },
});