import { defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { ensureSignedIn } from "../../auth.js";

export function authDirective(directiveName = "auth") {
  return {
    authDirectiveTypeDefs: `directive @${directiveName} on FIELD_DEFINITION`,
    authDirectiveTransformer: (schema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const directive = getDirective(schema, fieldConfig, directiveName)?.[0];
          if (directive) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = async (source, args, context, info) => {
              ensureSignedIn(context.req);
              return resolve.call(this, source, args, context, info);
            };
          }
          return fieldConfig;
        },
      }),
  };
}
