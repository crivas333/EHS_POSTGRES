//import { QueryClient } from "react-query";
import { QueryClient } from "@tanstack/react-query";

//export const queryClient = new QueryClient();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //staleTime: Infinity,
      //refetchOnWindowFocus: false, // default: true
      //refetchOnWindowFocus: "always",
      refetchOnWindowFocus: true, // was "always", now boolean
    },
  },
});
