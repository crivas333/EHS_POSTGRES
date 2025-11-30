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

  console.log("Applying auth directive transformer...");
  schema = authDirectiveTransformer(schema);
  
  console.log("Applying guest directive transformer...");
  schema = guestDirectiveTransformer(schema);

  console.log("Schema built with directives");
  return schema;
}