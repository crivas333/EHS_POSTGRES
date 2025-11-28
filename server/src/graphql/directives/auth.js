// src/graphql/directives/auth.js
import { defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { TokenService, AuthService } from "../../domain/auth/index.js";

const authService = new AuthService();

export function authDirective(directiveName = "auth") {
  return {
    authDirectiveTypeDefs: `directive @${directiveName} on FIELD_DEFINITION`,
    
    authDirectiveTransformer: (schema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

          if (authDirective) {
            const { resolve = defaultFieldResolver } = fieldConfig;

            fieldConfig.resolve = async (source, args, context, info) => {
              // Extract token from Authorization header or httpOnly cookie
              const token =
                context.req.headers.authorization?.replace("Bearer ", "") ||
                context.req.cookies?.access_token;

              if (!token) {
                throw new Error("Authentication required");
              }

              try {
                const payload = TokenService.verifyAccessToken(token);
                const user = await authService.me(payload.userId);
                context.user = user; // ← this is what your resolvers use
              } catch (err) {
                throw new Error("Invalid or expired token");
              }

              return resolve(source, args, context, info);
            };
          }

          return fieldConfig;
        },
      }),
  };
}