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

            fieldConfig.resolve = async function (source, args, context, info) {
              if (context.user) {
                throw new GraphQLError("You are already logged in.", {
                  extensions: { code: "ALREADY_AUTHENTICATED" },
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