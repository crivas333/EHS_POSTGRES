// src/schema.js
import { makeExecutableSchema } from "@graphql-tools/schema";
import { authDirective, guestDirective } from "./directives/index.js";
import typeDefs from "./typeDefs/index.js";
import resolvers from "./resolvers/index.js";

export default function buildSchema() {
  const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective();
  const { guestDirectiveTypeDefs, guestDirectiveTransformer } = guestDirective();

  let schema = makeExecutableSchema({
    typeDefs: [authDirectiveTypeDefs, guestDirectiveTypeDefs, typeDefs],
    resolvers,
  });

  schema = authDirectiveTransformer(schema);
  schema = guestDirectiveTransformer(schema);

  return schema;
}
