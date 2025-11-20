// utils/GraphQLErrorWithCode.js
export class GraphQLErrorWithCode extends Error {
  constructor(message, code = "BAD_REQUEST") {
    super(message);
    this.code = code;
  }
}
