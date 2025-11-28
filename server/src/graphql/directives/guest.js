
// src/graphql/directives/guest.js
import { defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { GraphQLError } from "graphql";

export function guestDirective(directiveName = "guest") {
  return {
    guestDirectiveTypeDefs: `directive @${directiveName} on FIELD_DEFINITION`,

    guestDirectiveTransformer: (schema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const guestDir = getDirective(schema, fieldConfig, directiveName)?.[0];

          if (guestDir) {
            const { resolve = defaultFieldResolver } = fieldConfig;

            fieldConfig.resolve = async (source, args, context, info) => {
              // Check for JWT in header OR refresh token cookie
              const hasAccessToken =
                context.req.headers.authorization?.startsWith("Bearer ");
              const hasRefreshToken = !!context.req.cookies?.refresh_token;

              if (hasAccessToken || hasRefreshToken) {
                throw new GraphQLError("You are already logged in.", {
                  extensions: { code: "UNAUTHORIZED" },
                });
              }

              return resolve(source, args, context, info);
            };
          }

          return fieldConfig;
        },
      }),
  };
}
