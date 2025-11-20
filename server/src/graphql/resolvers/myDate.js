import { GraphQLScalarType, Kind } from "graphql";

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  //The serialize method converts the scalar's back-end representation to a JSON-compatible format so Apollo Server can include it in an operation response.
  serialize(value) {
    //console.log("dateScalar-serialize-getTime():", value.getTime());
    //return value.getTime(); // Convert outgoing Date to integer for JSON
    return value; // no convertion (date remains in string format)
  },
  //Apollo Server calls parseValue method when the scalar is provided by a client as a GraphQL variable for an argument
  parseValue(value) {
    //console.log("dateScalar2:", value);
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    //console.log("dateScalar3:", ast);
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

export default {
  Date: dateScalar,
};
