// src/lib/express-graphql-dropin.js
import { createHandler } from "graphql-http/lib/use/express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const expressPlayground =
  require("graphql-playground-middleware-express").default;

export function graphqlHTTP(optionsOrFn) {
  return async (req, res, next) => {
    // Support function signature like express-graphql
    const options =
      typeof optionsOrFn === "function"
        ? await optionsOrFn(req, res)
        : optionsOrFn;

    const wantsHtml =
      req.headers.accept && req.headers.accept.includes("text/html");

    if (options.graphiql && wantsHtml) {
      return expressPlayground({ endpoint: "/graphql" })(req, res, next);
    }

    return createHandler({
      schema: options.schema,
      context: async () =>
        typeof options.context === "function"
          ? options.context(req, res)
          : options.context,
      formatError: options.customFormatErrorFn,
    })(req, res, next);
  };
}
