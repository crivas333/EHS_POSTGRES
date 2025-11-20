import { defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { isSignedIn } from "../../auth.js";
import { GraphQLError } from "graphql";

export function guestDirective(directiveName = "guest") {
  return {
    guestDirectiveTypeDefs: `directive @${directiveName} on FIELD_DEFINITION`,
    guestDirectiveTransformer: (schema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const directive = getDirective(schema, fieldConfig, directiveName)?.[0];
          if (directive) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = async (source, args, context, info) => {
              if (isSignedIn(context.req)) throw new GraphQLError("You must be signed out.", { extensions: { code: "UNAUTHORIZED" } });
              return resolve.call(this, source, args, context, info);
            };
          }
          return fieldConfig;
        },
      }),
  };
}

